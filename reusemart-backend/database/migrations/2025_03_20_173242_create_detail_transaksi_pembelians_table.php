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
        Schema::create('detail_transaksi_pembelian', function (Blueprint $table) {
            $table->id('id_detail_transaksi_pembelian');
            $table->unsignedBigInteger('id_transaksi_pembelian');
            $table->unsignedBigInteger('id_barang');
            $table->integer('harga_barang');
            $table->timestamps();

            $table->foreign('id_transaksi_pembelian')
                ->references('id_transaksi_pembelian')
                ->on('transaksi_pembelian')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_barang')
                ->references('id_barang')
                ->on('barang')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi_pembelian');
    }
};
