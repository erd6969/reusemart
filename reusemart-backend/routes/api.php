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
use App\Http\Controllers\JabatanController;
use App\Http\Controllers\HunterController;
use App\Http\Controllers\KeranjangController;
use App\Http\Controllers\RequestDonasiController;
use App\Http\Controllers\NotificationController;

Route::post('/send-konfirmasi-email', [EmailController::class, 'sendKonfirmasiEmail']);
Route::post('/reset-password', [LoginController::class, 'resetPassword']);

Route::post('/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'logout']);
Route::post ('/pembeli/register', [PembeliController::class, 'register'])->name('pembeli.register');
Route::post ('/organisasi/register', [OrganisasiController::class, 'register'])->name('organisasi.register');

Route::post('/mobile/login', [LoginController::class, 'loginMobile']);

Route::post('/send-notification', [NotificationController::class, 'sendNotification']);

Route::post('/pegawai/register', [PegawaiController::class, 'register'])->name('pegawai.register');


Route::get('/shop-page', [BarangController::class, 'showAll']);
Route::get('/shop-page/{category}', [BarangController::class, 'showByCategory']);
Route::get('/shop-page/search-barang/{search_barang}', [BarangController::class, 'search']);


Route::get('/detail-barang/{id_barang}', [BarangController::class, 'showDetailBarang']);
Route::get('/penitipByIdTransaksiPenitipan/{idTransaksiPenitipan}', [TransaksiPenitipanController::class, 'getPenitipById']);

Route::get('/diskusi/{id_barang}', [DiskusiController::class, 'show']);
Route::middleware('auth:sanctum')->post('/create-diskusi', [DiskusiController::class, 'store']);

#region Penitip
Route::middleware('auth:penitip')->group(function () {
    Route::get('/penitip/profile', [PenitipController::class, 'showProfile']);
    Route::get('/penitip/show-sold-product', [PenitipController::class, 'showSoldProducts']);
    Route::get('/penitip/show-donated-product', [PenitipController::class, 'showDonatedProducts']);

    Route::get('/penitip/show-detail-pendapatan/{id_barang}', [PenitipController::class, 'showDetailPendapatan']);
});
 #endregion

#region Organisasi
Route::middleware('auth:organisasi')->group(function () {
    Route::get('/show-request-barang', [OrganisasiController::class, 'showByOpenDonasi']);
    Route::get('/organisasi/show-profile', [OrganisasiController::class, 'profile']);
    Route::get('/organisasi/show-waiting', [OrganisasiController::class, 'showWaitingRequestById']);
    Route::get('/organisasi/show-history', [OrganisasiController::class, 'showHistoryRequestById']);
    Route::post('/organisasi/create-req', [OrganisasiController::class, 'createRequestDonasi']);
    Route::post('/organisasi/update-req/{id_organisasi}', [OrganisasiController::class, 'updateRequestDonasi']);
    Route::get('/organisasi/search-req/{search_request}', [OrganisasiController::class, 'SearchRequestDonasi']);
    Route::get('/organisasi/search-histo-req/{search_request}', [OrganisasiController::class, 'SearchHistoryReqDonasi']);
    Route::delete('/organisasi/delete-req/{id_request}', [OrganisasiController::class, 'DeleteRequestDonasi']);
    Route::get('/organisasi/search/{search_organisasi}', [OrganisasiController::class, 'search']);
    Route::delete('/organisasi/delete/{id_organisasi}', [OrganisasiController::class, 'destroy']);
    Route::post('/organisasi/update/{id_organisasi}', [OrganisasiController::class, 'update']);

    Route::get('/organisasi/show-detail-pendapatan/{id_barang}', [OrganisasiController::class, 'showDetailPendapatan']);
});
 #endregion

#region Pembeli
Route::middleware('auth:pembeli')->group(function () {
    Route::post('/pembeli/create-alamat', [AlamatController::class, 'store']);
    Route::get('/pembeli/alamat', [AlamatController::class, 'index']);
    Route::get('/pembeli/show-alamat', [AlamatController::class, 'show']);
    Route::get('/pembeli/show-profile', [PembeliController::class, 'show']);
    Route::get('/pembeli/show-history-purchase', [PembeliController::class, 'showHistoryPurchase']);
    Route::put('/pembeli/update-alamat/{id}', [AlamatController::class, 'update']);
    Route::delete('/pembeli/delete-alamat/{id}', [AlamatController::class, 'destroy']);
    Route::get('/pembeli/search-alamat/{search_alamat}', [AlamatController::class, 'search']);
    Route::put('/pembeli/change-alamat-utama/{id}', [AlamatController::class, 'updateAlamatUtama']);

    Route::post('/pembeli/add-to-cart/{id_barang}', [KeranjangController::class, 'store']);
    Route::get('/pembeli/show-cart', [KeranjangController::class, 'show']);
    Route::delete('/pembeli/delete-cart/{id_keranjang}', [KeranjangController::class, 'destroy']);
    Route::get('/pembeli/check-cart', [KeranjangController::class, 'checkCart']);
    Route::get('pembeli/count-cart', [KeranjangController::class, 'countCart']);
    Route::delete('/pembeli/delete-all-cart', [KeranjangController::class, 'deleteAll']);
});
#endregion


//Pegawai aku hapus middlewarenya, keknya gak perlu. Login cuma kasih rolenya di token. Kalau nested
//middleware pegawai nanti unauthenticated karena tokennya bukan pegawai. Udah cek tembak url juga aman kalau gak bungkus 
//middleware pegawai.

#region Pegawai
Route::middleware('auth:owner')->group(function () {
    Route::get('/request_donasi/show-accept-reject', [RequestDonasiController::class, 'showAcceptReject']);
    Route::get('/request_donasi/show-waiting-request', [RequestDonasiController::class, 'showWaitingRequest']);
    Route::get('/request_donasi/show-by-id/{id_barang}', [RequestDonasiController::class, 'showByIdBarang']);
    Route::get('/request_donasi/searchWaiting/{search_request_donasi}', [RequestDonasiController::class, 'searchWaiting']);
    Route::get('/request_donasi/searchDiterimaDitolak/{search_request_donasi}', [RequestDonasiController::class, 'searchDiterimaDitolak']);
    Route::post('/request_donasi/acceptRequest_donasi', [RequestDonasiController::class, 'acceptRequest_donasi']);
    Route::post('/request_donasi/rejectRequest', [RequestDonasiController::class, 'rejectRequest']);
    
    Route::get('/request_donasi/show-barang-open-donasi', [BarangController::class, 'showBarangByOpenDonasi']);
    Route::get('/request_donasi/searchBarangOpenDonasi/{search_barang}', [BarangController::class, 'searchBarangOpenDonasi']);
    Route::post('/request_donasi/updateRequest-Transaksi-Donasi', [RequestDonasiController::class, 'update']);

    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);

});
Route::middleware('auth:gudang')->group(function () {

});

