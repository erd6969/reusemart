<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Log;
use App\Models\Penitip;
use Illuminate\Http\Request;

class BarangTidakDiambil7Hari extends Command
{
    protected $signature = 'barang:tidak-diambil-7-hari';
    protected $description = 'Notifikasi barang titipan yang sudah lebih dari 7 hari tidak diambil';

    public function handle()
    {
        $now = Carbon::now();
        $targetDate = Carbon::today();
        Log::info("================================================");
        Log::info("Barang tidak diambil 7 hari dijalankan pada: {$now}");

        $transaksis = DetailTransaksiPenitipan::with('transaksiPenitipan', 'barang')
            ->whereDate('tanggal_batas_pengambilan', $targetDate)
            ->where('status_penitipan', 'ready jual')
            ->get();

        if ($transaksis->isEmpty()) {
            Log::info("Tidak ada barang yang mendekati melewati 7 hari tanggal berakhir.");
        }

        foreach ($transaksis as $transaksi) {
            $penitip = Penitip::where('id_penitip', $transaksi->transaksiPenitipan->id_penitip)
                ->first();

            $transaksi->status_penitipan = 'open donasi';
            $transaksi->save();

            Log::info("Mengirim notifikasi untuk barang ID: {$transaksi->id_barang}");
            Log::info("Mengirim notifikasi ke penitip ID: {$penitip->id_penitip}");
            Log::info("Notifikasi: Hari ini adalah hari terakhir untuk mengambil barang Anda");

            $notifRequest = new Request([
                'token' => $penitip->fcm_token,
                'title' => 'HARI INI HARI TERAKHIR MENGAMBIL BARANG ANDA UNTUK PENITIP ' . $penitip->nama_penitip,
                'body' => 'Barang Anda dengan nama ' . $transaksi->barang->nama_barang . ' sudah lebih dari 7 hari tidak diambil, silahkan ambil barang anda atau barang anda akan didonasikan!',
            ]);

            Log::info("Notifikasi: {$notifRequest->body}");

            (new NotificationController())->sendNotification($notifRequest);
        }

        Log::info("Proses Notifikasi Pengambilan Barang tersisa hari ini selesai.");

        $this->info('Notifikasi pengambilan barang tersisa hari ini dibatalkan.');
    }
}

