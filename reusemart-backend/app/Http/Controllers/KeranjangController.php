<?php

namespace App\Http\Controllers;

use App\Models\Keranjang;
use Illuminate\Http\Request;
use App\Models\Barang;
use Illuminate\Support\Facades\Auth;

class KeranjangController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store($id_barang)
    {
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $barang = Barang::find($id_barang);
            if (!$barang) {
                return response()->json([
                    'message' => 'Barang tidak ditemukan',
                ], 404);
            }

            // Check if the item is already in the cart
            $existingKeranjang = Keranjang::where('id_pembeli', $user->id_pembeli)
                ->where('id_barang', $id_barang)
                ->first();
            if ($existingKeranjang) {
                return response()->json([
                    'message' => 'Barang sudah ada di keranjang',
                ], 400);
            }

            $keranjang = Keranjang::create([
                'id_pembeli' => $user->id_pembeli,
                'id_barang' => $id_barang,
                'total_biaya_keranjang' => $barang->harga_barang,
            ]);

            return response()->json([
                'message' => 'Barang berhasil ditambahkan ke keranjang',
                'data' => $keranjang,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan barang ke keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $items = Keranjang::where('keranjang.id_pembeli', $user->id_pembeli)
                ->join('barang', 'keranjang.id_barang', '=', 'barang.id_barang')
                ->join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                ->join('penitip', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->select(
                    'keranjang.*',
                    'barang.*',
                    'penitip.id_penitip',
                    'penitip.foto_penitip',
                    'penitip.nama_penitip'
                )
                ->get();

            // Kelompokkan berdasarkan penitip
            $grouped = $items->groupBy('id_penitip')->map(function ($group) {
                return [
                    'id_penitip' => $group[0]->id_penitip,
                    'nama_penitip' => $group[0]->nama_penitip,
                    'foto_penitip' => $group[0]->foto_penitip,
                    'barang' => $group->map(function ($item) {
                        return [
                            'id_keranjang' => $item->id_keranjang,
                            'id_barang' => $item->id_barang,
                            'nama_barang' => $item->nama_barang,
                            'harga_barang' => $item->harga_barang,
                            'foto_barang' => $item->foto_barang,
                            'jumlah' => $item->jumlah ?? 1,
                        ];
                    })->values()
                ];
            })->values();

            return response()->json([
                'message' => 'Berhasil mendapatkan data keranjang',
                'data' => $grouped,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mendapatkan data keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, keranjang $keranjang)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_k)
    {
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $keranjang = Keranjang::find($id_k);
            if (!$keranjang) {
                return response()->json([
                    'message' => 'Keranjang tidak ditemukan',
                ], 404);
            }

            if ($keranjang->id_pembeli !== $user->id_pembeli) {
                return response()->json([
                    'message' => 'Unauthorized action',
                ], 403);
            }

            $keranjang->delete();

            return response()->json([
                'message' => 'Barang berhasil dihapus dari keranjang',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus barang dari keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkCart()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }
    
            // Ambil semua item di keranjang yang barangnya tidak tersedia
            $invalidItems = Keranjang::where('id_pembeli', $user->id_pembeli)
                ->join('barang', 'keranjang.id_barang', '=', 'barang.id_barang')
                ->join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->where('detail_transaksi_penitipan.status_penitipan', '!=', 'ready jual')
                ->select('keranjang.id_keranjang')
                ->get();
    
            if ($invalidItems->count() > 0) {
                // Hapus item tidak valid dari keranjang
                Keranjang::whereIn('id_keranjang', $invalidItems->pluck('id_keranjang'))->delete();
    
                return response()->json([
                    'status' => 'success',
                    'message' => 'Beberapa produk telah terjual dan telah dihapus dari keranjang.',
                    'deleted_count' => $invalidItems->count()
                ], 200);
            }
    
            return response()->json([
                'status' => 'success',
                'message' => 'Keranjang aman, semua produk tersedia',
            ], 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memeriksa keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function countCart()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $count = Keranjang::where('id_pembeli', $user->id_pembeli)->count();

            return response()->json([
                'status' => 'success',
                'message' => 'Jumlah barang di keranjang',
                'count' => $count,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghitung keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteAll()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            Keranjang::where('id_pembeli', $user->id_pembeli)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Semua barang di keranjang telah dihapus',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus semua barang dari keranjang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
}
