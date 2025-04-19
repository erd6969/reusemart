<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $fillable = [
        'id_transaksi_penitipan',
        'id_pegawai',
        'id_kategori',
        'id_hunter',
        'nama_barang',
        'deskripsi_barang',
        'garansi',
        'kondisi_barang',
        'harga_barang',
        'foto_barang',
        
    ];

    public function transaksi_penitipan()
    {
        return $this->belongsTo(TransaksiPenitipan::class, 'id_transaksi_penitipan');
    }
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

    
}
