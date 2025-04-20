<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPenitipan extends Model
{
    protected $table = 'transaksi_penitipan';
    protected $primaryKey = 'id_transaksi_penitipan';
    protected $fillable = [
        'id_transaksi_penitipan',
        'id_penitip',
        'tanggal_penitipan',
        'status_penitipan',
        'tanggal_berakhir',
        'tanggal_batas_pengambilan',
        'status_perpanjangan'
    ];
    public $timestamps = true;

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip', 'id_penitip');
    }
    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_barang', 'id_barang');
    }

    public function detailTransaksiPenitipan()
    {
        return $this->hasMany(DetailTransaksiPenitipan::class, 'id_transaksi_penitipan', 'id_transaksi_penitipan');
    }


}
