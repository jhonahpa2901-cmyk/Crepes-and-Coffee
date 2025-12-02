<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name',
        'type',
        'active',
        'phone',
        'account_name',
        'qr_image',
        'instructions',
        'order'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];
}
