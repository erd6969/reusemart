<?php

namespace App\Http\Controllers;

use App\Models\RequestDonasi;
use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\Organisasi;
use App\Models\TransaksiDonasi;
use App\Models\DetailTransaksiPenitipan;


class RequestDonasiController
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
    public function show()
    {
        try {
            return response()->json(RequestDonasi::with('barang', 'organisasi')->paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showWaitingRequest()
    {
        try {
            return response()->json(RequestDonasi::with('barang', 'organisasi')->where('status_request', 'Waiting')->paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showByIdBarang($id)
    {
        try {
            return response()->json(
                RequestDonasi::with(['barang' => function($query) {
                    $query->select('id_barang', 'nama_barang', 'foto_barang');
                }, 'organisasi'
                ])->where('id_barang', $id)->paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function search($search_request_donasi)
    {
        try{
            $request_donasi = RequestDonasi::with(['barang' => function($query) {
                $query->select('id_barang', 'nama_barang', 'foto_barang');
            }, 'organisasi'
            ])->whereHas('organisasi', function($query) use ($search_request_donasi) {
                $query->where('nama_organisasi', 'like', '%' . $search_request_donasi . '%');
            })
            ->paginate(10);

            if ($request_donasi->isEmpty()) {
                return response()->json([
                    'message' => 'Request Donasi not found',
                ], 404);
            }

            return response()->json([
                'message' => 'Request Donasi found',
                'data' => $request_donasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function acceptRequest_donasi(Request $request)
    {
        try {
            dd($request);
            $request->validate([
                'id_request_donasi' => 'required|integer',
                'tanggal_donasi' => 'required|date',
                'nama_penerima' => 'required|string|max:255',
            ]);


            $request_donasi = RequestDonasi::findOrFail($request->id_request_donasi);
            $request_donasi->status_request = "Accepted";
            $request_donasi->save();

            $transaksi_donasi = TransaksiDonasi::create([
                'id_request_donasi' => $request_donasi->id_request_donasi,
                'id_organisasi' => $request_donasi->id_organisasi,
                'tanggal_donasi' => $request->tanggal_donasi,
                'nama_penerima' => $request->nama_penerima,
            ]);

            $detail_transaksi_penitipan = DetailTransaksiPenitipan::findOrFail($request_donasi->id_barang);
            $detail_transaksi_penitipan->status_penitipan = "Didonasikan";
            $detail_transaksi_penitipan->save();

            return response()->json([
                'message' => 'Request Donasi accepted and Transaksi Donasi created',
                'data' => $request_donasi,
                'data_transaksi' => $transaksi_donasi,
                'status_penitipan' => $detail_transaksi_penitipan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function rejectRequest(Request $request)
    {
        try { 
            $request->validate([
                'id_request_donasi' => 'required|integer',
            ]);
            $id_request_donasi = $request->id_request_donasi;
            $request_donasi = RequestDonasi::findOrFail($id_request_donasi);
            $request_donasi->status_request = "Rejected";
            $request_donasi->save();

            return response()->json([
                'message' => 'Request Donasi rejected',
                'data' => $request_donasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(request_donasi $request_donasi)
    {
        //
    }
}
