<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembeliController;
use App\Http\Controllers\AlamatController;

Route::post ('/pembeli/register', [PembeliController::class, 'register']);
Route::post ('/pembeli/login', [PembeliController::class, 'login']);
Route::post ('/pembeli/logout', [PembeliController::class, 'logout'])->middleware('auth:pembeli');

Route::middleware('auth:pembeli')->group(function () {
    Route::post('/pembeli/create-alamat', [AlamatController::class, 'store']);
    Route::get('/pembeli/alamat', [AlamatController::class, 'index']);
    Route::get('/pembeli/show-alamat', [AlamatController::class, 'show']);
    Route::put('/pembeli/update-alamat/{id}', [AlamatController::class, 'update']);
    Route::delete('/pembeli/delete-alamat/{id}', [AlamatController::class, 'destroy']);
    Route::get('/pembeli/search-alamat/{id}', [AlamatController::class, 'search']);
    Route::put('/pembeli/change-alamat-utama/{id}', [AlamatController::class, 'updateAlamatUtama']);
});
