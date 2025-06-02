import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:reusemart_mobile/client/baseUrl.dart';

Future<void> sendNotification(String token, String title, String body) async {
  final response = await http.post(
    Uri.parse('$baseUrl/api/send-notification'),
    headers: {'Content-Type': 'application/json'},
    body: json.encode({
      'token': token,
      'title': title,
      'body': body,
    }),
  );

  if (response.statusCode == 200) {
    print("Notification sent!");
  } else {
    print("Failed to send notification: ${response.body}");
  }
}
