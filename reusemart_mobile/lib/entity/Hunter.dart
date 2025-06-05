import 'dart:convert';

class Hunter {
  int id_hunter;
  String email_hunter;
  String password_hunter;
  String nama_hunter;
  String nomor_telepon_hunter;
  double total_komisi;
  String foto_hunter;
  DateTime tanggal_lahir_hunter;

  Hunter({
    required this.id_hunter,
    required this.email_hunter,
    required this.password_hunter,
    required this.nama_hunter,
    required this.nomor_telepon_hunter,
    required this.total_komisi,
    required this.foto_hunter,
    required this.tanggal_lahir_hunter,
  });

  factory Hunter.fromRawJson(String str) => Hunter.fromJson(json.decode(str));
  factory Hunter.fromJson(Map<String, dynamic> json) => Hunter(
        id_hunter: json["id_hunter"],
        email_hunter: json["email_hunter"],
        password_hunter: json["password_hunter"],
        nama_hunter: json["nama_hunter"],
        nomor_telepon_hunter: json["nomor_telepon_hunter"],
        total_komisi: json["total_komisi"].toDouble(),
        foto_hunter: json["foto_hunter"],
        tanggal_lahir_hunter: DateTime.parse(json["tanggal_lahir_hunter"]),
      );

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_hunter": id_hunter,
        "email_hunter": email_hunter,
        "password_hunter": password_hunter,
        "nama_hunter": nama_hunter,
        "nomor_telepon_hunter": nomor_telepon_hunter,
        "total_komisi": total_komisi,
        "foto_hunter": foto_hunter,
         "tanggal_lahir_pembeli":
            "${tanggal_lahir_hunter.year.toString().padLeft(4, '0')}-${tanggal_lahir_hunter.month.toString().padLeft(2, '0')}-${tanggal_lahir_hunter.day.toString().padLeft(2, '0')}",
      };
}
