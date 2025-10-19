import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'dart:io';
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
  List<Carrera> _carreras = [];
  List<Carrera> _carrerasFiltradas = [];
  bool _cargando = false;
  bool _cargandoFoto = false;
  String? _fotoPerfil;
  String? _mensaje;
  bool _esExito = true;

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
      
      // Cargar carreras
      await _cargarCarreras();
      
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
    
    _nombresController.text = _usuario!.nombres ?? '';
    _apellidosController.text = _usuario!.apellidos ?? '';
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
    
    _filtrarCarreras();
  }

  Future<void> _cargarCentrosEducativos() async {
    try {
      final response = await _apiService.get('/api/centros-educativos');
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

  Future<void> _cargarCarreras() async {
    try {
      final response = await _apiService.get('/api/carreras');
      if (response['success']) {
        setState(() {
          _carreras = (response['data'] as List)
              .map((json) => Carrera.fromJson(json))
              .toList();
        });
        _filtrarCarreras();
      }
    } catch (e) {
      print('Error al cargar carreras: $e');
    }
  }

  void _filtrarCarreras() {
    if (_centroEducativoSeleccionado != null) {
      setState(() {
        _carrerasFiltradas = _carreras
            .where((c) => c.idCentroEducativo == _centroEducativoSeleccionado)
            .toList();
      });
      
      // Si la carrera seleccionada no está en las filtradas, limpiarla
      if (_carreraSeleccionada != null && 
          !_carrerasFiltradas.any((c) => c.id == _carreraSeleccionada)) {
        _carreraSeleccionada = null;
      }
    } else {
      setState(() {
        _carrerasFiltradas = [];
        _carreraSeleccionada = null;
      });
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

  String _obtenerMimeType(String path) {
    final extension = path.split('.').last.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  }

  Future<void> _guardarPerfil() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _cargando = true);
    
    try {
      final datos = {
        'nombres': _nombresController.text.trim(),
        'apellidos': _apellidosController.text.trim(),
        'email_personal': _emailPersonalController.text.trim(),
        'email_academico': _emailAcademicoController.text.trim(),
        'telefono': _telefonoController.text.trim(),
        'fecha_nacimiento': _fechaNacimiento?.toIso8601String().split('T')[0],
        'es_estudiante': _esEstudiante,
        'id_centro_educativo': _centroEducativoSeleccionado,
        'num_cuenta': _numCuentaController.text.trim(),
        'id_carrera': _carreraSeleccionada,
      };
      
      final response = await _apiService.put('/api/auth/perfil', datos);
      
      if (response['success']) {
        // Actualizar usuario en el provider
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        await authProvider.actualizarUsuario(response['data']);
        
        _mostrarMensaje('Perfil actualizado exitosamente', true);
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
                                
                                // Botón de guardar
                                const SizedBox(height: 24),
                                _buildBotonGuardar(),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
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
                decoration: const InputDecoration(
                  labelText: 'Nombres',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
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
                decoration: const InputDecoration(
                  labelText: 'Apellidos',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
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
                decoration: const InputDecoration(
                  labelText: 'Teléfono',
                  border: OutlineInputBorder(),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Color(0xFF16A34A)),
                  ),
                ),
                keyboardType: TextInputType.phone,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: InkWell(
                onTap: () async {
                  final fecha = await showDatePicker(
                    context: context,
                    initialDate: _fechaNacimiento ?? DateTime.now().subtract(const Duration(days: 365 * 20)),
                    firstDate: DateTime(1900),
                    lastDate: DateTime.now(),
                  );
                  if (fecha != null) {
                    setState(() => _fechaNacimiento = fecha);
                  }
                },
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
            'Soy Estudiante',
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Color(0xFF166534), // Verde oscuro
            ),
          ),
          value: _esEstudiante,
          onChanged: (value) {
            setState(() {
              _esEstudiante = value ?? false;
              if (!_esEstudiante) {
                _centroEducativoSeleccionado = null;
                _carreraSeleccionada = null;
                _numCuentaController.clear();
              }
            });
          },
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
          const SizedBox(height: 16),
          
          // Centro Educativo
          DropdownButtonFormField<int>(
            value: _centroEducativoSeleccionado,
            decoration: const InputDecoration(
              labelText: 'Centro Educativo',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
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
            onChanged: (value) {
              setState(() {
                _centroEducativoSeleccionado = value;
                _filtrarCarreras();
              });
            },
          ),
          const SizedBox(height: 16),
          
          // Número de Cuenta
          TextFormField(
            controller: _numCuentaController,
            decoration: const InputDecoration(
              labelText: 'Número de Cuenta / Identidad',
              hintText: 'Ej: 0000-00000-0000',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: Color(0xFF16A34A)),
              ),
            ),
          ),
          const SizedBox(height: 16),
          
          // Carrera
          DropdownButtonFormField<int>(
            value: _carreraSeleccionada,
            decoration: const InputDecoration(
              labelText: 'Carrera',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
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
            onChanged: _centroEducativoSeleccionado != null
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
                'Estado de Verificación: ',
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
