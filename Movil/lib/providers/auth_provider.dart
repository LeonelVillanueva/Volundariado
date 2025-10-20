import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../services/api_service.dart';
import '../models/usuario.dart';

/// Provider para manejar autenticación
class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  bool _isAuthenticated = false;
  bool _isLoading = false;
  String? _error;
  Usuario? _usuario;
  
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get error => _error;
  Usuario? get usuario => _usuario;
  
  /// Verificar si hay sesión guardada
  Future<void> verificarSesion() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      final usuarioJson = prefs.getString('usuario');
      
      if (token != null && usuarioJson != null) {
        final usuarioData = json.decode(usuarioJson);
        _usuario = Usuario.fromJson(usuarioData);
        _isAuthenticated = true;
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error al verificar sesión: $e');
    }
  }
  
  /// Login
  Future<bool> login(String usuario, String clave) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.login(usuario, clave);
      
      if (response['success'] == true) {
        final token = response['data']['token'];
        _usuario = Usuario.fromJson(response['data']['usuario']);
        
        // Guardar en SharedPreferences
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', token);
        await prefs.setString('usuario', json.encode(_usuario!.toJson()));
        
        // Guardar token en ApiService
        await _apiService.saveToken(token);
        
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _error = response['mensaje'] ?? 'Error al iniciar sesión';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = _convertirMensajeAmigable(e.toString());
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  String _convertirMensajeAmigable(String mensajeOriginal) {
    final mensajes = {
      'Credenciales inválidas': 'Usuario o contraseña incorrectos',
      'Usuario y contraseña son requeridos': 'Por favor completa todos los campos',
    };
    
    // Buscar mensaje exacto
    if (mensajes[mensajeOriginal] != null) {
      return mensajes[mensajeOriginal]!;
    }
    
    // Buscar por palabra clave
    if (mensajeOriginal.contains('pendiente de aprobación')) {
      return 'Tu cuenta está en revisión. Te notificaremos cuando sea aprobada.';
    }
    if (mensajeOriginal.contains('rechazada')) {
      return 'Tu solicitud fue rechazada. Contacta al administrador.';
    }
    if (mensajeOriginal.contains('inactiv')) {
      return 'Tu cuenta está inactiva. Contacta al administrador.';
    }
    
    // Mensaje genérico
    return 'Ocurrió un error. Por favor intenta de nuevo.';
  }
  
  /// Logout
  Future<void> logout() async {
    await _apiService.removeToken();
    _isAuthenticated = false;
    _usuario = null;
    _error = null;
    notifyListeners();
  }
  
  /// Limpiar error
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Actualizar datos del usuario
  Future<void> actualizarUsuario(Map<String, dynamic> datosUsuario) async {
    if (_usuario != null) {
      _usuario = Usuario.fromJson(datosUsuario);
      
      // Actualizar en SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('usuario', json.encode(_usuario!.toJson()));
      
      notifyListeners();
    }
  }
  
  /// Obtener nombre del rol
  String getRolNombre(int? idRol) {
    const roles = {
      1: 'Invitado',
      2: 'Estudiante voluntario',
      3: 'Voluntario general',
      4: 'Docente',
      5: 'Organizador',
      6: 'Administrador',
    };
    return roles[idRol] ?? 'Sin rol';
  }
  
  /// Obtener descripción del rol
  String getRolDescripcion(int? idRol) {
    const descripciones = {
      1: 'Puede visualizar eventos públicos',
      2: 'Puede inscribirse en eventos para estudiantes',
      3: 'Puede inscribirse en eventos públicos',
      4: 'Crea eventos y valida estudiantes',
      5: 'Crea eventos y gestiona inscripciones',
      6: 'Control total del sistema',
    };
    return descripciones[idRol] ?? '';
  }
}

