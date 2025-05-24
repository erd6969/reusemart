<?php

namespace App\Http\Controllers;

use App\Models\Komisi;
use App\Models\Keranjang;
use App\Models\Barang;
use App\Models\DetailTransaksiPenitipan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class KomisiController
{
    public function createKomisi($id_barang, Request $request)
    {
        $komisi = Komisi::create([
            'id_transaksi_pembelian' => $request->id_transaksi_pembelian,
            'id_barang' => $id_barang,
        ]);

        // Update the status of the item in the cart
        DetailTransaksiPenitipan::where('id_barang', $id_barang)
        ->update([
            'status_penitipan' => 'proses pembayaran',
        ]);

        // Menghapus barang dari keranjang
        Keranjang::where('id_barang', $id_barang)
            ->where('id_pembeli', Auth::guard('pembeli')->user()->id_pembeli)
            ->delete();


        return response()->json([
            'message' => 'Komisi created successfully',
            'komisi' => $komisi,
        ], 201);
    }

    public function getKomponenKomisi($id_barang)
    {
        $barang = Barang::find($id_barang);
        if (!$barang) {
            return response()->json([
                'message' => 'Barang not found',
            ], 404);
        }

        // Komisi Hunter
        $komisi_hunter = 0;
        if ($barang->id_hunter != null) {
            $komisi_hunter = $barang->harga_barang * 0.05;
        }

        // Status Perpanjangan & Tanggal Penitipan
        $detail = Barang::where('barang.id_barang', $id_barang)
            ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
            ->join('transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
            ->select('detail_transaksi_penitipan.status_perpanjangan', 'transaksi_penitipan.tanggal_penitipan')
            ->first();

        Log::info('Detail Transaksi Penitipan:', [
            'status_perpanjangan' => $detail->status_perpanjangan,
            'tanggal_penitipan' => $detail->tanggal_penitipan,
        ]);

        // Komisi Reusemart
        $komisi_reusemart = $detail->status_perpanjangan == 0
            ? $barang->harga_barang * 0.15
            : $barang->harga_barang * 0.25;
            //buat yang versi ga ada hunter

        // Bonus Penitip (20% dari komisi reusemart jika < 7 hari)
        $bonus_penitip = 0;
        if ($detail->tanggal_penitipan >= now()->subDays(7)) {
            $bonus_penitip = $komisi_reusemart * 0.2;
        }

        return response()->json([
            'id_barang' => $id_barang,
            'komisi_hunter' => $komisi_hunter,
            'komisi_reusemart' => $komisi_reusemart,
            'bonus_penitip' => $bonus_penitip,
        ]);
    }


}
