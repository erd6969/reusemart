import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:reusemart_mobile/KurirPage/kurir_detail_pengiriman.dart';

class KurirListPengirimanView extends StatefulWidget {
  @override
  _KurirListPengirimanViewState createState() =>
      _KurirListPengirimanViewState();
}

class _KurirListPengirimanViewState extends State<KurirListPengirimanView> {
  List<dynamic> listPengiriman = [];
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

      List<dynamic> data = await KurirClient.getListPengiriman(token);

      setState(() {
        listPengiriman = data;
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        errorMessage = "Gagal memuat list pengiriman.";
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
        Expanded(
          child: Builder(
            builder: (context) {
              if (isLoading) {
                return const Center(child: CircularProgressIndicator());
              }

              if (errorMessage != null) {
                return Center(child: Text(errorMessage!));
              }

              if (listPengiriman.isEmpty) {
                return Center(
                  child: Text(
                    "Belum Ada Tugas Pengiriman Untuk Anda",
                    style: const TextStyle(fontSize: 16),
                  ),
                );
              }

              return RefreshIndicator(
                onRefresh: () => fetchHistori(selectedDate),
                child: ListView.builder(
                  padding:
                      const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                  itemCount: listPengiriman.length,
                  itemBuilder: (context, index) {
                    final item = listPengiriman[index];
                    final barangList = item['barang'];

                    if (barangList == null ||
                        barangList is! List ||
                        barangList.isEmpty) {
                      return const SizedBox();
                    }

                    return Card(
                      elevation: 3,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      margin: const EdgeInsets.only(bottom: 16),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(12),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => KurirDetailPengirimanView(
                                id_transaksi: item['id_transaksi_pembelian'],
                                nama_pembeli: item['nama_pembeli'] ?? '',
                                alamat: item['alamat'] ?? '',
                                kelurahan: item['kelurahan'] ?? '',
                                kecamatan: item['kecamatan'] ?? '',
                                kabupaten: item['kabupaten'] ?? '',
                                kode_pos: item['kode_pos']?.toString() ?? '',
                                keterangan: item['keterangan'] ?? '',
                                listBarang: barangList,
                              ),
                            ),
                          ).then((_) => fetchHistori(selectedDate));
                        },
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Nama pembeli
                              Text(
                                item['nama_pembeli'] ?? 'Nama Pembeli',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),

                              // List barang
                              ...barangList.map<Widget>((barang) {
                                return Padding(
                                  padding: const EdgeInsets.only(bottom: 12.0),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(10),
                                        child: Image.network(
                                          KurirClient.getFotoBarang(
                                              barang['foto_barang']),
                                          width: 60,
                                          height: 60,
                                          fit: BoxFit.cover,
                                          loadingBuilder: (context, child,
                                              loadingProgress) {
                                            if (loadingProgress == null)
                                              return child;
                                            return Container(
                                              width: 60,
                                              height: 60,
                                              color: Colors.grey[200],
                                              child: Center(
                                                child:
                                                    CircularProgressIndicator(
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
                                            child: const Icon(
                                                Icons.broken_image,
                                                size: 28,
                                                color: Colors.grey),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          barang['nama_barang'] ?? 'Barang',
                                          style: const TextStyle(fontSize: 16),
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),

                              const Divider(),

                              // Alamat
                              Row(
                                children: [
                                  const Icon(Icons.location_on_outlined,
                                      color: Colors.red),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      '${item['alamat']}, ${item['kelurahan']}, ${item['kecamatan']}, ${item['kabupaten']}, ${item['kode_pos']}',
                                      style: const TextStyle(
                                          fontSize: 14, color: Colors.black87),
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
              );
            },
          ),
        ),
      ],
    );
  }
}
