import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/centro_educativo.dart';
import '../models/carrera.dart';

class VerPerfilEstudianteScreen extends StatefulWidget {
  final int idEstudiante;

  const VerPerfilEstudianteScreen({
    Key? key,
    required this.idEstudiante,
  }) : super(key: key);

  @override
  State<VerPerfilEstudianteScreen> createState() => _VerPerfilEstudianteScreenState();
}

class _VerPerfilEstudianteScreenState extends State<VerPerfilEstudianteScreen> {
  final _apiService = ApiService();
  
  Map<String, dynamic>? _estudiante;
  CentroEducativo? _centroEducativo;
  Carrera? _carrera;
  String? _fotoPerfil;
  bool _cargando = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  Future<void> _cargarDatos() async {
    setState(() => _cargando = true);
    
    try {
      // Cargar información del estudiante
      final response = await _apiService.get('/api/usuarios/${widget.idEstudiante}');
      
      if (response['success']) {
        setState(() => _estudiante = response['data']);
        
        // Cargar foto de perfil
        await _cargarFotoPerfil();
        
        // Cargar centro educativo si tiene
        if (_estudiante!['ID_centro_educativo'] != null) {
          await _cargarCentroEducativo();
        }
        
        // Cargar carrera si tiene
        if (_estudiante!['ID_carrera'] != null) {
          await _cargarCarrera();
        }
      } else {
        setState(() => _error = response['mensaje'] ?? 'No se pudo cargar el perfil');
      }
    } catch (e) {
      setState(() => _error = 'Error al cargar el perfil: $e');
    } finally {
      setState(() => _cargando = false);
    }
  }

  Future<void> _cargarFotoPerfil() async {
    try {
      final response = await _apiService.get('/api/fotos-perfil/usuario/${widget.idEstudiante}');
      if (response['success'] && response['data'] != null) {
        setState(() => _fotoPerfil = response['data']['imagen_url']);
      }
    } catch (e) {
      // No tiene foto
    }
  }

  Future<void> _cargarCentroEducativo() async {
    try {
      final response = await _apiService.get('/api/centros/${_estudiante!['ID_centro_educativo']}');
      if (response['success']) {
        setState(() => _centroEducativo = CentroEducativo.fromJson(response['data']));
      }
    } catch (e) {
      print('Error al cargar centro: $e');
    }
  }

