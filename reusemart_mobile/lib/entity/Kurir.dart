import 'dart:convert';

class Kurir {
  int id_pegawai;
  String email_pegawai;
  String password_pegawai;
  String nama_pegawai;
  String tanggal_lahir;
  String foto_pegawai;

  Kurir({
    required this.id_pegawai,
    required this.email_pegawai,
    required this.password_pegawai,
    required this.nama_pegawai,
    required this.tanggal_lahir,
    required this.foto_pegawai,
  });

  factory Kurir.fromRawJson(String str) => Kurir.fromJson(json.decode(str));
  factory Kurir.fromJson(Map<String, dynamic> json) => Kurir(
        id_pegawai: json["id_pegawai"],
        email_pegawai: json["email_pegawai"],
        password_pegawai: json["password_pegawai"],
        nama_pegawai: json["nama_pegawai"],
        tanggal_lahir: json["tanggal_lahir"],
        foto_pegawai: json["foto_pegawai"],
      );

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_pegawai": id_pegawai,
        "email_pegawai": email_pegawai,
        "password_pegawai": password_pegawai,
        "nama_pegawai": nama_pegawai,
        "tanggal_lahir": tanggal_lahir,
        "foto_pegawai": foto_pegawai,
      };
}
