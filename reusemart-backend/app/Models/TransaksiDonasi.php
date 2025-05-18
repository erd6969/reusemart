<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiDonasi extends Model
{
    protected $table = 'transaksi_donasi';
    protected $primaryKey = 'id_transaksi_donasi';
    protected $fillable = [
        'id_barang',
        'id_organisasi',
        'id_request_donasi',
        'tanggal_donasi',
        'nama_penerima',
    ];

    public $timestamps = false;

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }
    public function request_donasi()
    {
        return $this->belongsTo(RequestDonasi::class, 'id_request_donasi', 'id_request_donasi');
    }
}
