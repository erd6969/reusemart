<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Komisi Bulanan</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }
        h2 {
            margin-bottom: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td {
            border: 1px solid black;
            padding: 6px;
            text-align: left;
        }
        .no-border {
            border: none;
        }
        .header {
            margin-bottom: 10px;
        }
        .bold {
            font-weight: bold;
        }
        .underline {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="bold">ReUse Mart</div>
        <div>Jl. Green Eco Park No. 456 Yogyakarta</div>
    </div>

    <div class="underline bold">LAPORAN STOK GUDANG</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>Kode Produk</th>
                <th>Nama Produk</th>
                <th>ID Penitip</th>
                <th>Nama Penitip</th>
                <th>Tanggal Masuk</th>
                <th>Perpanjangan</th>
                <th>ID Hunter</th>
                <th>Nama Hunter</th>
                <th>Harga</th>
            </tr>
        </thead>
        <tbody>
            @foreach($laporan as $lap)
                @foreach($lap->detailTransaksiPenitipan as $detail)
                    <tr>
                        <td>B{{ $detail['barang']->id_barang }}</td>
                        <td>{{ $detail['barang']->nama_barang }}</td>
                        <td>{{ $lap->id_penitip }}</td>
                        <td>{{ $lap->penitip->nama_penitip }}</td>
                        <td>{{ \Carbon\Carbon::parse($lap->tanggal_penitipan)->format('j F Y') }}</td>
                        <td>{{ $detail->status_perpanjangan ? 'Ya' : 'Tidak' }}</td>
                        <td>{{ $detail['barang']->id_hunter ? $detail['barang']->id_hunter : '' }}</td>
                        <td>{{ $detail['barang']->hunter->nama_hunter ?? '-' }}</td>
                        <td>{{ number_format($detail['barang']->harga_barang, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            @endforeach
        </tbody>
    </table>
</body>
</html>
