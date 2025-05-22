<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TransaksiPembelian;
use App\Models\Komisi;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AutoCancelTransaksi extends Command
{
    protected $signature = 'transaksi:auto-cancel';
    protected $description = 'Cancel transaksi pembelian jika melebihi batas pembayaran';

    public function handle()
    {
        $now = Carbon::now();
        Log::info("================================================");

        Log::info("AutoCancelTransaksi dijalankan pada: {$now}");

        $transaksis = TransaksiPembelian::where('status_pembayaran', '0')
            ->where('batas_pembayaran', '<=', $now)
            ->where('verifikasi_bukti', '!=', 'transaksi dibatalkan')
            ->get();

        if ($transaksis->isEmpty()) {
            Log::info("Tidak ada transaksi yang perlu dibatalkan.");
        }

        foreach ($transaksis as $transaksi) {
            $id_transaksi = $transaksi->id_transaksi_pembelian;

            Log::info("Membatalkan transaksi ID: {$id_transaksi}");

            $idBarangs = Komisi::where('id_transaksi_pembelian', $id_transaksi)
                ->pluck('id_barang');

            DetailTransaksiPenitipan::whereIn('id_barang', $idBarangs)
                ->update([
                    'status_penitipan' => 'ready jual',
                ]);

            $transaksi->update([
                'verifikasi_bukti' => 'transaksi dibatalkan',
            ]);
        }

        Log::info("Proses pembatalan transaksi selesai.");

        $this->info('Transaksi otomatis dibatalkan.');
    }
}

