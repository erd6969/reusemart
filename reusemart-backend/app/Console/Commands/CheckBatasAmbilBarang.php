<?php

namespace App\Console\Commands;

use App\Models\Barang;
use Illuminate\Console\Command;
use App\Models\TransaksiPembelian;
use App\Models\Komisi;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CheckBatasAmbilBarang extends Command
{
    protected $signature = 'transaksi:check-batas';
    protected $description = 'Hangus';

    public function handle()
    {
        $now = Carbon::now();

        $transaksis = TransaksiPembelian::with('komisi.barang.detailtransaksipenitipan')
            ->where('pengiriman', 'diambil sendiri')
            ->where('tanggal_pengiriman', '<=', $now->subDays(2))
            ->get();

        foreach ($transaksis as $transaksi) {
            $transaksi->update([
                'status_pengiriman' => 'hangus',
            ]);

            foreach ($transaksi->komisi as $komisi) {
                $barang = $komisi->barang;

                if ($barang) {
                    foreach ($barang->detailtransaksipenitipan as $detail) {
                        $detail->update([
                            'status_penitipan' => 'open donasi',
                        ]);
                    }
                }
            }
        }
    }
}

