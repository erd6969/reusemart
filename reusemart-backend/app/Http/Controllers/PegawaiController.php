<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class PegawaiController
{
    public function register(Request $request){
        try {
            $request->validate([
                'id_jabatan' => 'required|integer|max:5',
                'email_pegawai' => 'required|email|unique:pegawai,email_pegawai',
                'password_pegawai' => 'required|min:8',
                'nama_pegawai' => 'required|string|max:255',
                'tanggal_lahir' => 'required|date',
                'foto_pegawai' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            $foto_pegawai_path = 'blank-profile-picture.jpg';
    
            $pegawai = pegawai::create([
                'id_jabatan' => $request->id_jabatan,
                'email_pegawai' => $request->email_pegawai,
                'password_pegawai' => Hash::make($request->password_pegawai),
                'nama_pegawai' => $request->nama_pegawai,
                'tanggal_lahir' => $request->tanggal_lahir,
                'foto_pegawai' => $foto_pegawai_path,
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
}
