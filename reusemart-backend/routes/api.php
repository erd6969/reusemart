<?php

use App\Http\Controllers\MerchandiseController;
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
use App\Http\Controllers\DetailTransaksiPenitipanController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\TransaksiMerchandiseController;

use App\Http\Controllers\KomisiController;
use App\Http\Controllers\TransaksiPembelianController;
use App\Http\Controllers\PdfController;

Route::get('/get-kabupaten', [AlamatController::class, 'GetKabupaten']);
Route::get('/get-kecamatan/{id_kabupaten}', [AlamatController::class, 'GetKecamatan']);
Route::get('/get-kelurahan/{id_kecamatan}', [AlamatController::class, 'GetKelurahan']);

Route::post('/send-konfirmasi-email', [EmailController::class, 'sendKonfirmasiEmail']);
Route::post('/reset-password', [LoginController::class, 'resetPassword']);

Route::post('/login', [LoginController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/logout-mobile', [LoginController::class, 'logoutMobile']);
Route::post('/pembeli/register', [PembeliController::class, 'register'])->name('pembeli.register');
Route::post('/organisasi/register', [OrganisasiController::class, 'register'])->name('organisasi.register');

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
Route::get('/penitip/get-top-seller', [PenitipController::class, 'getTopSeller']);
#region Penitip
Route::middleware('auth:penitip')->group(function () {
    Route::get('/penitip/profile', [PenitipController::class, 'showProfile']);
    Route::get('/penitip/show-sold-product', [PenitipController::class, 'showSoldProducts']);
    Route::get('/penitip/show-on-sale', [PenitipController::class, 'showOnSaleProducts']);
    Route::get('/penitip/show-donated-product', [PenitipController::class, 'showDonatedProducts']);
    Route::get('/penitip/show-extend-product', [PenitipController::class, 'showExtendProducts']);
    Route::post('/penitip/extend-barang', [PenitipController::class, 'extendBarangPenitip']);
    Route::post('/penitip/ambil-barang', [PenitipController::class, 'pengambilanBarang']);
    Route::get('/penitip/search-donasi/{search_barang}', [PenitipController::class, 'searchBarangDonasi']);
    Route::get('/penitip/search-extend/{search_barang}', [PenitipController::class, 'searchBarangExtend']);
    Route::get('/penitip/search-jual/{search_barang}', [PenitipController::class, 'searchBarangJual']);
    Route::get('/penitip/search-terjual/{search_barang}', [PenitipController::class, 'searchBarangTerjual']);
    Route::get('/penitip/show-detail-pendapatan/{id_barang}', [PenitipController::class, 'showDetailPendapatan']);
    Route::get('/detail-donasi/{id_barang}', [BarangController::class, 'showDetailBarangDonasi']);
    Route::get('/penitip/show-history-penitipan', [PenitipController::class, 'showHistoryPenitipan']);
    Route::get('/penitip/show-detail-history/{id_barang}', [BarangController::class, 'showHistoryBarangIdPenitip']);
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

    Route::get('/pembeli/get-alamat-utama', [AlamatController::class, 'getAlamatUtama']);
    Route::get('/pembeli/get-alamat-by-id/{id}', [AlamatController::class, 'getAlamatById']);

    Route::post('/pembeli/add-point/{poin}', [PembeliController::class, 'addPoint']);
    Route::post('/pembeli/reduce-point/{poin}', [PembeliController::class, 'reducePoint']);
    Route::get('/pembeli/show-merchandise', [MerchandiseController::class, 'showAll']);
    Route::post('/pembeli/create-komisi/{id_barang}', [KomisiController::class, 'createKomisi']);
    Route::post('/pembeli/create-merchandise/{id_merchandise}', [TransaksiMerchandiseController::class, 'createTransaksiMerchandise']);
    // Route::get('/pembeli/get-komponen-komisi/{id_barang}', [KomisiController::class, 'getKomponenKomisi']);

    Route::post('/pembeli/create-transaksi-pembelian', [TransaksiPembelianController::class, 'createTransaksiPembelian']);
    Route::get('/pembeli/show-transaksi-pembelian', [TransaksiPembelianController::class, 'showTransaksiPembelian']);
    Route::post('/pembeli/cancel-transaksi-pembelian', [TransaksiPembelianController::class, 'cancelTransaksiPembelian']);
    Route::post('/pembeli/finalize-transaksi-pembelian', [TransaksiPembelianController::class, 'finalizeTransaksiPembelian']);

    Route::get('/pembeli/show-unpaid-purchase', [PembeliController::class, 'showUnpaidPurchase']);
    Route::get('/pembeli/show-verification-purchase', [PembeliController::class, 'showVerificationPurchase']);
    Route::post('/pembeli/tambah-rating', [BarangController::class, 'tambahRating']);
    Route::get('/pembeli/show-all-history-pembelian', [PembeliController::class, 'showAllHistoryPembelian']);
    Route::get('/pembeli/show-detail-history/{id_barang}', [BarangController::class, 'showHistoryBarangIdPembeli']);
    Route::post('/pembeli/history-pembelian-by-tanggal', [PembeliController::class, 'showHistoryPembelianByTanggal']);
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

    Route::get('/laporan-donasi/{bulanTahun}', [PdfController::class, 'generateLaporanDonasi']);
    Route::get('/laporan-kategori/{tahun}', [PdfController::class, 'generateLaporanPenjualanKategori']);
    Route::get('/laporan-request-donasi', [PdfController::class, 'generateLaporanRequestDonasi']);
    Route::get('/laporan-barang-habis', [PdfController::class, 'generateLaporanBarangHabis']);
    Route::get('/laporan-transaksi-penitip/{id_penitip}/{bulanTahun}', [PdfController::class, 'generateLaporanPenitip']);
    Route::get('/laporan-penjualan-keseluruhan/{tahun}', [PdfController::class, 'generateLaporanPenjualanKeseluruhan']);
    Route::get('/laporan-komisi-bulanan/{bulanTahun}', [PdfController::class, 'generateLaporanKomisi']);
    Route::get('/laporan-stok-gudang', [PdfController::class, 'generateLaporanStokGudang']);

});
Route::middleware('auth:gudang')->group(function () {
    Route::get('/transaksi-penitipan-pdf/{id_transaksi_penitipan}', [PdfController::class, 'generateTransaksiPenitipan']);
    Route::get('/transaksi-pembelian-pdf/{id_transaksi_pembelian}', [PdfController::class, 'generateTransaksiPembelian']);
    Route::get('/pegawai-gudang/get-kurir', [PegawaiController::class, 'getListKurir']);
    Route::post('/transaksi_penitipan/create', [TransaksiPenitipanController::class, 'create']);
    Route::get('/transaksi_penitipan/show-all', [TransaksiPenitipanController::class, 'show']);
    Route::get('/pegawai-gudang/show-ambil', [BarangController::class, 'showAmbilProducts']);
    Route::get('/pegawai-gudang/show-pengiriman', [BarangController::class, 'showPengirimanProducts']);
    Route::get('/transaksi_penitipan/show-by-id/{id}', [TransaksiPenitipanController::class, 'showById']);
    Route::get('/transaksi_penitipan/search/{search_data}', [TransaksiPenitipanController::class, 'search']);
    Route::get('/detail_transaksi_penitipan/showByIdTP/{id}', [DetailTransaksiPenitipanController::class, 'show']);
    Route::delete('/detail_transaksi_penitipan/deleteWithBarang/{id}', [DetailTransaksiPenitipanController::class, 'deleteWithBarang']);
    Route::get('/penitip/searchByEmail/{search_penitip}', [PenitipController::class, 'searchByEmail']);
    Route::post('/transaksi_penitipan/update/{id}', [TransaksiPenitipanController::class, 'update']);
    Route::post('/barang/create', [BarangController::class, 'create']);
    Route::post('/barang/update', [BarangController::class, 'update']);
    Route::get('/kategori/search/{nama_kategori}', [KategoriController::class, 'searchByName']);
    Route::get('/pegawai-gudang/searchPegawai/{search_pegawai}', [PegawaiController::class, 'searchBynama']);
    Route::post('/pegawai-gudang/verif-ambil', [BarangController::class, 'VerifyAmbilBarangPenitip']);
    Route::post('/pegawai-gudang/verif-kirim-pembeli', [BarangController::class, 'VerifyPengirimanBarangPembeli']);
    Route::post('/pegawai-gudang/verif-pengambilan-pembeli', [BarangController::class, 'VerifyPengambilanPembeli']);
    Route::post('/pegawai-gudang/verif-ambil-pembeli/{id}', [BarangController::class, 'VerifyAmbilBarangPembeli']);
    Route::get('/pegawai-gudang/search-verif/{search_barang}', [BarangController::class, 'SearchAmbilProducts']);
    Route::get('/pegawai-gudang/search-pengiriman/{search_barang}', [BarangController::class, 'SearchPengirimanProducts']);
    Route::get('/hunter/search/{search_hunter}', [HunterController::class, 'searchHunter']);
    Route::get('/hitung-komisi/{id}', [BarangController::class, 'getKomisiPembelian']);
});

Route::middleware('auth:cs')->group(function () {
    Route::post('/penitip/register', [PenitipController::class, 'register'])->name('penitip.register');
    Route::get('/penitip/show-all', [PenitipController::class, 'show']);
    Route::get('/penitip/search/{search_penitip}', [PenitipController::class, 'search']);
    Route::delete('/penitip/delete/{id_penitip}', [PenitipController::class, 'destroy']);
    Route::post('/penitip/update/{id_penitip}', [PenitipController::class, 'update']);

    Route::get('/penitip/show-diskusi-by-date', [DiskusiController::class, 'showDiskusiByDate']);

    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);

    Route::get('/barang/show-unverified-barang', [TransaksiPembelianController::class, 'showUnverifiedTransaksiPembelian']);
    Route::get('/barang/show-detail-modal/{id_barang}', [TransaksiPembelianController::class, 'showDataModal']);
    Route::post('/transaksi-pembelian/verify-transaksi-pembelian', [TransaksiPembelianController::class, 'verifyTransaksiPembelian']);
    Route::post('/transaksi-pembelian/reject-transaksi-pembelian', [TransaksiPembelianController::class, 'rejectTransaksiPembelian']);

    Route::get('/transaksi-merchandise/show-all', [TransaksiMerchandiseController::class, 'showAll']);
    Route::post('/transaksi-merchandise/set-transaksi-merchandise', [TransaksiMerchandiseController::class, 'setTransaksiMerchandise']);
});

Route::middleware('auth:admin')->group(function () {
    Route::get('/organisasi/show-all', [OrganisasiController::class, 'show']);
    Route::get('/organisasi/search/{search_organisasi}', [OrganisasiController::class, 'search']);
    Route::delete('/organisasi/delete/{id_organisasi}', [OrganisasiController::class, 'destroy']);
    Route::post('/organisasi/update/{id_organisasi}', [OrganisasiController::class, 'update']);

    Route::post('/pegawai/reset-password/{id}', [PegawaiController::class, 'resetPassword']);
    Route::get('/pegawai/search/{search_pegawai}', [PegawaiController::class, 'search']);

    Route::post('/pegawai/register', [PegawaiController::class, 'register'])->name('pegawai.register');
    Route::get('/pegawai/show-all', [PegawaiController::class, 'show']);
    Route::delete('/pegawai/delete/{id_pegawai}', [PegawaiController::class, 'delete']);
    Route::post('/pegawai/update/{id_pegawai}', [PegawaiController::class, 'update']);
    Route::get('/jabatan/show', [JabatanController::class, 'show']);

    Route::get('/hunter/search/{search_hunter}', [HunterController::class, 'searchHunter']);
    Route::post('/hunter/reset-password/{id}', [HunterController::class, 'resetPassword']);

    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);
});

Route::middleware('auth:kurir')->group(function () {
    Route::get('/pegawai/show-profile', [PegawaiController::class, 'showProfile']);
    Route::get('/kurir/count-pengiriman', [PegawaiController::class, 'getJumlahPengantaranKurir']);

    Route::get('/kurir/histori-pengiriman/{tanggal}', [TransaksiPembelianController::class, 'getHistoriPengirimanKurir']);
    Route::get('/kurir/list-pengiriman', [TransaksiPembelianController::class, 'getListPengiriman']);

    Route::post('/kurir/update-status-pengiriman', [TransaksiPembelianController::class, 'changeStatusPengiriman']);
});
#endregion

Route::middleware('auth:hunter')->group(function () {
    Route::get('/hunter/show-profile', [HunterController::class, 'showProfile']);
    Route::get('/hunter/history', [HunterController::class, 'historyHunter']);
    Route::get('/hunter/show-detail-history/{id_barang}', [BarangController::class, 'showHistoryBarangIdHunter']);

});


