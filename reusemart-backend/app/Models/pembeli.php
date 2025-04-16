<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Pembeli extends Model
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;

    protected $table = 'pembeli';
    protected $primaryKey = 'id_pembeli';

    protected $fillable = [
        'id_pembeli',
        'email_pembeli',
        'password_pembeli',
        'nama_pembeli',
        'nomor_telepon_pembeli',
        'tanggal_lahir_pembeli',
        'poin_loyalitas',
        'foto_pembeli',
    ];

    public function alamat()
    {
        return $this->hasMany(Alamat::class, 'id_pembeli');
    }
}
