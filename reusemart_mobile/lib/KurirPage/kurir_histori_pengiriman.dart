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
    fetchHistori(selectedDate);
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

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
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

              return ListView.separated(
                padding: const EdgeInsets.symmetric(vertical: 16),
                itemCount: historiList.length,
                separatorBuilder: (context, index) => const Divider(
                  color: Colors.grey,
                  thickness: 0.8,
                  indent: 20,
                  endIndent: 20,
                  height: 20,
                ),
                itemBuilder: (context, index) {
                  final item = historiList[index];
                  String nama = item['nama_barang'];
                  String tanggal = item['tanggal_pengiriman'];
                  String alamat = item['alamat'];
                  String kelurahan = item['kelurahan'];
                  String kecamatan = item['kecamatan'];
                  String kabupaten = item['kabupaten'];
                  int kodepos = item['kode_pos'];

                  print(
                      "URL gambar: ${KurirClient.getFotoBarang(item['foto_barang'])}");

                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            KurirClient.getFotoBarang(item['foto_barang']),
                            width: 70,
                            height: 70,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) =>
                                Container(
                              width: 70,
                              height: 70,
                              color: Colors.grey[300],
                              child: const Icon(Icons.broken_image,
                                  size: 32, color: Colors.grey),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                nama,
                                style: const TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 0),
                              Text(
                                'Dikirim pada: $tanggal',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[600],
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                '$alamat, $kelurahan, $kecamatan, $kabupaten, $kodepos',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[700],
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      ],
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
