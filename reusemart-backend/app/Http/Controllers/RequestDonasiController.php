<?php

namespace App\Http\Controllers;

use App\Models\RequestDonasi;
use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\Organisasi;
use App\Models\TransaksiDonasi;
use App\Models\DetailTransaksiPenitipan;
use App\Models\Penitip;
use App\Models\Pembeli;
use App\Models\TransaksiPenitipan;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Log;


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
    public function showAcceptReject()
    {
        try {


            return response()->json(TransaksiDonasi::with('organisasi', 'request_donasi', 'barang')
            ->join('request_donasi', 'transaksi_donasi.id_request_donasi', '=', 'request_donasi.id_request_donasi')
            ->where('status_request', '!=', 'Waiting')
            ->paginate(10), 200);
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
            return response()->json(RequestDonasi::with('organisasi')->where('status_request', 'Waiting')->paginate(10), 200);
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

    public function searchWaiting($search_request_donasi)
    {
        try{
            $request_donasi = RequestDonasi::with('organisasi')
            ->where('status_request', 'Waiting')
            ->whereHas('organisasi', function($query) use ($search_request_donasi) {
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
    
    public function searchDiterimaDitolak($search_request_donasi)
    {
        try{
            $request_donasi = RequestDonasi::with('organisasi')
            ->where('status_request', '!=', 'Waiting')
            ->whereHas('organisasi', function($query) use ($search_request_donasi) {
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
            $request->validate([
                'id_request_donasi' => 'required|integer',
                'id_barang' => 'required|integer',
                'tanggal_donasi' => 'required|date',
                'nama_penerima' => 'required|string|max:255',
            ]);

            $detailPenitipan = DetailTransaksiPenitipan::where('id_barang', $request->id_barang)->pluck('id_transaksi_penitipan')->first();
            $transaksiPenitipan = TransaksiPenitipan::findOrFail($detailPenitipan);
            $penitip = Penitip::findOrFail($transaksiPenitipan->id_penitip);

            if ($penitip->fcm_token) {
                $notifRequest = new Request([
                    'token' => $penitip->fcm_token,
                    'title' => 'Barang Sudah Didonasikan',
                    'body' => 'Barang anda sudah didonasikan ke organisasi, terima kasih telah berpartisipasi dalam program donasi kami.',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }

            $request_donasi = RequestDonasi::findOrFail($request->id_request_donasi);
            $request_donasi->status_request = "Accepted";
            $request_donasi->save();

            $transaksi_donasi = TransaksiDonasi::create([
                'id_request_donasi' => $request_donasi->id_request_donasi,
                'id_barang' => $request->id_barang,
                'id_organisasi' => $request_donasi->id_organisasi,
                'tanggal_donasi' => $request->tanggal_donasi,
                'nama_penerima' => $request->nama_penerima,
            ]);

            $detail_transaksi_penitipan = DetailTransaksiPenitipan::findOrFail($transaksi_donasi->id_barang);
            $detail_transaksi_penitipan->status_penitipan = "Didonasikan";
            $detail_transaksi_penitipan->save();

            $barang = Barang::findOrFail($detail_transaksi_penitipan->id_barang);
            $harga_barang = $barang->harga_barang;

            $transaksi_penitipan = TransaksiPenitipan::findOrFail($detail_transaksi_penitipan->id_transaksi_penitipan);

            $penitip = Penitip::findOrFail($transaksi_penitipan->id_penitip);
            $penitip->poin_loyalitas = $penitip->poin_loyalitas + $harga_barang/10000;
            $penitip->save(); 

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

    public function update(Request $request)
    {
        try{
            $request->validate([
                'id_request_donasi' => 'required|integer',
                'id_transaksi_donasi' => 'integer',
                'status_request' => 'required|string',
                'tanggal_donasi' => 'nullable|date',
                'nama_penerima' => 'nullable|string|max:255',
            ]);

            $reqdon = RequestDonasi::findOrFail($request->id_request_donasi);
            /* Req don berarti status awalnya, request brarti status yang dipilih pas edit
            Reqdon  Request
            accept  accept = update
            accept  reject = delete
            accept  waiting = delete
            reject  waiting = ga ada yg diupdate, cuma status
            reject  reject = ga ada yg diupdate
            */

            
            if($request->status_request == "Accepted" && $reqdon->status_request == "Accepted"){
                $transaksi_donasi = TransaksiDonasi::findOrFail($request->id_transaksi_donasi);
                $detail_transaksi_penitipan = DetailTransaksiPenitipan::findOrFail($transaksi_donasi->id_barang);
                $transaksi_penitipan = TransaksiPenitipan::findOrFail($detail_transaksi_penitipan->id_transaksi_penitipan);
                $penitip = Penitip::findOrFail($transaksi_penitipan->id_penitip);

                if($penitip && $penitip->fcm_token){
                    $notifRequest = new Request([
                        'token' => $penitip->fcm_token,
                        'title' => 'Update REQUEST DONASI',
                        'body' => 'Terdapat Update dari Barang yang ingin anda donasikan ',
                    ]);
                }else{
                    return response()->json([
                        'message' => 'Penitip not found or FCM token not available',
                    ], 404);
                }

                $transaksi_donasi->nama_penerima = $request->nama_penerima;
                $transaksi_donasi->tanggal_donasi = $request->tanggal_donasi;
                $transaksi_donasi->save();

                (new NotificationController())->sendNotification($notifRequest);

                return response()->json([
                    'message' => 'Transaksi Donasi updated from accepted to accepted',
                    'data' => $transaksi_donasi
                ], 200);

            }else if(($request->status_request == "Rejected" || $request->status_request == "Waiting") 
                    && $reqdon->status_request == "Accepted"){
                // Untuk hapus karena kalau reject atau waiting brarti ga ada nama penerima brarti ga ada transaksi donasi
                $transaksi_donasi = TransaksiDonasi::findOrFail($request->id_transaksi_donasi);
                $transaksi_donasi->delete();

                // Untuk ganti status request donasinyo
                $reqdon->status_request = $request->status_request;
                $reqdon->save();

                // Status barang jugo diganti jadi open donasi lagi karna waiting atau rejected
                $detail_transaksi_penitipan = DetailTransaksiPenitipan::findOrFail($transaksi_donasi->id_barang);
                $detail_transaksi_penitipan->status_penitipan = "open donasi";
                $detail_transaksi_penitipan->save();

                return response()->json([
                    'message' => 'Transaksi donasi deleted and Status Request Donasi and Status barang Updated from accepted to rejected or waiting',
                    'data' => $reqdon
                ], 200);

            }else if($reqdon->status_request == "Rejected" && $request->status_request == "Waiting"){
                // Kalau dari rejected ke waiting ga usah ada transaksi donasi
                // Cukup update status request donasi
                $reqdon->status_request = $request->status_request;
                $reqdon->save();
                return response()->json([
                    'message' => 'Request Donasi updated from rejected to waiting',
                    'data' => $reqdon
                ], 200);

            }else if($reqdon->status_request == "Rejected" && $request->status_request == "Rejected"){
                // klau dari rejected ke rejected ga guna, jadi return ae
                return response()->json([
                    'message' => 'Request Donasi already rejected',
                ], 400);
            }
                

            return response()->json([
                'message' => 'Request Donasi updated',
                'data' => $reqdon
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Request Donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
