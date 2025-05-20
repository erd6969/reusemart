<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\PdfModel;
use App\Models\TransaksiPenitipan;
use App\Models\DetailTransaksiPenitipan;
use App\Models\Barang;
use App\Models\Penitip;
use Illuminate\Support\Facades\Log;

class PdfController
{
    public function generateTransaksiPenitipan($id_transaksi_penitipan)
    {
        $transaksi = TransaksiPenitipan::with(['penitip', 'detailTransaksiPenitipan.barang.pegawai'])->findOrFail($id_transaksi_penitipan);

        log::info('Transaksi Penitipan: ' . json_encode($transaksi));

        $pdf = Pdf::loadView('pdf.nota_transaksi_penitipan', ['transaksi' => $transaksi]);

        return $pdf->stream("nota_penitipan_{$id_transaksi_penitipan}.pdf");
    }

}
