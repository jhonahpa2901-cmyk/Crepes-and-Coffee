<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepescoffee.com',
            'password' => Hash::make('password'),
            'rol' => 'admin',
            'telefono' => '123456789',
            'direccion' => 'Av. Principal 123',
        ]);

        // Crear usuario cliente de ejemplo
        User::create([
            'name' => 'Cliente Ejemplo',
            'email' => 'cliente@example.com',
            'password' => Hash::make('password'),
            'rol' => 'cliente',
            'telefono' => '987654321',
            'direccion' => 'Calle Secundaria 456',
        ]);
    }
}
