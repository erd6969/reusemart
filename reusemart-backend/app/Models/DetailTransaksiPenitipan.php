<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DetailTransaksiPenitipan extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'detail_transaksi_penitipan';
    protected $primaryKey = 'id_detail_transaksi_penitipan';
    protected $fillable = [
        'id_detail_transaksi_penitipan',
        'id_transaksi_penitipan',
        'id_barang',
        'tanggal_berakhir',
        'tanggal_batas_pengambilan',
        'status_penitipan',
        'status_perpanjangan',
    ];
    
    public function transaksiPenitipan()
    {
        return $this->belongsTo(TransaksiPenitipan::class, 'id_transaksi_penitipan', 'id_transaksi_penitipan');
    }
    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    
}
