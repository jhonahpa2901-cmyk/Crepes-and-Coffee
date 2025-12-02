<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\AdminController;

// Ruta de prueba para verificar CORS
Route::get('/test', function () {
    return response()->json([
        'message' => 'CORS test successful',
        'timestamp' => now(),
        'status' => 'working'
    ]);
});

// Ruta POST simple para probar
Route::post('/test-simple', function (Request $request) {
    return response()->json([
        'message' => 'POST test successful',
        'data' => $request->all(),
        'status' => 'working'
    ]);
});

// Ruta para probar paso a paso SIN crear usuario
Route::post('/test-steps', function (Request $request) {
    $results = [];
    
    try {
        $results['step1'] = 'Request received';
        
        $results['step2'] = 'Input parsing';
        $name = $request->input('name', 'Test User');
        $email = $request->input('email', 'test@example.com');
        $results['parsed_data'] = ['name' => $name, 'email' => $email];
        
        $results['step3'] = 'Hash test';
        $password = \Hash::make('12345678');
        $results['hash_length'] = strlen($password);
        
        $results['step4'] = 'Model class check';
        $results['user_model_exists'] = class_exists('\App\Models\User');
        
        $results['step5'] = 'Database connection test';
        $results['db_connection'] = \DB::connection()->getPdo() ? 'OK' : 'FAIL';
        
        $results['step6'] = 'Users table exists';
        $results['users_table'] = \Schema::hasTable('users');
        
        $results['step7'] = 'Table columns';
        if (\Schema::hasTable('users')) {
            $results['columns'] = \Schema::getColumnListing('users');
        }
        
        return response()->json([
            'message' => 'All steps completed successfully',
            'results' => $results,
            'status' => 'success'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error in step testing',
            'error' => $e->getMessage(),
            'results' => $results,
            'status' => 'error'
        ], 500);
    }
});

// Ruta de prueba para registro sin tokens
Route::post('/test-register', function (Request $request) {
    try {
        // Paso 1: Probar que llegamos aquí
        $step = 'inicio';
        
        // Paso 2: Probar validación básica  
        $step = 'validacion';
        $name = $request->input('name', 'Test User');
        $email = $request->input('email', 'test@example.com');
        
        // Paso 3: Probar Hash
        $step = 'hash';
        $password = \Hash::make('12345678');
        
        // Paso 4: Probar creación
        $step = 'creacion';
        $user = \App\Models\User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'telefono' => '123456789',
            'direccion' => 'Test Address',
            'rol' => 'cliente',
        ]);
        
        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
            'step' => $step,
            'status' => 'success'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error creating user',
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => basename($e->getFile()),
            'step' => $step ?? 'unknown',
            'status' => 'error'
        ], 500);
    }
});

// Ruta de prueba para login sin DB
Route::post('/test-login', function (Request $request) {
    return response()->json([
        'message' => 'Login test successful',
        'email' => $request->input('email'),
        'status' => 'working',
        'token' => 'test-token-12345'
    ]);
});

// Ruta de prueba para ADMIN login sin DB
Route::post('/admin/test-login', function (Request $request) {
    return response()->json([
        'message' => 'Admin login test successful - CORS working!',
        'email' => $request->input('email'),
        'status' => 'working',
        'token' => 'test-admin-token-12345',
        'user' => [
            'id' => 1,
            'name' => 'Test Admin',
            'email' => $request->input('email'),
            'role' => 'admin'
        ]
    ]);
});

