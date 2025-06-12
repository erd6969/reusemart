<?php

namespace App\Http\Controllers;

use App\Models\Pembeli;
use App\Models\TransaksiPembelian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

            $foto_pembeli_path = 'blank-pembeli-profile-picture.png';

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

    public function show()
    {
        $userProf = Auth()->user();
        return response()->json(
            $userProf
            ,
            200
        );
    }

    public function showHistoryPurchase()
    {
        try {
            $pembeli = auth('pembeli')->user();

            $products = DB::table('transaksi_pembelian')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('transaksi_pembelian.id_pembeli', $pembeli->id_pembeli)
                ->where('transaksi_pembelian.status_pembayaran', '1')
                ->where('transaksi_pembelian.verifikasi_bukti', 'transaksi diverifikasi', 'belum diverifikasi')
                ->whereIn('transaksi_pembelian.status_pengiriman', [
                    'sedang disiapkan',
                    'sedang diantar',
                    'siap diambil',
                    'sudah sampai',
                    'sudah diambil',
                ])
                ->select(
                    'barang.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'transaksi_pembelian.status_pengiriman',
                )
                ->paginate(5);

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

    public function reducePoint($point)
    {
        try {
            $pembeli = auth('pembeli')->user();
            $pembeli->poin_loyalitas -= $point;
            $pembeli->save();

            return response()->json([
                'message' => 'Success',
                'data' => $pembeli
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Pembeli not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function addPoint($point)
    {
        try {
            $pembeli = auth('pembeli')->user();
            $pembeli->poin_loyalitas += $point;
            $pembeli->save();

            return response()->json([
                'message' => 'Success',
                'data' => $pembeli
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Pembeli not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showUnpaidPurchase()
    {
        try {
            $pembeli = auth('pembeli')->user();

            $products = TransaksiPembelian::where('id_pembeli', $pembeli->id_pembeli)
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('transaksi_pembelian.status_pembayaran', '0')
                ->Where('transaksi_pembelian.verifikasi_bukti', 'belum diverifikasi')
                ->select(
                    'barang.*',
                    'transaksi_pembelian.*',
                )
                ->paginate(5);
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

    public function showVerificationPurchase()
    {
        try {
            $pembeli = auth('pembeli')->user();

            $products = DB::table('transaksi_pembelian')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('transaksi_pembelian.id_pembeli', $pembeli->id_pembeli)
                ->where('transaksi_pembelian.status_pembayaran', '1')
                ->whereIn('transaksi_pembelian.verifikasi_bukti', [
                    'belum diverifikasi',
                    'transaksi ditolak'
                ])
                ->select(
                    'barang.*',
                    'transaksi_pembelian.*',
                )
                ->paginate(5);
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

    public function showAllHistoryPembelian()
    {
        try {
            $pembeli = auth('pembeli')->user();

            $barang = DB::table('transaksi_pembelian')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('transaksi_pembelian.id_pembeli', $pembeli->id_pembeli)
                ->select(
                    'barang.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'transaksi_pembelian.pengiriman',
                    'transaksi_pembelian.total_pembayaran',
                )
                ->orderBy('transaksi_pembelian.tanggal_pembelian', 'desc')
                ->paginate(10);

            return response()->json($barang, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Pembeli not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showHistoryPembelianByTanggal(Request $request){
        try{

            $validate = $request->validate([
                'tanggal_mulai' => 'required|date',
                'tanggal_selesai' => 'required|date',
            ]);

            $pembeli = auth('pembeli')->user();

            $tanggalMulai = Carbon::parse($validate['tanggal_mulai'])->startOfDay();     // 2025-06-02 00:00:00
            $tanggalSelesai = Carbon::parse($validate['tanggal_selesai'])->endOfDay();   // 2025-06-04 23:59:59

            $barang = DB::table('transaksi_pembelian')
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->join('barang', 'komisi.id_barang', '=', 'barang.id_barang')
                ->where('transaksi_pembelian.id_pembeli', $pembeli->id_pembeli)
                ->whereBetween('transaksi_pembelian.tanggal_pembelian', [$tanggalMulai, $tanggalSelesai])
                ->select(
                    'barang.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'transaksi_pembelian.pengiriman',
                    'transaksi_pembelian.total_pembayaran',
                )
                ->orderBy('transaksi_pembelian.tanggal_pembelian', 'desc')
                ->paginate(10);


            Log::info('Data pembelian berdasarkan tanggal', [
                'tanggal_mulai' => $validate['tanggal_mulai'],
                'tanggal_selesai' => $validate['tanggal_selesai'],
                'pembeli_id' => $pembeli->id_pembeli,
            ]);
            

            if($barang->isEmpty()){
                return response()->json([
                    'items' => [],
                    'message' => 'Tidak ada data pembelian pada rentang tanggal tersebut.',
                    'current_page' => 1,
                    'last_page' => 1,
                ], 200);
            }

            Log::info('Barang : ' . $barang->count() . ' items found');

            return response()->json($barang, 200);
            
        }catch(ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ada kesalahan saat mengambil data pembelian berdasarkan tanggal',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
