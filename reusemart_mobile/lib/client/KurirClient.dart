import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Kurir.dart';

class KurirClient {
  static const String baseUrl = '10.0.2.2:8000';
  static final String apiPath = '/api';

  static Future<Kurir?> getProfileKurir(String token) async {
    final url = Uri.http(baseUrl, '$apiPath/pegawai/show-profile');
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return Kurir.fromJson(data);
    } else {
      return null;
    }
  }

  static Future<int> countPengiriman(String token) async {
    final url = Uri.http(baseUrl, '$apiPath/kurir/count-pengiriman');
    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
      },
    );
    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');
    print('token : $token');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['count'];
    } else {
      return 0;
    }
  }

  static String getFotoKurir(String thumbnail) {
    return "http://$baseUrl/storage/img/Pegawai/$thumbnail";
  }

  static String getFotoBarang(String thumbnail) {
    return "http://$baseUrl/storage/img/Barang/$thumbnail";
  }

  static Future<List<String>> getPengiriman(String token) async {
    final url = Uri.http(baseUrl, '$apiPath/kurir/pengiriman');
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
      return data['data'];
    } else {
      return [];
    }
  }

  static Future<List<dynamic>> getHistoryPengiriman(
      String token, String tanggal) async {
    final url = Uri.http(baseUrl, '$apiPath/kurir/histori-pengiriman/$tanggal');

    final response = await http.get(
      url,
      headers: {
        'Authorization': 'Bearer $token',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    );

    print("tanggal : $tanggal");
    print('Response History : ${response.body}');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['data'];
    } else {
      return [];
    }
  }
}
