<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPembelian extends Model
{
    protected $table = 'transaksi_pembelian';
    protected $primaryKey = 'id_transaksi_pembelian';
    public $timestamps = false;

    protected $fillable = [
        'id_pembeli',
        'id_pegawai',
        'id_alamat',
        'id_pegawai',
        'tanggal_pembelian',
        'tanggal_pengiriman',
        'tanggal_pembayaran',
        'tanggal_pengambilan',
        'batas_pembayaran',
        'pengiriman',
        'penggunaan_poin',
        'tambahan_poin',
        'total_pembayaran',
        'bukti_pembayaran',
        'status_pengiriman',
        'status_pembayaran',
        'verifikasi_bukti'
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli', 'id_pembeli');
    }

    public function alamat()
    {
        return $this->belongsTo(Alamat::class, 'id_alamat', 'id_alamat');
    }
    
    public function komisi()
    {
        return $this->hasMany(Komisi::class, 'id_transaksi_pembelian', 'id_transaksi_pembelian');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai', 'id_pegawai');
    }
}
