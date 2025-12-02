<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pedido extends Model
{
    protected $fillable = [
        'usuario_id',
        'total',
        'estado',
        'metodo_pago',
        'direccion_entrega',
        'telefono',
        'notas',
        'mercadopago_payment_id',
        'mercadopago_preference_id'
    ];

    protected $casts = [
        'total' => 'decimal:2',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detallePedidos(): HasMany
    {
        return $this->hasMany(DetallePedido::class);
    }
}
