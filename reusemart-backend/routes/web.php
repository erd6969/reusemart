<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmailController;

Route::get('/email/verify', [EmailController::class, 'verifyEmail'])->name('verification.link');



