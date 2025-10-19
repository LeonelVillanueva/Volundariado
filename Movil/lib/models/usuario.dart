class Usuario {
  final int id;
  final String nombres;
  final String apellidos;
  final String? emailPersonal;
  final String? emailAcademico;
  final String? telefono;
  final String? fechaNacimiento;
  final int? esEstudiante;
  final int? idCentroEducativo;
  final String? numCuenta;
  final int? idCarrera;
  final String? urlFotoPerfil;
  final int? estaVerificado;
  final int? horasVoluntariadoAcumuladas;
  final String usuarioNombre;
  final int idRol;
  final String? estado;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Usuario({
    required this.id,
    required this.nombres,
    required this.apellidos,
    this.emailPersonal,
    this.emailAcademico,
    this.telefono,
    this.fechaNacimiento,
    this.esEstudiante,
    this.idCentroEducativo,
    this.numCuenta,
    this.idCarrera,
    this.urlFotoPerfil,
    this.estaVerificado,
    this.horasVoluntariadoAcumuladas,
    required this.usuarioNombre,
    required this.idRol,
    this.estado,
    this.createdAt,
    this.updatedAt,
  });

  factory Usuario.fromJson(Map<String, dynamic> json) {
    return Usuario(
      id: json['ID'] ?? json['id'],
      nombres: json['Nombres'] ?? json['nombres'] ?? '',
      apellidos: json['Apellidos'] ?? json['apellidos'] ?? '',
      emailPersonal: json['Email_personal'] ?? json['email_personal'],
      emailAcademico: json['Email_academico'] ?? json['email_academico'],
      telefono: json['Telefono'] ?? json['telefono'],
      fechaNacimiento: json['Fecha_nacimiento'] ?? json['fecha_nacimiento'],
      esEstudiante: json['Es_estudiante'] ?? json['es_estudiante'],
      idCentroEducativo: json['ID_centro_educativo'] ?? json['id_centro_educativo'],
      numCuenta: json['Num_cuenta'] ?? json['num_cuenta'],
      idCarrera: json['ID_carrera'] ?? json['id_carrera'],
      urlFotoPerfil: json['Url_foto_perfil'] ?? json['url_foto_perfil'],
      estaVerificado: json['Esta_verificado'] ?? json['esta_verificado'],
      horasVoluntariadoAcumuladas: json['Horas_voluntariado_acumuladas'] ?? json['horas_voluntariado_acumuladas'],
      usuarioNombre: json['Usuario_nombre'] ?? json['usuario_nombre'] ?? '',
      idRol: json['ID_rol'] ?? json['id_rol'],
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
      'Nombres': nombres,
      'Apellidos': apellidos,
      'Email_personal': emailPersonal,
      'Email_academico': emailAcademico,
      'Telefono': telefono,
      'Fecha_nacimiento': fechaNacimiento,
      'Es_estudiante': esEstudiante,
      'ID_centro_educativo': idCentroEducativo,
      'Num_cuenta': numCuenta,
      'ID_carrera': idCarrera,
      'Url_foto_perfil': urlFotoPerfil,
      'Esta_verificado': estaVerificado,
      'Horas_voluntariado_acumuladas': horasVoluntariadoAcumuladas,
      'Usuario_nombre': usuarioNombre,
      'ID_rol': idRol,
      'Estado': estado,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  Usuario copyWith({
    int? id,
    String? nombres,
    String? apellidos,
    String? emailPersonal,
    String? emailAcademico,
    String? telefono,
    String? fechaNacimiento,
    int? esEstudiante,
    int? idCentroEducativo,
    String? numCuenta,
    int? idCarrera,
    String? urlFotoPerfil,
    int? estaVerificado,
    int? horasVoluntariadoAcumuladas,
    String? usuarioNombre,
    int? idRol,
    String? estado,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Usuario(
      id: id ?? this.id,
      nombres: nombres ?? this.nombres,
      apellidos: apellidos ?? this.apellidos,
      emailPersonal: emailPersonal ?? this.emailPersonal,
      emailAcademico: emailAcademico ?? this.emailAcademico,
      telefono: telefono ?? this.telefono,
      fechaNacimiento: fechaNacimiento ?? this.fechaNacimiento,
      esEstudiante: esEstudiante ?? this.esEstudiante,
      idCentroEducativo: idCentroEducativo ?? this.idCentroEducativo,
      numCuenta: numCuenta ?? this.numCuenta,
      idCarrera: idCarrera ?? this.idCarrera,
      urlFotoPerfil: urlFotoPerfil ?? this.urlFotoPerfil,
      estaVerificado: estaVerificado ?? this.estaVerificado,
      horasVoluntariadoAcumuladas: horasVoluntariadoAcumuladas ?? this.horasVoluntariadoAcumuladas,
      usuarioNombre: usuarioNombre ?? this.usuarioNombre,
      idRol: idRol ?? this.idRol,
      estado: estado ?? this.estado,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  String toString() {
    return 'Usuario(id: $id, nombres: $nombres, apellidos: $apellidos, usuarioNombre: $usuarioNombre)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Usuario && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
