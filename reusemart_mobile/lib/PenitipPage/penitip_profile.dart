import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/PenitipClient.dart';
import 'package:reusemart_mobile/entity/Penitip.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';
import 'package:intl/intl.dart';

import 'package:flutter/material.dart';

Icon fullStar = const Icon(Icons.star, color: Colors.amber, size: 18);
Icon halfStar = const Icon(Icons.star_half, color: Colors.amber, size: 18);
Icon emptyStar = const Icon(Icons.star_border, color: Colors.amber, size: 18);

class ProfilePenitipPage extends StatefulWidget {
  @override
  _ProfilePenitipPageState createState() => _ProfilePenitipPageState();
}

class _ProfilePenitipPageState extends State<ProfilePenitipPage> {
  Penitip? _penitip;
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
      Penitip? penitip = await PenitipClient.getProfilePenitip(token);
      setState(() {
        _penitip = penitip;
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

    if (_penitip == null) {
      return const Center(child: Text('Gagal memuat data Penitip'));
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 20),
          const Text(
            'Profil Penitip',
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
                    PenitipClient.getFotoPenitip(_penitip!.foto_penitip ?? ''),
                    width: 250,
                    height: 250,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.center,
                  child: Text(
                    _penitip!.nama_penitip,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                _penitip!.badge
                    ? 
                      ClipRRect(
                        borderRadius: BorderRadius.circular(2),
                        child: Image.asset(
                          'images/badgeTop.png',
                          height: 120,
                          fit: BoxFit.cover,
                        ),
                      )
                    : const Text(
                        "Tidak ada Badge!",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.deepOrange,
                        ),
                      ),
                const SizedBox(height: 16),
                Container(
                  child: Row(
                    children: [
                      const Text(
                        "Rating : ",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.black,
                        ),
                      ),
                      Text(
                        "${_penitip?.rerata_rating.toStringAsFixed(1)}",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Row(children: buildStarIcons(_penitip?.rerata_rating ?? 0))
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Saldo : Rp ${_penitip!.saldo.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}', 
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Poin Loyalitas : ${_penitip!.poin_loyalitas}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Komisi Penitip : Rp ${_penitip!.komisi_penitip.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Email : ${_penitip!.email_penitip}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Nomor Telepon : ${_penitip!.nomor_telepon_penitip}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 16),
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
                    DateFormat('dd MMMM yyyy').format(_penitip!.tanggal_lahir),
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

List<Widget> buildStarIcons(double rating) {
  int fullStars = rating.floor();
  bool hasHalf = (rating - fullStars) >= 0.5;
  int totalStars = 5;
  List<Widget> stars = [];

  for (int i = 0; i < fullStars; i++) {
    stars.add(fullStar);
  }

  if (hasHalf) stars.add(halfStar);

  while (stars.length < totalStars) {
    stars.add(emptyStar);
  }

  return stars;
}
