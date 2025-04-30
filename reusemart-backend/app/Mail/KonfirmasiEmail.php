<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class KonfirmasiEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $nama;
    public $verificationUrl;

    public function __construct($data)
    {
        $this->nama = $data['name']; 
        $this->resetPasswordUrl = $data['reset_password_url']; 
    }

    public function build()
    {
        return $this->view('emails.konfirmasi')
                    ->subject('Konfirmasi Email untuk Reset Password')
                    ->with([
                        'nama' => $this->nama,
                        'resetPasswordUrl' => $this->resetPasswordUrl,
                    ]);
    }


}
