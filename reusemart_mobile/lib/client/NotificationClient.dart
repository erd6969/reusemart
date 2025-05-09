import 'package:http/http.dart' as http;
import 'dart:convert';

Future<void> sendNotification(String token, String title, String body) async {
  final response = await http.post(
    Uri.parse('http://10.0.2.2:8000/api/send-notification'),
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
