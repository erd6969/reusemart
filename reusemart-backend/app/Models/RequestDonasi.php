<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Barang;
use App\Models\Organisasi;
use App\Models\TransaksiDonasi;

class RequestDonasi extends Model
{
    protected $table = 'request_donasi';
    protected $primaryKey = 'id_request_donasi';
    protected $fillable = [
        'id_organisasi',
        'detail_request',
        'status_request',
    ];

    public $timestamps = false;

    public function organisasi()
    {
        return $this->belongsTo(Organisasi::class, 'id_organisasi', 'id_organisasi');
    }

    public function TransaksiDonasi()
    {
        return $this->hasMany(TransaksiDonasi::class, 'id_request_donasi', 'id_request_donasi');
    }

}
