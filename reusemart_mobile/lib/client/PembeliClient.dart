import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';

class PembeliClient {
  static final String apiPath = '/api';

  static Future<Pembeli?> getProfilePembeli(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/pembeli/show-profile');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Pembeli.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      print('Error fetching profile pembeli: $e');
      return null;
    }
  }

  static String getFotoPembeli(String thumbnail) {
    return "http://$baseUrl/storage/img/Pembeli/$thumbnail";
  }
}
