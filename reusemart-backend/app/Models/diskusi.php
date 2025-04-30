<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Diskusi extends Model
{
    use HasFactory;

    protected $table = 'diskusi';
    protected $primaryKey = 'id_diskusi';
    public $timestamps = false;

    protected $fillable = [
        'id_diskusi',
        'id_barang',
        'id_pembeli',
        'id_pegawai',
        'diskusi',
        'waktu_diskusi',
    ];

    public function barang()
    {
        return $this->belongsTo(Barang::class, 'id_barang', 'id_barang');
    }

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli', 'id_pembeli');
    }

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'id_pegawai', 'id_pegawai');
    }
}
