<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan Keseluruhan</title>
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

    <div class="underline bold">LAPORAN PENJUALAN BULANAN</div>
    <div>Tahun : {{ $tahun }}</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>

    <table>
        <thead>
            <tr>
                <th>Bulan</th>
                <th>Jumlah Barang Terjual</th>
                <th>Jumlah Penjualan Kotor</th>
            </tr>
        </thead>
        <tbody>
            @foreach($laporan as $lap)
             @if ($lap['jumlah_barang_terjual'] === 'Merge')
                <tr>
                    <td colspan="2" style="text-align: center;"><strong>Total</strong></td>
                    <td><strong>{{ number_format($lap['jumlah_penjualan_kotor'], 0, ',', '.') }}</strong></td>
                </tr>
            @else
                <tr>
                    <td>{{ $lap['bulan'] }}</td>
                    <td>{{ $lap['jumlah_barang_terjual'] }}</td>
                    <td>
                        @if(is_numeric($lap['jumlah_penjualan_kotor']))
                            {{ number_format($lap['jumlah_penjualan_kotor'], 0, ',', '.') }}
                        @else
                            {{ $lap['jumlah_penjualan_kotor'] }}
                        @endif
                    </td>
                </tr>
            @endif
            @endforeach
        </tbody>
    </table>
    @if ($grafik)
        <div style="margin-top: 30px;">
            <h3>Grafik Penjualan Kotor Bulanan</h3>
            <img src="{{ $grafik }}" alt="Grafik Penjualan" style="width: 100%; max-height: 400px;">
        </div>
    @endif
</body>
</html>
