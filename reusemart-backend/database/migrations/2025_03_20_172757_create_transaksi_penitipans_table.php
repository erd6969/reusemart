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
        Schema::create('transaksi_penitipan', function (Blueprint $table) {
            $table->id('id_transaksi_penitipan');
            $table->unsignedBigInteger('id_penitip');
            $table->date('tanggal_penitipan');
            $table->string('status_penitipan');
            $table->date('tanggal_berakhir');
            $table->date('tanggal_batas_pengambilan');
            $table->boolean('status_perpanjangan');
            $table->timestamps();

            $table->foreign('id_penitip')
                ->references('id_penitip')
                ->on('penitip')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_penitipan');
    }
};
