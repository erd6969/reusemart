<?php

namespace App\Http\Controllers;

use App\Models\TransaksiPembelian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransaksiPembelianController
{
    public function createTransaksiPembelian(Request $request)
    {
        try{
            $pembeli = Auth::user();
            if (!$pembeli) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

            $transaksi = TransaksiPembelian::create([
                'id_pembeli' => $pembeli->id_pembeli,
                'id_alamat' => $request->id_alamat,
                'tanggal_pembelian' => now(),
                'batas_pembayaran' => now()->addMinutes(15),
                'pengiriman' => $request->pengiriman,
                'penggunaan_poin' => $request->penggunaan_poin,
                'tambahan_poin' => $request->tambahan_poin,
                'total_pembayaran' => $request->total_pembayaran,
                'status_pembayaran' => 0,
                'verifikasi_bukti' => 'belum diverifikasi',
            ]);

            return response()->json([
                'message' => 'Transaksi Pembelian created successfully',
                'transaksi' => $transaksi,
            ], 201);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showTransaksiPembelian()
    {
        try {
            $pembeli = Auth::user();
            if (!$pembeli) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

            $transaksi = TransaksiPembelian::where('id_pembeli', $pembeli->id_pembeli)
                        ->orderBy('id_transaksi_pembelian', 'desc')
                        ->first();

            return response()->json([
                'message' => 'Daftar Transaksi Pembelian retrieved successfully',
                'transaksi' => $transaksi,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
