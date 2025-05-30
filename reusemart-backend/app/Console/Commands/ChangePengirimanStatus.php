<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TransaksiPembelian;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

use App\Models\Penitip;
use App\Models\Pembeli;
use App\Http\Controllers\NotificationController;

class ChangePengirimanStatus extends Command
{
    protected $signature = 'transaksi:pengiriman-status';
    protected $description = 'Mengubah status pengiriman jika sudah waktunya';

    public function handle()
    {
        $now = Carbon::now();
        Log::info("================================================");

        Log::info("ChangePengirimanStatus dijalankan pada: {$now}");

        $transaksis = TransaksiPembelian::where('pengiriman', 'diantar kurir')
            ->where('tanggal_pengiriman', '<=', $now)
            ->where('status_pengiriman', '!=', 'sedang diantar')
            ->get();

        if ($transaksis->isEmpty()) {
            Log::info("Tidak ada transaksi yang perlu diubah statusnya.");
        }

        foreach ($transaksis as $transaksi) {
            $id = $transaksi->id_transaksi_pembelian;
            $tanggal = $transaksi->tanggal_pengiriman;
            $transaksi->update(['status_pengiriman' => 'sedang diantar']);
            Log::info("Transaksi ID {$id} dengan tanggal pengiriman {$tanggal} diubah menjadi 'sedang diantar'.");

           $penitips = Penitip::join('transaksi_penitipan', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_pembelian.id_transaksi_pembelian', $id)
                ->select('penitip.*', 'barang.nama_barang')
                ->distinct()
                ->get();


            foreach ($penitips as $penitip) {
                if ($penitip->fcm_token) {
                    $notifRequest = new Request([
                        'token' => $penitip->fcm_token,
                        'title' => 'Barang Penjualan Anda Sedang Diantar',
                        'body' => 'Barang yang Anda titipkan sedang dalam proses pengiriman.',
                    ]);

                    (new NotificationController())->sendNotification($notifRequest);
                }
            }

            $pembeli = Pembeli::join('transaksi_pembelian', 'transaksi_pembelian.id_pembeli', '=', 'pembeli.id_pembeli')
                ->join('komisi', 'komisi.id_transaksi_pembelian', '=', 'transaksi_pembelian.id_transaksi_pembelian')
                ->join('barang', 'barang.id_barang', '=', 'komisi.id_barang')
                ->where('transaksi_pembelian.id_transaksi_pembelian', $id)
                ->select('pembeli.*', 'barang.nama_barang')
                ->first();

            if ($pembeli && $pembeli->fcm_token) {
                $notifRequest = new Request([
                    'token' => $pembeli->fcm_token,
                    'title' => 'Barang Anda Sedang Diantar',
                    'body' => 'Barang yang Anda beli sedang dalam proses pengiriman.',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }
        }

        Log::info("Proses pengubahan status menjadi sedang diantar selesai.");
        $this->info('Transaksi telah diantar.');
    }
}

