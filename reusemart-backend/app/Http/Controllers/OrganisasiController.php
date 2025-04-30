<?php

namespace App\Http\Controllers;

use App\Models\Organisasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OrganisasiController
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'email_organisasi' => 'required|email|unique:organisasi,email_organisasi',
                'password_organisasi' => 'required|min:8|same:konfirmasi_password_organisasi',
                'konfirmasi_password_organisasi' => 'required',
                'nama_organisasi' => 'required|string|max:255',
                'nomor_telepon_organisasi' => 'required|string|max:15',
                'alamat_organisasi' => 'required|string|max:255',
                'foto_organisasi' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);
    
            $foto_organisasi_path = 'blank-profile-picture.jpg';
    
            $organisasi = Organisasi::create([
                'email_organisasi' => $request->email_organisasi,
                'password_organisasi' => Hash::make($request->password_organisasi),
                'nama_organisasi' => $request->nama_organisasi,
                'nomor_telepon_organisasi' => $request->nomor_telepon_organisasi,
                'alamat_organisasi' => $request->alamat_organisasi,
                'foto_organisasi' => $foto_organisasi_path,
            ]);
    
            return response()->json([
                'message' => 'Registration successful',
                'organisasi' => $organisasi,
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

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
            $organisasi = Organisasi::all(); // Ambil semua organisasi
            return response()->json([
                'message' => 'Organisasi found',
                'data' => $organisasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, organisasi $organisasi)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(organisasi $organisasi)
    {
        //
    }

    public function search($search_)
    {
        try{
            $organisasi = Organisasi::where('nama_organisasi', 'like', '%' . $search_ . '%')->get();
            if ($organisasi->isEmpty()) {
                return response()->json([
                    'message' => 'Organisasi not found',
                ], 404);
            }
            return response()->json([
                'message' => 'Organisasi found',
                'data' => $organisasi
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Organisasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
