import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:reusemart_mobile/BarangPage/detail_barang.dart';
import 'package:reusemart_mobile/BarangPage/detail_history_barang_penitip.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';

import 'package:reusemart_mobile/client/PenitipClient.dart';

class PenitipHistoryPage extends StatefulWidget {
  final Future<List<Map<String, dynamic>>> Function() fetchData;
  const PenitipHistoryPage({super.key, required this.fetchData});

  @override
  State<PenitipHistoryPage> createState() => _PenitipHistoryPageState();
}

class _PenitipHistoryPageState extends State<PenitipHistoryPage> {
  late Future<List<Map<String, dynamic>>> _historyFuture;
  bool isLoading = true;
  String? _selectedStatus;

  @override
  void initState() {
    super.initState();
    _historyFuture = widget.fetchData();
  }

  @override
  Widget build(BuildContext context) {
    final List<String> _statusOptions = [
      'Semua',
      'ready jual',
      'open donasi',
      'terjual',
      'sudah diambil',
      'Didonasikan',
      'proses pembayaran',
      'masa pengambilan',
      'masa verifikasi',
    ];

    return Scaffold(
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _historyFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Terjadi kesalahan: ${snapshot.error}'));
          }

          final rawHistory = snapshot.data ?? [];

          // Flatten: Ambil semua barang dari setiap transaksi
          final items = rawHistory.expand((transaction) {
            final tanggal = transaction['tanggal_penitipan']?.toString() ?? '';
            final detailList =
                transaction['detail_transaksi_penitipan'] as List<dynamic>;
            return detailList.map((detail) {
              final barang = detail['barang'] ?? {};
              return {
                'nama_barang': barang['nama_barang'] ?? '',
                'status_penitipan': detail['status_penitipan'] ?? '',
                'tanggal_penitipan': tanggal,
                'foto_barang': barang['foto_barang'] ?? '',
                'barang': barang,
              };
            });
          }).toList();

          if (items.isEmpty) {
            return const Center(child: Text('Belum ada riwayat barang.'));
          }

// Filter items based on selected status
          final filteredItems = _selectedStatus == null
              ? items
              : items
                  .where((item) => item['status_penitipan'] == _selectedStatus)
                  .toList();

          return Column(
            children: [
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Filter status penitipan',
                    border: OutlineInputBorder(),
                  ),
                  value: _selectedStatus ?? 'Semua',
                  items: _statusOptions.map((status) {
                    return DropdownMenuItem<String>(
                      value: status,
                      child: Text(status),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedStatus = value == 'Semua' ? null : value;
                    });
                  },
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: filteredItems.length,
                  itemBuilder: (context, index) {
                    final item = filteredItems[index];

                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => DetailHistoryBarangPenitip(
                                id_barang: item['barang']['id_barang']),
                          ),
                        );
                      },
                      child: Card(
                        margin: const EdgeInsets.symmetric(
                            horizontal: 16, vertical: 8),
                        child: ListTile(
                          leading: ClipRRect(
                              borderRadius:
                                  BorderRadius.all(Radius.circular(8)),
                              child: Image.network(
                                BarangClient.getFotoBarang(item['foto_barang']),
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                              )),
                          title: Text(item['nama_barang']),
                          subtitle: Text(
                            'Dititipkan : ${DateFormat('dd MMMM yyyy').format(DateTime.parse(item['tanggal_penitipan']))}',
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: item['status_penitipan'] == 'terjual' ||
                                      item['status_penitipan'] == 'Didonasikan'
                                  ? Colors.green
                                  : item['status_penitipan'] == 'sudah diambil'
                                      ? Colors.red
                                      : item['status_penitipan'] ==
                                                  'proses pembayaran' ||
                                              item['status_penitipan'] ==
                                                  'masa pengambilan' ||
                                              item['status_penitipan'] ==
                                                  'masa verifikasi'
                                          ? Colors.orange
                                          : item['status_penitipan'] ==
                                                      'ready jual' ||
                                                  item['status_penitipan'] ==
                                                      'open donasi'
                                              ? Colors.blue
                                              : Colors.grey,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              item['status_penitipan'],
                              style: const TextStyle(
                                  color: Colors.white, fontSize: 12),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
