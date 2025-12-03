<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/test', function () {
    return '<h1>App is working! ✅</h1>';
});

Route::get('/run-migrations', function () {
    try {
        // Mostrar información de conexión
        $dbConfig = [
            'driver' => config('database.default'),
            'host' => config('database.connections.pgsql.host'),
            'database' => config('database.connections.pgsql.database'),
            'username' => config('database.connections.pgsql.username'),
        ];
        
        $output = '<h1>Ejecutando Migraciones...</h1>';
        $output .= '<h2>Configuración</h2><pre>' . json_encode($dbConfig, JSON_PRETTY_PRINT) . '</pre>';
        
        // Probar conexión
        try {
            \DB::connection()->getPdo();
            $output .= '<p style="color:green">✅ Conexión a base de datos: OK</p>';
        } catch (\Exception $e) {
            $output .= '<p style="color:red">❌ Error de conexión: ' . $e->getMessage() . '</p>';
            return $output;
        }
        
        // Ejecutar migraciones
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $migrationOutput = \Illuminate\Support\Facades\Artisan::output();
        
        $output .= '<h2>Resultado de Migraciones</h2><pre>' . $migrationOutput . '</pre>';
        $output .= '<p style="color:green;font-size:20px">✅ Migraciones completadas</p>';
        
        return $output;
    } catch (\Throwable $e) {
        return '<h1 style="color:red">❌ Error Fatal</h1>
                <h2>Mensaje:</h2><pre>' . $e->getMessage() . '</pre>
                <h2>Archivo:</h2><pre>' . $e->getFile() . ':' . $e->getLine() . '</pre>
                <h2>Stack Trace:</h2><pre>' . $e->getTraceAsString() . '</pre>';
    }
});

Route::get('/list-tables', function () {
    try {
        $tables = \DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
        
        $output = '<h1>Tablas en la Base de Datos</h1>';
        $output .= '<p>Total: ' . count($tables) . '</p>';
        $output .= '<ul>';
        foreach ($tables as $table) {
            $output .= '<li>' . $table->table_name . '</li>';
        }
        $output .= '</ul>';
        
        return $output;
    } catch (\Exception $e) {
        return '<h1 style="color:red">Error</h1><pre>' . $e->getMessage() . '</pre>';
    }
});
