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
        Schema::create('diskusi', function (Blueprint $table) {
            $table->id('id_diskusi');
            $table->unsignedBigInteger('id_barang');
            $table->unsignedBigInteger('id_pembeli');
            $table->unsignedBigInteger('id_pegawai');
            $table->string('diskusi');
            $table->datetime('waktu_diskusi');
            $table->timestamps();

            $table->foreign('id_barang')
                ->references('id_barang')
                ->on('barang')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_pembeli')
                ->references('id_pembeli')
                ->on('pembeli')
                ->onUpdate('cascade')
                ->onDelete('cascade');

            $table->foreign('id_pegawai')
                ->references('id_pegawai')
                ->on('pegawai')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diskusi');
    }
};
