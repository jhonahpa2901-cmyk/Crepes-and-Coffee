<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->command->info('Usuario administrador creado exitosamente.');
        $this->command->info('Email: admin@crepesandcoffee.com');
        $this->command->info('Contraseña: admin123');
    }
} 