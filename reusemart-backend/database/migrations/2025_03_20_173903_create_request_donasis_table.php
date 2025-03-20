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
        Schema::create('request_donasi', function (Blueprint $table) {
            $table->id('id_request_donasi');
            $table->unsignedBigInteger('id_barang');
            $table->unsignedBigInteger('id_organisasi');
            $table->string('detail_request');
            $table->boolean('status_request');
            $table->timestamps();

            $table->foreign('id_barang')
                ->references('id_barang')
                ->on('barang')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_organisasi')
                ->references('id_organisasi')
                ->on('organisasi')
                ->onUpdate('cascade')
                ->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_donasi');
    }
};
