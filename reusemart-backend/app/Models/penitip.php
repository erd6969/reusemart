<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penitip extends Model
{
    protected $table = 'penitip';
    protected $primaryKey = 'id_penitip';
    protected $fillable = [
        'id_penitip',
        'email_penitip',
        'password_penitip',
        'nama_penitip',
        'NIK',
        'nomor_telepon_penitip',
        'tanggal_lahir',
        'saldo',
        'poin_loyalitas',
        'badge',
        'foto_penitip',
        'komisi_penitip',
        'rerata_rating'
    ];
    public $timestamps = true;

    public function transaksiPenitipan()
    {
        return $this->hasMany(TransaksiPenitipan::class, 'id_penitip', 'id_penitip');
    }
    
}
