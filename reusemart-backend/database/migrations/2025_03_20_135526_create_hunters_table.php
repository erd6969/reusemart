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
        Schema::create('hunter', function (Blueprint $table) {
            $table->id('id_hunter');
            $table->string('email_hunter')->unique();
            $table->string('password_hunter');
            $table->string('nama_hunter');
            $table->string('nomor_telepon_hunter');
            $table->float('total_komisi');
            $table->string('foto_hunter');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hunter');
    }
};
