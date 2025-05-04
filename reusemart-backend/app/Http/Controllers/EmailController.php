<?php

namespace App\Http\Controllers;

use App\Mail\KonfirmasiEmail;
use App\Models\Pembeli;
use App\Models\Penitip;
use App\Models\Organisasi;
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
        $organisasi = Organisasi::where('email_organisasi', $email)->first();


        if (!$pembeli && !$penitip && !$organisasi) {
            return response()->json(['error' => 'Email tidak ditemukan'], 404);
        }

        // Generate token dan simpan di DB
        $token = Str::random(64);
        DB::table('password_resets')->updateOrInsert(
            ['email' => $email],
            ['token' => $token, 'created_at' => now()]
        );

        $resetPasswordUrl = 'http://localhost:5173/auth/reset-password?token=' . $token;

        // Kirim Email
        $receiver = $pembeli ?? $penitip ?? $organisasi;
        Mail::to($email)->send(new KonfirmasiEmail([
            'name' => $receiver->nama_pembeli ?? $receiver->nama_penitip ?? $receiver->nama_organisasi,
            'reset_password_url' => $resetPasswordUrl
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Email konfirmasi berhasil dikirim'
        ]);
    }

}

