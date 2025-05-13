<?php

namespace App\Http\Controllers;

use App\Models\Diskusi;
use Illuminate\Http\Request;
use App\Models\Barang;
use App\Models\Pembeli;
use App\Models\Pegawai;
use Illuminate\Support\Facades\Auth;


class DiskusiController
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
        try {
            $request->validate([
                'diskusi' => 'required|string|max:255',
                'id_barang' => 'required|exists:barang,id_barang',
            ]);

            // Cek apakah user adalah pembeli
            if (Auth::guard('pembeli')->check()) {
                $user = Auth::guard('pembeli')->user();

                $diskusi = Diskusi::create([
                    'id_barang' => $request->id_barang,
                    'id_pembeli' => $user->id_pembeli,
                    'id_pegawai' => null,
                    'diskusi' => $request->diskusi,
                    'waktu_diskusi' => now(),
                ]);

            // Cek apakah user adalah pegawai
            } elseif (Auth::guard('pegawai')->check()) {
                $user = Auth::guard('pegawai')->user();

                $diskusi = Diskusi::create([
                    'id_barang' => $request->id_barang,
                    'id_pembeli' => null,
                    'id_pegawai' => $user->id_pegawai,
                    'diskusi' => $request->diskusi,
                    'waktu_diskusi' => now(),
                ]);
            } else {
                return response()->json([
                    'message' => 'User not authenticated',
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Diskusi berhasil ditambahkan.',
                'data' => $diskusi,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($id_barang)
    {
        try {
            $diskusiData = Diskusi::with(['barang', 'pembeli', 'pegawai'])
                ->where('id_barang', $id_barang)
                ->orderBy('waktu_diskusi', 'desc')
                ->get();

            if (!$diskusiData) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Diskusi tidak ditemukan.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $diskusiData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, diskusi $diskusi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(diskusi $diskusi)
    {
        //
    }

    public function showDiskusiByDate(){
        $diskusi = Diskusi::with(['barang', 'pembeli', 'pegawai'])
            ->whereNotNull('id_pembeli')
            ->orderBy('waktu_diskusi', 'asc')
            ->get();
    
        return response()->json([
            'status' => 'success',
            'data' => $diskusi,
        ], 200);
    } 
}
