<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\User;

// Configurar la aplicación Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    // Verificar si el usuario admin ya existe
    $admin = User::where('email', 'admin@crepesandcoffee.com')->first();
    
    if ($admin) {
        echo "✅ El usuario administrador ya existe.\n";
        echo "Email: admin@crepesandcoffee.com\n";
        echo "Contraseña: admin123\n";
    } else {
        // Crear el usuario administrador
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        echo "✅ Usuario administrador creado exitosamente.\n";
        echo "Email: admin@crepesandcoffee.com\n";
        echo "Contraseña: admin123\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
} 