<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate --force');
        return '<h1>Migraciones ejecutadas con éxito ✅</h1><pre>' . \Illuminate\Support\Facades\Artisan::output() . '</pre>';
    } catch (\Exception $e) {
        return '<h1>Error al ejecutar migraciones ❌</h1><pre>' . $e->getMessage() . '</pre>';
    }
});
