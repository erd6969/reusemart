import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:shared_preferences/shared_preferences.dart';

class KurirHistoriView extends StatefulWidget {
  @override
  _KurirHistoriViewState createState() => _KurirHistoriViewState();
}

class _KurirHistoriViewState extends State<KurirHistoriView> {
  List<dynamic> historiList = [];
  bool isLoading = true;
  String? errorMessage;
  DateTime selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration(milliseconds: 100), () {
      fetchHistori(selectedDate);
    });
  }

  Future<void> fetchHistori(DateTime date) async {
    setState(() {
      isLoading = true;
      errorMessage = null;
    });
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('token');
      if (token == null) {
        setState(() {
          isLoading = false;
          errorMessage = "Token tidak ditemukan. Silakan login ulang.";
        });
        return;
      }

      String tanggalInput = date.toIso8601String().split('T').first;

      List<dynamic> data =
          await KurirClient.getHistoryPengiriman(token, tanggalInput);

      setState(() {
        historiList = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = "Gagal memuat histori pengiriman.";
      });
    }
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: selectedDate,
      firstDate: DateTime(2020, 1),
      lastDate: DateTime.now(),
      locale: const Locale('id', 'ID'),
    );
    if (picked != null && picked != selectedDate) {
      setState(() {
        selectedDate = picked;
      });
      await fetchHistori(picked);
    }
  }

  Widget _infoItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.black87,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header tanggal dan picker
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Row(
            children: [
              Expanded(
                child: Text(
                  "Tanggal: ${selectedDate.toIso8601String().split('T').first}",
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              ElevatedButton.icon(
                onPressed: () => _selectDate(context),
                icon: const Icon(Icons.calendar_today, size: 18),
                label: const Text("Pilih Tanggal"),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF347928),
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  textStyle: const TextStyle(fontSize: 14),
                ),
              ),
            ],
          ),
        ),

        // List histori pengiriman
        Expanded(
          child: Builder(
            builder: (context) {
              if (isLoading) {
                return const Center(child: CircularProgressIndicator());
              }

              if (errorMessage != null) {
                return Center(child: Text(errorMessage!));
              }

              if (historiList.isEmpty) {
                return Center(
                  child: Text(
                    "Belum ada histori pengiriman untuk tanggal ini.",
                    style: const TextStyle(fontSize: 16),
                  ),
                );
              }

              return ListView.builder(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                itemCount: historiList.length,
                itemBuilder: (context, index) {
                  final item = historiList[index];
                  final List<dynamic> barangList = item['barang'] ?? [];

                  // Ambil nama pembeli dan alamat lengkap
                  final String alamatLengkap =
                      '${item['alamat']}, ${item['kelurahan']}, ${item['kecamatan']}, ${item['kabupaten']}, ${item['kode_pos']}';

                  return Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16)),
                    margin: const EdgeInsets.only(bottom: 20),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _infoItem('Tanggal Pengiriman',
                              item['tanggal_pengiriman'] ?? ''),
                          _infoItem('Nama Pembeli', item['nama_pembeli'] ?? ''),
                          _infoItem('Alamat Lengkap', alamatLengkap),
                          if (item['keterangan'] != null &&
                              item['keterangan'].toString().isNotEmpty)
                            _infoItem('Keterangan', item['keterangan']),

                          const SizedBox(height: 12),
                          const Text(
                            'Daftar Barang',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Color(0xFF347928),
                            ),
                          ),
                          const SizedBox(height: 8),

                          // List barang
                          ...barangList.map((barang) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              child: Row(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Image.network(
                                      KurirClient.getFotoBarang(
                                          barang['foto_barang']),
                                      key: ValueKey(KurirClient.getFotoBarang(
                                          barang['foto_barang'])),
                                      width: 60,
                                      height: 60,
                                      fit: BoxFit.cover,
                                      loadingBuilder:
                                          (context, child, loadingProgress) {
                                        if (loadingProgress == null)
                                          return child;
                                        return Container(
                                          width: 60,
                                          height: 60,
                                          color: Colors.grey[200],
                                          child: Center(
                                            child: CircularProgressIndicator(
                                              value: loadingProgress
                                                          .expectedTotalBytes !=
                                                      null
                                                  ? loadingProgress
                                                          .cumulativeBytesLoaded /
                                                      loadingProgress
                                                          .expectedTotalBytes!
                                                  : null,
                                              strokeWidth: 2,
                                            ),
                                          ),
                                        );
                                      },
                                      errorBuilder:
                                          (context, error, stackTrace) =>
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
                                      barang['nama_barang'] ?? '',
                                      style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }).toList(),
                        ],
                      ),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }
}
