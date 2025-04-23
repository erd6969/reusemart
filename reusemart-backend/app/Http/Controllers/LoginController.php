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