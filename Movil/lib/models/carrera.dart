class Carrera {
  final int id;
  final String nombre;
  final int? idCentroEducativo;
  final String? estado;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Carrera({
    required this.id,
    required this.nombre,
    this.idCentroEducativo,
    this.estado,
    this.createdAt,
    this.updatedAt,
  });

  factory Carrera.fromJson(Map<String, dynamic> json) {
    return Carrera(
      id: json['ID'] ?? json['id'],
      nombre: json['Nombre'] ?? json['nombre'] ?? '',
      idCentroEducativo: json['ID_centro_educativo'] ?? json['id_centro_educativo'],
      estado: json['Estado'] ?? json['estado'],
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at']) 
          : null,
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ID': id,
      'Nombre': nombre,
      'ID_centro_educativo': idCentroEducativo,
      'Estado': estado,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'Carrera(id: $id, nombre: $nombre, centro: $idCentroEducativo)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Carrera && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
