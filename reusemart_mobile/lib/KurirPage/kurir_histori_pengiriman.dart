import 'package:flutter/material.dart';

class KurirHistoriView extends StatelessWidget {
  final List<Map<String, String>> historiList = [
    {
      'nama': 'Cina Bekas 2',
      'tanggal': '30 Agustus 2025',
      'alamat': 'Jl. Basabasi No. 123, Babarsari, Sleman, Yogyakarta 55117',
      'imageUrl': 'https://cdn.rafled.com/anime-icons/images/6jAr64WjtGpC.jpg',
    },
    {
      'nama': 'Laptop Gaming',
      'tanggal': '20 Mei 2025',
      'alamat': 'Jl. Pelangi No. 45, Umbulharjo, Yogyakarta',
      'imageUrl': 'https://cdn.rafled.com/anime-icons/images/6jAr64WjtGpC.jpg',
    },
    // Tambah data lainnya
  ];

  @override
  Widget build(BuildContext context) {
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
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.network(
                  item['imageUrl']!,
                  width: 70,
                  height: 70,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item['nama']!,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 0),
                    Text(
                      'Dikirim pada: ${item['tanggal']}',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item['alamat']!,
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
  }
}
