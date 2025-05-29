import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:shared_preferences/shared_preferences.dart';

class KurirDetailPengirimanView extends StatelessWidget {
  final int id_transaksi;
  final String nama_pembeli;
  final String alamat;
  final String kelurahan;
  final String kecamatan;
  final String kabupaten;
  final String kode_pos;
  final String keterangan;
  final List<dynamic> listBarang;

  const KurirDetailPengirimanView({
    super.key,
    required this.id_transaksi,
    required this.nama_pembeli,
    required this.alamat,
    required this.kelurahan,
    required this.kecamatan,
    required this.kabupaten,
    required this.kode_pos,
    required this.keterangan,
    required this.listBarang,
  });

  Future<String> getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token') ?? '';
  }

  @override
  Widget build(BuildContext context) {
    final fotoBarangUtama =
        listBarang.isNotEmpty ? listBarang[0]['foto_barang'] : '';

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF347928),
        title: const Text('Detail Pengiriman',
            style: TextStyle(color: Colors.white)),
      ),
      backgroundColor: Colors.grey[100],
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Foto barang utama sebagai representasi transaksi
            if (fotoBarangUtama.isNotEmpty)
              Center(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Image.network(
                    'https://i.sstatic.net/sakPM.png',
                    width: double.infinity,
                    height: 220,
                    fit: BoxFit.cover,
                    loadingBuilder: (context, child, loadingProgress) {
                      if (loadingProgress == null) return child;
                      return Container(
                        height: 220,
                        color: Colors.grey[200],
                        child: const Center(child: CircularProgressIndicator()),
                      );
                    },
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 220,
                      color: Colors.grey[300],
                      child: const Center(
                        child: Icon(Icons.broken_image,
                            size: 60, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 24),

            // Info transaksi
            SizedBox(
              width: double.infinity,
              child: Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _infoItem('Nama Pembeli', nama_pembeli),
                      _infoItem(
                        'Alamat Lengkap',
                        '$alamat, $kelurahan, $kecamatan, $kabupaten, $kode_pos',
                      ),
                      _infoItem('Keterangan', keterangan),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Daftar Barang',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Color(0xFF347928),
                      ),
                    ),
                    const SizedBox(height: 12),
                    for (var barang in listBarang)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Image.network(
                                KurirClient.getFotoBarang(
                                    barang['foto_barang']),
                                width: 60,
                                height: 60,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) =>
                                    Container(
                                  width: 60,
                                  height: 60,
                                  color: Colors.grey[300],
                                  child: const Icon(Icons.broken_image,
                                      size: 28, color: Colors.grey),
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                barang['nama_barang'],
                                style: const TextStyle(
                                    fontSize: 16, fontWeight: FontWeight.w600),
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Tombol Selesaikan Pengiriman
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () async {
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (context) =>
                        const Center(child: CircularProgressIndicator()),
                  );

                  try {
                    final token = await getToken();
                    await KurirClient.updateStatusPengiriman(
                        token, id_transaksi);

                    Navigator.pop(context);

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Pengiriman berhasil diselesaikan')),
                    );

                    Navigator.pop(context);
                  } catch (e) {
                    Navigator.pop(context);

                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                          content: Text('Gagal menyelesaikan pengiriman')),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF347928),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  textStyle: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.w600),
                ),
                child: const Text('Selesaikan Pengiriman'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 15,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontSize: 17,
              color: Colors.black87,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }
}
