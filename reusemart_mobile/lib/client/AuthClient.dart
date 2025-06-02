import 'dart:convert';
import 'package:http/http.dart' as http;



import 'package:reusemart_mobile/client/baseUrl.dart';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

class AuthClient {
  static final String apiPath = '/api';

  static Future<bool> login(String email, String password) async {
    final fcmToken = await FirebaseMessaging.instance.getToken();

    final url = Uri.http(baseUrl, '$apiPath/mobile/login');

    final body = {
      'email': email,
      'password': password,
    };

    if (fcmToken != null) {
      body['fcm_token'] = fcmToken;
    }

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('token', data['token']);
      await prefs.setString('role', data['role']);
      await prefs.setString('user', jsonEncode(data['user']));

      return true;
    } else {
      print('Login gagal: ${response.body}');
      return false;
    }
  }

  static Future<void> logout() async {
    final url = Uri.http(baseUrl, '$apiPath/logout-mobile');
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token != null) {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        await prefs.clear();
        print('Logout berhasil!');
      } else {
        print('Logout gagal: ${response.body}');
      }
    }
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<String?> getRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('role');
  }

  static Future<Map<String, dynamic>?> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString('user');
    if (userJson != null) {
      return jsonDecode(userJson);
    }
    return null;
  }
}
