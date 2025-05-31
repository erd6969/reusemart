import 'package:flutter/material.dart';

class DetailBarangPage extends StatelessWidget {
  final Map<String, dynamic> barang;

  const DetailBarangPage({super.key, required this.barang});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(barang['nama_barang'] ?? 'Detail Barang'),
        foregroundColor: Colors.white,
        backgroundColor: const Color(0xFF347928),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            Text(
              barang['nama_barang'] ?? '',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Harga: Rp ${barang['harga_barang'] ?? '0'}',
              style: const TextStyle(fontSize: 18, color: Colors.green),
            ),
            const SizedBox(height: 8),
            Text(
              'Deskripsi:\n${barang['deskripsi_barang'] ?? 'Tidak ada'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Kondisi: ${barang['kondisi_barang'] ?? '-'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              'Garansi hingga: ${barang['tanggal_garansi'] ?? '-'}',
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
