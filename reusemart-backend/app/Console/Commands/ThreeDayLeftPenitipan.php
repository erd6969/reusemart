<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Log;
use App\Models\Penitip;
use Illuminate\Http\Request;

class ThreeDayLeftPenitipan extends Command
{
    protected $signature = 'penitipan:three-day-left';
    protected $description = 'Notifikasi barang titipan yang sudah tinggal 3 hari';

    public function handle()
    {
        $now = Carbon::now();
        $targetDate = Carbon::now()->addDays(3);
        Log::info("================================================");
        Log::info("3DayLeftPenitipan dijalankan pada: {$now}");
        Log::info("3DayLeftPenitipan dijalankan pada: {$targetDate}");
        Log::info("================================================");

        $transaksis = DetailTransaksiPenitipan::with('transaksiPenitipan', 'barang')
            ->whereDate('tanggal_berakhir', $targetDate)
            ->where('status_penitipan', 'ready jual')
            ->get();

        if ($transaksis->isEmpty()) {
            Log::info("Tidak ada barang yang mendekati tanggal berakhir.");
        }

        foreach ($transaksis as $transaksi) {
            $penitip = Penitip::where('id_penitip', $transaksi->transaksiPenitipan->id_penitip)
                ->first();

            Log::info("Mengirim notifikasi untuk barang ID: {$transaksi->id_barang}");
            Log::info("Mengirim notifikasi ke penitip ID: {$penitip->id_penitip}");
            Log::info("Notifikasi: Barang Anda tersisa 3 hari menuju Tanggal Berakhir");

            $notifRequest = new Request([
                'token' => $penitip->fcm_token,
                'title' => 'Barang Anda tersisa 3 hari menuju Tanggal Berakhir untuk tuan/mbak ' . $penitip->nama_penitip,
                'body' => 'Barang Anda dengan nama ' . $transaksi->barang->nama_barang . ' akan berakhir pada tanggal ' . $transaksi->tanggal_berakhir,
            ]);

            Log::info("Notifikasi: {$notifRequest->body}");

            (new NotificationController())->sendNotification($notifRequest);
        }

        Log::info("Proses Notifikasi Penitipan Barang tersisa 3 hari selesai.");

        $this->info('Notifikasi barang tersisa 3 hari dibatalkan.');
    }
}

