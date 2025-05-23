import 'package:flutter/material.dart';
import 'package:reusemart_mobile/KurirPage/kurir_histori_pengiriman.dart';
import 'package:reusemart_mobile/KurirPage/kurir_profil.dart';
import 'package:reusemart_mobile/KurirPage/kurir_list_pengiriman.dart';

class KurirMainPage extends StatefulWidget {
  @override
  _KurirMainPageState createState() => _KurirMainPageState();
}

class _KurirMainPageState extends State<KurirMainPage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    KurirListPengiriman(),
    KurirHistoriView(),
    ProfilKurirView(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF347928),
        title: const Text(
          'Kurir Page ReuseMart',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
      backgroundColor: Colors.white,
      body: SafeArea(child: _pages[_currentIndex]),
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
            icon: Icon(Icons.delivery_dining),
            label: 'Pengiriman',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Histori',
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
