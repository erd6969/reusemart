<?php

namespace App\Console\Commands;

use App\Http\Controllers\BarangController;
use App\Models\Barang;
use Illuminate\Console\Command;
use App\Models\TransaksiPembelian;
use App\Models\Penitip;
use App\Models\Komisi;
use App\Models\DetailTransaksiPenitipan;
use App\Models\TransaksiPenitipan;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class HitungTopSeller extends Command
{
    protected $signature = 'penitip:hitung-top-seller';
    protected $description = 'Menghitung top seller berdasarkan jumlah barang atau total harga yang terjual';

    public function handle()
    {
        $now = Carbon::now();
        $today = $now->month;
        $highest = 0;
        $highestHarga = 0;
        $topSeller = null;


        $penitip = Penitip::all();

        foreach($penitip as $penitips){
            $details = DetailTransaksiPenitipan::whereHas('barang.komisi.transaksiPembelian', function ($query) use ($today) {
                $query->whereMonth('tanggal_pembelian', $today);
            })
            ->where('status_penitipan', 'terjual')
            ->whereHas('transaksiPenitipan', function ($query) use ($penitips) {
                $query->where('id_penitip', $penitips->id_penitip);
            })
            ->with('barang.komisi.transaksiPembelian')
            ->get();

            Log::info("Menghitung top seller untuk penitip: {$penitips->nama_penitip}");

            $transaksiCount = $details->count();
            $totalHarga = $details->sum(function ($detail) {
                return optional($detail->barang->komisi)->sum('total_harga_kotor') ?? 0;
            });

            foreach ($details as $detail) {
                Log::info("Barang ID: {$detail->id_barang}, Total Harga Kotor: " . optional($detail->barang->komisi)->sum('total_harga_kotor') . ", Status Penitipan: {$detail->status_penitipan}");
            }

            Log::info("Jumlah transaksi untuk penitip {$penitips->nama_penitip}: {$transaksiCount}");

            $penitips->badge = 0;
            $penitips->save();

            if($highest < $transaksiCount){
                $highest = $transaksiCount;
                $highestHarga = $totalHarga;
                $topSeller = $penitips;
            }else if($highest == $transaksiCount && $highestHarga < $totalHarga){
                $highest = $transaksiCount;
                $highestHarga = $totalHarga;
                $topSeller = $penitips;
            }

            Log::info("Total harga untuk penitip {$penitips->nama_penitip}: {$totalHarga}");
            Log::info("=================================================");
        }

        $topSeller->badge = 1;
        $bonus = $highestHarga * 0.01;
        $topSeller->saldo = $topSeller->saldo + $bonus;
        $topSeller->komisi_penitip = $topSeller->komisi_penitip + $bonus;
        $topSeller->poin_loyalitas = $topSeller->poin_loyalitas + $bonus;
        $topSeller->save();
        Log::info("Top seller bulan ini adalah: {$topSeller->nama_penitip} dengan total harga terjual: {$highest}");
        Log::info("Bonus untuk penitip adalah: {$bonus}");
        Log::info("=================================================");

    }
}

