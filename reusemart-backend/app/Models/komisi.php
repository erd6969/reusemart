<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Komisi extends Model
{
    protected $table = 'komisi';
    protected $primaryKey = 'id_komisi';
    protected $fillable = [
        'id_komisi',
        'id_transaksi_pembelian',
        'id_barang',
        'total_harga_kotor',
        'total_harga_bersih',
        'komisi_hunter',
        'komisi_reusemart',
        'bonus_penitip',
        
    ];
    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function transaksiPembelian()
    {
        return $this->belongsTo(TransaksiPembelian::class, 'id_transaksi_pembelian', 'id_transaksi_pembelian');
    }
}
