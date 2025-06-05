import 'package:flutter/material.dart';
import 'package:reusemart_mobile/PembeliPage/pembeli_history.dart';
import 'package:reusemart_mobile/client/PembeliClient.dart';
import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';

class ProfilePembeliPage extends StatefulWidget {
  @override
  _ProfilePembeliPageState createState() => _ProfilePembeliPageState();
}

class _ProfilePembeliPageState extends State<ProfilePembeliPage> {
  Pembeli? _pembeli;
  int poin = 0;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? token = prefs.getString('token');

    if (token != null) {
      Pembeli? pembeli = await PembeliClient.getProfilePembeli(token);
      setState(() {
        _pembeli = pembeli;
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');

    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_pembeli == null) {
      return const Center(child: Text('Gagal memuat data Pembeli'));
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 20),
          const Text(
            'Profil Pembeli',
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
                    PembeliClient.getFotoPembeli(_pembeli!.foto_pembeli ?? ''),
                    width: 250,
                    height: 250,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.center,
                  child: Text(
                    _pembeli!.nama_pembeli ?? 'Nama tidak tersedia',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Email Pembeli : ' + _pembeli!.email_pembeli,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Tanggal Lahir : ' + _pembeli!.tanggal_lahir_pembeli.toLocal().toString().split(' ')[0],
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Nomor Telepon : ' + _pembeli!.nomor_telepon_pembeli,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Poin Loyalitas : ' + _pembeli!.poin_loyalitas.toString(),
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),

                const SizedBox(height: 30),
                // Tombol Logout
                ElevatedButton.icon(
                  onPressed: () async {
                    await AuthClient.logout();
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(builder: (context) => LoginPage()),
                    );
                  },
                  // navigator.pushReplacement dengan push biasa beda, yang pushReplacement akan menghapus halaman sebelumnya dari stack
                  // sehingga ketika pengguna menekan tombol kembali, mereka tidak akan kembali ke halaman sebelumnya.
                  // kalau yang push biasa, pengguna akan kembali ke halaman sebelumnya ketika menekan tombol kembali
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
