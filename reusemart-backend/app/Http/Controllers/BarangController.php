<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\TransaksiPembelian;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;
use App\Models\Pegawai;
use App\Models\Hunter;
use App\Models\Komisi;
use App\Models\Kategori;
use App\Models\Penitip;
use App\Models\Pembeli;
use App\Models\TransaksiPenitipan;
use App\Models\TransaksiDonasi;
use App\Models\Organisasi;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Log;


class BarangController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function create(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'nama_barang' => 'required|string|max:255',
                'deskripsi_barang' => 'required|string',
                'harga_barang' => 'required|numeric',
                'tanggal_garansi' => 'required|date',
                'kondisi_barang' => 'required|string',
                'berat_barang' => 'required|numeric',
                'foto_barang' => 'required|image|mimes:jpeg,png,jpg,gif',
                'foto_barang2' => 'required|image|mimes:jpeg,png,jpg,gif',
                'foto_barang3' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'nama_kategori' => 'required|string',
                'nama_pegawai' => 'required|string',
                'nama_hunter' => 'nullable|string',
                'id_transaksi_penitipan' => 'required|integer',
            ]);

            // jangan lupa rating 0

            if ($request->hasFile('foto_barang')) {
                $file = $request->file('foto_barang');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $foto_barang = $filename;
            }

            if ($request->hasFile('foto_barang2')) {
                $file = $request->file('foto_barang2');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $foto_barang2 = $filename;
            }

            if ($request->hasFile('foto_barang3')) {
                $file = $request->file('foto_barang3');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $foto_barang3 = $filename;
            }

            $kategori = Kategori::where('nama_kategori', $validatedData['nama_kategori'])->first();
            if (!$kategori) {
                return response()->json([
                    'message' => 'Kategori not found',
                ], 404);
            }

            $pegawai = Pegawai::where('nama_pegawai', $validatedData['nama_pegawai'])->first();
            if (!$pegawai) {
                return response()->json([
                    'message' => 'Pegawai not found',
                ], 404);
            }

            if ($validatedData['nama_hunter'] != null) {
                $hunter = Hunter::where('nama_hunter', $validatedData['nama_hunter'])->first();
            }

            $barang = Barang::create([
                'id_pegawai' => $pegawai->id_pegawai,
                'id_hunter' => $hunter->id_hunter ?? null,
                'id_kategori' => $kategori->id_kategori,
                'nama_barang' => $validatedData['nama_barang'],
                'deskripsi_barang' => $validatedData['deskripsi_barang'],
                'tanggal_garansi' => $validatedData['tanggal_garansi'],
                'kondisi_barang' => $validatedData['kondisi_barang'],
                'harga_barang' => $validatedData['harga_barang'],
                'berat_barang' => $validatedData['berat_barang'],
                'foto_barang' => $foto_barang,
                'foto_barang2' => $foto_barang2,
                'foto_barang3' => isset($foto_barang3) ? $foto_barang3 : null,
                'rating' => 0,
            ]);


            $transaksi_penitipan = TransaksiPenitipan::where('id_transaksi_penitipan', $validatedData['id_transaksi_penitipan'])->first();
            if (!$transaksi_penitipan) {
                return response()->json(404);
            }

            $tanggal_penitipan = Carbon::parse($transaksi_penitipan->tanggal_penitipan);
            $tanggal_berakhir = $tanggal_penitipan->copy()->addDays(30);
            $tanggal_penitipan_plus_37 = $tanggal_penitipan->copy()->addDays(37);

            $detail_transaksi_penitipan = DetailTransaksiPenitipan::create([
                'id_barang' => $barang->id_barang,
                'id_transaksi_penitipan' => $transaksi_penitipan->id_transaksi_penitipan,
                'status_penitipan' => 'ready jual',
                'tanggal_berakhir' => $tanggal_berakhir,
                'tanggal_batas_pengambilan' => $tanggal_penitipan_plus_37,
                'status_perpanjangan' => 0,
            ]);

            return response()->json([
                'message' => 'Barang and Detail Transaksi Penitipan created successfully.',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Barang gagal ditambahkan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request)
    {
        try {

            $validatedData = $request->validate([
                'id_barang' => 'required|integer',
                'nama_barang' => 'required|string|max:255',
                'deskripsi_barang' => 'required|string',
                'harga_barang' => 'required|numeric',
                'tanggal_garansi' => 'required|date',
                'kondisi_barang' => 'required|string',
                'berat_barang' => 'required|numeric',
                'foto_barang' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'foto_barang2' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'foto_barang3' => 'nullable|image|mimes:jpeg,png,jpg,gif',
                'nama_kategori' => 'required|string',
                'nama_pegawai' => 'required|string',
                'nama_hunter' => 'nullable|string',
            ]);

            $barang = Barang::find($validatedData['id_barang']);
            if (!$barang) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }

            $kategori = Kategori::where('nama_kategori', $validatedData['nama_kategori'])->first();
            if (!$kategori) {
                return response()->json([
                    'message' => 'Kategori not found',
                ], 404);
            }

            $pegawai = Pegawai::where('nama_pegawai', $validatedData['nama_pegawai'])->first();
            if (!$pegawai) {
                return response()->json([
                    'message' => 'Pegawai not found',
                ], 404);
            }

            if ($validatedData['nama_hunter'] != null) {
                $hunter = Hunter::where('nama_hunter', $validatedData['nama_hunter'])->first();
            }

            $barang->update([
                'id_pegawai' => $pegawai->id_pegawai,
                'id_hunter' => $hunter->id_hunter ?? null,
                'nama_barang' => $validatedData['nama_barang'],
                'deskripsi_barang' => $validatedData['deskripsi_barang'],
                'tanggal_garansi' => $validatedData['tanggal_garansi'],
                'kondisi_barang' => $validatedData['kondisi_barang'],
                'harga_barang' => $validatedData['harga_barang'],
                'berat_barang' => $validatedData['berat_barang'],
                'id_kategori' => $kategori->id_kategori,
            ]);

            if ($request->hasFile('foto_barang')) {
                $file = $request->file('foto_barang');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $barang->foto_barang = $filename;
            }

            if ($request->hasFile('foto_barang2')) {
                $file = $request->file('foto_barang2');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $barang->foto_barang2 = $filename;
            }

            if ($request->hasFile('foto_barang3')) {
                $file = $request->file('foto_barang3');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Barang', $filename, 'public');
                $barang->foto_barang3 = $filename;
            }
            $barang->save();

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Barang gagal diupdate',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function showAll()
    {
        try {
            $barang = Barang::join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'ready jual')
                // ->where('transaksi_penitipan.tanggal_penitipan', '>=', Carbon::today()->subdays(25))
                ->get();

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Data Barang tidak ditemukan.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function showByCategory($namacategory)
    {
        try {
            $category = Kategori::where('nama_kategori', $namacategory)
                ->firstOrFail();
            if (!$category) {
                return response()->json(['message' => 'Kategori tidak ditemukan.'], 404);
            }

            // dd($category->id_kategori);
            $id_kategori = $category->id_kategori;
            $Barang = Barang::join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'ready jual')
                ->where('id_kategori', $id_kategori)
                ->get();


            if (!$Barang) {
                return response()->json(['message' => 'Data Barang dengan tidak ditemukan.'], 404);
            }

            return response()->json($Barang, 200);

        } catch (Exception $e) {
            return response()->json(['message' => 'Data Barangasdasd tidak ditemukan.'], 404);
        }
    }

    public function showDetailBarang($id_barang)
    {
        try {

            $Barang = Barang::where('id_barang', $id_barang)->firstOrFail();
            if (!$Barang) {
                return response()->json(['message' => 'Data Barang tidak ditemukan.'], 404);
            }

            $detailpenitipan = DetailTransaksiPenitipan::where('id_barang', $Barang->id_barang)->first();
            if (!$detailpenitipan) {
                return response()->json(['message' => 'Data Detail Transaksi Penitipan tidak ditemukan'], 404);
            }

            $transaksi_penitipan = TransaksiPenitipan::where('id_transaksi_penitipan', $detailpenitipan->id_transaksi_penitipan)->first();

            $penitip = Penitip::where('id_penitip', $transaksi_penitipan->id_penitip)->first();
            if (!$penitip) {
                return response()->json(['message' => 'Data Penitip tidak ditemukan'], 404);
            }


            $Barang->tanggal_berakhir = $detailpenitipan->tanggal_berakhir;

            $detailBarangPage = [
                'barang' => $Barang,
                'penitip' => $penitip,
            ];

            return response()->json($detailBarangPage, 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'ERRROR'], 404);
        }
    }

    public function showDetailBarangDonasi($id_barang)
    {
        try {
            $penitip = auth('penitip')->user();
            $products = DB::table('barang')
                ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->leftJoin('transaksi_donasi', 'transaksi_donasi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('organisasi', 'transaksi_donasi.id_organisasi', '=', 'organisasi.id_organisasi')
                ->where("barang.id_barang", $id_barang)
                ->select(
                    'barang.*',
                    'transaksi_donasi.tanggal_donasi',
                    'transaksi_donasi.nama_penerima',
                    'detail_transaksi_penitipan.status_penitipan',
                    'organisasi.nama_organisasi'
                )
                ->first();



            return response()->json(['data' => $products], 200);
        } catch (\Exception $e) {
            Log::info($e);
            return response()->json([
                'message' => 'detail barang donasi not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(barang $barang)
    {
        //
    }

    public function search($search_barang)
    {
        try {


            $barang = Barang::where(function ($query) use ($search_barang) {
                $query->where('nama_barang', 'LIKE', '%' . $search_barang . '%');
            })
                ->get();

            if (!$barang) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }

            return response()->json($barang, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function searchBarangOpenDonasi($search_barang)
    {
        try {


            $barang = Barang::join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'open donasi')
                ->where('barang.nama_barang', 'LIKE', '%' . $search_barang . '%')
                ->paginate(10);

            if (!$barang) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }

            return response()->json($barang, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve barang open donasi',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showBarangByOpenDonasi()
    {
        try {
            $barang = Barang::join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'open donasi')
                ->select('barang.*')
                ->paginate(10);

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'data ga ada woiii',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function tambahRating()
    {
        try {
            $validatedData = request()->validate([
                'id_barang' => 'required|integer',
                'rating' => 'required|integer|min:1|max:5',
            ]);

            $barang = Barang::find($validatedData['id_barang']);
            if (!$barang) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }

            $barang->rating = $validatedData['rating'];
            $barang->save();

            $detail = DetailTransaksiPenitipan::where('id_barang', $barang->id_barang)->first();

            if ($detail) {
                $transaksi = TransaksiPenitipan::find($detail->id_transaksi_penitipan);
                $penitip = Penitip::find($transaksi->id_penitip);
            }

            $barangIds = $penitip->transaksiPenitipan()
                ->with('detailTransaksiPenitipan.barang')
                ->get()
                ->pluck('detailTransaksiPenitipan')  // ambil semua detail
                ->flatten()                 // satukan jadi 1 list
                ->pluck('barang.id_barang') // ambil ID barang dari masing2 detail
                ->unique()                  // buang ID yang duplikat
                ->filter();                 // buang null

            log::info('ID BARANG :' . $barangIds);

            $ratarata = Barang::whereIn('id_barang', $barangIds)
                ->avg('rating');

            $penitip->rerata_rating = $ratarata;
            $penitip->save();

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update rating',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Memverifikasi pengambilan barang penitipan oleh penitip
    public function VerifyAmbilBarangPenitip(Request $request)
    {
        try {
            $today = Carbon::now();
            $detailTransaksi = DetailTransaksiPenitipan::where('id_detail_transaksi_penitipan', $request->id_detail_transaksi_penitipan)->first();

            if (!$detailTransaksi) {
                return response()->json([
                    'message' => 'Detail Transaksi not found',
                ], 404);
            }


            $detailTransaksi->update([
                'status_penitipan' => 'sudah diambil',
                'tanggal_pengambilan' => $today,
            ]);

            return response()->json([
                'message' => 'Status penitipan berhasil diperbarui',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function VerifyPengirimanBarangPembeli(Request $request)
    {
        try {
            $sendDate = $request->tanggal_pengiriman;

            $detailTransaksi = TransaksiPembelian::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)->first();
            $kurir = Pegawai::where('id_pegawai', $request->id_pegawai)
                ->where('id_jabatan', 4)
                ->first();
            if (!$detailTransaksi) {
                return response()->json([
                    'message' => 'Detail Transaksi not found',
                ], 404);
            }

            if ($kurir && $kurir->fcm_token) {
                $notifRequest = new Request([
                    'token' => $kurir->fcm_token,
                    'title' => 'Jadwal Pengiriman Baru',
                    'body' => 'Anda memiliki jadwal pengiriman baru pada tanggal ' . $sendDate . '. Silakan cek aplikasi kurir Anda untuk detail lebih lanjut.',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }

            $pembeli = Pembeli::where('id_pembeli', $detailTransaksi->id_pembeli)->first();
            if ($pembeli->fcm_token) {
                $notifRequest = new Request([
                    'token' => $pembeli->fcm_token,
                    'title' => 'Pengiriman Telah Dijadwalkan',
                    'body' => 'Barang Anda akan dikirim pada tanggal ' . $sendDate . '. Silakan tunggu kurir kami untuk mengantarkan barang Anda.',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }


            $penitips = Penitip::join('transaksi_penitipan', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->join('detail_transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->where('transaksi_pembelian.id_transaksi_pembelian', $detailTransaksi->id_transaksi_pembelian)
                ->select('penitip.*', 'barang.nama_barang')
                ->distinct()
                ->get();

            foreach ($penitips as $penitip) {
                if ($penitip->fcm_token) {
                    $notifRequest = new Request([
                        'token' => $penitip->fcm_token,
                        'title' => 'Pengiriman Barang Penjualan Telah Dijadwalkan',
                        'body' => 'Barang yang Anda titipkan akan dikirim pada tanggal ' . $sendDate . '. Silakan tunggu kurir kami untuk mengantarkan barang tersebut.',
                    ]);

                    (new NotificationController())->sendNotification($notifRequest);
                }
            }

            $this->getKomisiPembelian($detailTransaksi->id_transaksi_pembelian);
            $detailTransaksi->update([
                'id_pegawai' => $kurir->id_pegawai,
                'tanggal_pengiriman' => $sendDate,
            ]);

            return response()->json([
                'message' => 'Status penitipan berhasil diperbarui',
            ], 200);


        } catch (Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function VerifyPengambilanPembeli(Request $request)
    {
        try {
            $today = Carbon::now();
            $detailTransaksi = TransaksiPembelian::where('id_transaksi_pembelian', $request->id_transaksi_pembelian)
                ->first();

            if (!$detailTransaksi) {
                return response()->json([
                    'message' => 'Detail Transaksi not found',
                ], status: 404);
            }

            $pembeli = Pembeli::where('id_pembeli', $detailTransaksi->id_pembeli)->first();

            if ($pembeli->fcm_token) {
                $notifRequest = new Request([
                    'token' => $pembeli->fcm_token,
                    'title' => 'Barang Sudah Diterima',
                    'body' => 'Barang sudah diambil oleh pembeli. Terima kasih telah belanja barang bekas',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }


            $komisi = Komisi::where('id_transaksi_pembelian', $detailTransaksi->id_transaksi_pembelian)
                ->pluck('id_barang');
            $detailPenitipan = DetailTransaksiPenitipan::whereIn('id_barang', $komisi)
                ->pluck('id_transaksi_penitipan');
            $transaksiPenitipan = TransaksiPenitipan::whereIn('id_transaksi_penitipan', $detailPenitipan)
                ->pluck('id_penitip');
            $penitipList = Penitip::whereIn('id_penitip', $transaksiPenitipan)->get();

            if ($penitipList->isEmpty()) {
                return response()->json([
                    'message' => 'Tidak ada penitip ditemukan',
                ], 404);
            }

            foreach ($penitipList as $penitip) {
                if ($penitip->fcm_token) {
                    $notifRequest = new Request([
                        'token' => $penitip->fcm_token,
                        'title' => 'Barang Sudah Diterima',
                        'body' => 'Barang sudah diterima oleh pembeli. Terima kasih telah menitipkan barang Anda.',
                    ]);

                    (new NotificationController())->sendNotification($notifRequest);
                }
            }
            $this->getKomisiPembelian($detailTransaksi->id_transaksi_pembelian);

            $detailTransaksi->update([
                'status_pengiriman' => 'sudah diambil',
                'tanggal_pengambilan' => $today,
            ]);

            return response()->json([
                'message' => 'Status penitipan berhasil diperbarui',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getKomisiPembelian($id_transaksi_pembelian)
    {
        $cariKomisi = Komisi::with('barang.detailtransaksipenitipan.transaksiPenitipan.penitip', 'barang.hunter', 'transaksiPembelian.pembeli')->where('id_transaksi_pembelian', $id_transaksi_pembelian)
            ->get();

        foreach ($cariKomisi as $komisi) {
            $barang = $komisi->barang;
            $harga = $barang->harga_barang;
            $detail = $komisi->barang->detailtransaksipenitipan->first();
            $transaksi_penitipan = $detail->transaksiPenitipan;
            $pembeli = $komisi->transaksiPembelian->pembeli;
            $poinDapat = $komisi->transaksiPembelian->tambahan_poin;


            $komisi_hunter = 0;
            $komisi_reusemart = 0;
            $komisi_penitip = 0;
            $bonus_penitip = 0;

            if ($barang->id_hunter) {
                if ($detail->status_perpanjangan == 0) {
                    $komisi_penitip = $harga * 0.8;
                    $komisi_hunter = $harga * 0.05;
                    $komisi_reusemart = $harga * 0.15;
                } else {
                    $komisi_penitip = $harga * 0.7;
                    $komisi_hunter = $harga * 0.05;
                    $komisi_reusemart = $harga * 0.25;
                }
            } else {
                if ($detail->status_perpanjangan == 0) {
                    $komisi_penitip = $harga * 0.8;
                    $komisi_reusemart = $harga * 0.2;
                } else {
                    $komisi_penitip = $harga * 0.7;
                    $komisi_reusemart = $harga * 0.3;
                }
            }

            if ($transaksi_penitipan->tanggal_penitipan >= now()->subDays(7)) {
                $bonus_penitip = $komisi_reusemart * 0.1;
                $komisi_reusemart = $komisi_reusemart - $bonus_penitip;
                Log::info('Bonus Penitip: ' . $bonus_penitip);
                Log::info('Komisi Reusemart setelah bonus: ' . $komisi_reusemart);
            }

            $komisi->update([
                'total_harga_kotor' => $harga,
                'total_harga_bersih' => $komisi_penitip,
                'komisi_hunter' => $komisi_hunter,
                'komisi_reusemart' => $komisi_reusemart,
                'bonus_penitip' => $bonus_penitip,
            ]);

            if ($detail->transaksiPenitipan && $detail->transaksiPenitipan->penitip) {
                $penitip = $detail->transaksiPenitipan->penitip;
                $penitip->saldo += $komisi_penitip;
                $penitip->komisi_penitip += $bonus_penitip;
                $penitip->save();
            }

            if ($barang->id_hunter) {
                $hunter = $barang->hunter;
                $hunter->total_komisi += $komisi_hunter;
                $hunter->save();
            }

            if ($pembeli) {
                $pembeli->poin_loyalitas += $poinDapat;
                $pembeli->save();
            }
        }

        return response()->json([
            'message' => 'Komisi berhasil dihitung',
        ], 200);
    }
    public function VerifyAmbilBarangPembeli($id)
    {
        $validatedData = request()->validate([
            'tanggal_pengiriman' => 'required|date',
        ]);

        $transaksiPembelian = TransaksiPembelian::where('id_transaksi_pembelian', $id)->first();
        if (!$transaksiPembelian) {
            return response()->json([
                'status' => 'error',
                'message' => 'transaksi not found',
            ], 404);
        }

        $transaksiPembelian->update([
            'tanggal_pengiriman' => $validatedData['tanggal_pengiriman'],
            'status_pengiriman' => 'siap diambil',
        ]);

        $pembeli = Pembeli::where('id_pembeli', $transaksiPembelian->id_pembeli)->first();

        if ($pembeli->fcm_token) {
            $notifRequest = new Request([
                'token' => $pembeli->fcm_token,
                'title' => 'Segera Ambil Barang Pembelian Anda !!!',
                'body' => 'Barang Anda sudah siap diambil pada tanggal ' . $validatedData['tanggal_pengiriman'] . '. Silakan ambil di gudang ReuseMart.',
            ]);

            (new NotificationController())->sendNotification($notifRequest);
        }

        $komisi = Komisi::where('id_transaksi_pembelian', $transaksiPembelian->id_transaksi_pembelian)
            ->pluck('id_barang');
        $detailPenitipan = DetailTransaksiPenitipan::whereIn('id_barang', $komisi)
            ->pluck('id_transaksi_penitipan');
        $transaksiPenitipan = TransaksiPenitipan::whereIn('id_transaksi_penitipan', $detailPenitipan)
            ->pluck('id_penitip');
        $penitipList = Penitip::whereIn('id_penitip', $transaksiPenitipan)->get();

        if ($penitipList->isEmpty()) {
            return response()->json([
                'message' => 'Tidak ada penitip ditemukan',
            ], 404);
        }

        foreach ($penitipList as $penitip) {
            if ($penitip->fcm_token) {
                $notifRequest = new Request([
                    'token' => $penitip->fcm_token,
                    'title' => 'Barang akan segera diambil pembeli',
                    'body' => 'Barang yang Anda titipkan akan segera diambil oleh pembeli pada tanggal ' . $validatedData['tanggal_pengiriman'] . '. Terima kasih telah menitipkan barang Anda.',
                ]);

                (new NotificationController())->sendNotification($notifRequest);
            }
        }



        return response()->json([
            'status' => 'success',
            'data' => $transaksiPembelian,
        ]);
    }


    public function showAmbilProducts()
    {
        try {
            $products = DB::table('penitip')
                ->join('transaksi_penitipan', 'penitip.id_penitip', '=', 'transaksi_penitipan.id_penitip')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['masa pengambilan'])
                ->select(
                    'penitip.*',
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

    public function searchAmbilProducts($search_barang)
    {
        try {
            $gudang = auth('gudang')->user();
            $products = DB::table('penitip')
                ->join('transaksi_penitipan', 'penitip.id_penitip', '=', 'transaksi_penitipan.id_penitip')
                ->join('detail_transaksi_penitipan', 'transaksi_penitipan.id_transaksi_penitipan', '=', 'detail_transaksi_penitipan.id_transaksi_penitipan')
                ->join('barang', 'detail_transaksi_penitipan.id_barang', '=', 'barang.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->whereIn('detail_transaksi_penitipan.status_penitipan', ['masa pengambilan'])
                ->where(function ($query) use ($search_barang) {
                    $query->where('barang.nama_barang', 'LIKE', '%' . $search_barang . '%');
                })
                ->select(
                    'penitip.*',
                    'barang.*',
                    'detail_transaksi_penitipan.status_penitipan',
                    'detail_transaksi_penitipan.tanggal_berakhir',
                    'detail_transaksi_penitipan.tanggal_batas_pengambilan',
                    'detail_transaksi_penitipan.id_detail_transaksi_penitipan',
                    'detail_transaksi_penitipan.status_perpanjangan',
                )
                ->distinct()
                ->get();

            if (!$products) {
                return response()->json([
                    'message' => 'Barang not found',
                ], 404);
            }

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve ambil barang',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function SearchPengirimanProducts($search_barang)
    {
        try {
            $products = DB::table('barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->whereIn('transaksi_pembelian.status_pengiriman', ['sedang disiapkan', 'siap diambil', 'sedang diantar', 'sudah diambil'])
                ->where(function ($query) use ($search_barang) {
                    $query->where('transaksi_pembelian.id_transaksi_pembelian', 'like', "%{$search_barang}%")
                        ->orWhere('barang.nama_barang', 'like', "%{$search_barang}%")
                        ->orWhere('transaksi_pembelian.pengiriman', 'like', "%{$search_barang}%")
                        ->orWhere('transaksi_pembelian.status_pengiriman', 'like', "%{$search_barang}%");
                })
                ->select(
                    'barang.*',
                    'transaksi_pembelian.id_transaksi_pembelian',
                    'transaksi_pembelian.pengiriman',
                    'transaksi_pembelian.tanggal_pengiriman',
                    'transaksi_pembelian.status_pengiriman',
                )
                ->distinct()
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Barang not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }


    public function showPengirimanProducts()
    {
        try {
            $products = DB::table('barang')
                ->join('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->join('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->whereIn('transaksi_pembelian.status_pengiriman', ['sedang disiapkan', 'siap diambil', 'sedang diantar', 'sudah diambil'])
                ->select(
                    'barang.*',
                    'transaksi_pembelian.id_transaksi_pembelian',
                    'transaksi_pembelian.pengiriman',
                    'transaksi_pembelian.tanggal_pengiriman',
                    'transaksi_pembelian.status_pengiriman',
                    'transaksi_pembelian.tanggal_pembelian',
                )
                ->distinct()
                ->orderBy('transaksi_pembelian.id_transaksi_pembelian', 'desc')
                ->paginate(5);

            return response()->json($products, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Barang not found',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function showHistoryBarangIdHunter($id_barang)
    {
        try {
            $history = DB::table('barang')
                ->join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->leftJoin('pembeli', 'transaksi_pembelian.id_pembeli', '=', 'pembeli.id_pembeli')
                ->where('barang.id_barang', $id_barang)
                ->select(
                    'komisi.*',
                    'transaksi_pembelian.tanggal_pembelian',
                    'transaksi_pembelian.total_pembayaran',
                    'barang.id_barang',
                    'barang.nama_barang',
                    'barang.harga_barang',
                    'barang.foto_barang',
                    'barang.foto_barang2',
                )->distinct()
                ->get();

            if ($history->isEmpty()) {
                return response()->json([
                    'message' => 'History not found',
                ], 404);
            }

            return response()->json($history, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function showHistoryBarangIdPembeli($id_barang)
    {
        try {
            $history = DB::table('barang')
                ->join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                ->join('transaksi_penitipan', 'detail_transaksi_penitipan.id_transaksi_penitipan', '=', 'transaksi_penitipan.id_transaksi_penitipan')
                ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->leftJoin('penitip', 'transaksi_penitipan.id_penitip', '=', 'penitip.id_penitip')
                ->where('barang.id_barang', $id_barang)
                ->select(
                    'barang.*',
                    'transaksi_pembelian.*',
                    'penitip.nama_penitip',
                )->distinct()
                ->get();

            if ($history->isEmpty()) {
                return response()->json([
                    'message' => 'History not found',
                ], 404);
            }

            return response()->json($history, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showHistoryBarangIdPenitip($id_barang){
        try{
            $history = DB::table('barang')
                        ->join('detail_transaksi_penitipan', 'barang.id_barang', '=', 'detail_transaksi_penitipan.id_barang')
                        ->leftJoin('komisi', 'komisi.id_barang', '=', 'barang.id_barang')
                        ->leftJoin('transaksi_pembelian', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                        ->leftJoin('pembeli', 'transaksi_pembelian.id_pembeli', '=', 'pembeli.id_pembeli')
                        ->where('barang.id_barang', $id_barang)
                        ->select(
                            'barang.*',
                            'detail_transaksi_penitipan.status_penitipan',
                            'komisi.total_harga_bersih',
                            'pembeli.nama_pembeli',
                            'transaksi_pembelian.tanggal_pembelian',
                        )->distinct()
                        ->get();

            if ($history->isEmpty()) {
                return response()->json([
                    'message' => 'History not found',
                ], 404);
            }

            return response()->json($history, 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve history',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
