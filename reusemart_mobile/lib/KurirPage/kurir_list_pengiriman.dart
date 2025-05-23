import 'package:flutter/material.dart';

class KurirListPengiriman extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        SizedBox(height: 20),
        Text(
          'List Pengiriman',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 16),
        // Tambahkan konten histori di sini
        Text("Belum ada list pengiriman."),
      ],
    );
  }
}
