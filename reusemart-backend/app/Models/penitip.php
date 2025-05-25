<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Penitip extends Model
{
    use HasFactory, HasApiTokens;

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
        'foto_ktp',
        'komisi_penitip',
        'rerata_rating',
        'fcm_token',
    ];
    public $timestamps = false;
    

    public function transaksiPenitipan()
    {
        return $this->hasMany(TransaksiPenitipan::class, 'id_penitip', 'id_penitip');
    }
    
}
