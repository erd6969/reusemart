<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
class Pegawai extends Model
{
    use HasFactory, HasApiTokens;

    public $timestamps = false;

    protected $table = 'pegawai';
    protected $primaryKey = 'id_pegawai';

    protected $fillable = [
        'id_pegawai',
        'id_jabatan',
        'email_pegawai',
        'password_pegawai',
        'nama_pegawai',
        'tanggal_lahir',
        'foto_pegawai',
        'fcm_token',
    ];

    public function jabatan()
    {
        return $this->belongsTo(Jabatan::class, 'id_jabatan', 'id_jabatan');
    }

    public function diskusi()
    {
        return $this->hasMany(Diskusi::class, 'id_pegawai', 'id_pegawai');
    }
}
