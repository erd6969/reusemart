import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:reusemart_mobile/BarangPage/detail_barang.dart';
import 'package:reusemart_mobile/BarangPage/detail_history_barang_pembeli.dart';
import 'package:reusemart_mobile/BarangPage/detail_history_barang_penitip.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';

import 'package:reusemart_mobile/client/PembeliClient.dart';

class PembeliHistoryPage extends StatefulWidget {
  const PembeliHistoryPage({super.key});

  @override
  State<PembeliHistoryPage> createState() => _PembeliHistoryPageState();
}

class _PembeliHistoryPageState extends State<PembeliHistoryPage> {
  List<dynamic> historyData = [];
  int currentPage = 1;
  bool isLoading = false;
  bool hasMoreData = true;
  DateTime? tanggalMulai;
  DateTime? tanggalSelesai;
  final dateFormat = DateFormat('dd MMM yyyy');

  final ScrollController scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    fetchHistory();
    scrollController.addListener(() {
      if (scrollController.position.pixels >=
              scrollController.position.maxScrollExtent - 200 &&
          !isLoading &&
          hasMoreData) {
        fetchHistory();
      }
    });
  }

  @override
  void dispose() {
    scrollController.dispose();
    super.dispose();
  }

  Future<void> fetchHistory() async {
    setState(() => isLoading = true);
    try {
      final response =
          await PembeliClient.getAllHistoryPembelian(page: currentPage);
      final List<dynamic> newItems = response['items'] ?? [];

      setState(() {
        currentPage++;
        historyData.addAll(newItems);
        hasMoreData = newItems.isNotEmpty;
      });
    } catch (e) {
      debugPrint('Error loading history: $e');
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> fetchHistoryByTanggal() async {
    setState(() => isLoading = true);
    if (tanggalMulai == null || tanggalSelesai == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
            content: Text('Silakan pilih tanggal mulai dan selesai')),
      );
      return;
    } else if (tanggalMulai!.isAfter(tanggalSelesai!)) {
      showDialog(
        context: context,
        builder: (context) {
          return AlertDialog(
            title: const Text('Tanggal Tidak Valid'),
            content: const Text(
                'Tanggal mulai tidak boleh setelah tanggal selesai.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('OK'),
              ),
            ],
          );
        },
      );
      fetchHistory();
      return;
    }

    try {
      historyData.clear();
      final response = await PembeliClient.getHistoryPembelianByTanggal(
        tanggalMulai: tanggalMulai,
        tanggalSelesai: tanggalSelesai,
        page: currentPage,
      );
      print("Response: $response");
      final List<dynamic> newItems = response['items'] ?? [];

      setState(() {
        currentPage++;
        historyData.addAll(newItems);
        if (response['currentPage'] == response['lastPage']) {
          hasMoreData = false;
        } else {
          hasMoreData = true;
        }
      });
    } catch (e) {
      debugPrint('Error loading history by date: $e');
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: isLoading && historyData.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : !isLoading && historyData.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Tidak ada data history pembelian'),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: fetchHistory,
                        child: const Text('Coba Lagi'),
                      ),
                    ],
                  ),
                )
              : Column(children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: GestureDetector(
                            onTap: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: tanggalMulai ?? DateTime.now(),
                                firstDate: DateTime(2000),
                                lastDate: DateTime.now(),
                              );
                              if (picked != null) {
                                setState(() {
                                  tanggalMulai = picked;
                                  currentPage = 1;
                                  fetchHistoryByTanggal();
                                });
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 12, horizontal: 8),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                tanggalMulai != null
                                    ? dateFormat.format(tanggalMulai!)
                                    : 'Tanggal Mulai',
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: GestureDetector(
                            onTap: () async {
                              final picked = await showDatePicker(
                                context: context,
                                initialDate: tanggalSelesai ?? DateTime.now(),
                                firstDate: DateTime(2000),
                                lastDate: DateTime.now(),
                              );
                              if (picked != null) {
                                setState(() {
                                  tanggalSelesai = picked;
                                  currentPage = 1;
                                  fetchHistoryByTanggal();
                                });
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 12, horizontal: 8),
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                tanggalSelesai != null
                                    ? dateFormat.format(tanggalSelesai!)
                                    : 'Tanggal Selesai',
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(Icons.refresh),
                          tooltip: "Reset Filter",
                          onPressed: () {
                            setState(() {
                              tanggalMulai = null;
                              tanggalSelesai = null;
                              currentPage = 1;
                              historyData.clear();
                              fetchHistory();
                            });
                          },
                        ),
                      ],
                    ),
                  ),
                  const Divider(height: 1),
                  Expanded(
                    child: ListView.builder(
                      controller: scrollController,
                      itemCount: historyData.length + (hasMoreData ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == historyData.length) {
                          return const Center(
                            child: Padding(
                              padding: EdgeInsets.all(16.0),
                              child: CircularProgressIndicator(),
                            ),
                          );
                        }

                        final item = historyData[index];
                        final tanggal = item['tanggal_pembelian'] ?? '';
                        final formattedDate = tanggal != ''
                            ? DateFormat('dd MMM yyyy')
                                .format(DateTime.parse(tanggal))
                            : '-';

                        return Card(
                          margin: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 8),
                          child: ListTile(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => DetailHistoryBarangPembeli(
                                    id_barang: item['id_barang'],
                                  ),
                                ),
                              );
                            },
                            leading: ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                BarangClient.getFotoBarang(item['foto_barang']),
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                              ),
                            ),
                            title: Text(item['nama_barang']),
                            subtitle: Text('Dibeli: $formattedDate'),
                            trailing: Text(
                              'Rp ${item['total_pembayaran'].toString()}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ),
                        );
                      },
                    ),
                  )
                ]),
    );
  }
}
