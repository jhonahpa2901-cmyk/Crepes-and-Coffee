<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Producto;
use App\Models\Pedido;
use App\Models\Categoria;
use App\Models\DetallePedido;

// Configurar la aplicación Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "🗑️ Limpiando base de datos...\n";
    
    // Deshabilitar verificación de claves foráneas
    DB::statement('SET FOREIGN_KEY_CHECKS=0;');
    
    // Eliminar todos los datos existentes en el orden correcto
    DetallePedido::truncate();
    Pedido::truncate();
    Producto::truncate();
    Categoria::truncate();
    User::truncate();
    
    // Habilitar verificación de claves foráneas
    DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    
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
    
    // Asegurar que las claves foráneas estén habilitadas en caso de error
    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    } catch (Exception $e2) {
        echo "⚠️ Advertencia: No se pudieron habilitar las claves foráneas.\n";
    }
} 