<?php

namespace App\Http\Controllers;

use App\Models\TransaksiPembelian;
use App\Models\DetailTransaksiPenitipan;
use App\Models\Komisi;
use App\Models\Barang;
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

    public function cancelTransaksiPembelian(Request $request)
    {
        try {
            $id_transaksi_pembelian = $request->input('id_transaksi_pembelian');

            // Ambil semua id_barang dari komisi
            $idBarangs = Komisi::where('id_transaksi_pembelian', $id_transaksi_pembelian)
                ->pluck('id_barang');

            // Update status_penitipan jadi "ready jual"
            DetailTransaksiPenitipan::whereIn('id_barang', $idBarangs)
                ->update([
                    'status_penitipan' => 'ready jual',
                ]);

            // Update transaksi menjadi dibatalkan
            TransaksiPembelian::where('id_transaksi_pembelian', $id_transaksi_pembelian)
                ->update([
                    'verifikasi_bukti' => 'Transaksi dibatalkan',
                ]);

            return response()->json([
                'message' => 'Transaksi Pembelian cancelled successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function finalizeTransaksiPembelian(Request $request)
    {
        try {
            // Validasi bukti pembayaran
            $request->validate([
                'id_transaksi_pembelian' => 'required|exists:transaksi_pembelian,id_transaksi_pembelian',
                'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            // Upload file terlebih dahulu
            $image = $request->file('bukti_pembayaran');
            $uploadFolder = 'img/BuktiBayar';
            $image_uploaded_path = $image->store($uploadFolder, 'public');
            $fileName = basename($image_uploaded_path); // hasil: nama_file.jpg

            // Update transaksi
            TransaksiPembelian::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->update([
                    'tanggal_pembayaran' => now(),
                    'bukti_pembayaran' => $fileName,
                    'status_pembayaran' => 1,
                    'verifikasi_bukti' => 'belum diverifikasi',
                ]);

            // Ambil semua id_barang dari komisi
            $idBarangs = Komisi::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->pluck('id_barang');

            // Update status_penitipan jadi "ready jual"
            DetailTransaksiPenitipan::whereIn('id_barang', $idBarangs)
                ->update([
                    'status_penitipan' => 'terjual',
                ]);

            return response()->json([
                'message' => 'Transaksi berhasil difinalisasi',
                'bukti_pembayaran' => $fileName,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to finalize Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
