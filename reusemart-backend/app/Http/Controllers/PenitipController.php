<?php

namespace App\Http\Controllers;

use App\Models\Penitip;
use App\Models\Barang;
use App\Models\DetailTransaksiPenitipan;
use App\Models\TransaksiPenitipan;
use App\Models\Komisi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Laravel\Pail\ValueObjects\Origin\Console;

class PenitipController
{

    public function register(Request $request)
    {
        try {
            // dd($request);
            $request->validate([
                'email_penitip' => 'required|email|unique:penitip,email_penitip',
                'password_penitip' => 'required|min:8',
                'nama_penitip' => 'required|string|max:255',
                'nomor_telepon_penitip' => 'required|string|max:15',
                'tanggal_lahir' => 'required|date',
                'NIK' => 'required|string|max:16|unique:penitip,NIK',
                'foto_ktp' => 'required|image|mimes:jpeg,png,jpg,gif',
                'foto_penitip' => 'nullable|image|mimes:jpeg,png,jpg,gif'
            ]);

            $foto_penitip_path = $request->file('foto_penitip')->store('penitip', 'public');
            $fotoKTPPath = $request->file('foto_ktp')->store('ktp', 'public');
            Log::info($request);
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
                'message' => $e->getMessage(),
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

    public function search($search_)
    {
        try {
            $penitip = Penitip::where('nama_penitip', 'LIKE', '%' . $search_ . '%')->get();
    
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
                'message' => 'Error occurred',
                'error' => $e->getMessage(),
            ], 500);
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
    public function update(Request $request, $id_penitip)
{
    try {
        $penitip = Penitip::find($id_penitip);
        if (!$penitip) {
            return response()->json(['message' => 'Penitip not found'], 404);
        }

        // Validasi data
        $validatedData = $request->validate([
            'email_penitip' => 'required|email|unique:penitip,email_penitip,' . $id_penitip . ',id_penitip',
            'nama_penitip' => 'required|string|max:255',
            'password_penitip' => 'nullable|string|min:8',
            'nomor_telepon_penitip' => 'required|string|max:15',
            'foto_penitip' => 'nullable|image|mimes:jpeg,png,jpg,gif'
        ]);

        $updateData = [
            'email_penitip' => $validatedData['email_penitip'],
            'nama_penitip' => $validatedData['nama_penitip'],
            'nomor_telepon_penitip' => $validatedData['nomor_telepon_penitip'],
        ];

        // Jika password ada, update password
        if (!empty($validatedData['password_penitip'])) {
            $updateData['password_penitip'] = Hash::make($validatedData['password_penitip']);
        }

        // Cek jika ada foto yang di-upload
        if ($request->hasFile('foto_penitip')) {
            $image = $request->file('foto_penitip');
            $uploadFolder = 'penitip'; // Folder tempat foto disimpan

            // Menghapus foto lama jika ada
            if ($penitip->foto_penitip && Storage::disk('public')->exists($uploadFolder . '/' . $penitip->foto_penitip)) {
                Storage::disk('public')->delete($uploadFolder . '/' . $penitip->foto_penitip);
            }

            // Simpan foto baru
            $foto_penitip_path = $image->store($uploadFolder, 'public');
            $uploadedImageResponse = basename($foto_penitip_path);

            // Update data foto penitip
            $updateData['foto_penitip'] = $uploadedImageResponse;
        }

        // Update data penitip
        $penitip->update($updateData);

        return response()->json([
            'message' => 'Penitip updated successfully',
            'data' => $penitip
        ]);

    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validasi gagal',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to update penitip',
            'error' => $e->getMessage(),
        ], 500);
    }
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

    public function showDonatedProducts(){
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
            ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
            ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
            ->join('request_donasi', 'request_donasi.id_barang', '=', 'barang.id_barang')
            ->join('transaksi_donasi', 'transaksi_donasi.id_request_donasi', '=', 'request_donasi.id_request_donasi')
            ->join('organisasi', 'transaksi_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
            ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
            ->whereIn('detail_transaksi_penitipan.status_penitipan', ['sudah didonasikan'])
            ->select(
                'barang.*',
                'transaksi_donasi.tanggal_donasi',
                'transaksi_donasi.nama_penerima',
                'organisasi.nama_organisasi'
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

    public function showDetailPendapatan($id_barang)
    {
        try {
            $pendapatan = Komisi::where('id_barang', $id_barang)->first();
            if (!$pendapatan) {
                return response()->json([
                    'message' => 'Pendapatan not found',
                ], 404);
            }
            Log::info($pendapatan);
            Log::info("ID Barang: " . $id_barang);

            return response()->json([
                'message' => 'Success',
                'data' => $pendapatan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Komisi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

}
