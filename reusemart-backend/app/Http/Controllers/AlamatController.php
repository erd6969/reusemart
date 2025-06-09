<?php

namespace App\Http\Controllers;

use App\Models\Alamat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

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
            ]);

            // Check if the user already has an address marked as utama
            $existingUtama = Alamat::where('id_pembeli', $user->id_pembeli)
                ->where('alamat_utama', 1)
                ->first();
            if ($existingUtama) {
                // If the user already has an address marked as utama, set it to 0
                $alamat_utama = 0;
            }else{
                // If the user does not have an address marked as utama, set the new address to 1
                $alamat_utama = 1;
            }
            // Create a new address

            $alamat = Alamat::create([
                'id_pembeli' => $user->id_pembeli,
                'nama_alamat' => $request->nama_alamat,
                'alamat' => $request->alamat,
                'keterangan' => $request->keterangan,
                'kecamatan' => $request->kecamatan,
                'kabupaten' => $request->kabupaten,
                'kelurahan' => $request->kelurahan,
                'kode_pos' => $request->kode_pos,
                'alamat_utama' => $alamat_utama,
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
        try {
            \Log::info("Fetching address for user", ['user' => Auth::user()]);
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
        } catch (\Exception $e) {
            \Log::error("Failed to retrieve address", ['error' => $e->getMessage()]);
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
                    'message' => 'User Tidak Terautentikasi atau Token Tidak Valid',
                ], 401);
            }

            $alamat = Alamat::find($id_alamat);
            if (!$alamat) {
                return response()->json([
                    'message' => 'Alamat tidak ditemukan',
                ], 404);
            }

            if ($alamat->id_pembeli !== $user->id_pembeli) {
                return response()->json([
                    'message' => 'Anda tidak berwenang untuk menghapus alamat ini.',
                ], 403);
            }

            if ($alamat->alamat_utama == 1) {
                return response()->json([
                    'message' => 'Tidak dapat menghapus alamat utama.',
                ], 403);
            }

            $alamat->delete();

            return response()->json([
                'message' => 'Alamat berhasil dihapus',
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

     public function search($search_alamat){
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::where('id_pembeli', $user->id_pembeli)
                            ->where(function($query) use ($search_alamat) {
                                $query->where('nama_alamat', 'LIKE', '%' . $search_alamat . '%')
                                        ->orWhere('alamat', 'LIKE', '%' . $search_alamat . '%')
                                        ->orWhere('kecamatan', 'LIKE', '%' . $search_alamat . '%')
                                        ->orWhere('kabupaten', 'LIKE', '%' . $search_alamat . '%')
                                        ->orWhere('kelurahan', 'LIKE', '%' . $search_alamat . '%')
                                        ->orWhere('kode_pos', 'LIKE', '%' . $search_alamat . '%');

                            })
                            ->get();
    
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
    

    public function updateAlamatUtama(Request $request, $id_alamat)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat_utama_before = Alamat::where('id_pembeli', $user->id_pembeli)->where('alamat_utama', 1)->first();
            $alamat_utama_before->update(['alamat_utama' => 0]);

            $alamat = Alamat::find($id_alamat);
            if (!$alamat) {
                return response()->json([
                    'message' => 'Address not found',
                ], 404);
            }

            $alamat->update(['alamat_utama' => 1]);
            return response()->json($alamat, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAlamatUtama()
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::where('id_pembeli', $user->id_pembeli)->where('alamat_utama', 1)->first();
            if (!$alamat) {
                return response()->json([
                    'message' => 'No main address found for this user',
                ], 404);
            }

            return response()->json($alamat, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve main address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAlamatById($id_alamat)
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'message' => 'User not authenticated or invalid token',
                ], 401);
            }

            $alamat = Alamat::where('id_pembeli', $user->id_pembeli)->where('id_alamat', $id_alamat)->first();
            if (!$alamat) {
                return response()->json([
                    'message' => 'No address found for this user',
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

    public function GetKabupaten(){
        try{
            
            $response = Http::get('https://agusfebrianto.github.io/api-wilayah-indonesia/api/regencies/34.json');
            if ($response->failed()) {
                return response()->json([
                    'message' => 'Failed to retrieve address data',
                    'error' => $response->body(),
                ], 500);
            }

            return response()->json($response->json(), 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function GetKecamatan($id_kabupaten){
        try{
            $response = Http::get('https://agusfebrianto.github.io/api-wilayah-indonesia/api/districts/' . $id_kabupaten . '.json');
            if ($response->failed()) {
                return response()->json([
                    'message' => 'Failed to retrieve address data',
                    'error' => $response->body(),
                ], 500);
            }
            return response()->json($response->json(), 200);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function GetKelurahan($id_kecamatan){
        try{
            $response = Http::get('https://agusfebrianto.github.io/api-wilayah-indonesia/api/villages/' . $id_kecamatan . '.json');
            if ($response->failed()) {
                return response()->json([
                    'message' => 'Failed to retrieve address data',
                    'error' => $response->body(),
                ], 500);
            }
            return response()->json($response->json(), 200);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
