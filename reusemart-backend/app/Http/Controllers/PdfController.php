<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\PdfModel;
use App\Models\DetailTransaksiPenitipan;
use App\Models\TransaksiPenitipan;
use App\Models\TransaksiPembelian;
use App\Models\Barang;
use App\Models\Penitip;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PdfController
{
    public function generateTransaksiPenitipan($id_transaksi_penitipan)
    {
        $transaksi = TransaksiPenitipan::with(['penitip', 'detailTransaksiPenitipan.barang.pegawai'])->findOrFail($id_transaksi_penitipan);

        log::info('Transaksi Penitipan: ' . json_encode($transaksi));

        $pdf = Pdf::loadView('pdf.nota_transaksi_penitipan', ['transaksi' => $transaksi]);

        return $pdf->stream("nota_penitipan_{$id_transaksi_penitipan}.pdf");
    }

    public function generateTransaksiPembelian($id_transaksi_pembelian)
    {
        $transaksi = TransaksiPembelian::with(['pembeli', 'alamat', 'pegawai', 'komisi.barang.hunter'])->findOrFail($id_transaksi_pembelian);

        log::info('Transaksi Pembelian: ' . json_encode($transaksi));

        $pdf = Pdf::loadView('pdf.nota_transaksi_pembelian', ['transaksi' => $transaksi]);

        return $pdf->stream("nota_pembelian_{$id_transaksi_pembelian}.pdf");
    }

    public function generateLaporanDonasi($bulanTahun)
    {
        [$bulan, $tahun] = explode('-', $bulanTahun);

        $donasi = DB::table('barang as B')
            ->distinct()
            ->join('detail_transaksi_penitipan as DTP', 'B.id_barang', '=', 'DTP.id_barang')
            ->join('transaksi_penitipan as TPEN', 'TPEN.id_transaksi_penitipan', '=', 'DTP.id_transaksi_penitipan')
            ->join('penitip as P', 'P.id_penitip', '=', 'TPEN.id_penitip')
            ->join('transaksi_donasi as TD', 'B.id_barang', '=', 'TD.id_barang')
            ->join('request_donasi as RQ', 'RQ.id_request_donasi', '=', 'TD.id_request_donasi')
            ->join('organisasi as O', 'O.id_organisasi', '=', 'RQ.id_organisasi')
            ->whereMonth('TD.tanggal_donasi', $bulan)
            ->whereYear('TD.tanggal_donasi', $tahun)
            ->select(
                'B.id_barang',
                'B.nama_barang',
                'P.id_penitip',
                'P.nama_penitip',
                'TD.tanggal_donasi',
                'O.nama_organisasi',
                'TD.nama_penerima'
            )
            ->get();

        Log::info('Laporan Donasi: ' . json_encode($donasi));

        $pdf = Pdf::loadView('pdf.laporan_donasi', ['donasi' => $donasi]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_donasi_' . $bulan . '_' . $tahun . '.pdf"');
    }

    public function generateLaporanRequestDonasi()
    {
        $requestDonasi = DB::table('organisasi as o')
            ->select('o.id_organisasi', 'o.nama_organisasi', 'o.alamat_organisasi', 'rq.detail_request')
            ->distinct()
            ->join('request_donasi as rq', 'o.id_organisasi', '=', 'rq.id_organisasi')
            ->where('rq.status_request', 'waiting')
            ->get();

        Log::info('Laporan Request Donasi: ' . json_encode($requestDonasi));
        $pdf = Pdf::loadView('pdf.laporan_request_donasi', ['requestDonasi' => $requestDonasi]);
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_request_donasi.pdf"');
    }
    public function generateLaporanBarangHabis()
    {
        $today = Carbon::now();
        $barangHabis = DB::table('penitip as p')
            ->distinct()
            ->join('transaksi_penitipan as tpen', 'p.id_penitip', '=', 'tpen.id_penitip')
            ->join('detail_transaksi_penitipan as dtp', 'tpen.id_transaksi_penitipan', '=', 'dtp.id_transaksi_penitipan')
            ->join('barang as b', 'dtp.id_barang', '=', 'b.id_barang')
            ->whereMonth('dtp.tanggal_berakhir', $today->month)
            ->whereYear('dtp.tanggal_berakhir', $today->year)
            ->whereDate('dtp.tanggal_berakhir', '<=', $today->toDateString())
            ->select(
                'b.id_barang',
                'b.nama_barang',
                'p.id_penitip',
                'p.nama_penitip',
                'tpen.tanggal_penitipan',
                'dtp.tanggal_berakhir',
                'dtp.tanggal_batas_pengambilan',

            )
            ->get();



        Log::info('Laporan Barang Penitip Habis: ' . json_encode($barangHabis));
        $pdf = Pdf::loadView('pdf.laporan_barang_habis', ['barangHabis' => $barangHabis]);
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_request_donasi.pdf"');
    }

    public function generateLaporanPenitip($id_penitip, $bulanTahun)
    {
        [$bulan, $tahun] = explode('-', $bulanTahun);

        $laporan = DB::table('barang as b')
            ->select(
                'b.id_barang',
                'b.nama_barang',
                'tpen.tanggal_penitipan',
                'tpem.tanggal_pembelian',
                'k.total_harga_bersih',
                'k.bonus_penitip',
                DB::raw('(k.total_harga_bersih + k.bonus_penitip) as pendapatan')
            )
            ->distinct()
            ->join('detail_transaksi_penitipan as dtp', 'b.id_barang', '=', 'dtp.id_barang')
            ->join('transaksi_penitipan as tpen', 'tpen.id_transaksi_penitipan', '=', 'dtp.id_transaksi_penitipan')
            ->join('penitip as p', 'p.id_penitip', '=', 'tpen.id_penitip')
            ->join('komisi as k', 'b.id_barang', '=', 'k.id_barang')
            ->join('transaksi_pembelian as tpem', 'tpem.id_transaksi_pembelian', '=', 'k.id_transaksi_pembelian')
            ->where('p.id_penitip', $id_penitip)
            ->whereMonth('tpem.tanggal_pembelian', $bulan)
            ->whereYear('tpem.tanggal_pembelian', $tahun)
            ->where('dtp.status_penitipan', 'terjual')
            ->get();

        $penitip = DB::table('penitip')->where('id_penitip', $id_penitip)->first();

        $tanggalFilter = \Carbon\Carbon::createFromDate($tahun, $bulan, 1);

        $pdf = \PDF::loadView('pdf.laporan_penitip', [
            'laporan' => $laporan,
            'penitip' => $penitip,
            'bulanFilter' => $tanggalFilter,
        ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_penitip.pdf"');
    }



}
