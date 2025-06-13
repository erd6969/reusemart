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

    <div class="underline bold">LAPORAN KOMISI BULANAN</div>
    <div>Bulan : {{ \Carbon\Carbon::create()->month((int) $bulan)->translatedFormat('F') }}</div>
    <div>Tahun : {{ $tahun }}</div>
    <div>Tanggal cetak: {{ \Carbon\Carbon::now()->format('j F Y') }}</div>
    @php
        $total_harga_jual = 0;
        $total_komisi_hunter = 0;
        $total_komisi_reusemart = 0;
        $total_bonus_penitip = 0;
    @endphp

    <table>
        <thead>
            <tr>
                <th>Kode Produk</th>
                <th>Nama Produk</th>
                <th>Harga Jual</th>
                <th>Tanggal Masuk</th>
                <th>Tanggal Laku</th>
                <th>Komisi Hunter</th>
                <th>Komisi ReUse Mart</th>
                <th>Bonus Penitip</th>
            </tr>
        </thead>
        <tbody>
            @if ($laporan->isEmpty())
                <tr>
                    <td colspan="8" style="text-align: center;">Tidak ada data laporan komisi untuk bulan ini.</td>
                </tr>
            @else

                @foreach($laporan as $lap)
                    @if ($lap->total_pembayaran === 'Merge')
                        <tr>
                            <td colspan="2" style="text-align: center;"><strong>Total</strong></td>
                            <td><strong>{{ number_format($lap->total_pembayaran, 0, ',', '.') }}</strong></td>
                        </tr>
                    @else
                        @php
                            $total_harga_jual += $lap->total_pembayaran;
                            $total_komisi_hunter += $lap->komisi_hunter;
                            $total_komisi_reusemart += $lap->komisi_reusemart;
                            $total_bonus_penitip += $lap->bonus_penitip;
                        @endphp
                        <tr>
                            <td>B{{ $lap->id_barang }}</td>
                            <td>{{ $lap->nama_barang }}</td>
                            <td>
                                {{ number_format($lap->total_pembayaran, 0, ',', '.') }}
                            </td>
                            <td>{{ $lap->tanggal_penitipan }}</td>
                            <td>{{ $lap->tanggal_pembelian }}</td>
                            <td>{{ number_format($lap->komisi_hunter, 0, ',', '.') }}</td>
                            <td>{{ number_format($lap->komisi_reusemart, 0, ',', '.') }}</td>
                            <td>{{ number_format($lap->bonus_penitip, 0, ',', '.') }}</td>
                        </tr>
                    @endif
                @endforeach

                <tr>
                    <td colspan="2" style="text-align: center;"><strong>Total</strong></td>
                    <td><strong>{{ number_format($total_harga_jual, 0, ',', '.') }}</strong></td>
                    <td colspan="2"></td>
                    <td><strong>{{ number_format($total_komisi_hunter, 0, ',', '.') }}</strong></td>
                    <td><strong>{{ number_format($total_komisi_reusemart, 0, ',', '.') }}</strong></td>
                    <td><strong>{{ number_format($total_bonus_penitip, 0, ',', '.') }}</strong></td>
                </tr>
            @endif
        </tbody>
    </table>
</body>
</html>
