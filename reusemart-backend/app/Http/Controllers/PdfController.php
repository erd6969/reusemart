<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\PdfModel;
use App\Models\DetailTransaksiPenitipan;
use App\Models\TransaksiPenitipan;
use App\Models\TransaksiPembelian;
use App\Models\Kategori;
use App\Models\Barang;
use App\Models\Penitip;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;


class PdfController
{
    public function generateTransaksiPenitipan($id_transaksi_penitipan)
    {
        $transaksi = TransaksiPenitipan::with(['penitip', 'detailTransaksiPenitipan.barang.pegawai'])->findOrFail($id_transaksi_penitipan);

        if (!$transaksi->detailTransaksiPenitipan->count()) {
            return response()->json(['message' => 'Tidak ada detail transaksi penitipan untuk transaksi ini', 'errors' => 'Tidak ada data barang'], 404);
        }

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


    public function generateLaporanPenjualanKategori($tahun)
    {
        // $semuaKategori = Kategori::all();

        // $penjualan = DetailTransaksiPenitipan::with('barang.kategori')
        //     ->whereIn('status_penitipan', ['terjual', 'didonasikan', 'open donasi'])
        //     ->whereYear('tanggal_berakhir', $tahun)
        //     ->get();

        // $kategoriStats = $semuaKategori->map(function ($kategori) use ($penjualan) {
        //     $items = $penjualan->filter(function ($item) use ($kategori) {
        //         return optional($item->barang->kategori)->id_kategori == $kategori->id_kategori;
        //     });

        //     return [
        //         'nama_kategori' => $kategori->nama_kategori,
        //         'terjual' => $items->where('status_penitipan', 'terjual')->count() ?: '-',
        //         'gagal_terjual' => $items->whereIn('status_penitipan', ['Didonasikan', 'open donasi'])->count() ?: '-',
        //     ];
        // });

        // $pdf = Pdf::loadView('pdf.laporan_penjualan_kategori', [
        //     'kategoriStats' => $kategoriStats,
        //     'tahun' => $tahun
        // ]);

        // return response($pdf->output(), 200)
        //     ->header('Content-Type', 'application/pdf')
        //     ->header('Content-Disposition', 'inline; filename="laporan_penjualan_kategori_' . $tahun . '.pdf"');
        $kategoriStats = DB::table(DB::raw('(SELECT id_kategori, nama_kategori FROM kategori WHERE id_kategori % 10 = 0) as k_utama'))
            ->leftJoin('kategori as k', DB::raw('k.id_kategori - (k.id_kategori % 10)'), '=', 'k_utama.id_kategori')
            ->leftJoin('barang as b', 'b.id_kategori', '=', 'k.id_kategori')
            ->leftJoin('detail_transaksi_penitipan as dtp', 'b.id_barang', '=', 'dtp.id_barang')
            ->leftJoin('transaksi_penitipan as ttp', 'dtp.id_transaksi_penitipan', '=', 'ttp.id_transaksi_penitipan')
            ->leftJoin('komisi as kmi', 'b.id_barang', '=', 'kmi.id_barang')
            ->where(function ($query) use ($tahun) {
                $query->whereYear('dtp.tanggal_berakhir', $tahun)
                    ->orWhereNull('dtp.tanggal_berakhir');
            })
            ->select(
                DB::raw('k_utama.nama_kategori as nama_kategori'),
                DB::raw('COUNT(CASE WHEN kmi.id_komisi IS NOT NULL THEN 1 END) as terjual'),
                DB::raw('COUNT(CASE WHEN kmi.id_komisi IS NULL AND dtp.id_barang IS NOT NULL THEN 1 END) as gagal_terjual')
            )
            ->groupBy('k_utama.nama_kategori')
            ->orderBy('k_utama.nama_kategori')
            ->get();


        $pdf = Pdf::loadView('pdf.laporan_penjualan_kategori', [
            'kategoriStats' => $kategoriStats,
            'tahun' => $tahun
        ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_penjualan_kategori_' . $tahun . '.pdf"');
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
            ->whereDate('dtp.tanggal_berakhir', '<=', $today->toDateString())
            ->whereNotIn('dtp.status_penitipan', ['terjual', 'didonasikan', 'open donasi'])
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

        $pdf = PDF::loadView('pdf.laporan_penitip', [
            'laporan' => $laporan,
            'penitip' => $penitip,
            'bulanFilter' => $tanggalFilter,
        ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_penitip.pdf"');
    }

    public function generateLaporanPenjualanKeseluruhan($tahun)
    {
        $bulan_list = [
            '01' => 'Januari',
            '02' => 'Februari',
            '03' => 'Maret',
            '04' => 'April',
            '05' => 'Mei',
            '06' => 'Juni',
            '07' => 'Juli',
            '08' => 'Agustus',
            '09' => 'September',
            '10' => 'Oktober',
            '11' => 'November',
            '12' => 'Desember'
        ];

        Log::info("Generating Laporan Penjualan Keseluruhan untuk tahun: $tahun");


        $laporan = collect($bulan_list)->map(function ($bulan_nama, $bulan_angka) use ($tahun) {
            $id_transaksi_pembelian = DB::table('transaksi_pembelian')
                ->whereYear('tanggal_pembelian', $tahun)
                ->whereMonth('tanggal_pembelian', $bulan_angka)
                ->pluck('id_transaksi_pembelian');

            $jumlah_barang_terjual = DB::table('komisi')
                ->whereIn('id_transaksi_pembelian', $id_transaksi_pembelian)
                ->count();

            $jumlah_penjualan_kotor = DB::table('transaksi_pembelian')
                ->whereYear('tanggal_pembelian', $tahun)
                ->whereMonth('tanggal_pembelian', $bulan_angka)
                ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
                ->sum('komisi.total_harga_kotor');


            return [
                'bulan' => $bulan_nama,
                'jumlah_barang_terjual' => $jumlah_barang_terjual,
                'jumlah_penjualan_kotor' => $jumlah_penjualan_kotor
            ];
        });

        $total_penjualan = DB::table('transaksi_pembelian')
            ->whereYear('tanggal_pembelian', $tahun)
            ->join('komisi', 'transaksi_pembelian.id_transaksi_pembelian', '=', 'komisi.id_transaksi_pembelian')
            ->sum('komisi.total_harga_kotor');

        // $totalBarangTerjual = DB::table('komisi')
        // ->whereIn('id_transaksi_pembelian', function ($query) {
        //     $query->select('id')
        //         ->from('transaksi_pembelian')
        //         ->whereYear('tanggal_pembelian', 2024);
        // })
        // ->count();
        // ini untuk total barang terjual

        $chartData = [
            'labels' => $laporan->pluck('bulan')->toArray(),
            'datasets' => [
                [
                    'label' => 'Penjualan Kotor',
                    'data' => $laporan->pluck('jumlah_penjualan_kotor')->map(function ($val) {
                        return is_numeric($val) ? $val : null;
                    })->toArray(),
                    'backgroundColor' => 'rgba(75, 192, 192, 0.6)',
                ]
            ]
        ];

        $chartConfig = [
            'type' => 'bar',
            'data' => $chartData,
            'options' => [
                'plugins' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Grafik Penjualan Kotor Bulanan'
                    ]
                ],
                'scales' => [
                    'y' => [
                        'beginAtZero' => true
                    ]
                ]
            ]
        ];

        $quickChartUrl = 'https://quickchart.io/chart';
        $encodedConfig = json_encode($chartConfig);
        $chartImageUrl = "$quickChartUrl?c=" . urlencode($encodedConfig);

        // Ambil isi gambar dari QuickChart
        $chartImageContent = file_get_contents($chartImageUrl);

        $grafikStoragePath = 'img/grafik/grafik_penjualan.png';
        Storage::disk('public')->put($grafikStoragePath, $chartImageContent);

        // Ambil base64 untuk dikirim ke view
        $grafikBase64 = null;
        if (Storage::disk('public')->exists($grafikStoragePath)) {
            $grafikBase64 = 'data:image/png;base64,' . base64_encode(Storage::disk('public')->get($grafikStoragePath));
        }

        $laporan->push([
            'bulan' => 'Total',
            'jumlah_barang_terjual' => 'Merge',
            'jumlah_penjualan_kotor' => $total_penjualan
        ]);

        $pdf = Pdf::loadView('pdf.laporan_penjualan_keseluruhan', [
            'laporan' => $laporan,
            'tahun' => $tahun,
            'grafik' => $grafikBase64
        ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_penjualan_' . $tahun . '.pdf"');

    }


    public function generateLaporanKomisi($bulanTahun)
    {
        [$bulan, $tahun] = explode('-', $bulanTahun);

        $laporan = DB::table('komisi as k')
            ->select(
                'k.id_barang',
                'b.nama_barang',
                'tp.total_pembayaran',
                'tpen.tanggal_penitipan',
                'tp.tanggal_pembelian',
                'k.komisi_hunter',
                'k.komisi_reusemart',
                'k.bonus_penitip',
            )
            ->join('barang as b', 'k.id_barang', '=', 'b.id_barang')
            ->join('transaksi_pembelian as tp', 'k.id_transaksi_pembelian', '=', 'tp.id_transaksi_pembelian')
            ->join('detail_transaksi_penitipan as dtp', 'b.id_barang', '=', 'dtp.id_barang')
            ->join('transaksi_penitipan as tpen', 'dtp.id_transaksi_penitipan', '=', 'tpen.id_transaksi_penitipan')
            ->whereMonth('tp.tanggal_pembelian', $bulan)
            ->whereYear('tp.tanggal_pembelian', $tahun)
            ->where(function ($query) {
                $query->where('tp.status_pengiriman', 'sudah sampai')
                    ->orWhere('tp.status_pengiriman', 'sudah diambil');
            })
            ->get();

        Log::info('Laporan Komisi: ' . json_encode($laporan));
        $pdf = Pdf::loadView('pdf.laporan_komisi', ['laporan' => $laporan, 'bulan' => $bulan, 'tahun' => $tahun]);
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_komisi_' . $bulan . '_' . $tahun . '.pdf"');
    }

    public function generateLaporanStokGudang()
    {
        $today = Carbon::now();
        $laporan = TransaksiPenitipan::with(['detailTransaksiPenitipan.barang.hunter', 'penitip'])
            ->whereHas('detailTransaksiPenitipan', function ($query) {
                $query->where('status_penitipan', 'ready jual');
            })
            ->get();
        $pdf = Pdf::loadView('pdf.laporan_stok_gudang', ['laporan' => $laporan]);
        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="laporan_stok_gudang_' . $today->format('Y-m-d') . '.pdf"');
    }

}
