<?php

namespace App\Http\Controllers;

use App\Models\DetailTransaksiPenitipan;
use Illuminate\Http\Request;

class DetailTransaksiPenitipanController
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

    public function show($id)
    {
        $detailTransaksiPenitipan = DetailTransaksiPenitipan::with(['barang', 
        'barang.pegawai' => function($query) {
            $query->select('id_pegawai', 'nama_pegawai');
        },

        'barang.hunter' => function($query) {
            $query->select('id_hunter', 'nama_hunter');
        },

        'barang.kategori' => function($query) {
            $query->select('id_kategori', 'nama_kategori');
        },

        ])->where('id_transaksi_penitipan', $id)->get();


        if($detailTransaksiPenitipan->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => 'Data not found',
                'data' => null,
            ], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => $detailTransaksiPenitipan,
        ]);
    }

    public function deleteWithBarang($id)
    {
        $detailTransaksiPenitipan = DetailTransaksiPenitipan::with('barang')->where('id_detail_transaksi_penitipan', $id)->first();

        if (!$detailTransaksiPenitipan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Detail Transaksi Penitipan not found',
            ], 404);
        }

        $detailTransaksiPenitipan->barang()->delete();
        $detailTransaksiPenitipan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Detail Transaksi Penitipan and associated Barang deleted successfully',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DetailTransaksiPenitipan $detailTransaksiPenitipan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DetailTransaksiPenitipan $detailTransaksiPenitipan)
    {
        //
    }
}
