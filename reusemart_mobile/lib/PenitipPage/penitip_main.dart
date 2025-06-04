import 'package:flutter/material.dart';
import 'package:reusemart_mobile/PenitipPage/penitip_profile.dart';
import 'package:reusemart_mobile/PenitipPage/penitip_history.dart';
import 'package:reusemart_mobile/BarangPage/list_barang.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/client/PenitipClient.dart';

class PenitipMainPage extends StatefulWidget {
  const PenitipMainPage({super.key});

  @override
  State<PenitipMainPage> createState() => _PenitipMainPageState();
}

class _PenitipMainPageState extends State<PenitipMainPage> {
  int _currentIndex = 0;

  Future<List<dynamic>> fetchBarang() async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    return await BarangClient.getBarang(token);
  }

  Future<List<Map<String, dynamic>>> fetchHistory() async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    final history = await PenitipClient.getPenitipHistory(token);
    return history;
  }


  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return ListBarangPage(fetchData: fetchBarang);
      case 1:
        return PenitipHistoryPage(fetchData: fetchHistory);
      case 2:
        return ProfilePenitipPage();
      default:
        return ProfilePenitipPage();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: const Color(0xFF347928),
        title: const Text(
          'Penitip Page ReuseMart',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
      backgroundColor: Colors.white,
      body: SafeArea(child: _getPage(_currentIndex)),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFF347928),
        unselectedItemColor: Colors.grey,
        backgroundColor: const Color(0xFFFFFBE6),
        onTap: (index) {
          setState(() => _currentIndex = index);
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.storefront),
            label: 'Barang',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag),
            label: 'History',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
