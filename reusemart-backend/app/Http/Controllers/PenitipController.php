<?php

namespace App\Http\Controllers;

use App\Models\Penitip;
use App\Models\Barang;
use App\Models\DetailTransaksiPenitipan;
use App\Models\TransaksiPenitipan;
use App\Models\Komisi;

use Illuminate\Http\Request;
use Carbon\Carbon;

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
                'email_penitip' => 'required|email|unique:penitip,email_penitip|unique:pegawai,email_pegawai|unique:organisasi,email_organisasi|unique:hunter,email_hunter|unique:pembeli,email_pembeli',
                'password_penitip' => 'required|min:8',
                'nama_penitip' => 'required|string|max:255',
                'nomor_telepon_penitip' => 'required|string|max:15',
                'tanggal_lahir' => 'required|date',
                'NIK' => 'required|string|max:16|unique:penitip,NIK',
                'foto_ktp' => 'required|image|mimes:jpeg,png,jpg,gif',
                'foto_penitip' => 'nullable|image|mimes:jpeg,png,jpg,gif'
            ], [
                'NIK.unique' => 'NIK sudah terdaftar',
            ]);


            $fotoKTPPath = $request->file('foto_ktp')->store('img/Penitip/ktp', 'public');
            if ($request->hasFile('foto_penitip')) {
                $foto_penitip_path = $request->file('foto_penitip')->store('img/Penitip', 'public');
            } else {
                $foto_penitip_path = 'img/blank-profile-picture.jpg';
            }
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


            if (!empty($validatedData['password_penitip'])) {
                $updateData['password_penitip'] = Hash::make($validatedData['password_penitip']);
            }

            if ($request->hasFile('foto_penitip')) {
                $image = $request->file('foto_penitip');
                // $uploadFolder = 'Penitip';
                $uploadPath = 'img/Penitip';
                $image_uploaded_path = $image->store($uploadPath, 'public');
                $uploadedImageResponse = basename($image_uploaded_path);

                if ($penitip->foto_penitip && Storage::disk('public')->exists($uploadPath . '/' . $penitip->foto_penitip)) {
                    Storage::disk('public')->delete($uploadPath . '/' . $penitip->foto_penitip);
                }

                $updateData['foto_penitip'] = $uploadedImageResponse;
            }

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
    public function destroy($id)
    {
        Log::info("Menghapus penitip dengan ID: " . $id);
        try {
            $penitip = Penitip::findOrFail($id);
            $penitip->delete();

            return response()->json([
                'message' => 'penitip berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'error' => $e->getMessage(),
            ], 500);
        }
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
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['terjual', 'proses pembayaran'])
                ->select(
                    'barang.*',
                    'transaksi_pembelian.tanggal_pembelian',
                )
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Barang Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function searchBarangDonasi($search_barang)
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_donasi', 'transaksi_donasi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('organisasi', 'transaksi_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['didonasikan', 'open donasi'])
                ->where(function ($query) use ($search_barang) {
                    $query->where('barang.nama_barang', 'like', "%{$search_barang}%")
                        ->orWhere('transaksi_donasi.tanggal_donasi', 'like', "%{$search_barang}%")
                        ->orWhere('transaksi_donasi.nama_penerima', 'like', "%{$search_barang}%")
                        ->orWhere('organisasi.nama_organisasi', 'like', "%{$search_barang}%")
                        ->orWhere('detail_transaksi_penitipan.status_penitipan', 'like', "%{$search_barang}%");
                })
                ->select(
                    'barang.*',
                    'transaksi_donasi.tanggal_donasi',
                    'transaksi_donasi.nama_penerima',
                    'detail_transaksi_penitipan.status_penitipan',
                    'organisasi.nama_organisasi'
                )
                ->orderByRaw("FIELD(detail_transaksi_penitipan.status_penitipan, 'open donasi', 'didonasikan')")
                ->paginate(5);

            return response()->json($products, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function searchBarangExtend($search_barang)
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['ready jual', 'masa pengambilan'])
                ->where(function ($query) use ($search_barang) {
                    $query->where('barang.nama_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('barang.harga_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('detail_transaksi_penitipan.tanggal_berakhir', 'like', '%' . $search_barang . '%')
                        ->orWhere('detail_transaksi_penitipan.tanggal_batas_pengambilan', 'like', '%' . $search_barang . '%');
                })

                ->select(
                    'barang.*',
                    'detail_transaksi_penitipan.status_penitipan',
                    'detail_transaksi_penitipan.tanggal_berakhir',
                    'detail_transaksi_penitipan.tanggal_batas_pengambilan',
                    'detail_transaksi_penitipan.id_detail_transaksi_penitipan',
                    'detail_transaksi_penitipan.status_perpanjangan',
                )
                ->distinct()
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    public function searchBarangJual($search_barang)
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->where('detail_transaksi_penitipan.status_penitipan', 'ready jual')
                ->where(function ($query) use ($search_barang) {
                    $query->where('barang.nama_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('barang.harga_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('detail_transaksi_penitipan.tanggal_berakhir', 'like', '%' . $search_barang . '%');
                })
                ->select('barang.*', 'detail_transaksi_penitipan.tanggal_berakhir')
                ->distinct()
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    public function searchBarangTerjual($search_barang)
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['terjual', 'proses pembayaran'])
                ->where(function ($query) use ($search_barang) {
                    $query->where('barang.nama_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('barang.harga_barang', 'like', '%' . $search_barang . '%')
                        ->orWhere('detail_transaksi_penitipan.tanggal_berakhir', 'like', '%' . $search_barang . '%')
                        ->orWhere('detail_transaksi_penitipan.status_penitipan', 'like', '%' . $search_barang . '%');
                })
                ->select(
                    'barang.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'detail_transaksi_penitipan.status_penitipan',
                    'detail_transaksi_penitipan.tanggal_berakhir'
                )
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showOnSaleProducts()
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->where('detail_transaksi_penitipan.status_penitipan', 'ready jual')
                ->select('barang.*', 'detail_transaksi_penitipan.tanggal_berakhir')
                ->distinct()
                ->paginate(5);


            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showExtendProducts()
    {
        try {
            $penitip = auth('penitip')->user();
            $today = Carbon::now()->toDateString();


            DetailTransaksiPenitipan::whereIn('status_penitipan', ['ready jual', 'masa pengambilan'])
                ->whereDate('tanggal_berakhir', '<', $today)
                ->update(['status_penitipan' => 'open donasi']);


            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['ready jual', 'masa pengambilan'])
                ->whereDate('detail_transaksi_penitipan.tanggal_berakhir', '>=', $today)
                ->select(
                    'barang.*',
                    'detail_transaksi_penitipan.status_penitipan',
                    'detail_transaksi_penitipan.tanggal_berakhir',
                    'detail_transaksi_penitipan.tanggal_batas_pengambilan',
                    'detail_transaksi_penitipan.id_detail_transaksi_penitipan',
                    'detail_transaksi_penitipan.status_perpanjangan',
                )
                ->distinct()
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Penitip not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }
    public function showDonatedProducts()
    {
        try {
            $penitip = auth('penitip')->user();

            $products = DB::table('transaksi_penitipan')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_donasi', 'transaksi_donasi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('organisasi', 'transaksi_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where('transaksi_penitipan.id_penitip', $penitip->id_penitip)
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['didonasikan', 'open donasi'])
                ->select(
                    'barang.*',
                    'transaksi_donasi.tanggal_donasi',
                    'transaksi_donasi.nama_penerima',
                    'detail_transaksi_penitipan.status_penitipan',
                    'organisasi.nama_organisasi'
                )
                ->orderByRaw("FIELD(detail_transaksi_penitipan.status_penitipan, 'open donasi', 'didonasikan')")
                ->paginate(5);



            return response()->json($products, 200);
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

    public function extendBarangPenitip(Request $request)
    {
        $detailTransaksi = DetailTransaksiPenitipan::where('id_detail_transaksi_penitipan', $request->id_detail_transaksi_penitipan)->first();

        if (!$detailTransaksi) {
            return response()->json([
                'message' => 'Detail Transaksi not found',
            ], 404);
        }

        if ($detailTransaksi->tanggal_berakhir->toDateString() < Carbon::now()->toDateString()) {
            return response()->json([
                'message' => 'Barang sudah kadaluarsa',
            ], 400);
        }


        $tanggalBerakhirBaru = $detailTransaksi->tanggal_berakhir->addDays(30);
        $batasPengambilanBaru = $tanggalBerakhirBaru->copy()->addDays(7);

        $detailTransaksi->update([
            'tanggal_berakhir' => $tanggalBerakhirBaru,
            'tanggal_batas_pengambilan' => $batasPengambilanBaru,
            'status_perpanjangan' => 1,
        ]);


        return response()->json([
            'message' => 'Perpanjangan berhasil',
        ], 200);
    }


    public function pengambilanBarang(Request $request)
    {
        $detailTransaksi = DetailTransaksiPenitipan::where('id_barang', $request->id_barang)->first();

        if (!$detailTransaksi) {
            return response()->json([
                'message' => 'Barang not found',
            ], 404);
        }

        $detailTransaksi->update([
            'status_penitipan' => 'masa pengambilan',
        ]);

        return response()->json([
            'message' => 'Barang berhasil diambil',
        ], 200);
    }

    public function searchByEmail($email_penitip)
    {
        try {
            $penitip = Penitip::where('email_penitip', 'LIKE', '%' . $email_penitip . '%')->get();

            if ($penitip->isEmpty()) {
                return response()->json([
                    'message' => 'Penitip not found',
                ], 404);
            }

            return response()->json($penitip, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showHistoryPenitipan(){
        try {
            $penitip = auth('penitip')->user();
            $targetDate = Carbon::now()->subDays(30);
            $today = Carbon::now();


            $history = TransaksiPenitipan::where('id_penitip', $penitip->id_penitip)
            ->with([
                'detailTransaksiPenitipan.barang.komisi' => function ($query) {
                    $query->select('id_komisi', 'id_barang', 'id_transaksi_pembelian', 'total_harga_bersih');
                },
                'detailTransaksiPenitipan.barang.komisi.transaksiPembelian.pembeli' => function ($query) {
                    $query->select('id_pembeli', 'nama_pembeli');
                }
            ])
            ->whereBetween('tanggal_penitipan', [$targetDate, $today])
            ->orderBy('tanggal_penitipan', 'desc')
            ->get();


            return response()->json($history, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getTopSeller(){
        try{
            $penitip = Penitip::where('badge', '=', 1)
            ->first();

            return response()->json($penitip, 200);
        }catch (\Exception $e) {
            return response()->json([
                'message' => 'Error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
