import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

/// Servicio para manejar peticiones a la API
class ApiService {
  late final Dio _dio;
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.timeout,
      receiveTimeout: ApiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    ));
    
    // Interceptor para agregar token automáticamente
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }
  
  /// Obtener token del almacenamiento local
  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }
  
  /// Guardar token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }
  
  /// Eliminar token
  Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('usuario');
  }
  
  /// Login
  Future<Map<String, dynamic>> login(String usuario, String clave) async {
    try {
      final response = await _dio.post(
        '/api/auth/login',
        data: {
          'usuario_nombre': usuario,
          'clave': clave,
        },
      );
      
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Verificar token
  Future<Map<String, dynamic>> verificarToken() async {
    try {
      final response = await _dio.get('/api/auth/verificar');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Obtener perfil del usuario
  Future<Map<String, dynamic>> obtenerPerfil() async {
    try {
      final response = await _dio.get('/api/auth/perfil');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Obtener eventos
  Future<Map<String, dynamic>> obtenerEventos() async {
    try {
      final response = await _dio.get('/api/eventos');
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
  
  /// Manejo de errores
  String _handleError(DioException e) {
    if (e.response != null) {
      final data = e.response!.data;
      if (data is Map && data.containsKey('mensaje')) {
        return data['mensaje'];
      }
      return 'Error: ${e.response!.statusCode}';
    } else if (e.type == DioExceptionType.connectionTimeout) {
      return 'Tiempo de espera agotado. Verifica tu conexión.';
    } else if (e.type == DioExceptionType.receiveTimeout) {
      return 'El servidor tardó demasiado en responder.';
    } else {
      return 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
    }
  }
}

