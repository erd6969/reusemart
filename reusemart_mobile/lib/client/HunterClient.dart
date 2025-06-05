import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Hunter.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';

class HunterClient {
  static final String apiPath = '/api';

  static Future<Hunter?> getProfileHunter(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/hunter/show-profile');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return Hunter.fromJson(data);
      } else {
        return null;
      }
    } catch (e) {
      print('Error fetching profile Hunter: $e');
      return null;
    }
  }

  static String getFotoHunter(String thumbnail) {
    return "http://$baseUrl/storage/img/Hunter/$thumbnail";
  }
}
