import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Configuración de la API
class ApiConfig {
  // URL base del backend
  // Para emulador Android: http://10.0.2.2:3000
  // Para emulador iOS: http://localhost:3000
  // Para dispositivo físico: Usar tu IP local (ej: http://192.168.1.10:3000)
  static String get baseUrl => dotenv.env['API_URL'] ?? 'http://10.0.2.2:3000';
  
  // Endpoints
  static String get loginUrl => '$baseUrl/api/auth/login';
  static String get registerUrl => '$baseUrl/api/auth/registrar';
  static String get profileUrl => '$baseUrl/api/auth/perfil';
  static String get eventosUrl => '$baseUrl/api/eventos';
  static String get usuariosUrl => '$baseUrl/api/usuarios';
  
  // Timeout para peticiones
  static const Duration timeout = Duration(seconds: 30);
}