  Future<void> _cargarCarrera() async {
    try {
      final response = await _apiService.get('/api/carreras/${_estudiante!['ID_carrera']}');
      if (response['success']) {
        setState(() => _carrera = Carrera.fromJson(response['data']));
      }
    } catch (e) {
      print('Error al cargar carrera: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil de Usuario'),
        backgroundColor: const Color(0xFF16A34A),
        foregroundColor: Colors.white,
      ),
      body: _cargando
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.error_outline, size: 64, color: Colors.red),
                        const SizedBox(height: 16),
                        Text(
                          _error!,
                          style: const TextStyle(fontSize: 16, color: Colors.red),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                )
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      // Header con foto
                      Container(
                        color: const Color(0xFF16A34A),
                        padding: const EdgeInsets.symmetric(vertical: 32),
                        child: Center(
                          child: Column(
                            children: [
                              // Foto de perfil grande
                              Stack(
                                children: [
                                  Container(
                                    width: 120,
                                    height: 120,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.white, width: 4),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.2),
                                          blurRadius: 10,
                                          offset: const Offset(0, 4),
                                        ),
                                      ],
                                    ),
                                    child: _fotoPerfil != null
                                        ? ClipOval(
                                            child: Image.memory(
                                              Uri.parse(_fotoPerfil!).data!.contentAsBytes(),
                                              fit: BoxFit.cover,
                                              width: 120,
                                              height: 120,
                                            ),
                                          )
                                        : CircleAvatar(
                                            radius: 58,
                                            backgroundColor: const Color(0xFFF0FDF4),
                                            child: Text(
                                              _getIniciales(
                                                _estudiante!['Nombres'] ?? '',
                                                _estudiante!['Apellidos'] ?? '',
                                              ),
                                              style: const TextStyle(
                                                fontSize: 40,
                                                fontWeight: FontWeight.bold,
                                                color: Color(0xFF16A34A),
                                              ),
                                            ),
                                          ),
                                  ),
                                  // Badge de verificado
                                  if (_estudiante!['Esta_verificado'] == 1)
                                    Positioned(
                                      bottom: 0,
                                      right: 0,
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: BoxDecoration(
                                          color: Colors.green,
                                          shape: BoxShape.circle,
                                          border: Border.all(color: Colors.white, width: 2),
                                        ),
                                        child: const Icon(
                                          Icons.check,
                                          color: Colors.white,
                                          size: 20,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 16),
                              
                              // Nombre
                              Text(
                                '${_estudiante!['Nombres']} ${_estudiante!['Apellidos']}',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              
                              // Badges
                              Wrap(
                                alignment: WrapAlignment.center,
                                spacing: 8,
                                children: [
                                  Chip(
                                    label: Text(_getRolNombre(_estudiante!['ID_rol'])),
                                    backgroundColor: const Color(0xFFD1FAE5),
                                    labelStyle: const TextStyle(
                                      color: Color(0xFF166534),
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  if (_estudiante!['Esta_verificado'] == 0)
                                    const Chip(
                                      label: Text('Pendiente'),
                                      backgroundColor: Color(0xFFFEF3C7),
                                      labelStyle: TextStyle(
                                        color: Color(0xFF92400E),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      // Contenido
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            // Información Personal
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Información Personal',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF166534),
                                      ),
                                    ),
                                    const Divider(),
                                    if (_estudiante!.containsKey('Usuario_nombre'))
                                      _buildInfoRow('Usuario', _estudiante!['Usuario_nombre'] ?? 'N/A'),
                                    if (_estudiante!.containsKey('Email_personal'))
                                      _buildInfoRow('Email Personal', _estudiante!['Email_personal'] ?? 'No proporcionado'),
                                    if (_estudiante!.containsKey('Email_academico'))
                                      _buildInfoRow('Email Académico', _estudiante!['Email_academico'] ?? 'No proporcionado'),
                                    if (_estudiante!.containsKey('Telefono'))
                                      _buildInfoRow('Teléfono', _estudiante!['Telefono'] ?? 'No proporcionado'),
                                    if (_estudiante!.containsKey('Fecha_nacimiento'))
                                      _buildInfoRow('Fecha Nacimiento', _formatearFecha(_estudiante!['Fecha_nacimiento'])),
                                    _buildInfoRow('Estado', _estudiante!['Estado'] ?? 'N/A'),
                                  ],
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            
                            // Información Académica
                            if (_estudiante!['Es_estudiante'] == 1) ...[
                              Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Información Académica',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Color(0xFF166534),
                                        ),
                                      ),
                                      const Divider(),
                                      if (_estudiante!.containsKey('ID_centro_educativo') && _centroEducativo != null)
                                        _buildInfoRow('Centro Educativo', _centroEducativo!.nombre),
                                      if (_estudiante!.containsKey('ID_carrera') && _carrera != null)
                                        _buildInfoRow('Carrera', _carrera!.nombre),
                                      if (_estudiante!.containsKey('Num_cuenta'))
                                        _buildInfoRow('N° de Cuenta', _estudiante!['Num_cuenta'] ?? 'No proporcionado'),
                                      _buildInfoRow(
                                        'Estado de Verificación',
                                        _estudiante!['Esta_verificado'] == 1 ? 'Verificado' : 'Pendiente',
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                            ],
                            
                            // Horas de Voluntariado
                            if (_estudiante!.containsKey('Horas_voluntariado_acumuladas'))
                              Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Actividad de Voluntariado',
                                        style: TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: Color(0xFF166534),
                                        ),
                                      ),
                                      const Divider(),
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: const Color(0xFFF0FDF4),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: const Icon(
                                              Icons.access_time,
                                              color: Color(0xFF16A34A),
                                              size: 32,
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                '${_estudiante!['Horas_voluntariado_acumuladas'] ?? 0}',
                                                style: const TextStyle(
                                                  fontSize: 32,
                                                  fontWeight: FontWeight.bold,
                                                  color: Color(0xFF16A34A),
                                                ),
                                              ),
                                              const Text(
                                                'Horas acumuladas',
                                                style: TextStyle(color: Colors.grey),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  String _getRolNombre(int idRol) {
    const roles = {
      1: 'Invitado',
      2: 'Estudiante voluntario',
      3: 'Voluntario general',
      4: 'Docente',
      5: 'Organizador',
      6: 'Administrador'
    };
    return roles[idRol] ?? 'Sin rol';
  }

  String _formatearFecha(String? fecha) {
    if (fecha == null) return 'No proporcionada';
    try {
      final date = DateTime.parse(fecha);
      return '${date.day}/${date.month}/${date.year}';
    } catch (e) {
      return 'No proporcionada';
    }
  }

  String _getIniciales(String nombres, String apellidos) {
    final inicial1 = nombres.isNotEmpty ? nombres[0].toUpperCase() : '';
    final inicial2 = apellidos.isNotEmpty ? apellidos[0].toUpperCase() : '';
    return inicial1 + inicial2;
  }
}

