<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiMerchandise extends Model
{

    protected $table = 'transaksi_merchandise';
    protected $primaryKey = 'id_transaksi_merchandise';
    public $timestamps = false;
    protected $fillable = [
        'id_pembeli',
        'id_merchandise',
        'tanggal_claim',
        'jumlah_claim',
        'status_claim'
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli', 'id_pembeli');
    }
    public function merchandise()
    {
        return $this->belongsTo(Merchandise::class, 'id_merchandise', 'id_merchandise');
    }

}
