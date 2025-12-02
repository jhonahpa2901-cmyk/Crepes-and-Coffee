<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\User;

// Configurar la aplicación Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "🚀 Configurando sistema de administración...\n\n";
    
    // Verificar si el usuario admin ya existe
    $admin = User::where('email', 'admin@crepesandcoffee.com')->first();
    
    if ($admin) {
        echo "✅ El usuario administrador ya existe.\n";
        echo "Email: admin@crepesandcoffee.com\n";
        echo "Contraseña: admin123\n\n";
    } else {
        // Crear usuario administrador
        echo "👤 Creando usuario administrador...\n";
        
        $admin = User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        echo "✅ Usuario administrador creado exitosamente.\n\n";
    }
    
    echo "🔑 Credenciales del Administrador:\n";
    echo "Email: admin@crepesandcoffee.com\n";
    echo "Contraseña: admin123\n\n";
    
    echo "⚠️ IMPORTANTE:\n";
    echo "- Solo este usuario puede acceder al módulo de escritorio\n";
    echo "- El módulo de escritorio es exclusivo para administración\n";
    echo "- No hay opción de registro en el módulo de escritorio\n\n";
    
    echo "🚀 Para ejecutar el sistema:\n";
    echo "1. Backend: php artisan serve --host=127.0.0.1 --port=8000\n";
    echo "2. Módulo de escritorio: cd admin-desktop && npm run electron-dev\n\n";
    
    echo "✅ Sistema configurado correctamente!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
} 