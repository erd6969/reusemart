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
        <p><span class="bold">Pembeli:</span>
            {{ 'T' . $transaksi->pembeli->id_pembeli . '/ ' . $transaksi->pembeli->nama_pembeli }}</p>
            @php
                $alamat = $transaksi->alamat;
            @endphp
        <p>{{ $alamat->nama_alamat }}, {{ $alamat->alamat }}, {{ $alamat->keterangan }}</p>
        <p>{{ $alamat->kecamatan }}, {{ $alamat->kabupaten }}, {{ $alamat->kelurahan }}, {{ $alamat->kode_pos }}</p>
    </div>

    <div class="section">
        <p><span class="bold">Delivery:</span>
        <p>{{ isset($transaksi->pegawai) ? 'P' . $transaksi->pegawai->id_pegawai . ' ' . $transaksi->pegawai->nama_pegawai : 'Diambil Sendiri' }}</p>
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

    <div class="section">
        @php
            $totalBarang = 0;
            foreach ($transaksi->komisi as $detail) {
                $totalBarang += $detail->barang->harga_barang;
            }
            $ongkir = ($totalBarang > 1500000) ? 0 : 100000;
            $totalSetelahOngkir = $totalBarang + $ongkir;
            $poin = $transaksi->penggunaan_poin ?? 0;
            $potongan = $poin * 1000;
            $totalHargaPotongan = $totalSetelahOngkir - $potongan;
        @endphp

        <div class="section">
            <p><span>Total : Rp. {{ number_format($totalBarang, 0, ',', '.') }}</span></p>
            <p><span>Ongkir : Rp. {{ number_format($ongkir, 0, ',', '.') }}</span></p>
            <p><span>Total Setelah Ongkir : Rp. {{ number_format($totalSetelahOngkir, 0, ',', '.') }}</span></p>
            <p><span>Potongan {{ $poin }} poin : - Rp. {{ number_format($potongan, 0, ',', '.') }}</span></p>
            <p><span>Total Harga Potongan : Rp. {{ number_format($totalHargaPotongan, 0, ',', '.') }}</span></p>
        </div>
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

     @if($transaksi->pengiriman === 'diantar kurir')
                <p>Diterima Oleh</p>                             
         @elseif($transaksi->pengiriman === 'diambil sendiri')
                <p>Diambil Oleh</p>
         @else
                <!-- Tambahkan aksi lain jika diperlukan -->
         @endif
        <br>
        <br>
        <br>
         <p>(.....................................)</p>
         <p>Tanggal (............................)</p>



</body>

</html>