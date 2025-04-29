<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header h1 {
            font-size: 24px;
            color: #333333;
        }
        .email-body {
            font-size: 16px;
            line-height: 1.5;
            color: #555555;
        }
        .email-body p {
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #5cb85c;
            color: #ffffff;
            font-size: 16px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            display: block;
            margin: 0 auto;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Halo {{ $nama }}!</h1>
        </div>
        <div class="email-body">
            <p>Terima kasih telah mendaftar di ReuseMart ! Kami sangat senang menyambut Anda.</p>
            <p>Untuk mereset password Anda, silakan klik tombol di bawah ini:</p>
            <a href="{{ $resetPasswordUrl }}" class="button">Reset Password</a>
            <p>Jika Anda tidak merasa mendaftar, Anda bisa mengabaikan email ini.</p>
        </div>
        <div class="footer">
            <p>Terima kasih telah bergabung dengan kami!<br>
                ReuseMart - Semua hak cipta dilindungi.</p>
        </div>
    </div>
</body>
</html>
