<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $fillable = [
        'id_pegawai',
        'id_kategori',
        'id_hunter',
        'nama_barang',
        'deskripsi_barang',
        'garansi',
        'kondisi_barang',
        'harga_barang',
        'foto_barang',
        'foto_barang2',
        'foto_barang3',
        
    ];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai');
    }
    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'id_kategori');
    }
    public function hunter()
    {
        return $this->belongsTo(Hunter::class, 'id_hunter');
    }

    public function request_donasi()
    {
        return $this->hasMany(request_donasi::class, 'id_barang', 'id_barang');
    }

    public function detailtransaksipenitipan()
    {
        return $this->hasMany(DetailTransaksiPenitipan::class, 'id_barang', 'id_barang');
    }
    
}
