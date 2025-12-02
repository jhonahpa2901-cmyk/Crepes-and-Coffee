<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductoResource;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $productos = Producto::with('categoria')->where('disponible', true)->get();
        return response()->json($productos);
    }

    public function adminIndex(): JsonResponse
    {
        $productos = Producto::with('categoria')
            ->withCount('pedidoItems as orders_count')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($productos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias,id',
            'disponible' => 'boolean',
            'destacado' => 'boolean',
            'stock' => 'integer|min:0',
        ]);

        $producto = Producto::create($request->all());

        return response()->json([
            'message' => 'Producto creado exitosamente',
            'producto' => new ProductoResource($producto->load('categoria'))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): ProductoResource
    {
        $producto = Producto::with('categoria')->findOrFail($id);
        return new ProductoResource($producto);
    }

    /**
     * Display productos por categoría.
     */
    public function porCategoria(string $categoriaId): AnonymousResourceCollection
    {
        $productos = Producto::with('categoria')
            ->where('categoria_id', $categoriaId)
            ->where('disponible', true)
            ->get();
        return ProductoResource::collection($productos);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric|min:0',
            'imagen' => 'nullable|string',
            'categoria_id' => 'required|exists:categorias,id',
            'disponible' => 'boolean',
            'destacado' => 'boolean',
            'stock' => 'integer|min:0',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->all());

        return response()->json([
            'message' => 'Producto actualizado exitosamente',
            'producto' => new ProductoResource($producto->load('categoria'))
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json([
            'message' => 'Producto eliminado exitosamente'
        ]);
    }
}
