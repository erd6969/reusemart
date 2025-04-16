<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Alamat extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'alamat';
    protected $primaryKey = 'id_alamat';

    protected $fillable = [
        'id_alamat',
        'id_pembeli',
        'nama_alamat',
        'alamat',
        'keterangan',
        'kecamatan',
        'kabupaten',
        'kelurahan',
        'kode_pos',
        'alamat_utama',
    ];

    public function pembeli()
    {
        return $this->belongsTo(Pembeli::class, 'id_pembeli');
    }
}
