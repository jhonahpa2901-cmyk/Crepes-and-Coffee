<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Exceptions\MPApiException;

class PagoController extends Controller
{
    private $accessToken;

    public function __construct()
    {
        // Leer directamente del .env para evitar problemas de caché
        $this->accessToken = env('MERCADOPAGO_ACCESS_TOKEN');
        
        if (!$this->accessToken) {
            throw new \Exception('MERCADOPAGO_ACCESS_TOKEN no está configurado en el archivo .env');
        }
        
        MercadoPagoConfig::setAccessToken($this->accessToken);
    }

    public function crearPreferencia(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'pedido_id' => 'required|exists:pedidos,id',
            ]);

            $pedido = Pedido::with('detallePedidos.producto')->findOrFail($request->pedido_id);
            
            // Crear array de items para Mercado Pago
            $items = [];
            foreach ($pedido->detallePedidos as $detalle) {
                $items[] = [
                    'title' => $detalle->producto->nombre ?? 'Producto',
                    'quantity' => (int) $detalle->cantidad,
                    'unit_price' => (float) $detalle->precio_unitario,
                    'currency_id' => 'PEN'  // Soles peruanos
                ];
            }

            // URLs de retorno
            $backUrls = [
                'success' => env('FRONTEND_URL', 'http://localhost:3005') . '/pago/exito',
                'failure' => env('FRONTEND_URL', 'http://localhost:3005') . '/pago/fallo',
                'pending' => env('FRONTEND_URL', 'http://localhost:3005') . '/pago/pendiente',
            ];

            // Crear preferencia
            $preferenceData = [
                'items' => $items,
                'back_urls' => $backUrls,
                'auto_return' => 'approved',
                'external_reference' => (string) $pedido->id,
                'statement_descriptor' => 'CREPES & COFFEE',
                'notification_url' => env('APP_URL', 'http://localhost:8000') . '/api/pagos/webhook'
            ];

            $client = new PreferenceClient();
            $preference = $client->create($preferenceData);

            // Guardar preference_id en el pedido
            $pedido->update([
                'mercadopago_preference_id' => $preference->id
            ]);

            return response()->json([
                'init_point' => $preference->init_point,
                'preference_id' => $preference->id,
                'sandbox_init_point' => $preference->sandbox_init_point ?? null
            ]);

        } catch (MPApiException $e) {
            return response()->json([
                'error' => 'Error de Mercado Pago',
                'message' => $e->getMessage(),
                'details' => $e->getApiResponse()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear preferencia',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function webhook(Request $request): JsonResponse
    {
        try {
            // Log del webhook para debugging
            \Log::info('Mercado Pago Webhook recibido:', $request->all());

            $type = $request->input('type');
            $dataId = $request->input('data.id');

            if ($type === 'payment' && $dataId) {
                // Obtener información del pago
                $client = new PaymentClient();
                $payment = $client->get($dataId);

                if ($payment) {
                    // Buscar pedido por external_reference
                    $externalRef = $payment->external_reference;
                    $pedido = Pedido::find($externalRef);
                    
                    if ($pedido) {
                        // Actualizar estado según el status del pago
                        $nuevoEstado = 'pendiente';
                        if ($payment->status === 'approved') {
                            $nuevoEstado = 'confirmado';
                        } elseif ($payment->status === 'rejected') {
                            $nuevoEstado = 'cancelado';
                        }

                        $pedido->update([
                            'mercadopago_payment_id' => $payment->id,
                            'estado' => $nuevoEstado
                        ]);

                        \Log::info("Pedido #{$pedido->id} actualizado a estado: {$nuevoEstado}");
                    }
                }
            }

            return response()->json(['status' => 'ok'], 200);

        } catch (\Exception $e) {
            \Log::error('Error en webhook de Mercado Pago: ' . $e->getMessage());
            return response()->json(['status' => 'error'], 500);
        }
    }

    public function verificarPago(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'payment_id' => 'required'
            ]);

            $client = new PaymentClient();
            $payment = $client->get($request->payment_id);

            return response()->json([
                'status' => $payment->status,
                'status_detail' => $payment->status_detail,
                'external_reference' => $payment->external_reference,
                'transaction_amount' => $payment->transaction_amount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al verificar pago',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
