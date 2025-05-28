<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Barang Penitipan Habis</title>
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

    <div class="underline bold">LAPORAN BARANG MASA PENITIPAN HABIS</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>Kode Produk</th>
                <th>Nama Produk</th>
                <th>Id Penitip</th>
                <th>Nama Penitip</th>
                <th>Tanggal Masuk</th>
                <th>Tanggal Akhir</th>
                <th>Batas Ambil</th>
            </tr>
        </thead>
        <tbody>
            @foreach($barangHabis as $bp)
            <tr>
                <td>{{ strtoupper(substr($bp->nama_barang, 0, 1)) }}{{ $bp->id_barang }}</td>
                <td>{{ $bp->nama_barang}}</td>
                <td>T{{ $bp->id_penitip }}</td>
                <td>{{ $bp->nama_penitip }}</td>
                <td>{{ \Carbon\Carbon::parse($bp->tanggal_penitipan)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($bp->tanggal_berakhir)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($bp->tanggal_batas_pengambilan)->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
