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
        $detailTransaksiPenitipan = DetailTransaksiPenitipan::with(['barang'])->where('id_transaksi_penitipan', $id)->paginate(10);
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
