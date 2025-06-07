import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Hunter.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';

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

  static Future<Map<String, dynamic>> getAllHistoryHunter({int page = 1}) async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    try {
      final url = Uri.http(baseUrl, '$apiPath/hunter/history', {
        'page': page.toString(),
      });

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return {
          'items': List<Map<String, dynamic>>.from(data['data']),
          'currentPage': data['current_page'],
          'lastPage': data['last_page'],
        };
      } else {
        throw Exception('Failed to load history hunter');
      }
    } catch (e) {
      throw Exception('Error fetching history hunter: $e');
    }
  }
}
