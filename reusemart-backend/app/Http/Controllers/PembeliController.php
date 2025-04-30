<?php

namespace App\Http\Controllers;

use App\Models\Pembeli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PembeliController
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'email_organisasi' => 'required|email|unique:organisasi,email_organisasi',
                'password_organisasi' => 'required|min:8',
                'konfirmasi_password_organisasi' => 'required|same:password_organisasi',
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
    public function show(pembeli $pembeli)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, pembeli $pembeli)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(pembeli $pembeli)
    {
        //
    }
}
