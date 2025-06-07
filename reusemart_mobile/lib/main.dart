import 'package:flutter/material.dart';
import 'package:reusemart_mobile/HomePage/UmumMain.dart';
import 'AuthPage/login.dart';
import 'HomePage/Home.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

// Notifikasi lokal
final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
    FlutterLocalNotificationsPlugin();

// Channel Android
const AndroidNotificationChannel _defaultChannel = AndroidNotificationChannel(
  'default_channel',
  'Default Notifications',
  description: 'This channel is used for important notifications.',
  importance: Importance.max,
);

// Background handler
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('🔕 Background message: ${message.notification?.title}');
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  await _setupFlutterNotifications();
  runApp(const MainApp());
}

// Inisialisasi notifikasi lokal
Future<void> _setupFlutterNotifications() async {
  const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
  const initSettings = InitializationSettings(android: androidSettings);

  await flutterLocalNotificationsPlugin.initialize(initSettings);

  await flutterLocalNotificationsPlugin
      .resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>()
      ?.createNotificationChannel(_defaultChannel);
}

// Menampilkan notifikasi
Future<void> _showNotification(String title, String body) async {
  const androidDetails = AndroidNotificationDetails(
    'default_channel',
    'Default Notifications',
    importance: Importance.max,
    priority: Priority.high,
  );
  const notifDetails = NotificationDetails(android: androidDetails);

  await flutterLocalNotificationsPlugin.show(
    0,
    title,
    body,
    notifDetails,
  );
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  final FirebaseMessaging messaging = FirebaseMessaging.instance;
  bool _fcmReady = false;

  @override
  void initState() {
    super.initState();
    print('🕓 App started at: ${DateTime.now()}');
    _requestNotificationPermission();
    _getFCMToken();
    _setupFCMListeners();
  }

  Future<void> _requestNotificationPermission() async {
    NotificationSettings settings = await messaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
    print('🔐 Notifikasi diizinkan: ${settings.authorizationStatus}');
  }

  Future<void> _getFCMToken() async {
    String? token = await messaging.getToken();
    print('📱 FCM Token: $token');
    if (token != null) {
      setState(() {
        _fcmReady = true;
      });
    }
  }

  void _setupFCMListeners() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('🕓 onMessage triggered at: ${DateTime.now()}');
      print('🔔 Foreground message received');

      final title =
          message.data['title'] ?? message.notification?.title ?? 'No Title';
      final body =
          message.data['body'] ?? message.notification?.body ?? 'No Body';
      _showNotification(title, body);
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('📨 App dibuka dari notifikasi: ${message.notification?.title}');
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('id', 'ID'),
        Locale('en', 'US'),
      ],
      home: const Scaffold(
        body: Center(
          child: UmumMainPage(),
        ),
      ),
    );
  }
}
