import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Kurir.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';

class KurirClient {
  static final String apiPath = '/api';

  static Future<Kurir?> getProfileKurir(String token) async {
    try {
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
    } catch (e) {
      print('Error fetching profile kurir: $e');
      return null;
    }
  }

  static Future<int> countPengiriman(String token) async {
    try {
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
    } catch (e) {
      print('Error counting pengiriman: $e');
      return 0;
    }
  }

  static String getFotoKurir(String thumbnail) {
    return "http://$baseUrl/storage/img/Pegawai/$thumbnail";
  }

  static String getFotoBarang(String thumbnail) {
    print("http://$baseUrl/storage/img/Barang/$thumbnail");
    return "http://$baseUrl/storage/img/Barang/$thumbnail";
  }

  static Future<List<String>> getPengiriman(String token) async {
    try {
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
    } catch (e) {
      print('Error fetching pengiriman: $e');
      return [];
    }
  }

  static Future<List<dynamic>> getHistoryPengiriman(
      String token, String tanggal) async {
    try {
      final url =
          Uri.http(baseUrl, '$apiPath/kurir/histori-pengiriman/$tanggal');

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
    } catch (e) {
      print('Error fetching history pengiriman: $e');
      return [];
    }
  }

  static Future<List<dynamic>> getListPengiriman(String token) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/kurir/list-pengiriman');

      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      print('Response List Pengiriman : ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['data'];
      } else {
        return [];
      }
    } catch (e) {
      print('Error fetching list pengiriman: $e');
      return [];
    }
  }

  static Future<void> updateStatusPengiriman(
      String token, int idTransaksi) async {
    try {
      final url = Uri.http(baseUrl, '$apiPath/kurir/update-status-pengiriman');

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'id_transaksi_pembelian': idTransaksi,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to update status pengiriman');
      }
    } catch (e) {
      print('Error updating status pengiriman: $e');
      throw e;
    }
  }
}
