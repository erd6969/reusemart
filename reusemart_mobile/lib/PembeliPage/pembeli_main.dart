import 'package:flutter/material.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_barang.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_merchandise.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_profile.dart';

class PembeliMainPage extends StatefulWidget {
  const PembeliMainPage({super.key});

  @override
  State<PembeliMainPage> createState() => _PembeliMainPageState();
}

class _PembeliMainPageState extends State<PembeliMainPage> {
  int _currentIndex = 0;

  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return PembeliBarangPage();
      case 1:
        return PembeliMerchandisePage(); // dibuat ulang setiap kali pindah
      case 2:
        return ProfilePembeliPage();
      default:
        return PembeliBarangPage();
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
        selectedItemColor: Color(0xFF347928),
        unselectedItemColor: Colors.grey,
        backgroundColor: Color(0xFFFFFBE6),
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
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
