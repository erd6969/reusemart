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
        Schema::create('barang', function (Blueprint $table) {
            $table->id('id_barang');
            $table->unsignedBigInteger('id_transaksi_penitipan');
            $table->unsignedBigInteger('id_pegawai');
            $table->unsignedBigInteger('id_kategori');
            $table->unsignedBigInteger('id_hunter');
            $table->string('nama_barang');
            $table->string('deskripsi_barang');
            $table->boolean('garansi');
            $table->string('kondisi_barang');
            $table->float('harga_barang');
            $table->string('foto_barang');
            $table->timestamps();

            $table->foreign('id_transaksi_penitipan')
                ->references('id_transaksi_penitipan')
                ->on('transaksi_penitipan')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_pegawai')
                ->references('id_pegawai')
                ->on('pegawai')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_kategori')
                ->references('id_kategori')
                ->on('kategori')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_hunter')
                ->references('id_hunter')
                ->on('hunter')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang');
    }
};
