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
        Schema::create('alamat', function (Blueprint $table) {
            $table->id('id_alamat');
            $table->unsignedBigInteger('id_pembeli');
            $table->string('nama_alamat');
            $table->string('alamat');
            $table->string('keterangan');
            $table->string('kecamatan');
            $table->string('kabupaten');
            $table->string('kelurahan');
            $table->integer('kode_pos');
            $table->boolean('alamat_utama');
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
        Schema::dropIfExists('alamat');
    }
};
