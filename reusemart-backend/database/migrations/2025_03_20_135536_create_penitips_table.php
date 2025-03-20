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
        Schema::create('penitip', function (Blueprint $table) {
            $table->id('id_penitip');
            $table->string('email_penitip')->unique();
            $table->string('password_penitip');
            $table->string('nama_penitip');
            $table->string('NIK');
            $table->string('nomor_telepon_penitip');
            $table->date('tanggal_lahir');
            $table->float('saldo');
            $table->string('poin_loyalitas');
            $table->boolean('badge');
            $table->string('foto_penitip');
            $table->float('komisi_penitip');
            $table->float('rerata_rating');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('penitip');
    }
};
