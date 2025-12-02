<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Yape, Plin, Efectivo, Contra Entrega
            $table->string('type'); // digital, cash
            $table->boolean('active')->default(true);
            $table->string('phone')->nullable(); // Para Yape/Plin
            $table->string('account_name')->nullable(); // Nombre del titular
            $table->string('qr_image')->nullable(); // URL del QR
            $table->text('instructions')->nullable(); // Instrucciones adicionales
            $table->integer('order')->default(0); // Orden de visualización
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
