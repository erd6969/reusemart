<?php

namespace App\Http\Controllers;

use App\Models\TransaksiPenitipan;
use Illuminate\Http\Request;
use App\Models\DetailTransaksiPenitipan;
use App\Models\Barang;
use App\Models\Penitip;
use Illuminate\Support\Facades\Log;

class TransaksiPenitipanController
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
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'email_penitip' => 'required|email',
            'tanggal_penitipan' => 'required|date',
        ]);

        $penitip = Penitip::where('email_penitip', $validatedData['email_penitip'])->first();
        if (!$penitip) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penitip not found',
            ], 404);
        }
        $validatedData['id_penitip'] = $penitip->id_penitip;
        unset($validatedData['email_penitip']);
        $transaksiPenitipan = TransaksiPenitipan::create($validatedData);

        return response()->json([
            'status' => 'success',
            'data' => $transaksiPenitipan,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $TransaksiPenitipan = TransaksiPenitipan::with(['penitip:id_penitip,nama_penitip,email_penitip'])
        ->orderBy('id_transaksi_penitipan', 'desc')
        ->paginate(10);
        // $TransaksiPenitipan = TransaksiPenitipan::with(['penitip', 'detailTransaksiPenitipan.barang'])->get();
        return response()->json(
            $TransaksiPenitipan
        );
    }

    public function showById($id)
    {
        $TransaksiPenitipan = TransaksiPenitipan::with(['penitip:id_penitip,nama_penitip,email_penitip'])
        ->where('id_transaksi_penitipan', $id)
        ->first();
        // $TransaksiPenitipan = TransaksiPenitipan::with(['penitip', 'detailTransaksiPenitipan.barang'])->get();
        return response()->json(
            $TransaksiPenitipan
        );
    }

    public function search($search_data)
    {
        $TransaksiPenitipan = TransaksiPenitipan::with(['penitip'])
            ->whereHas('penitip', function ($query) use ($search_data) {
                $query->where('email_penitip', 'like', '%' . $search_data . '%')
                    ->orWhere('nama_penitip', 'like', '%' . $search_data . '%');
            })
            ->get();

        if ($TransaksiPenitipan->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data not found',
            ], 404);
        }

        return response()->json($TransaksiPenitipan, 200);
    }

    public function update($id)
    {
        $validatedData = request()->validate([
            'tanggal_penitipan' => 'required|date',
        ]);

        $transaksiPenitipan = TransaksiPenitipan::where('id_transaksi_penitipan', $id)->first();
        if (!$transaksiPenitipan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penitip not found',
            ], 404);
        }

        $transaksiPenitipan->update($validatedData);
        return response()->json([
            'status' => 'success',
            'data' => $transaksiPenitipan,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransaksiPenitipan $TransaksiPenitipan)
    {
        //
    }
}
