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
        Schema::create('pembeli', function (Blueprint $table) {
            $table->id('id_pembeli');
            $table->unsignedBigInteger('id_transaksi_pembelian');
            $table->string('email_pembeli')->unique();
            $table->string('password_pembeli');
            $table->string('nama_pembeli');
            $table->string('nomor_telepon_pembeli');
            $table->date("tanggal_lahir_pembeli");
            $table->integer('poin_loyalitas');
            $table->string('foto_pembeli');
            $table->timestamps();

            $table->foreign('id_transaksi_pembelian')
                ->references('id_transaksi_pembelian')
                ->on('transaksi_pembelian')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembeli');
    }
};
