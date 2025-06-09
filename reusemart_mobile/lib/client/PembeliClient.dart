import 'dart:convert';
import 'package:http/http.dart' as http;

import 'package:reusemart_mobile/entity/Pembeli.dart';
import 'package:reusemart_mobile/client/baseUrl.dart';
import 'package:reusemart_mobile/client/AuthClient.dart';
import 'package:intl/intl.dart';

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

  static Future<Map<String, dynamic>> getAllHistoryPembelian(
      {int page = 1}) async {
    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    try {
      final url =
          Uri.http(baseUrl, '$apiPath/pembeli/show-all-history-pembelian', {
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
        throw Exception('Failed to load history pembelian');
      }
    } catch (e) {
      throw Exception('Error fetching history pembelian: $e');
    }
  }

  static Future<void> createTransaksiMerchandise(
      String token, int idMerchandise) async {
    try {
      final url = Uri.http(
          baseUrl, '$apiPath/pembeli/create-merchandise/$idMerchandise');

      print('Request URL: $url');

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode != 201) {
        throw Exception('Failed to create transaksi merchandise');
      }
    } catch (e) {
      print('Error Create transaksi merchandise: $e');
      throw e;
    }
  }

  static Future<Map<String, dynamic>> getHistoryPembelianByTanggal(
      {int page = 1, DateTime? tanggalMulai, DateTime? tanggalSelesai}) async {
    final dateFormat = DateFormat('yyyy-MM-dd');

    final token = await AuthClient.getToken();
    if (token == null) throw Exception("Token tidak ditemukan");
    try {
      final url =
          Uri.http(baseUrl, '$apiPath/pembeli/history-pembelian-by-tanggal', {
        'tanggal_mulai': dateFormat.format(tanggalMulai!),
        'tanggal_selesai': dateFormat.format(tanggalSelesai!),
        'page': page.toString(),
      });

      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['data'] != null) {
          return {
            'items': List<Map<String, dynamic>>.from(data['data']),
            'currentPage': data['current_page'],
            'lastPage': data['last_page'],
          };
        }
        else if (data['items'] == null ||
            (data['items'] is List && data['items'].isEmpty)) {
          print('Data tidak ditemukan atau format tidak sesuai: $data');
          return {
            'items': [],
            'currentPage': 1,
            'lastPage': 1,
          };
        }

      } else {
        throw Exception('Failed to load history pembelian by tanggal');
      }
    } catch (e) {
      throw Exception('Error fetching history pembelian by tanggal: $e');
    }
    throw Exception('Unexpected error in getHistoryPembelianByTanggal');
  }
}
