<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Pembeli;
use App\Models\Penitip;

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
            return response()->json([
                'message' => 'Login successful',
                'pembeli' => $pembeli,
                // 'token' => $pembeli->createToken('auth_token')->plainTextToken // jika pakai Sanctum
            ]);
        }

        // Coba cari di tabel penitip
        $penitip = Penitip::where('email_penitip', $credentials['email'])->first();
        if ($penitip && Hash::check($credentials['password'], $penitip->password_penitip)) {
            return response()->json([
                'message' => 'Login successful',
                'penitip' => $penitip,
                // 'token' => $penitip->createToken('auth_token')->plainTextToken
            ]);
        }

        return response()->json([
            'message' => 'Email atau password salah.'
        ], 401);
    }
}