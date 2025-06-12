import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/BarangPage/detail_merchandise.dart';

class PembeliMerchandisePage extends StatefulWidget {
  final Future<List<dynamic>> Function() fetchData;

  const PembeliMerchandisePage({super.key, required this.fetchData});

  @override
  State<PembeliMerchandisePage> createState() => _PembeliMerchandisePageState();
}

class _PembeliMerchandisePageState extends State<PembeliMerchandisePage> {
  List<dynamic> _barangList = [];
  String _searchText = '';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchBarang();
  }

  Future<void> fetchBarang() async {
    setState(() => _isLoading = true);
    try {
      final data = await widget.fetchData();
      setState(() {
        _barangList = data;
        _isLoading = false;
      });
    } catch (e) {
      print('Gagal mengambil data barang merchandise: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _searchText.isEmpty
        ? _barangList
        : _barangList.where((barang) {
            final nama =
                barang['nama_merchandise']?.toString().toLowerCase() ?? '';
            return nama.contains(_searchText.toLowerCase());
          }).toList();

    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
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
                            final fotoUrl = BarangClient.getFotoMerchandise(
                                barang['gambar_merchandise'] ?? '');

                            return GestureDetector(
                              onTap: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => DetailMerchandisePage(
                                      barang: barang,
                                    ),
                                  ),
                                );
                                // fetch ulang setelah kembali dari detail
                                fetchBarang();
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
                                        borderRadius: BorderRadius.circular(10),
                                        child: Image.network(
                                          fotoUrl,
                                          height: 80,
                                          fit: BoxFit.cover,
                                          errorBuilder:
                                              (context, error, stackTrace) =>
                                                  Container(
                                            height: 120,
                                            color: Colors.grey[300],
                                            child:
                                                const Icon(Icons.broken_image),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        barang['nama_merchandise'],
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      const SizedBox(height: 15),
                                      Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 6),
                                            decoration: BoxDecoration(
                                              color: Colors.red,
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              'Stok: ${barang['jumlah_merchandise']}',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 13,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 10, vertical: 6),
                                            decoration: BoxDecoration(
                                              color: Colors.green,
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                            ),
                                            child: Text(
                                              '${barang['poin_tukar']?.toString() ?? '0'} poin',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}
