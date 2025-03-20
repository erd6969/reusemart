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
        Schema::create('organisasi', function (Blueprint $table) {
            $table->id('id_organisasi');
            $table->string('email_organisasi')->unique();
            $table->string('password_organisasi');
            $table->string('nama_organisasi');
            $table->string('alamat_organisasi');
            $table->string('nomor_telepon_organisasi');
            $table->string('foto_organisasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organisasi');
    }
};
