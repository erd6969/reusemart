<?php

namespace App\Http\Controllers;

use App\Mail\KonfirmasiEmail;
use App\Models\Pembeli;
use App\Models\Penitip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class EmailController
{
    public function sendKonfirmasiEmail(Request $request)
    {
        $email = $request->email;
        $pembeli = Pembeli::where('email_pembeli', $email)->first();
        $penitip = Penitip::where('email_penitip', $email)->first();

        if (!$pembeli && !$penitip) {
            return response()->json(['error' => 'Email tidak ditemukan'], 404);
        }

        // Generate token dan simpan di DB
        $token = Str::random(64);
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetPasswordUrl = env('FRONTEND_URL') . '/auth/reset-password?token=' . $token;

        // Kirim Email
        $receiver = $pembeli ?? $penitip;
        Mail::to($email)->send(new KonfirmasiEmail([
            'name' => $receiver->nama_pembeli ?? $receiver->nama_penitip,
            'reset_password_url' => $resetPasswordUrl
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Email konfirmasi berhasil dikirim'
        ]);
    }

}

