class CentroEducativo {
  final int id;
  final String nombre;
  final String? direccion;
  final String? ciudad;
  final String? telefono;
  final String? email;
  final String? estado;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  CentroEducativo({
    required this.id,
    required this.nombre,
    this.direccion,
    this.ciudad,
    this.telefono,
    this.email,
    this.estado,
    this.createdAt,
    this.updatedAt,
  });

  factory CentroEducativo.fromJson(Map<String, dynamic> json) {
    return CentroEducativo(
      id: json['ID'] ?? json['id'],
      nombre: json['Nombre'] ?? json['nombre'] ?? '',
      direccion: json['Direccion'] ?? json['direccion'],
      ciudad: json['Ciudad'] ?? json['ciudad'],
      telefono: json['Telefono'] ?? json['telefono'],
      email: json['Email'] ?? json['email'],
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
      'Direccion': direccion,
      'Ciudad': ciudad,
      'Telefono': telefono,
      'Email': email,
      'Estado': estado,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'CentroEducativo(id: $id, nombre: $nombre)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is CentroEducativo && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
