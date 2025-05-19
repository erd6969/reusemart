<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
class Organisasi extends Model
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;

    protected $table = 'organisasi';
    protected $primaryKey = 'id_organisasi';

    protected $fillable = [
        'id_organisasi',
        'email_organisasi',
        'password_organisasi',
        'nama_organisasi',
        'alamat_organisasi',
        'nomor_telepon_organisasi',
        'foto_organisasi',
        'fcm_token',
    ];

    public function requestDonasi()
    {
        return $this->hasMany(RequestDonasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function transaksiDonasi()
    {
        return $this->hasMany(TransaksiDonasi::class, 'id_organisasi', 'id_organisasi');    
    }
}
