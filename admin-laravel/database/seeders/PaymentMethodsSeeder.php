<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('payment_methods')->insert([
            [
                'name' => 'Yape',
                'type' => 'digital',
                'active' => false,
                'phone' => null,
                'account_name' => null,
                'qr_image' => null,
                'instructions' => 'Escanea el código QR con tu app de Yape y realiza el pago. Luego envía el comprobante.',
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Plin',
                'type' => 'digital',
                'active' => false,
                'phone' => null,
                'account_name' => null,
                'qr_image' => null,
                'instructions' => 'Escanea el código QR con tu app de Plin y realiza el pago. Luego envía el comprobante.',
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Contra Entrega',
                'type' => 'cash',
                'active' => true,
                'phone' => null,
                'account_name' => null,
                'qr_image' => null,
                'instructions' => 'Paga en efectivo cuando recibas tu pedido en la dirección indicada.',
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
