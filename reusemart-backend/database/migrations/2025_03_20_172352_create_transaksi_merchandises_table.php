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
        Schema::create('transaksi_merchandise', function (Blueprint $table) {
            $table->id('id_transaksi_merchandise');
            $table->unsignedBigInteger('id_pembeli');
            $table->date('tanggal_claim');
            $table->integer('jumlah_claim');
            $table->boolean('status_claim');
            $table->timestamps();

            $table->foreign('id_pembeli')
                ->references('id_pembeli')
                ->on('pembeli')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi_merchandise');
    }
};
