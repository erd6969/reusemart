<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPenitipan extends Model
{
    protected $table = 'transaksi_penitipan';
    protected $primaryKey = 'id_transaksi_penitipan';
    public $timestamps = false;
    protected $fillable = [
        'id_transaksi_penitipan',
        'id_penitip',
        'tanggal_penitipan',
    ];

    protected $casts = [
        'tanggal_penitipan' => 'date',
    ];

    public function penitip()
    {
        return $this->belongsTo(Penitip::class, 'id_penitip', 'id_penitip');
    }

    public function detailTransaksiPenitipan()
    {
        return $this->hasMany(DetailTransaksiPenitipan::class, 'id_transaksi_penitipan', 'id_transaksi_penitipan');
    }


}
