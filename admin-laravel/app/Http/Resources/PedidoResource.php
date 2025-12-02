<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'usuario_id' => $this->usuario_id,
            'total' => $this->total,
            'estado' => $this->estado,
            'direccion_entrega' => $this->direccion_entrega,
            'telefono' => $this->telefono,
            'notas' => $this->notas,
            'mercadopago_payment_id' => $this->mercadopago_payment_id,
            'mercadopago_preference_id' => $this->mercadopago_preference_id,
            'usuario' => $this->whenLoaded('usuario'),
            'detalle_pedidos' => $this->whenLoaded('detallePedidos'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
