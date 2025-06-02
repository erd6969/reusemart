import 'package:flutter/material.dart';

class PenitipHistoryPage extends StatelessWidget {
  const PenitipHistoryPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Dummy data
    final List<Map<String, String>> history = [
      {
        'date': '2024-06-01',
        'item': 'Sepeda Bekas',
        'status': 'Selesai',
      },
      {
        'date': '2024-05-28',
        'item': 'Laptop Second',
        'status': 'Diproses',
      },
      {
        'date': '2024-05-20',
        'item': 'Kamera DSLR',
        'status': 'Dibatalkan',
      },
    ];

    return Scaffold(
      body: ListView.builder(
        itemCount: history.length,
        itemBuilder: (context, index) {
          final item = history[index];
          return Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: const Icon(Icons.history),
              title: Text(item['item'] ?? ''),
              subtitle: Text('Tanggal: ${item['date']}'),
              trailing: Text(item['status'] ?? ''),
            ),
          );
        },
      ),
    );
  }
}
