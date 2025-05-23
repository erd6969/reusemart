<?php

namespace App\Http\Controllers;

use App\Models\TransaksiPembelian;
use App\Models\DetailTransaksiPenitipan;
use App\Models\Komisi;
use App\Models\Barang;
use App\Models\Pembeli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Penitip;
use Illuminate\Support\Facades\Log;

use App\Http\Controllers\NotificationController;


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
                'batas_pembayaran' => now()->addMinutes(1),
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
                    'verifikasi_bukti' => 'transaksi dibatalkan',
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
                'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg,gif',
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

            TransaksiPembelian::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->update([
                    'status_pengiriman' => 'sedang disiapkan'
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

    public function showUnverifiedTransaksiPembelian()
    {
        try {
            $transaksi = TransaksiPembelian::join('pembeli', 'transaksi_pembelian.id_pembeli', '=', 'pembeli.id_pembeli')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('verifikasi_bukti', 'belum diverifikasi')
                ->orderBy('transaksi_pembelian.id_transaksi_pembelian', 'asc')
                ->select(
                    'transaksi_pembelian.*',
                    'pembeli.nama_pembeli',
                    'komisi.id_barang',
                    'barang.nama_barang',
                    'barang.harga_barang'
                )
                ->paginate(10);
                Log::info($transaksi);

            $groupedTransaksi = $transaksi->groupBy('id_transaksi_pembelian')->map(function($group){
                return [
                    'id_transaksi_pembelian' => $group[0]->id_transaksi_pembelian,
                    'nama_pembeli' => $group[0]->nama_pembeli,
                    'tanggal_pembelian' => $group[0]->tanggal_pembelian,
                    'tanggal_pembayaran' => $group[0]->tanggal_pembayaran,
                    'batas_pembayaran' => $group[0]->batas_pembayaran,
                    'pengiriman' => $group[0]->pengiriman,
                    'penggunaan_poin' => $group[0]->penggunaan_poin,
                    'tambahan_poin' => $group[0]->tambahan_poin,
                    'total_pembayaran' => $group[0]->total_pembayaran,
                    'status_pembayaran' => $group[0]->status_pembayaran,
                    'verifikasi_bukti' => $group[0]->verifikasi_bukti,
                    'status_pengiriman' => $group[0]->status_pengiriman,
                    'bukti_pembayaran' => $group[0]->bukti_pembayaran,
                    'barang' => $group->map(function($item) {
                        return [
                            'id_barang' => $item->id_barang,
                            'nama_barang' => $item->nama_barang,
                            'harga_barang' => $item->harga_barang,
                        ];
                    })->values()
                ];
            })->values();

            return response()->json([
                'message' => 'Daftar Unverified Transaksi Pembelian retrieved successfully',
                'transaksi' => [
                    'current_page' => $transaksi->currentPage(),
                    'last_page' => $transaksi->lastPage(),
                    'per_page' => $transaksi->perPage(),
                    'total' => $transaksi->total(),
                    'data' => $groupedTransaksi
                ],
            ], 200);


        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve Unverified Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showDataModal($id_transaksi_pembelian)
    {
        try {
            $transaksi = TransaksiPembelian::where('id_transaksi_pembelian', $id_transaksi_pembelian)
                ->join('pembeli', 'transaksi_pembelian.id_pembeli', '=', 'pembeli.id_pembeli')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->select(
                    'transaksi_pembelian.*',
                    'komisi.*',
                    'barang.*',
                    'pembeli.nama_pembeli'
                )
                ->first();

            return response()->json([
                'message' => 'Data Modal retrieved successfully',
                'transaksi' => $transaksi,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve Data Modal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function verifyTransaksiPembelian(Request $request)
    {
        try {
            $transaksi = TransaksiPembelian::with('komisi.barang.detailTransaksiPenitipan.transaksiPenitipan.penitip')
                ->where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->first();

            if (!$transaksi) {
                return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
            }

            $transaksi->update([
                'verifikasi_bukti' => 'transaksi diverifikasi',
                'status_pengiriman' => 'sedang disiapkan'
            ]);
            
            // Ambil penitip pertama yang ditemukan
            $penitip = Penitip::join('transaksi_penitipan', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                    ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                    ->join('barang', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                    ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                    ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                    ->where('transaksi_pembelian.id_transaksi_pembelian', $request->id_transaksi_pembelian)
                    ->select('penitip.*')
                    ->first();

            // Kirim notifikasi
            if ($penitip && $penitip->fcm_token) {
                $notifRequest = new Request([
                    'token' => $penitip->fcm_token,
                    'title' => 'Barang Terjual',
                    'body' => 'Barang Anda Telah Terjual dan Sedang Disiapkan untuk Pengiriman',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }

            return response()->json(['message' => 'Transaksi diverifikasi dan notifikasi dikirim'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memverifikasi transaksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function rejectTransaksiPembelian(Request $request)
    {
        try {
            $transaksi = TransaksiPembelian::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->update([
                    'verifikasi_bukti' => 'transaksi ditolak',
                ]);

            return response()->json([
                'message' => 'Transaksi Pembelian rejected successfully',
                'transaksi' => $transaksi,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reject Transaksi Pembelian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getJumlahPengantaranKurir()
    {
        try {
            $kurir = Auth::user();
            if (!$kurir) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

            $jumlahPengantaran = TransaksiPembelian::where('id_pegawai', $kurir->id_pegawai)
                ->where('status_pengiriman', 'sudah diterima')
                ->count();

            return response()->json([
                'message' => 'Jumlah Pengantaran retrieved successfully',
                'jumlah_pengantaran' => $jumlahPengantaran,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve Jumlah Pengantaran',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // ------------------------ Kurir ------------------------

    public function getHistoriPengirimanKurir($tanggal)
    {
        try {
            $kurir = Auth::guard('kurir')->user();
            if (!$kurir) {
                return response()->json(['message' => 'Kurir not found'], 404);
            }

            $historiPengiriman = TransaksiPembelian::where('id_pegawai', $id_kurir)
                ->where('pengiriman', '=', 'diantar kurir')
                ->where('status_pengiriman', '=', 'sudah diterima')
                ->whereDate('tanggal_pengiriman', $tanggal)
                ->get();

            return response()->json($historiPengiriman, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil histori pengiriman kurir',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getPengiriman()
    {
        try {
            $kurir = Auth::guard('kurir')->user();
            if (!$kurir) {
                return response()->json(['message' => 'Kurir not found'], 404);
            }

            $pengiriman = TransaksiPembelian::where('id_pegawai', $kurir->id_pegawai)
                ->where('pengiriman', '=', 'diantar kurir')
                ->where('status_pengiriman', '=', 'sedang diantar')
                ->get();

            return response()->json($pengiriman, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data pengiriman kurir',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function changeStatusPengiriman(Request $request)
    {
        $transaksi = TransaksiPembelian::with('komisi.barang.detailTransaksiPenitipan.transaksiPenitipan.penitip')
            ->where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
            ->first();

        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $transaksi->update([
            'status_pengiriman' => 'sedang diterima'
        ]);

        // Ambil penitip pertama yang ditemukan
        $penitip = Penitip::join('transaksi_penitipan', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_pembelian.id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->select('penitip.*')
                ->first();

        // Ambil pembeli pertama yang ditemukan
        $pembeli = Pembeli::where('id_pembeli', $transaksi->id_pembeli)->first();

        // Kirim notifikasi penitip
        if ($penitip && $penitip->fcm_token) {
            $notifRequest = new Request([
                'token' => $penitip->fcm_token,
                'title' => 'Transaksi Penjualan Selesai',
                'body' => 'Transaksi Penjualan Selesai dan Barang Telah Diterima oleh Pembeli dengan Baik Oleh ' . $pembeli->nama_pembeli,
            ]);

            (new NotificationController())->sendNotification($notifRequest);
        }

        // Kirim notifikasi pembeli
        if ($pembeli && $pembeli->fcm_token) {
            $notifRequest = new Request([
                'token' => $pembeli->fcm_token,
                'title' => 'Barang Sudah Sampai !!!',
                'body' => 'Transaksi Pembelian Selesai dan Barang Telah Diterima dengan Baik Ileh ' . $pembeli->nama_pembeli,
            ]);

            (new NotificationController())->sendNotification($notifRequest);
        }
    }
}
