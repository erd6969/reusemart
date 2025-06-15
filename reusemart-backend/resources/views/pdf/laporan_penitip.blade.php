<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Laporan Transaksi Penitip</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .header {
            text-align: left;
            margin-bottom: 20px;
        }
        .header h3 {
            margin-bottom: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .total-row td {
            font-weight: bold;
        }
    </style>
</head>
<body>

<div class="header">
    <strong>ReUse Mart</strong><br>
    Jl. Green Eco Park No. 456 Yogyakarta<br><br>

    <strong>LAPORAN TRANSAKSI PENITIP</strong><br>
    ID Penitip: T{{ $penitip->id_penitip ?? '-' }}<br>
    Nama Penitip: {{ $penitip->nama_penitip ?? '-' }}<br>
    Bulan: {{ $bulanFilter->translatedFormat('F') }}<br>
    Tahun: {{ $bulanFilter->format('Y') }}<br>
    Tanggal cetak: {{ \Carbon\Carbon::now()->format('d F Y') }}

</div>

<table>
    <thead>
        <tr>
            <th>Kode Produk</th>
            <th>Nama Produk</th>
            <th>Tanggal Masuk</th>
            <th>Tanggal Laku</th>
            <th>Harga Jual Bersih<br>(sudah dipotong Komisi)</th>
            <th>Bonus terjual cepat</th>
            <th>Pendapatan</th>
        </tr>
    </thead>
    <tbody>
        @php
            $total_bersih = 0;
            $total_bonus = 0;
            $total_pendapatan = 0;
        @endphp
        @if($laporan->isEmpty())
            <tr>
                <td colspan="7" class="no-border">Tidak ada data.</td>
            </tr>
        @else

        
        @foreach ($laporan as $item)
        @php
                $total_bersih += $item->total_harga_bersih;
                $total_bonus += $item->bonus_penitip;
                $total_pendapatan += $item->pendapatan;
                @endphp
            <tr>
                <td>K{{ $item->id_barang }}</td>
                <td class="text-left">{{ $item->nama_barang }}</td>
                <td>{{ \Carbon\Carbon::parse($item->tanggal_penitipan)->format('d/m/Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($item->tanggal_pembelian)->format('d/m/Y') }}</td>
                <td>{{ number_format($item->total_harga_bersih, 0, ',', '.') }}</td>
                <td>{{ number_format($item->bonus_penitip, 0, ',', '.') }}</td>
                <td>{{ number_format($item->pendapatan, 0, ',', '.') }}</td>
            </tr>
            @endforeach
            
            <tr class="total-row">
                <td colspan="4">TOTAL</td>
                <td>{{ number_format($total_bersih, 0, ',', '.') }}</td>
                <td>{{ number_format($total_bonus, 0, ',', '.') }}</td>
                <td>{{ number_format($total_pendapatan, 0, ',', '.') }}</td>
            </tr>
        @endif
        </tbody>
    </table>
    
</body>
</html>
