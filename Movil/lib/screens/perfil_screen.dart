import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'dart:convert';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../models/usuario.dart';
import '../models/centro_educativo.dart';
import '../models/carrera.dart';

class PerfilScreen extends StatefulWidget {
  const PerfilScreen({Key? key}) : super(key: key);

  @override
  State<PerfilScreen> createState() => _PerfilScreenState();
}

class _PerfilScreenState extends State<PerfilScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  final _imagePicker = ImagePicker();
  
  // Variables de estado
  Usuario? _usuario;
  List<CentroEducativo> _centrosEducativos = [];
  List<Carrera> _carrerasFiltradas = [];
  bool _cargando = false;
  bool _cargandoFoto = false;
  bool _modoEdicion = false;
  String? _fotoPerfil;
  String? _mensaje;
  bool _esExito = true;
  
  // Configuración de privacidad
  Map<String, dynamic> _privacidad = {
    'perfil_publico': true,
    'mostrar_email_personal': false,
    'mostrar_email_academico': false,
    'mostrar_telefono': false,
    'mostrar_fecha_nacimiento': false,
    'mostrar_centro_educativo': true,
    'mostrar_carrera': true,
    'mostrar_horas_voluntariado': true,
  };

  // Controladores del formulario
  final _nombresController = TextEditingController();
  final _apellidosController = TextEditingController();
  final _emailPersonalController = TextEditingController();
  final _emailAcademicoController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _numCuentaController = TextEditingController();
  
  // Variables del formulario
  DateTime? _fechaNacimiento;
  bool _esEstudiante = false;
  int? _centroEducativoSeleccionado;
  int? _carreraSeleccionada;

  @override
  void initState() {
    super.initState();
    _cargarDatos();
  }

  @override
  void dispose() {
    _nombresController.dispose();
    _apellidosController.dispose();
    _emailPersonalController.dispose();
    _emailAcademicoController.dispose();
    _telefonoController.dispose();
    _numCuentaController.dispose();
    super.dispose();
  }

  Future<void> _cargarDatos() async {
    setState(() => _cargando = true);
    
    try {
      // Cargar datos del usuario desde el backend
      final response = await _apiService.get('/api/auth/perfil');
      if (response['success']) {
        _usuario = Usuario.fromJson(response['data']);
        _llenarFormulario();
        await _cargarFotoPerfil();
      } else {
        // Fallback: usar datos del AuthProvider
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        _usuario = authProvider.usuario;
        if (_usuario != null) {
          _llenarFormulario();
          await _cargarFotoPerfil();
        }
      }

      // Cargar centros educativos
      await _cargarCentrosEducativos();
      
      // Cargar configuración de privacidad
      await _cargarPrivacidad();
      
      // Las carreras se cargarán automáticamente en _llenarFormulario si ya tiene centro
      
    } catch (e) {
      print('Error al cargar datos del perfil: $e');
      // Fallback: usar datos del AuthProvider
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      _usuario = authProvider.usuario;
      if (_usuario != null) {
        _llenarFormulario();
        await _cargarFotoPerfil();
      }
    } finally {
      setState(() => _cargando = false);
    }
  }

  void _llenarFormulario() {
    if (_usuario == null) return;
    
    _nombresController.text = _usuario!.nombres;
    _apellidosController.text = _usuario!.apellidos;
    _emailPersonalController.text = _usuario!.emailPersonal ?? '';
    _emailAcademicoController.text = _usuario!.emailAcademico ?? '';
    _telefonoController.text = _usuario!.telefono ?? '';
    _numCuentaController.text = _usuario!.numCuenta ?? '';
    
    _esEstudiante = _usuario!.esEstudiante == 1;
    _centroEducativoSeleccionado = _usuario!.idCentroEducativo;
    _carreraSeleccionada = _usuario!.idCarrera;
    
    if (_usuario!.fechaNacimiento != null) {
      _fechaNacimiento = DateTime.parse(_usuario!.fechaNacimiento!);
    }
    
    // Cargar carreras si ya tiene un centro seleccionado
    if (_centroEducativoSeleccionado != null) {
      _cargarCarrerasPorCentro(_centroEducativoSeleccionado!);
    }
  }

  Future<void> _cargarCentrosEducativos() async {
    try {
      final response = await _apiService.get('/api/centros');
      if (response['success']) {
        setState(() {
          _centrosEducativos = (response['data'] as List)
              .map((json) => CentroEducativo.fromJson(json))
              .toList();
        });
      }
    } catch (e) {
      print('Error al cargar centros educativos: $e');
    }
  }

  Future<void> _cargarCarrerasPorCentro(int idCentro) async {
    try {
      final response = await _apiService.get('/api/carreras/centro/$idCentro');
      if (response['success']) {
        setState(() {
          _carrerasFiltradas = (response['data'] as List)
              .map((json) => Carrera.fromJson(json))
              .toList();
        });
        
        // Si la carrera seleccionada no está en las filtradas, limpiarla
        if (_carreraSeleccionada != null && 
            !_carrerasFiltradas.any((c) => c.id == _carreraSeleccionada)) {
          setState(() {
            _carreraSeleccionada = null;
          });
        }
      }
    } catch (e) {
      print('Error al cargar carreras del centro: $e');
      setState(() {
        _carrerasFiltradas = [];
      });
    }
  }

  void _onCentroEducativoChanged(int? nuevoCentro) {
    setState(() {
      _centroEducativoSeleccionado = nuevoCentro;
      _carreraSeleccionada = null; // Limpiar carrera al cambiar de centro
      _carrerasFiltradas = [];
    });
    
    if (nuevoCentro != null) {
      _cargarCarrerasPorCentro(nuevoCentro);
    }
  }

  Future<void> _cargarFotoPerfil() async {
    try {
      // Primero verificar si el usuario tiene referencia a foto en MySQL
      if (_usuario?.urlFotoPerfil != null && 
          _usuario!.urlFotoPerfil!.startsWith('mongodb://foto_usuario_')) {
        
        // Si hay referencia, cargar la foto desde MongoDB
        final response = await _apiService.get('/api/fotos-perfil/mi-foto');
        if (response['success'] && response['data'] != null) {
          setState(() {
            _fotoPerfil = response['data']['imagen_url'];
          });
          print('✅ Foto de perfil cargada desde MongoDB');
        }
      } else {
        print('ℹ️ Usuario no tiene foto de perfil (referencia MySQL: ${_usuario?.urlFotoPerfil})');
      }
    } catch (e) {
      print('❌ Error al cargar foto de perfil: $e');
    }
  }

  Future<void> _seleccionarFoto() async {
    try {
      final XFile? imagen = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (imagen != null) {
        await _subirFoto(imagen);
      }
    } catch (e) {
      _mostrarMensaje('Error al seleccionar imagen: $e', false);
    }
  }

  Future<void> _tomarFoto() async {
    try {
      final XFile? imagen = await _imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (imagen != null) {
        await _subirFoto(imagen);
      }
    } catch (e) {
      _mostrarMensaje('Error al tomar foto: $e', false);
    }
  }

  Future<void> _subirFoto(XFile imagen) async {
    setState(() => _cargandoFoto = true);
    
    try {
      // Comprimir imagen antes de subirla
      print('📦 Tamaño original: ${(await imagen.readAsBytes()).length / 1024} KB');
      
      final comprimida = await FlutterImageCompress.compressWithFile(
        imagen.path,
        minWidth: 800,
        minHeight: 800,
        quality: 85,
        format: CompressFormat.jpeg,
      );
      
      if (comprimida == null) {
        _mostrarMensaje('Error al comprimir la imagen', false);
        return;
      }
      
      print('📦 Tamaño comprimido: ${comprimida.length / 1024} KB');
      
      // Convertir a Base64
      final base64 = base64Encode(comprimida);
      final mimeType = 'image/jpeg'; // Siempre JPEG después de comprimir
      
      // Validar tamaño (máximo 5MB después de comprimir)
      if (comprimida.length > 5 * 1024 * 1024) {
        _mostrarMensaje('La imagen sigue siendo muy grande. Intenta con otra foto.', false);
        return;
      }
      
      // Subir a MongoDB
      final response = await _apiService.post('/api/fotos-perfil', {
        'imagen_base64': 'data:$mimeType;base64,$base64',
        'mime_type': mimeType,
        'tamaño_bytes': comprimida.length,
        'nombre_original': imagen.name,
      });
      
      if (response['success']) {
        setState(() {
          _fotoPerfil = 'data:$mimeType;base64,$base64';
        });
        _mostrarMensaje('Foto de perfil actualizada exitosamente', true);
      } else {
        _mostrarMensaje(response['mensaje'] ?? 'Error al subir foto', false);
      }
    } catch (e) {
      print('❌ Error completo: $e');
      _mostrarMensaje('Error al subir la foto: $e', false);
    } finally {
      setState(() => _cargandoFoto = false);
    }
  }


  Future<void> _cargarPrivacidad() async {
    try {
      final response = await _apiService.get('/api/privacidad/mi-configuracion');
      if (response['success']) {
        setState(() {
          _privacidad = Map<String, dynamic>.from(response['data']);
        });
      }
    } catch (e) {
      print('Error al cargar configuración de privacidad: $e');
    }
  }

  Future<void> _guardarPrivacidad() async {
    try {
      final response = await _apiService.put('/api/privacidad/mi-configuracion', _privacidad);
      if (response['success']) {
        _mostrarMensaje('Configuración de privacidad actualizada', true);
      } else {
        _mostrarMensaje(response['mensaje'] ?? 'Error al guardar privacidad', false);
      }
    } catch (e) {
      _mostrarMensaje('Error al guardar privacidad: $e', false);
    }
  }

  Future<void> _guardarPerfil() async {
    if (!_formKey.currentState!.validate()) return;
    
    // VALIDACIÓN: Email personal
    if (_emailPersonalController.text.isNotEmpty && 
        !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailPersonalController.text)) {
      _mostrarMensaje('El email personal no es válido. Debe contener @ y un dominio válido', false);
      return;
    }
    
    // VALIDACIÓN: Email académico
    if (_emailAcademicoController.text.isNotEmpty && 
        !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailAcademicoController.text)) {
      _mostrarMensaje('El email académico no es válido. Debe contener @ y un dominio válido', false);
      return;
    }
    
    // VALIDACIÓN: Teléfono (8 dígitos)
    if (_telefonoController.text.isNotEmpty) {
      final digitos = _telefonoController.text.replaceAll(RegExp(r'\D'), '');
      if (digitos.length != 8) {
        _mostrarMensaje('El teléfono debe tener exactamente 8 dígitos', false);
        return;
      }
    }
    
    // Validar campos de estudiante si está marcado como estudiante
    if (_esEstudiante) {
      if (_centroEducativoSeleccionado == null) {
        _mostrarMensaje('Debe seleccionar un centro educativo', false);
        return;
      }
      if (_numCuentaController.text.trim().isEmpty) {
        _mostrarMensaje('Debe ingresar su número de cuenta o identidad', false);
        return;
      }
      if (_carreraSeleccionada == null) {
        _mostrarMensaje('Debe seleccionar una carrera', false);
        return;
      }
    }
    
    setState(() => _cargando = true);
    
    try {
      final datos = {
        'nombres': _nombresController.text.trim(),
        'apellidos': _apellidosController.text.trim(),
        'email_personal': _emailPersonalController.text.trim(),
        'email_academico': _emailAcademicoController.text.trim(),
        'telefono': _telefonoController.text.trim(),
        'fecha_nacimiento': _fechaNacimiento?.toIso8601String().split('T')[0],
        'es_estudiante': _esEstudiante ? 1 : 0,
        'id_centro_educativo': _esEstudiante ? _centroEducativoSeleccionado : null,
        'num_cuenta': _esEstudiante ? _numCuentaController.text.trim() : null,
        'id_carrera': _esEstudiante ? _carreraSeleccionada : null,
      };
      
      final response = await _apiService.put('/api/auth/perfil', datos);
      
      if (response['success']) {
        // Actualizar usuario en el provider
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        await authProvider.actualizarUsuario(response['data']);
        
        _mostrarMensaje('Perfil actualizado exitosamente', true);
        setState(() => _modoEdicion = false); // Desactivar modo edición
      } else {
        _mostrarMensaje(response['mensaje'] ?? 'Error al actualizar perfil', false);
      }
    } catch (e) {
      _mostrarMensaje('Error al guardar perfil: $e', false);
    } finally {
      setState(() => _cargando = false);
    }
  }

  void _mostrarMensaje(String mensaje, bool esExito) {
    setState(() {
      _mensaje = mensaje;
      _esExito = esExito;
    });
    
    // Limpiar mensaje después de 3 segundos
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        setState(() => _mensaje = null);
      }
    });
  }

  String _obtenerIniciales() {
    final nombres = _nombresController.text.trim();
    final apellidos = _apellidosController.text.trim();
    
    String iniciales = '';
    if (nombres.isNotEmpty) iniciales += nombres[0].toUpperCase();
    if (apellidos.isNotEmpty) iniciales += apellidos[0].toUpperCase();
    
    return iniciales.isEmpty ? '??' : iniciales;
  }

  String _obtenerNombreRol(int? idRol) {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0FDF4), // Verde muy claro
      appBar: AppBar(
        title: const Text(
          'Mi Perfil',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFF16A34A), // Verde medio
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: Icon(
              _modoEdicion ? Icons.close : Icons.edit,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() {
                if (_modoEdicion) {
                  // Cancelar: recargar datos
                  _cargarDatos();
                }
                _modoEdicion = !_modoEdicion;
              });
            },
            tooltip: _modoEdicion ? 'Cancelar' : 'Editar',
          ),
        ],
      ),
      body: _cargando
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Mensaje de estado
                  if (_mensaje != null)
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _esExito 
                            ? const Color(0xFFDCFCE7) // Verde claro
                            : const Color(0xFFFEE2E2), // Rojo claro
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: _esExito 
                              ? const Color(0xFF22C55E) // Verde
                              : const Color(0xFFEF4444), // Rojo
                        ),
                      ),
                      child: Text(
                        _mensaje!,
                        style: TextStyle(
                          color: _esExito 
                              ? const Color(0xFF166534) // Verde oscuro
                              : const Color(0xFF991B1B), // Rojo oscuro
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  
                  // Tarjeta principal
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          // Sección de foto de perfil
                          _buildFotoPerfil(),
                          const SizedBox(height: 24),
                          
                          // Formulario
                          Form(
                            key: _formKey,
                            child: Column(
                              children: [
                                // Datos personales
                                _buildDatosPersonales(),
                                const SizedBox(height: 20),
                                
                                // Datos de estudiante
                                if (_esEstudiante) _buildDatosEstudiante(),
                                
                                // Botón de guardar (solo en modo edición)
                                if (_modoEdicion) ...[
                                  const SizedBox(height: 24),
                                  _buildBotonGuardar(),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Tarjeta de Configuración de Privacidad (Compacta)
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: ExpansionTile(
                      tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      childrenPadding: const EdgeInsets.only(left: 16, right: 16, bottom: 16),
                      leading: const Icon(
                        Icons.privacy_tip_outlined,
                        color: Color(0xFF16A34A),
                        size: 28,
                      ),
                      title: const Text(
                        'Configuración de Privacidad',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF166534),
                        ),
                      ),
                      subtitle: const Text(
                        'Controla qué información es visible',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                      children: [
                        // Nota informativa
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDEEBFF),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: const Color(0xFF1976D2)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.info_outline, color: Color(0xFF1976D2), size: 16),
                              SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  'Tu docente podrá ver tu información por motivos académicos.',
                                  style: TextStyle(fontSize: 11, color: Color(0xFF1565C0)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        
                        // Perfil Público
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0FDF4),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: SwitchListTile(
                            value: _privacidad['perfil_publico'] ?? true,
                            onChanged: (value) {
                              setState(() {
                                _privacidad['perfil_publico'] = value;
                              });
                            },
                            title: const Text(
                              'Perfil Público',
                              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                            ),
                            subtitle: const Text(
                              'Permite que otros usuarios vean tu perfil',
                              style: TextStyle(fontSize: 11),
                            ),
                            activeColor: const Color(0xFF16A34A),
                            contentPadding: EdgeInsets.zero,
                            dense: true,
                          ),
                        ),
                        
                        // Opciones de privacidad compactas
                        if (_privacidad['perfil_publico'] ?? true) ...[
                          const SizedBox(height: 8),
                          _buildOpcionPrivacidadCompacta('mostrar_email_personal', 'Email personal'),
                          _buildOpcionPrivacidadCompacta('mostrar_email_academico', 'Email académico'),
                          _buildOpcionPrivacidadCompacta('mostrar_telefono', 'Teléfono'),
                          _buildOpcionPrivacidadCompacta('mostrar_fecha_nacimiento', 'Fecha de nacimiento'),
                          _buildOpcionPrivacidadCompacta('mostrar_centro_educativo', 'Centro educativo'),
                          _buildOpcionPrivacidadCompacta('mostrar_carrera', 'Carrera'),
                          _buildOpcionPrivacidadCompacta('mostrar_horas_voluntariado', 'Horas de voluntariado'),
                        ],
                        
                        const SizedBox(height: 12),
                        
                        // Botón guardar compacto
                        SizedBox(
                          width: double.infinity,
                          height: 42,
                          child: ElevatedButton.icon(
                            onPressed: _guardarPrivacidad,
                            icon: const Icon(Icons.save, size: 18),
                            label: const Text(
                              'Guardar Privacidad',
                              style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF16A34A),
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
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
  
  Widget _buildOpcionPrivacidadCompacta(String clave, String titulo) {
    return Padding(
      padding: const EdgeInsets.only(left: 8, bottom: 4),
      child: Row(
        children: [
          SizedBox(
            height: 32,
            child: Checkbox(
              value: _privacidad[clave] ?? false,
              onChanged: (value) {
                setState(() {
                  _privacidad[clave] = value ?? false;
                });
              },
              activeColor: const Color(0xFF16A34A),
              materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
              visualDensity: VisualDensity.compact,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              titulo,
              style: const TextStyle(fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFotoPerfil() {
    return Column(
      children: [
        // Foto de perfil
        Stack(
          children: [
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFBBF7D0), // Lima claro
                border: Border.all(
                  color: Colors.white,
                  width: 4,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: _fotoPerfil != null
                  ? ClipOval(
                      child: Image.memory(
                        base64Decode(_fotoPerfil!.split(',')[1]),
                        width: 120,
                        height: 120,
                        fit: BoxFit.cover,
                      ),
                    )
                  : Center(
                      child: Text(
                        _obtenerIniciales(),
                        style: const TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF15803D), // Verde oscuro
                        ),
                      ),
                    ),
            ),
            
            // Botón de cámara
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF16A34A), // Verde medio
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: PopupMenuButton<String>(
                  icon: _cargandoFoto
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : const Icon(
                          Icons.camera_alt,
                          color: Colors.white,
                          size: 20,
                        ),
                  onSelected: (value) {
                    if (value == 'galeria') {
                      _seleccionarFoto();
                    } else if (value == 'camara') {
                      _tomarFoto();
                    }
                  },
                  itemBuilder: (context) => [
                    const PopupMenuItem(
                      value: 'galeria',
                      child: Row(
                        children: [
                          Icon(Icons.photo_library, color: Color(0xFF16A34A)),
                          SizedBox(width: 8),
                          Text('Galería'),
                        ],
                      ),
                    ),
                    const PopupMenuItem(
                      value: 'camara',
                      child: Row(
                        children: [
                          Icon(Icons.camera_alt, color: Color(0xFF16A34A)),
                          SizedBox(width: 8),
                          Text('Cámara'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        
        const SizedBox(height: 12),
        
        // Información del usuario
        Text(
          '${_nombresController.text} ${_apellidosController.text}',
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF166534), // Verde oscuro
          ),
        ),
        const SizedBox(height: 4),
        Text(
          _obtenerNombreRol(_usuario?.idRol),
          style: const TextStyle(
            fontSize: 14,
            color: Color(0xFF16A34A), // Verde medio
            fontWeight: FontWeight.w500,
          ),
        ),
        
        // Horas de voluntariado
        if (_usuario != null)
          Container(
            margin: const EdgeInsets.only(top: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF22C55E), // Verde
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                const Text(
                  'Horas de Voluntariado Acumuladas',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${_usuario!.horasVoluntariadoAcumuladas ?? 0}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildDatosPersonales() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Datos Personales',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF166534), // Verde oscuro
          ),
        ),
        const SizedBox(height: 16),
        
        // Nombres y Apellidos
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _nombresController,
                enabled: _modoEdicion,
                decoration: const InputDecoration(
                  labelText: 'Nombres',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]')),
                ],
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Los nombres son requeridos';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextFormField(
                controller: _apellidosController,
                enabled: _modoEdicion,
                decoration: const InputDecoration(
                  labelText: 'Apellidos',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
                inputFormatters: [
                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]')),
                ],
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Los apellidos son requeridos';
                  }
                  return null;
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Emails
        TextFormField(
          controller: _emailPersonalController,
          enabled: _modoEdicion,
          decoration: const InputDecoration(
            labelText: 'Email Personal',
            border: OutlineInputBorder(),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Color(0xFF16A34A)),
            ),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value != null && value.isNotEmpty) {
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                return 'Email inválido';
              }
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        
        TextFormField(
          controller: _emailAcademicoController,
          enabled: _modoEdicion,
          decoration: const InputDecoration(
            labelText: 'Email Académico',
            border: OutlineInputBorder(),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Color(0xFF16A34A)),
            ),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value != null && value.isNotEmpty) {
              if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value)) {
                return 'Email inválido';
              }
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        
        // Teléfono y Fecha de Nacimiento
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _telefonoController,
                enabled: _modoEdicion,
                decoration: const InputDecoration(
                  labelText: 'Teléfono',
                  hintText: '12345678',
                  helperText: '8 dígitos',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
                keyboardType: TextInputType.number,
                maxLength: 8,
                inputFormatters: [
                  FilteringTextInputFormatter.digitsOnly,
                ],
                validator: (value) {
                  if (value != null && value.isNotEmpty) {
                    final digitos = value.replaceAll(RegExp(r'\D'), '');
                    if (digitos.length != 8) {
                      return 'Debe tener 8 dígitos';
                    }
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: InkWell(
                onTap: _modoEdicion ? () async {
                  final fecha = await showDatePicker(
                    context: context,
                    initialDate: _fechaNacimiento ?? DateTime.now().subtract(const Duration(days: 365 * 20)),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (fecha != null) {
                    setState(() => _fechaNacimiento = fecha);
                  }
                } : null,
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Fecha de Nacimiento',
                    border: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: Color(0xFF16A34A)),
                    ),
                  ),
                  child: Text(
                    _fechaNacimiento != null
                        ? '${_fechaNacimiento!.day}/${_fechaNacimiento!.month}/${_fechaNacimiento!.year}'
                        : 'Seleccionar fecha',
                    style: TextStyle(
                      color: _fechaNacimiento != null 
                          ? Colors.black 
                          : Colors.grey[600],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        
        // Checkbox Es Estudiante
        CheckboxListTile(
          title: const Text(
            'Pertenezco a un centro educativo',
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Color(0xFF166534), // Verde oscuro
            ),
          ),
          value: _esEstudiante,
          onChanged: _modoEdicion ? (value) {
            setState(() {
              _esEstudiante = value ?? false;
              if (!_esEstudiante) {
                _centroEducativoSeleccionado = null;
                _carreraSeleccionada = null;
                _numCuentaController.clear();
              }
            });
          } : null,
          activeColor: const Color(0xFF16A34A), // Verde medio
          controlAffinity: ListTileControlAffinity.leading,
        ),
      ],
    );
  }

  Widget _buildDatosEstudiante() {
    return Container(
      margin: const EdgeInsets.only(top: 20),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4), // Verde muy claro
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFBBF7D0), // Lima claro
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Datos de Estudiante',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF166534), // Verde oscuro
            ),
          ),
          const SizedBox(height: 8),
          
          // Mensaje informativo
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFDEEBFF),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF1976D2)),
            ),
            child: const Row(
              children: [
                Icon(Icons.info_outline, color: Color(0xFF1976D2), size: 20),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Los campos marcados con * son obligatorios para guardar',
                    style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          
          // Centro Educativo
          DropdownButtonFormField<int>(
            value: _centroEducativoSeleccionado,
            decoration: InputDecoration(
              label: RichText(
                text: const TextSpan(
                  text: 'Centro Educativo ',
                  style: TextStyle(color: Color(0xFF4B5563), fontSize: 16),
                  children: [
                    TextSpan(
                      text: '*',
                      style: TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ],
                ),
              ),
              border: const OutlineInputBorder(),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF16A34A)),
              ),
            ),
            items: [
              const DropdownMenuItem<int>(
                value: null,
                child: Text('Selecciona un centro'),
              ),
              ..._centrosEducativos.map((centro) => DropdownMenuItem<int>(
                value: centro.id,
                child: Text(centro.nombre),
              )),
            ],
            onChanged: _modoEdicion ? _onCentroEducativoChanged : null,
          ),
          const SizedBox(height: 16),
          
          // Número de Cuenta
          TextFormField(
            controller: _numCuentaController,
            enabled: _modoEdicion,
            decoration: InputDecoration(
              label: RichText(
                text: const TextSpan(
                  text: 'Número de Cuenta / Identidad ',
                  style: TextStyle(color: Color(0xFF4B5563), fontSize: 16),
                  children: [
                    TextSpan(
                      text: '*',
                      style: TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ],
                ),
              ),
              hintText: 'Ej: 0000-00000-0000',
              border: const OutlineInputBorder(),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF16A34A)),
              ),
            ),
            keyboardType: TextInputType.number,
            inputFormatters: [
              FilteringTextInputFormatter.allow(RegExp(r'[0-9\-]')),
            ],
          ),
          const SizedBox(height: 16),
          
          // Carrera
          DropdownButtonFormField<int>(
            value: _carreraSeleccionada,
            decoration: InputDecoration(
              label: RichText(
                text: const TextSpan(
                  text: 'Carrera ',
                  style: TextStyle(color: Color(0xFF4B5563), fontSize: 16),
                  children: [
                    TextSpan(
                      text: '*',
                      style: TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ],
                ),
              ),
              border: const OutlineInputBorder(),
              focusedBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF16A34A)),
              ),
            ),
            items: [
              const DropdownMenuItem<int>(
                value: null,
                child: Text('Selecciona una carrera'),
              ),
              ..._carrerasFiltradas.map((carrera) => DropdownMenuItem<int>(
                value: carrera.id,
                child: Text(carrera.nombre),
              )),
            ],
            onChanged: (_modoEdicion && _centroEducativoSeleccionado != null)
                ? (value) {
                    setState(() {
                      _carreraSeleccionada = value;
                    });
                  }
                : null,
          ),
          const SizedBox(height: 16),
          
          // Estado de Verificación
          Row(
            children: [
              const Text(
                'Estado: ',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF166534), // Verde oscuro
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: (_usuario?.estaVerificado == 1)
                      ? const Color(0xFFDCFCE7) // Verde claro
                      : const Color(0xFFFEF3C7), // Amarillo claro
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  (_usuario?.estaVerificado == 1) ? 'Verificado' : 'Pendiente',
                  style: TextStyle(
                    color: (_usuario?.estaVerificado == 1)
                        ? const Color(0xFF166534) // Verde oscuro
                        : const Color(0xFF92400E), // Amarillo oscuro
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          if (_usuario?.estaVerificado != 1) ...[
            const SizedBox(height: 8),
            const Text(
              'Un docente debe aprobarte en tu centro educativo',
              style: TextStyle(
                fontSize: 11,
                color: Color(0xFF6B7280),
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildBotonGuardar() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: _cargando ? null : _guardarPerfil,
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF16A34A), // Verde medio
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
        ),
        child: _cargando
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  SizedBox(width: 12),
                  Text('Guardando...'),
                ],
              )
            : const Text(
                'Guardar Cambios',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
      ),
    );
  }
}

