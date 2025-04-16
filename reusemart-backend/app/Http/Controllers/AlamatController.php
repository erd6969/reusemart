<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlamatController
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
            $user = Auth::user();

            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $request->validate([
                'nama_alamat' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'keterangan' => 'required|string|max:255',
                'kecamatan' => 'required|string|max:255',
                'kabupaten' => 'required|string|max:255',
                'kelurahan' => 'required|string|max:255',
                'kode_pos' => 'required|integer',
                'alamat_utama' => 'boolean',
            ]);

            $alamat = Alamat::create([
                'id_pembeli' => $user->id_pembeli,
                'nama_alamat' => $request->nama_alamat,
                'alamat' => $request->alamat,
                'keterangan' => $request->keterangan,
                'kecamatan' => $request->kecamatan,
                'kabupaten' => $request->kabupaten,
                'kelurahan' => $request->kelurahan,
                'kode_pos' => $request->kode_pos,
                'alamat_utama' => $request->alamat_utama,
            ]);

            return response()->json($alamat, 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show()
    {
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::where('id_pembeli', $user->id_pembeli)->get();
            if ($alamat->isEmpty()) {
                return response()->json([
                    'message' => 'No addresses found for this user',
                ], 404);
            }

            return response()->json($alamat, 200);

        }catch(\Exception $e){
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id_alamat)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::find($id_alamat);
            if (!$alamat) {
                return response()->json([
                    'message' => 'Address not found',
                ], 404);
            }

            if ($alamat->id_pembeli !== $user->id_pembeli) {
                return response()->json([
                    'message' => 'You are not authorized to update this address.',
                ], 403);
            }            

            $request->validate([
                'nama_alamat' => 'required|string|max:255',
                'alamat' => 'required|string|max:255',
                'keterangan' => 'required|string|max:255',
                'kecamatan' => 'required|string|max:255',
                'kabupaten' => 'required|string|max:255',
                'kelurahan' => 'required|string|max:255',
                'kode_pos' => 'required|integer',
                'alamat_utama' => 'boolean',
            ]);

            $alamat->update([
                'nama_alamat' => $request->nama_alamat,
                'alamat' => $request->alamat,
                'keterangan' => $request->keterangan,
                'kecamatan' => $request->kecamatan,
                'kabupaten' => $request->kabupaten,
                'kelurahan' => $request->kelurahan,
                'kode_pos' => $request->kode_pos,
                'alamat_utama' => $request->alamat_utama,
            ]);
            
            return response()->json($alamat, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id_alamat)
    {
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::find($id_alamat);
            if (!$alamat) {
                return response()->json([
                    'message' => 'Address not found',
                ], 404);
            }

            if ($alamat->id_pembeli !== $user->id_pembeli) {
                return response()->json([
                    'message' => 'You are not authorized to delete this address.',
                ], 403);
            } 

            $alamat->delete();

            return response()->json([
                'message' => 'Address deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */

    public function search($id_alamat){
        try{
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::where('id_alamat', $id_alamat)->where('id_pembeli', $user->id_pembeli)->first();
            if (!$alamat) {
                return response()->json([
                    'message' => 'Address not found',
                ], 404);
            }

            return response()->json($alamat, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
