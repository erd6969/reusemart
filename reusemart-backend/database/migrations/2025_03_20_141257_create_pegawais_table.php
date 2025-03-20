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
        Schema::create('pegawai', function (Blueprint $table) {
            $table->id('id_pegawai');
            $table->unsignedBigInteger('id_jabatan');
            $table->string('email_pegawai')->unique();
            $table->string('password_pegawai');
            $table->string('nama_pegawai');
            $table->date('tanggal_lahir');
            $table->string('foto_pegawai');
            $table->timestamps();

            $table->foreign('id_jabatan')
                ->references('id_jabatan')
                ->on('jabatan')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawai');
    }
};
