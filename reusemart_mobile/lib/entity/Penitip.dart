import 'dart:convert';

class Penitip {
  int id_penitip;
  String email_penitip;
  String password_penitip;
  String nama_penitip;
  String NIK;
  String foto_ktp;
  String nomor_telepon_penitip;
  DateTime tanggal_lahir;
  double saldo;
  int poin_loyalitas;
  bool badge;
  double komisi_penitip;
  double rerata_rating;
  String foto_penitip;

  Penitip({
    required this.id_penitip,
    required this.email_penitip,
    required this.password_penitip,
    required this.nama_penitip,
    required this.NIK,
    required this.foto_ktp,
    required this.nomor_telepon_penitip,
    required this.tanggal_lahir,
    required this.saldo,
    required this.poin_loyalitas,
    required this.badge,
    required this.komisi_penitip,
    required this.rerata_rating,
    required this.foto_penitip,
  });

  factory Penitip.fromRawJson(String str) => Penitip.fromJson(json.decode(str));
  factory Penitip.fromJson(Map<String, dynamic> json) => Penitip(
        id_penitip: json["id_penitip"],
        email_penitip: json["email_penitip"],
        password_penitip: json["password_penitip"],
        nama_penitip: json["nama_penitip"],
        NIK: json["NIK"],
        foto_ktp: json["foto_ktp"],
        nomor_telepon_penitip: json["nomor_telepon_penitip"],
        tanggal_lahir: DateTime.parse(json["tanggal_lahir"]),
        saldo: (json["saldo"] ?? 0).toDouble(),
        poin_loyalitas: json["poin_loyalitas"],
        badge: json["badge"] == 1,
        komisi_penitip: (json["komisi_penitip"] ?? 0).toDouble(),
        rerata_rating: (json["rerata_rating"] ?? 0).toDouble(),
        foto_penitip: json["foto_penitip"],
      );

  String toRawJson() => json.encode(toJson());
  Map<String, dynamic> toJson() => {
        "id_penitip": id_penitip,
        "email_penitip": email_penitip,
        "password_penitip": password_penitip,
        "nama_penitip": nama_penitip,
        "NIK": NIK,
        "foto_ktp": foto_ktp,
        "nomor_telepon_penitip": nomor_telepon_penitip,
        "tanggal_lahir": tanggal_lahir.toIso8601String(),
        "saldo": saldo,
        "poin_loyalitas": poin_loyalitas,
        "badge": badge,
        "komisi_penitip": komisi_penitip,
        "rerata_penitip": rerata_rating,
        "foto_penitip": foto_penitip,
      };
}
