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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text("Riwayat Pembelian"),
      ),
      body: historyData.isEmpty && isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
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
                    ? DateFormat('dd MMM yyyy').format(DateTime.parse(tanggal))
                    : '-';

                return Card(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
