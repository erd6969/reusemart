<?php

namespace App\Http\Controllers;

use App\Models\TransaksiMerchandise;
use App\Models\Merchandise;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TransaksiMerchandiseController
{

    public function createTransaksiMerchandise($id_merchandise)
    {
        try {
            $today = Carbon::now();
            $pembeli = auth()->user();

            $merchandiseTransaksi = TransaksiMerchandise::create([
                'id_merchandise' => $id_merchandise,
                'id_pembeli' => $pembeli->id_pembeli,
                'status_claim' => 0,
                'jumlah_claim' => 1,
            ]);

            $merchandise = Merchandise::find($id_merchandise);
            if ($merchandise && $merchandise->jumlah_merchandise > 0) {
                if ($pembeli->poin_loyalitas < $merchandise->poin_tukar) {
                    return response()->json([
                        'message' => 'Poin loyalitas tidak mencukupi untuk menukar merchandise ini',
                    ], 400);
                } else {
                    $pembeli->poin_loyalitas -= $merchandise->poin_tukar;
                    $pembeli->save();
                    $merchandise->jumlah_merchandise = $merchandise->jumlah_merchandise - 1;
                    $merchandise->save();
                }
            } else {
                return response()->json([
                    'message' => 'Stok merchandise habis',
                ], 400);
            }

            return response()->json($merchandiseTransaksi, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses transaksi merchandise',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function showAll()
    {
        $transaksi_merchandise = TransaksiMerchandise::with([
            'pembeli' => function ($query) {
                $query->select('id_pembeli', 'nama_pembeli');
            },

            'merchandise' => function ($query) {
                $query->select('id_merchandise', 'nama_merchandise', 'jumlah_merchandise');
            }
        ])->orderByRaw('ISNULL(tanggal_claim) DESC, tanggal_claim DESC')->paginate(10);

        if ($transaksi_merchandise->isEmpty()) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
        return response()->json(
            $transaksi_merchandise
            ,
            200
        );
    }

    public function setTransaksiMerchandise(Request $request)
    {
        $request->validate([
            'id_transaksi_merchandise' => 'required|integer',
            'tanggal_claim' => 'date|nullable',
            'status_claim' => 'integer'
        ]);

        $transaksi_merchandise = TransaksiMerchandise::where('id_transaksi_merchandise', $request->id_transaksi_merchandise)->first();

        if (!$transaksi_merchandise) {
            return response()->json([
                'message' => 'Transaksi merchandise tidak ditemukan'
            ], 404);
        }

        $transaksi_merchandise->tanggal_claim = $request->tanggal_claim;
        $transaksi_merchandise->status_claim = $request->status_claim;
        $transaksi_merchandise->save();

        return response()->json([
            'message' => 'Tanggal Claim dan Status Claim berhasil diset',
            'data' => $transaksi_merchandise
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(transaksi_merchandise $transaksi_merchandise)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, transaksi_merchandise $transaksi_merchandise)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(transaksi_merchandise $transaksi_merchandise)
    {
        //
    }
}
