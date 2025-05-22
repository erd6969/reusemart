<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Log;
use App\Models\Penitip;
use Illuminate\Http\Request;

class TodayLastPenitipan extends Command
{
    protected $signature = 'penitipan:last-day';
    protected $description = 'Notifikasi barang titipan yang sudah sampai pada tanggal berakhir';

    public function handle()
    {
        $now = Carbon::now();
        $targetDate = Carbon::today();
        Log::info("================================================");
        Log::info("Today Last Penitipan dijalankan pada: {$now}");

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
            Log::info("Notifikasi: Hari ini adalah hari terakhir barang Anda");

            $notifRequest = new Request([
                'token' => $penitip->fcm_token,
                'title' => 'Penitip ' . $penitip->nama_penitip . ' Hari ini adalah hari terakhir barang Anda!',
                'body' => 'Barang Anda dengan nama ' . $transaksi->barang->nama_barang . ' akan berakhir malam ini, silahkan ambil barang anda atau perpanjang penitipan barang ',
            ]);

            Log::info("Notifikasi: {$notifRequest->body}");

            (new NotificationController())->sendNotification($notifRequest);
        }

        Log::info("Proses Notifikasi Penitipan Barang tersisa hari ini selesai.");

        $this->info('Notifikasi barang tersisa hari ini dibatalkan.');
    }
}

