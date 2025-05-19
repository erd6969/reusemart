<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;
use App\Models\Pegawai;
use App\Models\Hunter;
use App\Models\Kategori;
use App\Models\Penitip;
use App\Models\TransaksiPenitipan;
use App\Models\DetailTransaksiPenitipan;
use Carbon\Carbon;

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
        try{

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

            if($validatedData['nama_hunter'] != null){
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
            if(!$transaksi_penitipan) {
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
        }catch(ValidationException $e){
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        }catch (\Exception $e) {
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

            if($validatedData['nama_hunter'] != null){
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
                ->where('detail_transaksi_penitipan.status_penitipan', '=', 'ready jual')
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

    public function showDetailBarang($id_barang) // ini untuk detail barang page, jadi ada data penitip juga
    {
        try {
            // dd($id_barang);
            $Barang = Barang::where('id_barang', $id_barang)->firstOrFail();
            if (!$Barang) {
                return response()->json(['message' => 'Data Barang tidak ditemukan.'], 404);
            }

            $detailpenitipan = DetailTransaksiPenitipan::where('id_barang', $Barang->id_barang)->first();
            if (!$detailpenitipan) {
                return response()->json(['message' => 'Data Detail Transaksi Penitipan tidak ditemukan'], 404);
            }

            $transaksi_penitipan = TransaksiPenitipan::where('id_transaksi_penitipan', $detailpenitipan->id_transaksi_penitipan)->first();
            // dd($Barang);
            $penitip = Penitip::where('id_penitip', $transaksi_penitipan->id_penitip)->first();
            if (!$penitip) {
                return response()->json(['message' => 'Data Penitip tidak ditemukan'], 404);
            }

            $detailBarangPage = [
                'barang' => $Barang,
                'penitip' => $penitip,
            ];

            return response()->json($detailBarangPage, 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'ERRROR'], 404);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(barang $barang)
    {
        //
    }

    public function search($search_barang){
        try {
            

            $barang = Barang::where(function($query) use ($search_barang) {
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
                'message' => 'Failed to retrieve address',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function searchBarangOpenDonasi($search_barang){
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
                'message' => 'Failed to retrieve address',
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

    public function tambahRating(){
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

            return response()->json($barang, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update rating',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
