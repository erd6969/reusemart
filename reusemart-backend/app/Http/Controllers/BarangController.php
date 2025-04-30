<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;
use App\Models\Kategori;
use App\Models\Penitip;
use App\Models\TransaksiPenitipan;
use App\Models\DetailTransaksiPenitipan;

class BarangController
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
    public function showAll()
    {
        try {
            $Barang = Barang::all();
            return response()->json($Barang, 200);
        } catch (Exception $e) {
            return $e;
            // return response()->json(['message' => 'Data Barang tidak ditemukan.'], 404);
        }
    }

    public function showByCategory($namacategory)
    {
        try {
            $category = Kategori::where('nama_kategori', $namacategory)->firstOrFail();
            if (!$category) {
                return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
            }
            
            // dd($category->id_kategori);
            $id_kategori = $category->id_kategori;
            $Barang = Barang::where('id_kategori', $id_kategori)->get();
            if ($Barang->isEmpty()) {
                return response()->json(['message' => 'Data Barang dengan tidak ditemukan.'], 404);
            }
            return response()->json($Barang, 200);
            
        } catch (Exception $e) {
            dd($e);
            return response()->json(['message' => 'Data Barangasdasd tidak ditemukan.'], 404);
        }
    }

    public function showDetailBarang($id_barang) // ini untuk detail barang page, jadi ada data penitip juga
    {
        try {
            // dd($id_barang);
            $Barang = Barang::where('id_barang', $id_barang)->firstOrFail();
            if (!$Barang) {
                return response()->json(['message' => 'Data Barang tidak ditemukan.'], 404);
            }

            $detailpenitipan = DetailTransaksiPenitipan::where('id_barang', $Barang->id_barang)->first();
            if (!$detailpenitipan) {
                return response()->json(['message' => 'Data Detail Transaksi Penitipan tidak ditemukan'], 404);
            }

            $transaksi_penitipan = TransaksiPenitipan::where('id_transaksi_penitipan', $detailpenitipan->id_transaksi_penitipan)->first();
            // dd($Barang);
            $penitip = Penitip::where('id_penitip', $transaksi_penitipan->id_penitip)->first();
            if (!$penitip) {
                return response()->json(['message' => 'Data Penitip tidak ditemukan'], 404);
            }

            $detailBarangPage = [
                'barang' => $Barang,
                'penitip' => $penitip,
            ];

            return response()->json($detailBarangPage, 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'ERRROR'], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, barang $barang)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(barang $barang)
    {
        //
    }

    public function search($search_barang){
        try {
            

            $barang = Barang::where(function($query) use ($search_barang) {
                                $query->where('nama_barang', 'LIKE', '%' . $search_barang . '%');
                            })
                            ->get();
    
            if (!$barang) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }
    
            return response()->json($barang, 200);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
