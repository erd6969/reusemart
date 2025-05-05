<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class Hunter extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'hunter';
    protected $primaryKey = 'id_hunter';
    public $timestamps = false;

    protected $fillable = [
        'id_hunter',
        'email_hunter',
        'password_hunter',
        'nama_hunter',
        'nomor_telepon_hunter',
        'tanggal_lahir_hunter',
        'total_komisi',
        'foto_hunter',
    ];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'id_hunter', 'id_hunter');
    }
}
