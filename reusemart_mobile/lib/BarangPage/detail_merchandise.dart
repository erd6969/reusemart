import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/client/PembeliClient.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DetailMerchandisePage extends StatelessWidget {
  final Map<String, dynamic> barang;

  DetailMerchandisePage({super.key, required this.barang});

  Future<void> _klaimMerchandise(BuildContext context) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Token tidak ditemukan')),
        );
        return;
      }

      await PembeliClient.createTransaksiMerchandise(
          token, barang['id_merchandise']);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Merchandise berhasil diklaim')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal klaim merchandise: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final fotoUrl =
        BarangClient.getFotoMerchandise(barang['gambar_merchandise'] ?? '');

    return Scaffold(
      appBar: AppBar(
        title: Text(barang['nama_merchandise'] ?? 'Detail Barang'),
        foregroundColor: Colors.white,
        backgroundColor: const Color(0xFF347928),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                fotoUrl,
                height: 500,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(
                  height: 100,
                  color: Colors.grey[300],
                  child: const Icon(Icons.broken_image),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              barang['nama_merchandise'] ?? '',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              'Deskripsi:\n${barang['deskripsi'] ?? 'Tidak ada'}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 28),
            ElevatedButton(
              onPressed: () => _klaimMerchandise(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF347928),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Klaim Merchandise'),
            ),
          ],
        ),
      ),
    );
  }
}
