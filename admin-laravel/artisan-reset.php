<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use App\Models\User;

// Configurar la aplicación Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "🗑️ Limpiando base de datos usando artisan...\n";
    
    // Ejecutar comandos de artisan para limpiar la base de datos
    $output = shell_exec('php artisan migrate:fresh --force 2>&1');
    echo $output;
    
    echo "✅ Base de datos limpiada exitosamente.\n";
    
    // Crear solo el usuario administrador
    echo "👤 Creando usuario administrador...\n";
    
    $admin = User::create([
        'name' => 'Administrador',
        'email' => 'admin@crepesandcoffee.com',
        'password' => Hash::make('admin123'),
        'rol' => 'admin',
        'email_verified_at' => now(),
    ]);
    
    echo "✅ Usuario administrador creado exitosamente.\n";
    echo "\n🔑 Credenciales del Administrador:\n";
    echo "Email: admin@crepesandcoffee.com\n";
    echo "Contraseña: admin123\n";
    echo "\n⚠️ IMPORTANTE: Solo este usuario puede acceder al módulo de escritorio.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
} 