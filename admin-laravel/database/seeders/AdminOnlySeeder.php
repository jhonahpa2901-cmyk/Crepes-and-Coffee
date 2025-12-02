<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminOnlySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si el usuario admin ya existe
        $admin = User::where('email', 'admin@crepesandcoffee.com')->first();
        
        if ($admin) {
            $this->command->info('El usuario administrador ya existe.');
            $this->command->info('Email: admin@crepesandcoffee.com');
            $this->command->info('Contraseña: admin123');
            return;
        }

        // Crear usuario administrador
        User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
        ]);

        $this->command->info('✅ Usuario administrador creado exitosamente.');
        $this->command->info('🔑 Credenciales del Administrador:');
        $this->command->info('Email: admin@crepesandcoffee.com');
        $this->command->info('Contraseña: admin123');
        $this->command->info('');
        $this->command->info('⚠️ IMPORTANTE: Solo este usuario puede acceder al módulo de escritorio.');
    }
} 