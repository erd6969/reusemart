import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:reusemart_mobile/client/AuthClient.dart';

import 'package:reusemart_mobile/entity/Penitip.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';

import 'package:reusemart_mobile/client/baseUrl.dart';

class PenitipClient {
  static final String apiPath = '/api';

  static Future<Penitip?> getProfilePenitip(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/penitip/profile');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Penitip.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      print('Error fetching profile Penitip: $e');
      return null;
    }
  }

  static String getFotoPenitip(String thumbnail) {
    return "http://$baseUrl/storage/img/Penitip/$thumbnail";
  }

  static Future<List<Map<String, dynamic>>> getPenitipHistory(String token) async {

    /*
    contoh nya (buat agus belaajr be)
      Map<String, dynamic> contohMap = {
        "nama": "Budi",
        "umur": 25,
        "aktif": true,
      };
    
    Kalau list of maps, misalnya:
      List<Map<String, dynamic>> contohList = [
        {"nama": "Budi", "umur": 25, "aktif": true},
        {"nama": "Siti", "umur": 30, "aktif": false},
      ];

    */
    try {
      final url = Uri.http(baseUrl, '$apiPath/penitip/show-history-penitipan');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data);
      } else {
        return [];
      }
    } catch (e) {
      print('Error fetching penitip history: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>> getTopSeller() async {
    try {
      final token = await AuthClient.getToken();
      if (token == null) throw Exception("Token tidak ditemukan");
      final url = Uri.http(baseUrl, '$apiPath/penitip/get-top-seller');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Map<String, dynamic>.from(data);
      } else {
        return {};
      }
    } catch (e) {
      print('Error fetching top seller: $e');
      return {};
    }
  }
}
