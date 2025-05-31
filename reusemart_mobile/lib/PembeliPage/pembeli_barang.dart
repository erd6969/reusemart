import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/PembeliClient.dart';
import 'package:reusemart_mobile/PembeliPage/detail_barang.dart';

class PembeliBarangPage extends StatefulWidget {
  const PembeliBarangPage({super.key});

  @override
  State<PembeliBarangPage> createState() => _PembeliBarangPageState();
}

class _PembeliBarangPageState extends State<PembeliBarangPage> {
  List<dynamic> _barangList = [];
  String _searchText = '';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchBarang();
  }

  Future<void> fetchBarang() async {
    try {
      final token = await AuthClient.getToken();
      if (token == null) {
        print('Token tidak tersedia');
        return;
      }

      final data = await PembeliClient.getBarang(token);
      setState(() {
        _barangList = data;
        _isLoading = false;
      });
    } catch (e) {
      print('Gagal mengambil data barang: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _searchText.isEmpty
        ? _barangList
        : _barangList.where((barang) {
            final nama = barang['nama_barang']?.toString().toLowerCase() ?? '';
            return nama.contains(_searchText.toLowerCase());
          }).toList();

    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Search Bar
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: TextField(
                    decoration: const InputDecoration(
                      labelText: 'Cari barang...',
                      prefixIcon: Icon(Icons.search),
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (value) {
                      setState(() {
                        _searchText = value;
                      });
                    },
                  ),
                ),

                // Hapus Carousel, langsung ke Grid View

                // Grid View
                Expanded(
                  child: filteredList.isEmpty
                      ? const Center(child: Text('Tidak ada data barang.'))
                      : GridView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 0.8,
                          ),
                          itemCount: filteredList.length,
                          itemBuilder: (context, index) {
                            final barang = filteredList[index];
                            final fotoUrl = PembeliClient.getFotoBarang(
                                barang['foto_barang'] ?? '');

                            return GestureDetector(
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) =>
                                        DetailBarangPage(barang: barang),
                                  ),
                                );
                              },
                              child: Card(
                                elevation: 4,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(8),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.stretch,
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: Image.network(
                                          fotoUrl,
                                          height: 100,
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) =>
                                                  Container(
                                            height: 100,
                                            color: Colors.grey[300],
                                            child:
                                                const Icon(Icons.broken_image),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        barang['nama_barang'] ?? 'Tanpa Nama',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 14,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Rp ${barang['harga_barang']?.toString() ?? '0'}',
                                        style: const TextStyle(
                                          color: Colors.green,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }),
                ),
              ],
            ),
    );
  }
}
