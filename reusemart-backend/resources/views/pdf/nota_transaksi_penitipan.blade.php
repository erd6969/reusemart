<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nota Transaksi Penitipan</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #000;
        }
        h2, h4 {
            margin: 0;
            padding: 0;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 20px;
        }
        .section {
            margin-bottom: 10px;
        }
        .bold {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        td, th {
            padding: 5px;
            vertical-align: top;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>ReUse Mart</h2>
        <p>Jl. Green Eco Park No. 456 Yogyakarta</p>
    </div>

    <div class="section">
        <p><span class="bold">No Nota:</span> {{ $transaksi->id_transaksi_penitipan . '.' . $transaksi->penitip->id_penitip . '.' . \Carbon\Carbon::parse($transaksi->tanggal_penitipan)->format('d.m.Y')}}</p>
        <p><span class="bold">Tanggal Penitipan:</span> {{ \Carbon\Carbon::parse($transaksi->tanggal_penitipan)->format('d/m/Y') }}</p>
        <p><span class="bold">Masa Penitipan Sampai:</span> {{ \Carbon\Carbon::parse($transaksi->detailTransaksiPenitipan[0]->tanggal_berakhir)->format('d/m/Y') }}</p>
    </div>

    <div class="section">
        <p><span class="bold">Penitip:</span> {{ 'T' . $transaksi->penitip->id_penitip . '/ ' . $transaksi->penitip->nama_penitip }}</p>
        <p>{{ $transaksi->penitip->alamat_penitip }}</p>
    </div>

    <div class="section">
        <p><span class="bold">Delivery:</span> Kurir ReUseMart ({{ $transaksi->kurir->nama_kurir ?? 'N/A' }})</p>
    </div>

    <div class="section">

        <table border="1">
            <thead>
                <tr>
                    <th>Nama Barang</th>
                    <th>Harga (Rp)</th>
                    <th>Keterangan</th>
                    <th>Garansi</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($transaksi->detailTransaksiPenitipan as $detail)
                    <tr>
                        <td>{{ $detail->barang->nama_barang }}</td>
                        <td>{{ number_format($detail->barang->harga_barang, 0, ',', '.') }}</td>
                        <td>
                            Berat Barang: {{ $detail->barang->berat_barang ?? 'N/A' }} kg
                        </td>
                        <td>
                            {{ \Carbon\Carbon::parse($detail->barang->tanggal_garansi)->greaterThan(\Carbon\Carbon::now()) 
                                ? 'Garansi: ' . \Carbon\Carbon::parse($detail->barang->tanggal_garansi)->format('d/m/Y') 
                                : 'Sudah Kadaluarsa / Lewat Garansi' 
                            }}
                        </td>

                    </tr>
                @endforeach

            </tbody>
        </table>

    </div>

    <div class="footer">
        <p>Diterima dan QC oleh:</p>
        <p>{{ 'P' . $transaksi->detailTransaksiPenitipan[0]->barang->pegawai->id_pegawai . ' ' . $transaksi->detailTransaksiPenitipan[0]->barang->pegawai->nama_pegawai }}</p>
    </div>

</body>
</html>
