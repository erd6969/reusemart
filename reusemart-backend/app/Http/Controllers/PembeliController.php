<?php

namespace App\Http\Controllers;

use App\Models\Pembeli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class PembeliController
{
    public function register(Request $request)
    {
        try {
            $request->validate([
                'email_pembeli' => 'required|email|unique:pembeli,email_pembeli|unique:penitip,email_penitip|unique:pegawai,email_pegawai|unique:organisasi,email_organisasi',
                 'password_pembeli' => 'required|min:8',
                 'konfirmasi_password_pembeli' => 'required|same:password_pembeli',
                 'nama_pembeli' => 'required|string|max:255',
                 'nomor_telepon_pembeli' => 'required|string|max:15',
                 'tanggal_lahir_pembeli' => 'required|date',
                 'foto_pembeli' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);
            




            $foto_pembeli_path = 'blank-profile-picture.jpg';
     
             $pembeli = Pembeli::create([
                 'email_pembeli' => $request->email_pembeli,
                 'password_pembeli' => Hash::make($request->password_pembeli),
                 'nama_pembeli' => $request->nama_pembeli,
                 'nomor_telepon_pembeli' => $request->nomor_telepon_pembeli,
                 'tanggal_lahir_pembeli' => $request->tanggal_lahir_pembeli,
                 'poin_loyalitas' => 0,
                 'foto_pembeli' => $foto_pembeli_path,
            ]);

            return response()->json([
                'message' => 'Registration successful',
                'pembeli' => $pembeli,
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
        $userProf = Auth()->user();
        return response()->json(
            $userProf
        , 200);
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

    public function showHistoryPurchase(){
        try {
            $pembeli = auth('pembeli')->user();

            $products = DB::table('transaksi_pembelian')
            ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
            ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
            ->where('transaksi_pembelian.id_pembeli', $pembeli->id_pembeli)
            ->where('transaksi_pembelian.status_pembayaran', '1')
            ->select(
                'barang.*',
                'transaksi_pembelian.tanggal_pembelian',
                'transaksi_pembelian.status_pengiriman',
            )
            ->get();

            return response()->json([
                'message' => 'Success',
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Pembeli not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

}
