import 'dart:convert';

class Pembeli {
  int id_pembeli;
  String email_pembeli;
  String password_pembeli;
  String nama_pembeli;
  String nomor_telepon_pembeli;
  DateTime tanggal_lahir_pembeli;
  int poin_loyalitas;
  String foto_pembeli;

  Pembeli({
    required this.id_pembeli,
    required this.email_pembeli,
    required this.password_pembeli,
    required this.nama_pembeli,
    required this.nomor_telepon_pembeli,
    required this.tanggal_lahir_pembeli,
    required this.poin_loyalitas,
    required this.foto_pembeli,
  });

  factory Pembeli.fromRawJson(String str) => Pembeli.fromJson(json.decode(str));
  factory Pembeli.fromJson(Map<String, dynamic> json) => Pembeli(
        id_pembeli: json["id_pembeli"],
        email_pembeli: json["email_pembeli"],
        password_pembeli: json["password_pembeli"],
        nama_pembeli: json["nama_pembeli"],
        nomor_telepon_pembeli: json["nomor_telepon_pembeli"],
        tanggal_lahir_pembeli: DateTime.parse(json["tanggal_lahir_pembeli"]),
        poin_loyalitas: json["poin_loyalitas"],
        foto_pembeli: json["foto_pembeli"],
      );

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_pembeli": id_pembeli,
        "email_pembeli": email_pembeli,
        "password_pembeli": password_pembeli,
        "nama_pembeli": nama_pembeli,
        "nomor_telepon_pembeli": nomor_telepon_pembeli,
        "tanggal_lahir_pembeli":
            "${tanggal_lahir_pembeli.year.toString().padLeft(4, '0')}-${tanggal_lahir_pembeli.month.toString().padLeft(2, '0')}-${tanggal_lahir_pembeli.day.toString().padLeft(2, '0')}",
        "poin_loyalitas": poin_loyalitas,
        "foto_pembeli": foto_pembeli,
      };
}