Route::middleware('auth:cs')->group(function () {
    Route::post ('/penitip/register', [PenitipController::class, 'register'])->name('penitip.register');
    Route::get('/penitip/show-all', [PenitipController::class, 'show']);
    Route::get('/penitip/search/{search_penitip}', [PenitipController::class, 'search']);
    Route::delete('/penitip/delete/{id_penitip}', [PenitipController::class, 'destroy']);
    Route::post('/penitip/update/{id_penitip}', [PenitipController::class, 'update']);

    Route::get('/penitip/show-diskusi-by-date', [DiskusiController::class, 'showDiskusiByDate']);

    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);
});

Route::middleware('auth:admin')->group(function () {
    Route::get('/organisasi/show-all', [OrganisasiController::class, 'show']);
    Route::get('/organisasi/search/{search_organisasi}', [OrganisasiController::class, 'search']);
    Route::delete('/organisasi/delete/{id_organisasi}', [OrganisasiController::class, 'destroy']);
    Route::post('/organisasi/update/{id_organisasi}', [OrganisasiController::class, 'update']);
    
    Route::post('/pegawai/reset-password/{id}', [PegawaiController::class, 'resetPassword']);
    Route::get('/pegawai/search/{search_pegawai}', [PegawaiController::class, 'search']);
    
    Route::post ('/pegawai/register', [PegawaiController::class, 'register'])->name('pegawai.register');
    Route::get('/pegawai/show-all', [PegawaiController::class, 'show']);
    Route::delete('/pegawai/delete/{id_pegawai}', [PegawaiController::class, 'delete']);
    Route::post('/pegawai/update/{id_pegawai}', [PegawaiController::class, 'update']);
    Route::get('/jabatan/show', [JabatanController::class, 'show']);

    Route::get('/hunter/search/{search_hunter}', [HunterController::class, 'searchHunter']);
    Route::post('/hunter/reset-password/{id}', [HunterController::class, 'resetPassword']);

    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);
});
#endregion

