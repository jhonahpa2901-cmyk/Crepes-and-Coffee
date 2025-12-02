<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Producto;
use App\Models\Pedido;
use App\Models\Categoria;
use App\Models\PaymentMethod;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        // Verificar si el usuario es admin
        if ($user->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado. Solo los administradores pueden acceder al panel de escritorio.'
            ], 403);
        }

        $token = $user->createToken('admin-desktop-token', ['admin'])->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->rol,
            ],
            'message' => 'Acceso exitoso al panel de administración'
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        
        if (!$user || $user->rol !== 'admin') {
            return response()->json([
                'message' => 'Acceso denegado. Se requieren permisos de administrador.'
            ], 403);
        }
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->rol,
            ]
        ]);
    }

    public function dashboard()
    {
        // Estadísticas generales
        $totalOrders = Pedido::count();
        $totalRevenue = Pedido::where('estado', 'entregado')->sum('total');
        $totalUsers = User::where('rol', 'cliente')->count();
        $totalProducts = Producto::count();

        // Pedidos recientes
        $recentOrders = Pedido::with(['usuario', 'detallePedidos.producto'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'total' => $pedido->total,
                    'status' => $pedido->estado,
                    'metodo_pago' => $pedido->metodo_pago,
                    'created_at' => $pedido->created_at->format('Y-m-d H:i'),
                    'user' => [
                        'name' => $pedido->usuario->name ?? 'Usuario eliminado',
                        'email' => $pedido->usuario->email ?? 'N/A'
                    ]
                ];
            });

        return response()->json([
            'totalPedidos' => $totalOrders,
            'ingresosTotales' => (float) $totalRevenue,
            'totalUsuarios' => $totalUsers,
            'totalProductos' => $totalProducts,
            'recentOrders' => $recentOrders
        ]);
    }

    // Gestión de Productos
    public function products()
    {
        $products = Producto::with('categoria')->get()->map(function ($producto) {
            return [
                'id' => $producto->id,
                'name' => $producto->nombre,
                'price' => (float) $producto->precio,
                'category' => $producto->categoria->nombre ?? 'Sin categoría',
                'stock' => $producto->stock,
                'image' => $producto->imagen,
                'description' => $producto->descripcion
            ];
        });

        return response()->json($products);
    }

    public function showProduct($id)
    {
        $producto = Producto::with('categoria')->findOrFail($id);
        
        return response()->json([
            'id' => $producto->id,
            'name' => $producto->nombre,
            'price' => (float) $producto->precio,
            'category' => $producto->categoria->nombre ?? 'Sin categoría',
            'stock' => $producto->stock,
            'image' => $producto->imagen,
            'description' => $producto->descripcion
        ]);
    }

    public function storeProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        // Buscar o crear categoría
        $categoria = Categoria::firstOrCreate(['nombre' => $request->category]);

        // Manejar la imagen
        $imagenPath = '/logo.jpg'; // Imagen por defecto
        
        if ($request->hasFile('image')) {
            // Subir nueva imagen
            $imagenPath = $request->file('image')->store('productos', 'public');
            $imagenPath = '/storage/' . $imagenPath;
        } elseif ($request->image_url) {
            // Usar URL proporcionada
            $imagenPath = $request->image_url;
        }

        $producto = Producto::create([
            'nombre' => $request->name,
            'precio' => $request->price,
            'categoria_id' => $categoria->id,
            'stock' => $request->stock,
            'imagen' => $imagenPath,
            'descripcion' => $request->description
        ]);

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'product' => [
                'id' => $producto->id,
                'name' => $producto->nombre,
                'price' => (float) $producto->precio,
                'category' => $categoria->nombre,
                'stock' => $producto->stock,
                'image' => $producto->imagen,
                'description' => $producto->descripcion
            ]
        ], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        // Buscar o crear categoría
        $categoria = Categoria::firstOrCreate(['nombre' => $request->category]);

        // Manejar la imagen
        $imagenPath = $producto->imagen; // Mantener imagen actual por defecto
        
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si no es la por defecto
            if ($producto->imagen && $producto->imagen !== '/logo.jpg' && str_starts_with($producto->imagen, '/storage/')) {
                $oldImagePath = str_replace('/storage/', '', $producto->imagen);
                Storage::disk('public')->delete($oldImagePath);
            }
            
            // Subir nueva imagen
            $imagenPath = $request->file('image')->store('productos', 'public');
            $imagenPath = '/storage/' . $imagenPath;
        } elseif ($request->image_url) {
            // Usar nueva URL proporcionada
            $imagenPath = $request->image_url;
        }

        $producto->update([
            'nombre' => $request->name,
            'precio' => $request->price,
            'categoria_id' => $categoria->id,
            'stock' => $request->stock,
            'imagen' => $imagenPath,
            'descripcion' => $request->description
        ]);

        return response()->json([
            'message' => 'Producto actualizado exitosamente',
            'product' => [
                'id' => $producto->id,
                'name' => $producto->nombre,
                'price' => (float) $producto->precio,
                'category' => $categoria->nombre,
                'stock' => $producto->stock,
                'image' => $producto->imagen,
                'description' => $producto->descripcion
            ]
        ]);
    }

    public function deleteProduct($id)
    {
        $producto = Producto::findOrFail($id);
        
        // Eliminar imagen si no es la por defecto
        if ($producto->imagen && $producto->imagen !== '/logo.jpg' && str_starts_with($producto->imagen, '/storage/')) {
            $imagePath = str_replace('/storage/', '', $producto->imagen);
            Storage::disk('public')->delete($imagePath);
        }
        
        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado exitosamente'
        ]);
    }

    // Endpoint específico para subir imágenes
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('productos', 'public');
            $imageUrl = '/storage/' . $imagePath;

            return response()->json([
                'message' => 'Imagen subida exitosamente',
                'image_url' => $imageUrl,
                'image_path' => $imagePath
            ]);
        }

        return response()->json([
            'message' => 'No se encontró ninguna imagen'
        ], 400);
    }

    // Gestión de Categorías
    public function categories()
    {
        $categories = Categoria::all();
        return response()->json($categories);
    }

    public function showCategory($id)
    {
        $categoria = Categoria::findOrFail($id);
        return response()->json($categoria);
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias'
        ]);

        $categoria = Categoria::create($request->all());
        
        return response()->json([
            'message' => 'Categoría creada exitosamente',
            'category' => $categoria
        ], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);
        
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre,' . $id
        ]);

        $categoria->update($request->all());
        
        return response()->json([
            'message' => 'Categoría actualizada exitosamente',
            'category' => $categoria
        ]);
    }

    public function deleteCategory($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return response()->json([
            'message' => 'Categoría eliminada exitosamente'
        ]);
    }

    // Gestión de Pedidos
    public function orders()
    {
        $orders = Pedido::with(['usuario', 'detallePedidos.producto'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pedido) {
                return [
                    'id' => $pedido->id,
                    'user_id' => $pedido->usuario_id,
                    'total' => (float) $pedido->total,
                    'status' => $pedido->estado,
                    'metodo_pago' => $pedido->metodo_pago,
                    'direccion_entrega' => $pedido->direccion_entrega,
                    'telefono' => $pedido->telefono,
                    'notas' => $pedido->notas,
                    'created_at' => $pedido->created_at->format('Y-m-d H:i'),
                    'user' => [
                        'name' => $pedido->usuario->name ?? 'Usuario eliminado',
                        'email' => $pedido->usuario->email ?? 'N/A'
                    ],
                    'items' => $pedido->detallePedidos->map(function ($detalle) {
                        return [
                            'name' => $detalle->producto->nombre ?? 'Producto eliminado',
                            'quantity' => $detalle->cantidad,
                            'price' => (float) $detalle->precio_unitario,
                            'subtotal' => (float) $detalle->subtotal,
                            'notas' => $detalle->notas
                        ];
                    })
                ];
            });

        return response()->json($orders);
    }

    public function showOrder($id)
    {
        $pedido = Pedido::with(['usuario', 'detallePedidos.producto'])->findOrFail($id);
        
        return response()->json([
            'id' => $pedido->id,
            'user_id' => $pedido->usuario_id,
            'total' => (float) $pedido->total,
            'status' => $pedido->estado,
            'metodo_pago' => $pedido->metodo_pago,
            'direccion_entrega' => $pedido->direccion_entrega,
            'telefono' => $pedido->telefono,
            'notas' => $pedido->notas,
            'created_at' => $pedido->created_at->format('Y-m-d H:i'),
            'user' => [
                'name' => $pedido->usuario->name ?? 'Usuario eliminado',
                'email' => $pedido->usuario->email ?? 'N/A'
            ],
            'items' => $pedido->detallePedidos->map(function ($detalle) {
                return [
                    'name' => $detalle->producto->nombre ?? 'Producto eliminado',
                    'quantity' => $detalle->cantidad,
                    'price' => (float) $detalle->precio_unitario,
                    'subtotal' => (float) $detalle->subtotal,
                    'notas' => $detalle->notas
                ];
            })
        ]);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $pedido = Pedido::findOrFail($id);
        
        $request->validate([
            'estado' => 'required|in:pendiente,confirmado,preparando,en_camino,listo,entregado,cancelado'
        ]);

        $pedido->update(['estado' => $request->estado]);
        
        return response()->json([
            'message' => 'Estado del pedido actualizado exitosamente',
            'order' => [
                'id' => $pedido->id,
                'status' => $pedido->estado
            ]
        ]);
    }

    // Gestión de Usuarios
    public function users()
    {
        $users = User::where('rol', '!=', 'admin')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->rol,
                    'created_at' => $user->created_at->format('Y-m-d H:i')
                ];
            });

        return response()->json($users);
    }

    public function showUser($id)
    {
        $user = User::findOrFail($id);
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->rol,
            'created_at' => $user->created_at->format('Y-m-d H:i')
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:cliente,admin'
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'rol' => $request->role
        ]);
        
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->rol
            ]
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        if ($user->rol === 'admin') {
            return response()->json([
                'message' => 'No se puede eliminar un usuario administrador'
            ], 403);
        }
        
        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    // Estadísticas
    public function stats()
    {
        $stats = [
            'total_orders' => Pedido::count(),
            'total_revenue' => (float) Pedido::where('status', 'completed')->sum('total'),
            'total_users' => User::where('rol', 'cliente')->count(),
            'total_products' => Producto::count(),
            'orders_today' => Pedido::whereDate('created_at', today())->count(),
            'revenue_today' => (float) Pedido::whereDate('created_at', today())->where('status', 'completed')->sum('total'),
        ];

        return response()->json($stats);
    }

    public function salesStats()
    {
        $salesByMonth = Pedido::where('status', 'completed')
            ->selectRaw('MONTH(created_at) as month, SUM(total) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($salesByMonth);
    }

    public function orderStats()
    {
        $ordersByStatus = Pedido::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return response()->json($ordersByStatus);
    }

    // Gestión de Métodos de Pago
    public function getPaymentMethods()
    {
        $methods = PaymentMethod::orderBy('order')->get();
        return response()->json($methods);
    }

    public function updatePaymentMethod(Request $request, $id)
    {
        $method = PaymentMethod::findOrFail($id);
        
        $request->validate([
            'active' => 'sometimes|boolean',
            'phone' => 'nullable|string|max:20',
            'account_name' => 'nullable|string|max:255',
            'qr_image' => 'nullable|string',
            'instructions' => 'nullable|string'
        ]);
        
        $method->update($request->only([
            'active',
            'phone',
            'account_name',
            'qr_image',
            'instructions'
        ]));
        
        return response()->json([
            'message' => 'Método de pago actualizado exitosamente',
            'method' => $method
        ]);
    }

    public function uploadPaymentQR(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('payment_qr', 'public');
            $imageUrl = '/storage/' . $imagePath;

            return response()->json([
                'message' => 'QR subido exitosamente',
                'image_url' => $imageUrl
            ]);
        }

        return response()->json([
            'message' => 'No se encontró la imagen'
        ], 400);
    }
} 