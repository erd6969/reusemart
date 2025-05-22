<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Nota Transaksi Pembelian</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
            color: #000;
        }

        h2,
        h4 {
            margin: 0;
            padding: 0;
        }

        .header,
        .footer {
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

        td,
        th {
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
        <p><span class="bold">No Nota:</span>
            {{ $transaksi->id_transaksi_pembelian . '.' . $transaksi->pembeli->id_pembeli . '.' . \Carbon\Carbon::parse($transaksi->tanggal_Pembelian)->format('d.m.Y')}}
        </p>
        <p><span class="bold">Tanggal Pembelian:</span>
            {{ \Carbon\Carbon::parse($transaksi->tanggal_Pembelian)->format('d/m/Y') }}</p>
    </div>

    <div class="section">
        <p><span class="bold">pembeli:</span>
            {{ 'T' . $transaksi->pembeli->id_pembeli . '/ ' . $transaksi->pembeli->nama_pembeli }}</p>
        <p>{{ $transaksi->pembeli->alamat_pembeli }}</p>
    </div>

    <div class="section">
        <p><span class="bold">Delivery:</span> Kurir ReUseMart
            <p>{{ isset($transaksi->pegawai) ? 'P' . $transaksi->pegawai->id_pegawai . ' ' . $transaksi->pegawai->nama_pegawai : 'Pegawai tidak tersedia' }}


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
                @foreach ($transaksi->komisi as $detail)
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
        <p>
            @php
                $firstKomisi = $transaksi->komisi->first();
                $pegawai = $firstKomisi ? $firstKomisi->barang->pegawai : null;
            @endphp

            {{ $pegawai ? 'P' . $pegawai->id_pegawai . ' ' . $pegawai->nama_pegawai : 'Pegawai tidak tersedia' }}
        </p>
    </div>

</body>

</html>