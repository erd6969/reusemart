import 'package:flutter/material.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_history.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_merchandise.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_profile.dart';
import 'package:reusemart_mobile/BarangPage/list_barang.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/client/PembeliClient.dart';

class PembeliMainPage extends StatefulWidget {
  const PembeliMainPage({super.key});

  @override
  State<PembeliMainPage> createState() => _PembeliMainPageState();
}

class _PembeliMainPageState extends State<PembeliMainPage> {
  int _currentIndex = 0;

  Future<List<dynamic>> fetchBarang() async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    return await BarangClient.getBarang(token);
  }

  Future<List<dynamic>> fetchMerchandise() async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    return await BarangClient.getMerchandise(token);
  }

  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return ListBarangPage(fetchData: fetchBarang);
      case 1:
        return PembeliMerchandisePage(fetchData: fetchMerchandise);
      case 2:
        return PembeliHistoryPage();
      case 3:
        return ProfilePembeliPage();
      default:
        return ListBarangPage(fetchData: fetchBarang);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: const Color(0xFF347928),
        title: const Text(
          'Pembeli Page ReuseMart',
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
            label: 'Merchandise',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
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
