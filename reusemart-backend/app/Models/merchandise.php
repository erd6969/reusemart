<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchandise extends Model
{
    protected $table = 'merchandise';
    protected $primaryKey = 'id_merchandise';
    public $timestamps = false;

    protected $fillable = [
        'nama_merchandise',
        'jumlah_merchandise',
        'deskripsi',
        'gambar_merchandise',
        'poin_tukar'
    ];

    public function transaksiMerchandise()
    {
        return $this->hasMany(TransaksiMerchandise::class, 'id_merchandise', 'id_merchandise');
    }
}
