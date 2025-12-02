<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            [
                'nombre' => 'Bebidas',
                'descripcion' => 'Café, té, jugos y bebidas refrescantes',
                'imagen' => 'bebidas.jpg',
                'activo' => true,
            ],
            [
                'nombre' => 'Crepes Salados',
                'descripcion' => 'Crepes con ingredientes salados',
                'imagen' => 'crepes-salados.jpg',
                'activo' => true,
            ],
            [
                'nombre' => 'Crepes Dulces',
                'descripcion' => 'Crepes con ingredientes dulces',
                'imagen' => 'crepes-dulces.jpg',
                'activo' => true,
            ],
            [
                'nombre' => 'Especiales de la Casa',
                'descripcion' => 'Nuestras especialidades únicas',
                'imagen' => 'especiales.jpg',
                'activo' => true,
            ],
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}
