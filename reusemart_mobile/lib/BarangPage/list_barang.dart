import 'package:flutter/material.dart';
import 'package:reusemart_mobile/BarangPage/detail_barang.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/client/PenitipClient.dart';

class ListBarangPage extends StatefulWidget {
  final Future<List<dynamic>> Function() fetchData;

  const ListBarangPage({super.key, required this.fetchData});

  @override
  State<ListBarangPage> createState() => _ListBarangPageState();
}

class _ListBarangPageState extends State<ListBarangPage> {
  List<dynamic> _barangList = [];
  String _searchText = '';
  bool _isLoading = true;
  Map<String, dynamic>? _topSeller;

  @override
  void initState() {
    super.initState();
    getTopSeller();
    fetchBarang();
  }

  Future<void> fetchBarang() async {
    try {
      final data = await widget.fetchData();
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

  Future<void> getTopSeller() async{
    try{
      setState(() {
        _isLoading = true;
      });
      final data = await PenitipClient.getTopSeller();
      setState((){
        _topSeller = data;
        _isLoading = false;
      });
    }catch (e) {
      print('Gagal mengambil data top seller: $e');
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
                Container(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.orange[100],
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.orange, width: 1),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.star, color: Colors.orange),
                      SizedBox(width: 8),
                      Text(
                        'Top Seller Bulan Lalu: ${_topSeller?['nama_penitip'] ?? 'Tidak ada'}!',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.orange,
                        ),
                      ),
                    ],
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
                            final fotoUrl = BarangClient.getFotoBarang(
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
