<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PembeliController;
use App\Http\Controllers\PenitipController;
use App\Http\Controllers\AlamatController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\TransaksiPenitipanController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\EmailController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\DiskusiController;
use App\Http\Controllers\OrganisasiController;

Route::post('/send-konfirmasi-email', [EmailController::class, 'sendKonfirmasiEmail']);
Route::post('/reset-password', [LoginController::class, 'resetPassword']);

Route::post('/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'logout']);
Route::post ('/pembeli/register', [PembeliController::class, 'register'])->name('pembeli.register');
Route::post ('/pegawai/register', [PegawaiController::class, 'register'])->name('pegawai.register');
Route::post ('/organisasi/register', [OrganisasiController::class, 'register'])->name('organisasi.register');

Route::post('/pegawai/reguister', [PegawaiController::class, 'register'])->name('pegawai.register');


Route::get('/shop-page', [BarangController::class, 'showAll']);
Route::get('/shop-page/{category}', [BarangController::class, 'showByCategory']);
Route::get('/shop-page/search-barang/{search_barang}', [BarangController::class, 'search']);


Route::get('/detail-barang/{id_barang}', [BarangController::class, 'showDetailBarang']);
Route::get('/penitipByIdTransaksiPenitipan/{idTransaksiPenitipan}', [TransaksiPenitipanController::class, 'getPenitipById']);

Route::get('/diskusi/{id_barang}', [DiskusiController::class, 'show']);
Route::middleware('auth:sanctum')->post('/create-diskusi', [DiskusiController::class, 'store']);

#region Penitip
Route::middleware('auth:penitip')->group(function () {
    Route::post ('/penitip/logout', [PenitipController::class, 'logout']);
});
 #endregion

#region Pembeli
Route::middleware('auth:pembeli')->group(function () {
    Route::post('/pembeli/create-alamat', [AlamatController::class, 'store']);
    Route::get('/pembeli/alamat', [AlamatController::class, 'index']);
    Route::get('/pembeli/show-alamat', [AlamatController::class, 'show']);
    Route::put('/pembeli/update-alamat/{id}', [AlamatController::class, 'update']);
    Route::delete('/pembeli/delete-alamat/{id}', [AlamatController::class, 'destroy']);
    Route::get('/pembeli/search-alamat/{search_alamat}', [AlamatController::class, 'search']);
    Route::put('/pembeli/change-alamat-utama/{id}', [AlamatController::class, 'updateAlamatUtama']);
});
#endregion


//Pegawai aku hapus middlewarenya, keknya gak perlu. Login cuma kasih rolenya di token. Kalau nested
//middleware pegawai nanti unauthenticated karena tokennya bukan pegawai. Udah cek tembak url juga aman kalau gak bungkus 
//middleware pegawai.

#region Pegawai
Route::middleware('auth:owner')->group(function () {

});
Route::middleware('auth:gudang')->group(function () {

});

Route::middleware('auth:cs')->group(function () {
    Route::post ('/penitip/register', [PenitipController::class, 'register'])->name('penitip.register');
});

Route::middleware('auth:admin')->group(function () {
    Route::get('/organisasi/show-all', [OrganisasiController::class, 'show']);
    Route::get('/organisasi/search/{search_organisasi}', [OrganisasiController::class, 'search']);
});
#endregion

