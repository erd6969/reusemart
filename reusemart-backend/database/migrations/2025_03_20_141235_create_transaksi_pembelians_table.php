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
        Schema::create('transaksi_pembelian', function (Blueprint $table) {
            $table->id('id_transaksi_pembelian');
            $table->unsignedBigInteger('id_pembayaran');
            $table->unsignedBigInteger('id_alamat');
            $table->datetime('tanggal_pembelian');
            $table->string('status_transaksi');
            $table->integer('total_barang');
            $table->date('tanggal_pengiriman');
            $table->float('total_harga');
            $table->float('total_harga_bersih');
            $table->float('total_harga_kotor');
            $table->float('komisi_hunter');
            $table->float('komisi_reusemart');
            $table->float('bonus_penitip');
            $table->timestamps();

            $table->foreign('id_pembayaran')
                ->references('id_pembayaran')
                ->on('pembayaran')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_alamat')
                ->references('id_alamat')
                ->on('alamat')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_pembelian');
    }
};
