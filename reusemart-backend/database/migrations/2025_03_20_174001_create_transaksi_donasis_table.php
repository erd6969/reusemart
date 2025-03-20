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
        Schema::create('transaksi_donasi', function (Blueprint $table) {
            $table->id('id_transaksi_donasi');
            $table->unsignedBigInteger('id_organisasi');
            $table->unsignedBigInteger('id_request_donasi');
            $table->date('tanggal_donasi');
            $table->string('nama_penerima');
            $table->timestamps();

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_request_donasi')
                ->references('id_request_donasi')
                ->on('request_donasi')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_donasi');
    }
};
