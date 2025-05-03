<?php

namespace App\Http\Controllers;

use App\Models\Penitip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class PenitipController
{

    public function register(Request $request)
    {
        try {
            $request->validate([
                'email_penitip' => 'required|email|unique:penitip,email_penitip',
                'password_penitip' => 'required|min:8',
                'nama_penitip' => 'required|string|max:255',
                'nomor_telepon_penitip' => 'required|string|max:15',
                'tanggal_lahir' => 'required|date',
                'NIK' => 'required|string|max:16|unique:penitip,NIK',
                'foto_ktp' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'foto_penitip' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);


            $foto_penitip_path = 'blank-profile-picture.jpg';
            $fotoKTPPath = $request->file('foto_ktp')->store('ktp', 'public');

            $penitip = penitip::create([
                'email_penitip' => $request->email_penitip,
                'password_penitip' => Hash::make($request->password_penitip),
                'nama_penitip' => $request->nama_penitip,
                'nomor_telepon_penitip' => $request->nomor_telepon_penitip,
                'tanggal_lahir' => $request->tanggal_lahir,
                'NIK' => $request->NIK,
                'foto_ktp' => $fotoKTPPath,
                'saldo' => 0,
                'poin_loyalitas' => 0,
                'badge' => 0,
                'komisi_penitip' => 0,
                'rerata_rating' => 0,
                'foto_penitip' => $foto_penitip_path,
            ]);

            return response()->json([
                'message' => 'Registration successful',
                'penitip' => $penitip,
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

    public function logout(Request $request)
    {
        if (Auth::check()) {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'message' => 'Logout successful',
            ]);
        }

        return response()->json([
            'message' => 'No user is logged in',
        ], 401);
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

    public function search(Request $search_)
    {
        try{
            $penitip = Penitip::where('nama_penitip', 'like', '%' . $search_ . '%')->get();
            if ($penitip->isEmpty()) {
                return response()->json([
                    'message' => 'Penitip not found',
                ], 404);
            }
            return response()->json([
                'message' => 'Penitip found',
                'data' => $penitip
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(penitip $penitip)
    {
        try {
            return response()->json(Penitip::paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, penitip $penitip)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(penitip $penitip)
    {
        
    }

    public function showProfile()
    {
        try {
            $penitip = auth('penitip')->user();
            return response()->json($penitip, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showSoldProducts()
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
            ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
            ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
            ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
            ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
            ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
            ->where('detail_transaksi_penitipan.status_penitipan', 'terjual')
            ->select(
                'barang.*',
                'transaksi_pembelian.tanggal_pembelian'
            )
            ->get();

            return response()->json([
                'message' => 'Success',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    
}
