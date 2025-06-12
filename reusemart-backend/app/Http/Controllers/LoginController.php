<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Pembeli;
use App\Models\Penitip;
use App\Models\Pegawai;
use App\Models\Organisasi;
use App\Models\Hunter;
use Illuminate\Support\Facades\DB;

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

        $hunter = Hunter::where('email_hunter', $credentials['email'])->first();
        if ($hunter && Hash::check($credentials['password'], $hunter->password_hunter)) {
            $token = $hunter->createToken('auth_token', ["hunter"])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'hunter'
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

        $organisasi = Organisasi::where('email_organisasi', $credentials['email'])->first();
        if ($organisasi && Hash::check($credentials['password'], $organisasi->password_organisasi)) {
            $token = $organisasi->createToken('auth_token', ["organisasi"])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'organisasi'
            ]);
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

    public function logoutMobile(Request $request)
    {
        $user = $request->user();

        // Hapus FCM token
        $user->fcm_token = null;
        $user->save();

        // Hapus token akses saat ini
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful'
        ]);
    }


    // Fungsi untuk reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:8|confirmed',
        ]);

        $resetRecord = DB::table('password_resets')->where('token', $request->token)->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Token tidak valid atau sudah kadaluarsa.'], 400);
        }

        // Coba cari pembeli dulu
        $pembeli = Pembeli::where('email_pembeli', $resetRecord->email)->first();
        if ($pembeli) {
            $pembeli->password_pembeli = Hash::make($request->password);
            $pembeli->save();
        } else {
            // Coba cari penitip
            $penitip = Penitip::where('email_penitip', $resetRecord->email)->first();
            if ($penitip) {
                $penitip->password_penitip = Hash::make($request->password);
                $penitip->save();
            } else {
                $organisasi = Organisasi::where('email_organisasi', $resetRecord->email)->first();
                if ($organisasi) {
                    $organisasi->password_organisasi = Hash::make($request->password);
                    $organisasi->save();
                } else {
                    return response()->json(['message' => 'Email tidak ditemukan.'], 404);
                }
            }
        }

        // Hapus token setelah digunakan
        DB::table('password_resets')->where('email', $resetRecord->email)->delete();

        return response()->json(['message' => 'Password berhasil diperbarui.']);
    }

    public function loginMobile(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'fcm_token' => 'nullable|string',  // token FCM opsional
        ]);

        $fcmToken = $credentials['fcm_token'] ?? null;

        // Cek Pembeli
        $pembeli = Pembeli::where('email_pembeli', $credentials['email'])->first();
        if ($pembeli && Hash::check($credentials['password'], $pembeli->password_pembeli)) {
            $pembeli->fcm_token = $fcmToken;
            $pembeli->save();

            $token = $pembeli->createToken('auth_token', ['pembeli'])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'pembeli',
                'user' => $pembeli
            ]);
        }

        // Cek Penitip
        $penitip = Penitip::where('email_penitip', $credentials['email'])->first();
        if ($penitip && Hash::check($credentials['password'], $penitip->password_penitip)) {
            $penitip->fcm_token = $fcmToken;
            $penitip->save();

            $token = $penitip->createToken('auth_token', ['penitip'])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'penitip',
                'user' => $penitip
            ]);
        }

        // Cek Hunter
        $hunter = Hunter::where('email_hunter', $credentials['email'])->first();
        if ($hunter && Hash::check($credentials['password'], $hunter->password_hunter)) {
            $hunter->fcm_token = $fcmToken;
            $hunter->save();

            $token = $hunter->createToken('auth_token', ['hunter'])->plainTextToken;
            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => 'hunter',
                'user' => $hunter
            ]);
        }

        // Cek Kurir
        $pegawai = Pegawai::where('email_pegawai', $credentials['email'])->first();
        if ($pegawai && Hash::check($credentials['password'], $pegawai->password_pegawai)) {
            if ($pegawai->jabatan->id_jabatan == 4) {
                $pegawai->fcm_token = $fcmToken;
                $pegawai->save();

                $token = $pegawai->createToken('auth_token', ['kurir'])->plainTextToken;
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'role' => 'kurir',
                    'user' => $pegawai
                ]);
            }
        }

        return response()->json([
            'message' => 'Email atau password salah, atau role tidak diizinkan di mobile.'
        ], 401);
    }
}
