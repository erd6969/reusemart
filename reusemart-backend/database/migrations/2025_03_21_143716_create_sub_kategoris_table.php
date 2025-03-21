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
        Schema::create('sub_kategori', function (Blueprint $table) {
            $table->id('id_sub_kategori');
            $table->unsignedBigInteger('id_kategori');
            $table->string('nama_sub_kategori');
            $table->timestamps();

            $table->foreign('id_kategori')
                ->references('id_kategori')
                ->on('kategori')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_kategori');
    }
};
