import 'package:flutter/material.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/AuthPage/login.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:reusemart_mobile/client/NotificationClient.dart';

class PembeliHomePage extends StatefulWidget {
  const PembeliHomePage({super.key});

  @override
  State<PembeliHomePage> createState() => _PembeliHomePageState();
}

class _PembeliHomePageState extends State<PembeliHomePage> {
  String? _fcmToken;

  @override
  void initState() {
    super.initState();
    initFCM();
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Handle foreground notification
      print("Received message: ${message.notification?.title}");
    });
  }

  Future<void> initFCM() async {
    _fcmToken = await FirebaseMessaging.instance.getToken();
    print("FCM Token (dari home): $_fcmToken");
  }

  void _handleSendNotification() async {
    print("FCM Token (dari home): $_fcmToken");
    if (_fcmToken != null) {
      await sendNotification(
          _fcmToken!, 'Tes Notifikasi', 'Ini pesan dari tombol.');
    } else {
      print('Token belum tersedia');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pembeli Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Selamat datang, Pembeli!'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                await AuthClient.logout();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => LoginPage()),
                );
              },
              child: const Text('Log Out'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleSendNotification,
              child: const Text('Kirim Notifikasi'),
            ),
          ],
        ),
      ),
    );
  }
}
