<?php

namespace App\Http\Controllers;

use App\Mail\KonfirmasiEmail;
use App\Models\Pembeli;
use App\Models\Penitip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController
{
    public function sendKonfirmasiEmail(Request $request)
    {
        // Cari Pembeli berdasarkan email
        $pembeli = Pembeli::where('email_pembeli', $request->email)->first();
        $penitip = Penitip::where('email_penitip', $request->email)->first();

        if (!$pembeli && !$penitip) {
            return response()->json(['error' => 'Email tidak ditemukan'], 404);
        }

        // URL untuk reset password (akan diarahkan ke frontend React)
        $resetPasswordUrl = env('FRONTEND_URL') . '/auth/reset-password?email=' . urlencode($request->email);

        // Kirimkan email konfirmasi dengan URL reset password
        if($pembeli){
            Mail::to($pembeli->email_pembeli)->send(new KonfirmasiEmail([
                'name' => $pembeli->nama_pembeli,  // Nama pembeli
                'reset_password_url' => $resetPasswordUrl // URL untuk reset password
            ]));
        }else if($penitip){
            Mail::to($penitip->email_penitip)->send(new KonfirmasiEmail([
                'name' => $penitip->nama_penitip,  // Nama penitip
                'reset_password_url' => $resetPasswordUrl // URL untuk reset password
            ]));
        }

        return response()->json([
            'success' => true,
            'message' => 'Email konfirmasi berhasil dikirim']);
    }

}

