import 'package:flutter/material.dart';
import 'package:reusemart_mobile/BarangPage/list_barang.dart';
import 'package:reusemart_mobile/HomePage/Home.dart';
import 'package:reusemart_mobile/client/BarangClient.dart';
import 'package:reusemart_mobile/HomePage/ProfileGuest.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';

class UmumMainPage extends StatefulWidget {
  const UmumMainPage({super.key});

  @override
  State<UmumMainPage> createState() => _UmumMainPageState();
}

class _UmumMainPageState extends State<UmumMainPage> {
  int _currentIndex = 0;
  Future<List<dynamic>> fetchBarang() async {
    return await BarangClient.getBarangUmum();
  }

  Widget _getPage(int index) {
    switch (index) {
      case 0:
        return HomePage();
      case 1:
        return ListBarangPage(fetchData: fetchBarang);
      case 2:
        return ProfileGuestPage();
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
          'Umum Page ReuseMart',
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
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.shopping_bag),
            label: 'Barang',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
