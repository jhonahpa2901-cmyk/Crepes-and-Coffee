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
        config(['app.debug' => true]);
        \Illuminate\Support\Facades\Artisan::call('migrate --force');
        return '<h1>Migraciones ejecutadas con éxito ✅</h1><pre>' . \Illuminate\Support\Facades\Artisan::output() . '</pre>';
    } catch (\Throwable $e) {
        return '<h1>Error al ejecutar migraciones ❌</h1><pre>' . $e->getMessage() . "\n\n" . $e->getTraceAsString() . '</pre>';
    }
});

