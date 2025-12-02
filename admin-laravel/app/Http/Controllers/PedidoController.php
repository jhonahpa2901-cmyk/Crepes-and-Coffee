<?php

namespace App\Http\Controllers;

use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use App\Models\DetallePedido;
use App\Models\Producto;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $pedidos = Pedido::with(['usuario', 'detallePedidos.producto'])->get();
        return PedidoResource::collection($pedidos);
    }

    /**
     * Display pedidos del usuario autenticado.
     */
    public function misPedidos(Request $request): AnonymousResourceCollection
    {
        $pedidos = Pedido::with(['detallePedidos.producto'])
            ->where('usuario_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
        return PedidoResource::collection($pedidos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        // Obtener métodos de pago activos dinámicamente
        $activePaymentMethods = PaymentMethod::where('active', true)->pluck('name')->toArray();
        
        // Crear regla de validación dinámica
        $methodsValidation = !empty($activePaymentMethods) 
            ? 'required|in:' . implode(',', $activePaymentMethods)
            : 'required|string';
        
        $request->validate([
            'total' => 'required|numeric|min:0',
            'direccion_entrega' => 'nullable|string',
            'telefono' => 'nullable|string',
            'notas' => 'nullable|string',
            'metodo_pago' => $methodsValidation,
            'productos' => 'required|array|min:1',
            'productos.*.producto_id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
            'productos.*.notas' => 'nullable|string',
        ]);

        // Obtener el método de pago para determinar el estado inicial
        $paymentMethod = PaymentMethod::where('name', $request->metodo_pago)->first();
        
        // Determinar estado inicial según tipo de método de pago
        // - Métodos digitales (Yape, Plin): pendiente (esperando comprobante)
        // - Métodos cash (Contra Entrega): confirmado
        $estadoInicial = 'pendiente';
        if ($paymentMethod && $paymentMethod->type === 'cash') {
            $estadoInicial = 'confirmado';
        }
        
        $pedido = Pedido::create([
            'usuario_id' => $request->user()->id,
            'total' => $request->total,
            'direccion_entrega' => $request->direccion_entrega,
            'telefono' => $request->telefono,
            'notas' => $request->notas,
            'metodo_pago' => $request->metodo_pago,
            'estado' => $estadoInicial,
        ]);

        foreach ($request->productos as $item) {
            $producto = Producto::findOrFail($item['producto_id']);
            DetallePedido::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $item['producto_id'],
                'cantidad' => $item['cantidad'],
                'precio_unitario' => $producto->precio,
                'subtotal' => $item['cantidad'] * $producto->precio,
                'notas' => $item['notas'] ?? null,
            ]);
        }

        // Mensaje personalizado según tipo de pago
        $mensaje = 'Pedido creado exitosamente.';
        if ($paymentMethod) {
            if ($paymentMethod->type === 'digital') {
                $mensaje .= ' Por favor, envía el comprobante de pago al WhatsApp del negocio.';
            } elseif ($paymentMethod->type === 'cash') {
                $mensaje .= ' Pagarás contra entrega.';
            }
        }
            
        return response()->json([
            'message' => $mensaje,
            'pedido' => new PedidoResource($pedido->load(['usuario', 'detallePedidos.producto'])),
            'metodo_pago' => $request->metodo_pago,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): PedidoResource
    {
        $pedido = Pedido::with(['usuario', 'detallePedidos.producto'])->findOrFail($id);
        return new PedidoResource($pedido);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'estado' => 'required|in:pendiente,confirmado,preparando,listo,entregado,cancelado',
        ]);

        $pedido = Pedido::findOrFail($id);
        $pedido->update($request->only('estado'));

        return response()->json([
            'message' => 'Estado del pedido actualizado exitosamente',
            'pedido' => new PedidoResource($pedido->load(['usuario', 'detallePedidos.producto']))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();

        return response()->json([
            'message' => 'Pedido eliminado exitosamente'
        ]);
    }
}
