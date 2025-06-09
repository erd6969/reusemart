import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';

import 'package:reusemart_mobile/client/baseUrl.dart';

class BarangClient {
  static final String apiPath = '/api';
  static Future<List<dynamic>> getBarang(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/shop-page');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      // print('Response status: ${response.statusCode}');
      // print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        print('Request gagal: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching barang: $e');
      return [];
    }
  }

  static Future<List<dynamic>> getBarangUmum() async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/shop-page');
      final response = await http.get(
        url,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      // print('Response status: ${response.statusCode}');
      // print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        print('Request gagal: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching barang: $e');
      return [];
    }
  }

  static String getFotoBarang(String thumbnail) {
    print("http://$baseUrl/storage/img/Barang/$thumbnail");
    return "http://$baseUrl/storage/img/Barang/$thumbnail";
  }

  static Future<Map<String, dynamic>?> getHistoryBarangPenitipById(
      int id) async {
    try {
      final token = await AuthClient.getToken();
      if (token == null) throw Exception("Token tidak ditemukan");

      final url = Uri.http(baseUrl, '$apiPath/penitip/show-detail-history/$id');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty) {
          return data[0]; // ⬅️ Return only the first item
        }
      }
      print('Request gagal: ${response.statusCode}');
      return null;
    } catch (e) {
      print('Error fetching barang by ID: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getHistoryBarangPembeliById(
      int id) async {
    try {
      final token = await AuthClient.getToken();
      if (token == null) throw Exception("Token tidak ditemukan");

      final url = Uri.http(baseUrl, '$apiPath/pembeli/show-detail-history/$id');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty) {
          return data[0]; // ⬅️ Return only the first item
        }
      }
      print('Request gagal: ${response.statusCode}');
      return null;
    } catch (e) {
      print('Error fetching barang by ID: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getHistoryBarangHunterById(
      int id) async {
    try {
      final token = await AuthClient.getToken();
      if (token == null) throw Exception("Token tidak ditemukan");

      final url = Uri.http(baseUrl, '$apiPath/hunter/show-detail-history/$id');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty) {
          return data[0]; // ⬅️ Return only the first item
        }
      }
      print('Request gagal: ${response.statusCode}');
      return null;
    } catch (e) {
      print('Error fetching barang by ID: $e');
      return null;
    }
  }

  static Future<List<dynamic>> getMerchandise(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/pembeli/show-merchandise');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      // print('Response status: ${response.statusCode}');
      // print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        print('Request gagal: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching barang: $e');
      return [];
    }
  }

  static String getFotoMerchandise(String thumbnail) {
    print("http://$baseUrl/storage/img/Merchandise/$thumbnail");
    return "http://$baseUrl/storage/img/Merchandise/$thumbnail";
  }
}
