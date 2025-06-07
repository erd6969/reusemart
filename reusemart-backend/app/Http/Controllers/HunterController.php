<?php

namespace App\Http\Controllers;

use App\Models\Hunter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HunterController
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(hunter $hunter)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, hunter $hunter)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(hunter $hunter)
    {
        //
    }

    public function searchHunter($search_hunter)
    {
        try {
            if (empty($search_hunter)) {
                return response()->json([
                    'message' => 'Search query is empty.',
                ], 400); // Return a bad request if search query is empty
            }

            $hunter = Hunter::where('nama_hunter', 'like', '%' . $search_hunter . '%')
                ->select('hunter.*')
                ->get();

            if ($hunter->isEmpty()) {
                return response()->json([
                    'message' => 'Hunter tidak ditemukan.',
                ], 404);
            }

            return response()->json($hunter, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mencari hunter',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword($id)
    {
        try {
            $hunter = Hunter::where('id_hunter', $id)->first();
            if (!$hunter) {
                return response()->json([
                    'message' => 'Hunter tidak ditemukan',
                ], 404);
            }

            $newPassword = $hunter->tanggal_lahir_hunter;
            Log::info('New Password: ' . $newPassword); // Log the new password for debugging
            $hunter->password_hunter = Hash::make($newPassword);
            $hunter->save();

            return response()->json([
                'message' => 'Password berhasil direset',
                'new_password' => $newPassword,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mereset password',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showProfile()
    {
        try {
            $hunter = auth('hunter')->user();
            return response()->json($hunter, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'hunter not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function historyHunter()
    {
        try {
            $hunter = auth('hunter')->user();

            $history = DB::table('detail_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->join('hunter', 'barang.id_hunter', '=', 'hunter.id_hunter')
                ->join('komisi', 'barang.id_barang', '=', 'komisi.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('hunter.id_hunter', $hunter->id_hunter)
                ->where('detail_transaksi_penitipan.status_penitipan', 'terjual')
                ->select(
                    'komisi.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'transaksi_pembelian.total_pembayaran',
                    'barang.id_barang',
                    'barang.nama_barang',
                    'barang.harga_barang',
                    'barang.foto_barang',
                    'barang.foto_barang2',
                    'hunter.nama_hunter'
                )
                ->paginate(10);

            return response()->json($history, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'hunter not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
