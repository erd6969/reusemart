<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';
    protected $fillable = [
        'id_kategori',
        'nama_kategori',
    ];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_kategori');
    }

}
