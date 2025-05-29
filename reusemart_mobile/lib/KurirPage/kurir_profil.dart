import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/KurirClient.dart';
import 'package:reusemart_mobile/entity/Kurir.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';

class ProfilKurirView extends StatefulWidget {
  @override
  _ProfilKurirViewState createState() => _ProfilKurirViewState();
}

class _ProfilKurirViewState extends State<ProfilKurirView> {
  Kurir? _kurir;
  int jumlahPengiriman = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
    _countPengiriman();
  }

  Future<void> _loadProfile() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token != null) {
      Kurir? kurir = await KurirClient.getProfileKurir(token);
      setState(() {
        _kurir = kurir;
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<int> _countPengiriman() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token != null) {
      int count = await KurirClient.countPengiriman(token);
      setState(() {
        jumlahPengiriman = count;
      });
    }
    return jumlahPengiriman;
  }

  Future<void> _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');

    // Ganti ke halaman login, pastikan route 'login' tersedia
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_kurir == null) {
      return const Center(child: Text('Gagal memuat data kurir'));
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 20),
          const Text(
            'Profil Kurir',
            style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 20),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.black12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.network(
                    KurirClient.getFotoKurir(_kurir!.foto_pegawai ?? ''),
                    width: 250,
                    height: 250,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.center,
                  child: Text(
                    _kurir!.nama_pegawai ?? 'Nama tidak tersedia',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Tanggal Lahir',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    _kurir!.tanggal_lahir ?? 'Belum ada data',
                    style: const TextStyle(color: Colors.black54),
                  ),
                ),
                const SizedBox(height: 12),
                const Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Jumlah Pengiriman',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    '${jumlahPengiriman} Pengiriman',
                    style: const TextStyle(color: Colors.black54),
                  ),
                ),
                const SizedBox(height: 24),

                // Tombol Logout
                ElevatedButton.icon(
                  onPressed: () async {
                    await AuthClient.logout();
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => LoginPage()),
                    );
                  },
                  icon: const Icon(Icons.logout),
                  label: const Text('Logout'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 12),
                    textStyle: const TextStyle(fontSize: 16),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
