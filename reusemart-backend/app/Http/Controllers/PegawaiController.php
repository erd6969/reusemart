<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\TransaksiPembelian;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PegawaiController
{
    public function register(Request $request){
        try {
            $request->validate([
                'id_jabatan' => 'required|integer|max:5',
                'email_pegawai' => 'required|email|unique:pegawai,email_pegawai|unique:penitip,email_penitip|unique:organisasi,email_organisasi|unique:hunter,email_hunter|unique:pembeli,email_pembeli',
                'password_pegawai' => 'required|min:8',
                'nama_pegawai' => 'required|string|max:255',
                'tanggal_lahir' => 'required|date',
                'foto_pegawai' => 'nullable|image|mimes:jpeg,png,jpg,gif'
            ]);

            $foto_pegawai_path = 'blank-pegawai-profile-pict.png';

            if ($request->hasFile('foto_pegawai')) {
                $file = $request->file('foto_pegawai');
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('img/Pegawai', $filename, 'public');
                $foto_pegawai = $filename; 
            } else {
                $foto_pegawai = $foto_pegawai_path;
            }
    
            $pegawai = pegawai::create([
                'id_jabatan' => $request->id_jabatan,
                'email_pegawai' => $request->email_pegawai,
                'password_pegawai' => Hash::make($request->password_pegawai),
                'nama_pegawai' => $request->nama_pegawai,
                'tanggal_lahir' => $request->tanggal_lahir,
                'foto_pegawai' => $foto_pegawai,
            ]);
    
            return response()->json([
                'message' => 'Registrasi berhasil',
                'pegawai' => $pegawai,
            ], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registrasi gagal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function resetPassword($id){
        try{
            $pegawai = Pegawai::where('id_pegawai', $id)->first();
            if (!$pegawai) {
                return response()->json([
                    'message' => 'Pegawai tidak ditemukan',
                ], 404);
            }
    
            $newPassword = $pegawai->tanggal_lahir;
            $pegawai->password_pegawai = Hash::make($newPassword);
            $pegawai->save();
    
            return response()->json([
                'message' => 'Password berhasil direset',
                'new_password' => $newPassword,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mereset password',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function search($search_pegawai){
        try {
            if(empty($search_pegawai)) {
                return response()->json([
                    'message' => 'Search query is empty.',
                ], 400); // Return a bad request if search query is empty
            }
    
            $pegawai = Pegawai::where('nama_pegawai', 'like', '%' . $search_pegawai . '%')
                ->join('jabatan', 'pegawai.id_jabatan', '=', 'jabatan.id_jabatan')
                ->select('pegawai.*', 'jabatan.nama_jabatan')
                ->get();
    
            if ($pegawai->isEmpty()) {
                return response()->json([
                    'message' => 'Pegawai tidak ditemukan.',
                ], 404);
            }
    
            return response()->json($pegawai, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mencari pegawai',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(){
        try {
            return response()->json(Pegawai::paginate(10), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data pegawai',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    public function delete($id){
        try {
            $pegawai = Pegawai::findOrFail($id);
            $pegawai->delete();

            return response()->json([
                'message' => 'Pegawai berhasil dihapus',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus pegawai',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id_pegawai)
    {
        try {
            $pegawai = Pegawai::find($id_pegawai);
            if (!$pegawai) {
                return response()->json(['message' => 'Pegawai not found'], 404);
            }
    
            $validatedData = $request->validate([
                'email_pegawai' => 'required|email|unique:pegawai,email_pegawai,' . $id_pegawai . ',id_pegawai',
                'nama_pegawai' => 'required|string|max:255',
                'tanggal_lahir' => 'required|string|max:15',
                'id_jabatan' => 'required|integer|max:5',
                'foto_pegawai' => 'nullable|image|mimes:jpeg,png,jpg,gif'
            ]);

            
            $updateData = [
                'email_pegawai' => $validatedData['email_pegawai'],
                'nama_pegawai' => $validatedData['nama_pegawai'],
                'tanggal_lahir' => $validatedData['tanggal_lahir'],
                'id_jabatan' => $validatedData['id_jabatan'],
            ];
            
            Log::info($request->all());

            if ($request->hasFile('foto_pegawai')) {
                $image = $request->file('foto_pegawai');
                $uploadFolder = 'img/Pegawai';
                $image_uploaded_path = $image->store($uploadFolder, 'public');
                $uploadedImageResponse = basename($image_uploaded_path);
    
                // Menghapus foto lama jika ada
                if ($pegawai->foto_pegawai && Storage::disk('public')->exists($uploadFolder . '/' . $pegawai->foto_pegawai)) {
                    Storage::disk('public')->delete($uploadFolder . '/' . $pegawai->foto_pegawai);
                }
    
                // Update foto pegawai
                $updateData['foto_pegawai'] = $uploadedImageResponse;
            }
    
            $pegawai->update($updateData);
    
            return response()->json([
                'message' => 'Pegawai updated successfully',
                'data' => $pegawai
            ]);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update pegawai',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function showProfile(){
        try {
            $pegawai = Auth::guard()->user();
            if (!$pegawai) {
                return response()->json(['message' => 'Pegawai not found'], 404);
            }
    
            return response()->json($pegawai, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data pegawai',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getListKurir()
    {
        $kurir = Pegawai::where('id_jabatan', 4)->get(['id_pegawai', 'nama_pegawai']);
        return response()->json($kurir, 200);
    }


    public function searchByNama($nama_pegawai)
    {
        $pegawai = Pegawai::where('nama_pegawai', 'like', '%' . $nama_pegawai . '%')
            ->join('jabatan', 'pegawai.id_jabatan', '=', 'jabatan.id_jabatan')
            ->where('pegawai.id_jabatan', '=', 3) // iki tanda nya pegawai gudang
            ->select('pegawai.id_pegawai', 'pegawai.nama_pegawai', 'jabatan.nama_jabatan')
            ->get();

        if ($pegawai->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pegawai not found',
            ], 404);
        }

        return response()->json($pegawai);
    }

    public function getJumlahPengantaranKurir()
    {
        try {
            $pegawai = Auth::guard()->user();
            if (!$pegawai) {
                return response()->json(['message' => 'Pegawai not found'], 404);
            }

            $jumlahPengantaran = TransaksiPembelian::where('id_pegawai', $pegawai->id_pegawai)
                ->where('status_pengiriman', '=', 'sudah sampai')
                ->count();

            return response()->json([
                'count' => $jumlahPengantaran,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil jumlah pengantaran',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
