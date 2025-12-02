<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insertar usuario administrador
        DB::table('users')->insert([
            'name' => 'Administrador',
            'email' => 'admin@crepesandcoffee.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insertar categorías
        $categorias = [
            ['nombre' => 'Bebidas', 'descripcion' => 'Café, té, jugos y bebidas refrescantes', 'imagen' => 'bebidas.jpg', 'activo' => true],
            ['nombre' => 'Crepes Salados', 'descripcion' => 'Crepes con ingredientes salados', 'imagen' => 'crepes-salados.jpg', 'activo' => true],
            ['nombre' => 'Crepes Dulces', 'descripcion' => 'Crepes con ingredientes dulces', 'imagen' => 'crepes-dulces.jpg', 'activo' => true],
            ['nombre' => 'Especiales de la Casa', 'descripcion' => 'Nuestras especialidades únicas', 'imagen' => 'especiales.jpg', 'activo' => true],
        ];

        foreach ($categorias as $categoria) {
            $categoria['created_at'] = now();
            $categoria['updated_at'] = now();
            DB::table('categorias')->insert($categoria);
        }

        // Insertar productos básicos
        $productos = [
            [
                'nombre' => 'Café Americano',
                'descripcion' => 'Café negro tradicional - GRATIS',
                'precio' => 0.00,
                'imagen' => '/logo.jpg',
                'categoria_id' => 1,
                'disponible' => true,
                'destacado' => true,
                'stock' => 100,
            ],
            [
                'nombre' => 'Crepe de Chocolate',
                'descripcion' => 'Crepe dulce con chocolate derretido',
                'precio' => 12.00,
                'imagen' => '/crepeChocolate.jpg',
                'categoria_id' => 3,
                'disponible' => true,
                'destacado' => true,
                'stock' => 50,
            ],
            [
                'nombre' => 'Crepe Pollo y Queso',
                'descripcion' => 'Crepe salado con pollo y queso',
                'precio' => 15.00,
                'imagen' => '/crepeChocolateFresa.jpg',
                'categoria_id' => 2,
                'disponible' => true,
                'destacado' => true,
                'stock' => 50,
            ],
        ];

        foreach ($productos as $producto) {
            $producto['created_at'] = now();
            $producto['updated_at'] = now();
            DB::table('productos')->insert($producto);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('productos')->truncate();
        DB::table('categorias')->truncate();
        DB::table('users')->where('email', 'admin@crepesandcoffee.com')->delete();
    }
};