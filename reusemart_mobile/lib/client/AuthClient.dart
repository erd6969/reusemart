import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:reusemart_mobile/entity/Kurir.dart';
import 'package:reusemart_mobile/entity/Hunter.dart';
import 'package:reusemart_mobile/entity/Penitip.dart';

import 'package:shared_preferences/shared_preferences.dart';

class AuthClient {
  static const String baseUrl = '10.0.2.2:8000';
  static final String apiPath = '/api';

  static Future<bool> login(String email, String password) async {
    final url = Uri.http(baseUrl, '$apiPath/mobile/login');

    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      // Simpan token dan data user ke SharedPreferences
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
    final url = Uri.http(baseUrl, '$apiPath/logout');

    // Ambil token yang disimpan di SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token != null) {
      // Kirim token di header untuk otentikasi
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Jika berhasil logout, hapus token dari SharedPreferences
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
