import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/client/baseUrl.dart';

class BarangClient {
  // static const String baseUrl = '10.0.2.2:8000';
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

  static String getFotoBarang(String thumbnail) {
    print("http://$baseUrl/storage/img/Barang/$thumbnail");
    return "http://$baseUrl/storage/img/Barang/$thumbnail";
  }
}
