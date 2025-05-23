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
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>ID Organisasi</th>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Request</th>
            </tr>
        </thead>
        <tbody>
            @foreach($requestDonasi as $rd)
            <tr>
                <td>ORG{{ $rd->id_organisasi }}</td>
                <td>{{ $rd->nama_organisasi }}</td>
                <td>{{ $rd->alamat_organisasi }}</td>
                <td>{{ $rd->detail_request }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
