import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/HunterClient.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';

class DetailHistoryHunter extends StatefulWidget {
  final int id_barang;

  const DetailHistoryHunter({super.key, required this.id_barang});

  @override
  State<DetailHistoryHunter> createState() => _DetailHistoryHunterState();
}

class _DetailHistoryHunterState extends State<DetailHistoryHunter> {
  Map<String, dynamic>? barangData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchDetailBarang();
  }

  Future<void> fetchDetailBarang() async {
    try {
      final response =
          await BarangClient.getHistoryBarangHunterById(widget.id_barang);
      setState(() {
        barangData = response;
      });
    } catch (e) {
      debugPrint('Error fetching detail: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Detail Riwayat Hunter"),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [  
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.network(
                          BarangClient.getFotoBarang(
                              barangData!['foto_barang']),
                          width: double.infinity,
                          height: 200,
                          fit: BoxFit.cover,
                        ),
                      ),
                    const SizedBox(height: 16),
                    Text(
                      barangData!['nama_barang'],
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Harga Barang',
                      style: TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                    Text(
                      'Rp ${barangData!['harga_barang'].toString()}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Pendapatan Komisi',
                      style: TextStyle(fontSize: 14, color: Colors.grey),
                    ),
                    Text(
                      'Rp ${barangData!['komisi_hunter'].toString()}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
