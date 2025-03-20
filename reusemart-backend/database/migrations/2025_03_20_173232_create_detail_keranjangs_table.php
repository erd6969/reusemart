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
        Schema::create('detail_keranjang', function (Blueprint $table) {
            $table->id('id_detail_keranjang');
            $table->unsignedBigInteger('id_barang');
            $table->unsignedBigInteger('id_keranjang');       
            $table->float('harga_total');
            $table->integer('jumlah_barang');
            $table->timestamps();

            $table->foreign('id_barang')
                ->references('id_barang')
                ->on('barang')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_keranjang')
                ->references('id_keranjang')
                ->on('keranjang')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_keranjang');
    }
};
