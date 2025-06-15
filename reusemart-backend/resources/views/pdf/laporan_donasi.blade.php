<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Donasi Barang</title>
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

    <div class="underline bold">LAPORAN Donasi Barang</div>
    <div>Tahun : {{ \Carbon\Carbon::parse($donasi->first()->tanggal_donasi)->format('Y') }}</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>Kode Produk</th>
                <th>Nama Produk</th>
                <th>Id Penitip</th>
                <th>Nama Penitip</th>
                <th>Tanggal Donasi</th>
                <th>Organisasi</th>
                <th>Nama Penerima</th>
            </tr>
        </thead>
        <tbody>
            
            @foreach($donasi as $d)
            <tr>
                <td>K{{ $d->id_barang }}</td>
                <td>{{ $d->nama_barang }}</td>
                <td>T{{ $d->id_penitip }}</td>
                <td>{{ $d->nama_penitip }}</td>
                <td>{{ \Carbon\Carbon::parse($d->tanggal_donasi)->format('j/n/Y') }}</td>
                <td>{{ $d->nama_organisasi }}</td>
                <td>{{ $d->nama_penerima }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
