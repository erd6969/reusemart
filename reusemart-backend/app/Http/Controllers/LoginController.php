<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Pembeli;
use App\Models\Penitip;
use App\Models\Pegawai;


class LoginController
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $pembeli = Pembeli::where('email_pembeli', $credentials['email'])->first();
        if ($pembeli && Hash::check($credentials['password'], $pembeli->password_pembeli)) {
            $token = $pembeli->createToken('auth_token', ["pembeli"])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'pembeli'
            ]);
        }

        $penitip = Penitip::where('email_penitip', $credentials['email'])->first();
        if ($penitip && Hash::check($credentials['password'], $penitip->password_penitip)) {
            $token = $penitip->createToken('auth_token', ["penitip"])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'penitip'
            ]);
        }

        $pegawai = pegawai::where('email_pegawai', $credentials['email'])->first();
        if ($pegawai && Hash::check($credentials['password'], $pegawai->password_pegawai)) {
            $cekJabatan = $pegawai->jabatan->id_jabatan;

            if ($cekJabatan == 1) {
                $token = $pegawai->createToken('auth_token', ["owner"])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'owner'
                ]);
            } else if ($cekJabatan == 2) {
                $token = $pegawai->createToken('auth_token', ["admin"])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'admin'
                ]);
            } else if ($cekJabatan == 3) {
                $token = $pegawai->createToken('auth_token', ["gudang"])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'gudang'
                ]);
            } else if ($cekJabatan == 4) {
                $token = $pegawai->createToken('auth_token', ["kurir"])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'kurir'
                ]);
            } else if ($cekJabatan == 5) {
                $token = $pegawai->createToken('auth_token', ["cs"])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'cs'
                ]);
            } else {

                return response()->json([
                    'message' => 'Jabatan tidak ditemukan'
                ], 404);
            }
        }

        return response()->json([
            'message' => 'Email atau password salah.'
        ], 401);
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }
}