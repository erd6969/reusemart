import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Penitip.dart';

class PenitipClient {
  // static const String baseUrl = '10.0.2.2:8000';
  static const String baseUrl = '192.168.0.112:8000';
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
}
