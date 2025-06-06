import 'package:flutter/material.dart';
// import 'package:intl/intl.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/BarangPage/detail_history_hunter.dart';

import 'package:reusemart_mobile/client/HunterClient.dart';

class HunterHistory extends StatefulWidget {
  const HunterHistory({super.key});

  @override
  State<HunterHistory> createState() => _HunterHistoryState();
}

class _HunterHistoryState extends State<HunterHistory> {
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

  int lastPage = 1;

  Future<void> fetchHistory() async {
    if (isLoading || !hasMoreData) return;
    setState(() => isLoading = true);

    try {
      final response =
          await HunterClient.getAllHistoryHunter(page: currentPage);

      final List<dynamic> newItems = response['items'] ?? [];
      final int apiLastPage = response['lastPage'] ?? 1;

      setState(() {
        lastPage = apiLastPage; // simpan lastPage dari API

        historyData.addAll(newItems);

        if (currentPage >= lastPage) {
          hasMoreData = false; // sudah di halaman terakhir
        } else {
          currentPage++; // baru naik halaman kalau belum lastPage
        }
      });
    } catch (e) {
      debugPrint('Error loading history: $e');
      setState(() => hasMoreData = false);
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text("Riwayat Hunter"),
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

                return Card(
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => DetailHistoryHunter(
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
                    trailing: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Komisi didapatkan',
                          style: TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        Text(
                          'Rp ${item['komisi_hunter'].toString()}',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
