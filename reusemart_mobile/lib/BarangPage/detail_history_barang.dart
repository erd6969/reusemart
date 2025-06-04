import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_carousel_slider/carousel_slider.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';

class DetailHistoryBarang extends StatefulWidget {
  final int id_barang;

  const DetailHistoryBarang({super.key, required this.id_barang});

  @override
  _DetailHistoryBarangState createState() => _DetailHistoryBarangState();
}

class _DetailHistoryBarangState extends State<DetailHistoryBarang> {
  Map<String, dynamic>? barang;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchBarang();
  }

  Future<void> fetchBarang() async {
    final fetched = await BarangClient.getBarangById(widget.id_barang);
    setState(() {
      barang = fetched;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (barang == null) {
      return const Scaffold(
        body: Center(child: Text('Data barang tidak ditemukan')),
      );
    }

    final foto1 = BarangClient.getFotoBarang(barang?['foto_barang'] ?? '');
    final foto2 = BarangClient.getFotoBarang(barang?['foto_barang2'] ?? '');
    final foto3 = BarangClient.getFotoBarang(barang?['foto_barang3'] ?? '');

    final List<String> fotoList = [
      if (foto1.isNotEmpty) foto1,
      if (foto2.isNotEmpty) foto2,
      if (foto3.isEmpty) foto3,
    ];

    return Scaffold(
      appBar: AppBar(
        title: Text(barang?['nama_barang'] ?? 'Detail Barang'),
        foregroundColor: Colors.white,
        backgroundColor: const Color(0xFF347928),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            if (fotoList.isNotEmpty)
              SizedBox(
                height: 400,
                child: CarouselSlider.builder(
                  itemCount: fotoList.length,
                  slideBuilder: (index) {
                    return Image.network(
                      fotoList[index],
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const Icon(Icons.broken_image, size: 100),
                    );
                  },
                  slideIndicator: CircularSlideIndicator(
                    padding: const EdgeInsets.only(bottom: 8),
                    indicatorRadius: 4,
                    itemSpacing: 12,
                    currentIndicatorColor: Colors.green,
                  ),
                  enableAutoSlider: true,
                  autoSliderDelay: const Duration(seconds: 3),
                  unlimitedMode: true,
                ),
              ),
            const SizedBox(height: 16),
            Text(
              barang?['nama_barang'] ?? '',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Harga : Rp ${barang?['harga_barang'] ?? '0'}',
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),
            const SizedBox(height: 8),
            Text(
              'Deskripsi :\n${barang?['deskripsi_barang'] ?? 'Tidak ada'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Kondisi : ${barang?['kondisi_barang'] ?? '-'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Text(
                  'Garansi : ',
                  style: TextStyle(fontSize: 16),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: barang?['tanggal_garansi'] != null &&
                            barang!['tanggal_garansi'].toString().isNotEmpty
                        ? Colors.green
                        : Colors.grey,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    barang?['tanggal_garansi'] != null &&
                            barang!['tanggal_garansi'].toString().isNotEmpty
                        ? 'Tersedia hingga ${barang!['tanggal_garansi']}'
                        : 'Tidak ada garansi',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 26),
            Text('Infomasi Tambahan Barang!',
                style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),

            const SizedBox(height: 16),
            if (barang?['nama_pembeli'] != null)
              Text(
                'Nama Pembeli : ${barang!['nama_pembeli']}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            const SizedBox(height: 8),
            if (barang?['status_penitipan'] != null)
              Row(
                children: [
                  const Text(
                    'Status Penitipan : ',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: 
                        barang!['status_penitipan'] == 'terjual' || 
                        barang!['status_penitipan'] == 'Didonasikan'
                        ? Colors.green
                        : barang!['status_penitipan'] == 'sudah diambil'
                          ? Colors.red
                          : barang!['status_penitipan'] == 'proses pembayaran' ||
                            barang!['status_penitipan'] == 'masa pengambilan' ||
                            barang!['status_penitipan'] == 'masa verifikasi'
                              ? Colors.orange
                              : barang!['status_penitipan'] == 'ready jual' ||
                                barang!['status_penitipan'] == 'open donasi'
                                ? Colors.blue
                                : Colors.grey,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      barang!['status_penitipan'],
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ],
              ),
            const SizedBox(height: 8),
            if (barang?['tanggal_pembelian'] != null)
              Text(
                'Waktu Pembelian : ${barang!['tanggal_pembelian']}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            const SizedBox(height: 8),
            if (barang?['total_harga_bersih'] != null)
              Text(
                'Harga Bersih Barang : ${barang!['total_harga_bersih']}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            const SizedBox(height: 8),
            
          ],
        ),
      ),
    );
  }
}
