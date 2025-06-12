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

        th,
        td {
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

    <div class="underline bold">Laporan Penjualan Barang Kategori</div>
    <div>Tahun : {{ $tahun }}</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>Kategori</th>
                <th>Jumlah Item Terjual</th>
                <th>Jumlah Item Gagal Terjual</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($kategoriStats as $kategori)
            <tr>
                <td>{{ $kategori->nama_kategori }}</td>
                <td>{{ $kategori->terjual > 0 ? $kategori->terjual : '-' }}</td>
                <td>{{ $kategori->gagal_terjual > 0 ? $kategori->gagal_terjual : '-' }}</td>
            </tr>
            @endforeach

        </tbody>
    </table>

</body>

</html>