// Ruta para crear usuario admin en PostgreSQL
Route::get('/create-admin', function (Request $request) {
    try {
        $existingAdmin = \App\Models\User::where('email', 'admin@crepesandcoffee.com')->first();
        
        if ($existingAdmin) {
            return response()->json([
                'message' => 'Admin user already exists',
                'email' => $existingAdmin->email,
                'status' => 'exists'
            ]);
        }
        
        $admin = \App\Models\User::create([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => \Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
        ]);
        
        return response()->json([
            'message' => 'Admin user created successfully',
            'email' => $admin->email,
            'status' => 'created'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error creating admin user',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

// Ruta para probar conexión PostgreSQL directa
Route::get('/test-db', function () {
    try {
        $connection = \DB::connection('pgsql');
        $pdo = $connection->getPdo();
        
        return response()->json([
            'message' => 'Database connection successful',
            'driver' => $pdo->getAttribute(PDO::ATTR_DRIVER_NAME),
            'server_info' => $pdo->getAttribute(PDO::ATTR_SERVER_INFO),
            'status' => 'connected'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Database connection failed',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

// Ruta para probar configuración de entorno
Route::get('/test-env', function () {
    return response()->json([
        'DB_CONNECTION' => env('DB_CONNECTION'),
        'DB_HOST' => env('DB_HOST'),
        'DB_PORT' => env('DB_PORT'),
        'DB_DATABASE' => env('DB_DATABASE'),
        'DB_USERNAME' => env('DB_USERNAME'),
        'DB_PASSWORD' => env('DB_PASSWORD') ? '[SET]' : '[NOT SET]',
        'DB_URL' => env('DB_URL') ? '[SET]' : '[NOT SET]',
        'DB_SSLMODE' => env('DB_SSLMODE'),
        'PGSSLMODE' => env('PGSSLMODE'),
        'status' => 'config_displayed'
    ]);
});

// Ruta para probar conexión PostgreSQL RAW (sin Laravel DB)
Route::get('/test-raw-db', function () {
    try {
        $dbUrl = env('DB_URL');
        
        if (!$dbUrl) {
            return response()->json([
                'message' => 'DB_URL not found',
                'status' => 'error'
            ], 500);
        }
        
        // Parse DB_URL manualmente
        $url = parse_url($dbUrl);
        
        $dsn = sprintf(
            'pgsql:host=%s;port=%d;dbname=%s;sslmode=require',
            $url['host'],
            $url['port'] ?? 5432,
            ltrim($url['path'], '/')
        );
        
        $pdo = new PDO($dsn, $url['user'], $url['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 120,
            PDO::ATTR_PERSISTENT => false,
        ]);
        
        // Probar query simple
        $result = $pdo->query("SELECT version()")->fetchColumn();
        
        return response()->json([
            'message' => 'Raw PostgreSQL connection successful',
            'version' => $result,
            'dsn' => str_replace($url['pass'], '[HIDDEN]', $dsn),
            'status' => 'connected'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Raw PostgreSQL connection failed',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

// Ruta para probar conexión con DB_URL directo (como DSN)
Route::get('/test-dsn', function () {
    try {
        $dbUrl = env('DB_URL');
        
        if (!$dbUrl) {
            return response()->json([
                'message' => 'DB_URL not found',
                'status' => 'error'
            ], 500);
        }
        
        // Usar DB_URL directamente como DSN para PDO
        $pdo = new PDO($dbUrl, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 120,
            PDO::ATTR_PERSISTENT => false,
        ]);
        
        // Probar query simple
        $result = $pdo->query("SELECT version()")->fetchColumn();
        
        return response()->json([
            'message' => 'Direct DSN connection successful',
            'version' => $result,
            'status' => 'connected'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Direct DSN connection failed',
            'error' => $e->getMessage(),
            'status' => 'error'
        ], 500);
    }
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas públicas - CON SANCTUM TOKENS
Route::post('/register', function (Request $request) {
    try {   
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Hash::make($request->password),
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'rol' => 'cliente',
        ]);

        // Crear token de Sanctum REAL
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Usuario registrado exitosamente'
        ], 201);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error en registro',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Login para cliente - CON SANCTUM TOKENS
Route::post('/login', function (Request $request) {
    try {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user || !\Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Las credenciales proporcionadas son incorrectas.'
            ], 422);
        }

        // Crear token de Sanctum REAL
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Inicio de sesión exitoso'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error en login',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Rutas de productos y categorías (públicas)
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/categorias', [CategoriaController::class, 'index']);

// Webhook de Mercado Pago
Route::post('/webhook/mercadopago', [PagoController::class, 'webhook']);

// Rutas protegidas (requieren autenticación)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Carrito
    Route::get('/carrito', [PedidoController::class, 'getCarrito']);
    Route::post('/carrito/agregar', [PedidoController::class, 'agregarAlCarrito']);
    Route::put('/carrito/actualizar', [PedidoController::class, 'actualizarCarrito']);
    Route::delete('/carrito/eliminar/{productoId}', [PedidoController::class, 'eliminarDelCarrito']);
    Route::delete('/carrito/vaciar', [PedidoController::class, 'vaciarCarrito']);
    
    // Pedidos
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos', [PedidoController::class, 'misPedidos']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);
    
    // Pagos
    Route::post('/pagos/preferencia', [PagoController::class, 'crearPreferencia']);
});

// Ruta de login para admin - versión temporal sin tokens
Route::post('/admin/login', function (Request $request) {
    try {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user || !\Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        if ($user->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado. Solo administradores.'
            ], 403);
        }

        return response()->json([
            'token' => 'temp-admin-token-12345',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->rol,
            ],
            'message' => 'Login exitoso - versión temporal'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error en login',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Rutas de administración - TEMPORALMENTE SIN MIDDLEWARE
Route::prefix('admin')->group(function () {
    // Dashboard y perfil
    Route::get('/me', function() {
        return response()->json([
            'user' => [
                'id' => 1,
                'name' => 'Administrador',
                'email' => 'admin@crepesandcoffee.com',
                'role' => 'admin',
            ]
        ]);
    });
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    
    // Gestión de Productos
    Route::get('/products', [AdminController::class, 'products']);
    Route::get('/products/{id}', [AdminController::class, 'showProduct']);
    Route::post('/products', [AdminController::class, 'storeProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    
    // Subida de imágenes
    Route::post('/upload-image', [AdminController::class, 'uploadImage']);
    
    // Gestión de Categorías
    Route::get('/categories', [AdminController::class, 'categories']);
    Route::get('/categories/{id}', [AdminController::class, 'showCategory']);
    Route::post('/categories', [AdminController::class, 'storeCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
    
    // Gestión de Pedidos
    Route::get('/orders', [AdminController::class, 'orders']);
    Route::get('/orders/{id}', [AdminController::class, 'showOrder']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    
    // Gestión de Usuarios
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}', [AdminController::class, 'showUser']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    
    // Estadísticas
    Route::get('/stats', [AdminController::class, 'stats']);
    Route::get('/stats/sales', [AdminController::class, 'salesStats']);
    Route::get('/stats/orders', [AdminController::class, 'orderStats']);
    
    // Métodos de Pago
    Route::get('/payment-methods', [AdminController::class, 'getPaymentMethods']);
    Route::put('/payment-methods/{id}', [AdminController::class, 'updatePaymentMethod']);
    Route::post('/payment-methods/upload-qr', [AdminController::class, 'uploadPaymentQR']);
});

// Endpoint público - Métodos de pago activos para el cliente
Route::get('/payment-methods/active', function() {
    return \App\Models\PaymentMethod::where('active', true)
        ->orderBy('order')
        ->get();
});

// Rutas de Mercado Pago
Route::post('/pagos/crear-preferencia', [App\Http\Controllers\PagoController::class, 'crearPreferencia']);
Route::post('/pagos/webhook', [App\Http\Controllers\PagoController::class, 'webhook']);
Route::post('/pagos/verificar', [App\Http\Controllers\PagoController::class, 'verificarPago']); 