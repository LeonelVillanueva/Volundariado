import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../models/centro_educativo.dart';
import '../models/carrera.dart';
import 'ver_perfil_estudiante_screen.dart';

class GestionCentroScreen extends StatefulWidget {
  const GestionCentroScreen({Key? key}) : super(key: key);

  @override
  State<GestionCentroScreen> createState() => _GestionCentroScreenState();
}

class _GestionCentroScreenState extends State<GestionCentroScreen> with SingleTickerProviderStateMixin {
  final _apiService = ApiService();
  late TabController _tabController;
  
  // Variables de estado
  CentroEducativo? _centro;
  Map<String, dynamic> _estadisticas = {
    'total_estudiantes': 0,
    'verificados': 0,
    'pendientes': 0
  };
  List<dynamic> _estudiantesPendientes = [];
  List<dynamic> _estudiantesVerificados = [];
  List<Carrera> _carreras = [];
  
  // Variables de formulario
  final _formKey = GlobalKey<FormState>();
  final _nombreController = TextEditingController();
  final _direccionController = TextEditingController();
  final _ciudadController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _emailController = TextEditingController();
  final _nuevaCarreraController = TextEditingController();
  
  bool _cargando = false;
  bool _modoEdicion = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _cargarDatos();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _nombreController.dispose();
    _direccionController.dispose();
    _ciudadController.dispose();
    _telefonoController.dispose();
    _emailController.dispose();
    _nuevaCarreraController.dispose();
    super.dispose();
  }

  Future<void> _cargarDatos() async {
    setState(() => _cargando = true);
    
    await Future.wait([
      _cargarCentro(),
      _cargarEstadisticas(),
      _cargarEstudiantes(),
      _cargarCarreras(),
    ]);
    
    setState(() => _cargando = false);
  }

  Future<void> _cargarCentro() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      if (usuario?.idCentroEducativo == null) {
        setState(() => _centro = null);
        return;
      }

      final response = await _apiService.get('/api/centros/${usuario!.idCentroEducativo}');
      
      if (response['success']) {
        setState(() {
          _centro = CentroEducativo.fromJson(response['data']);
          _nombreController.text = _centro!.nombre;
          _direccionController.text = _centro!.direccion ?? '';
          _ciudadController.text = _centro!.ciudad ?? '';
          _telefonoController.text = _centro!.telefono ?? '';
          _emailController.text = _centro!.email ?? '';
        });
      }
    } catch (e) {
      print('Error al cargar centro: $e');
    }
  }

  Future<void> _cargarEstadisticas() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      if (usuario?.idCentroEducativo == null) {
        setState(() => _estadisticas = {
          'total_estudiantes': 0,
          'verificados': 0,
          'pendientes': 0
        });
        return;
      }

      final response = await _apiService.get('/api/verificacion/estadisticas');
      
      if (response['success']) {
        final data = response['data'];
        setState(() {
          _estadisticas = {
            'total_estudiantes': _toInt(data['total_estudiantes']),
            'verificados': _toInt(data['verificados']),
            'pendientes': _toInt(data['pendientes']),
          };
        });
      }
    } catch (e) {
      print('Error al cargar estadísticas: $e');
      setState(() => _estadisticas = {
        'total_estudiantes': 0,
        'verificados': 0,
        'pendientes': 0
      });
    }
  }

  Future<void> _cargarEstudiantes() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      if (usuario?.idCentroEducativo == null) {
        setState(() {
          _estudiantesPendientes = [];
          _estudiantesVerificados = [];
        });
        return;
      }

      // Cargar pendientes
      final responsePendientes = await _apiService.get('/api/verificacion/pendientes');
      if (responsePendientes['success']) {
        final pendientes = responsePendientes['data'] as List;
        // Cargar fotos para cada estudiante pendiente
        await _cargarFotosEstudiantes(pendientes);
        setState(() => _estudiantesPendientes = pendientes);
      }

      // Cargar todos los estudiantes
      final responseEstudiantes = await _apiService.get('/api/centros/${usuario!.idCentroEducativo}/estudiantes');
      if (responseEstudiantes['success']) {
        final verificados = (responseEstudiantes['data'] as List)
            .where((e) => e['Esta_verificado'] == 1)
            .toList();
        // Cargar fotos para cada estudiante verificado
        await _cargarFotosEstudiantes(verificados);
        setState(() => _estudiantesVerificados = verificados);
      }
    } catch (e) {
      print('Error al cargar estudiantes: $e');
    }
  }

  Future<void> _cargarFotosEstudiantes(List<dynamic> estudiantes) async {
    for (final estudiante in estudiantes) {
      try {
        final response = await _apiService.get('/api/fotos-perfil/usuario/${estudiante['ID']}');
        if (response['success'] && response['data'] != null) {
          estudiante['foto_perfil'] = response['data']['imagen_url'];
        } else {
          estudiante['foto_perfil'] = null;
        }
      } catch (e) {
        estudiante['foto_perfil'] = null;
      }
    }
  }

  Future<void> _cargarCarreras() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      if (usuario?.idCentroEducativo == null) {
        setState(() => _carreras = []);
        return;
      }

      final response = await _apiService.get('/api/carreras/centro/${usuario!.idCentroEducativo}');
      
      if (response['success']) {
        setState(() {
          _carreras = (response['data'] as List)
              .map((json) => Carrera.fromJson(json))
              .toList();
        });
      }
    } catch (e) {
      print('Error al cargar carreras: $e');
    }
  }

  Future<void> _crearCentro() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _cargando = true);

    try {
      final response = await _apiService.post('/api/centros', {
        'nombre': _nombreController.text.trim(),
        'direccion': _direccionController.text.trim(),
        'ciudad': _ciudadController.text.trim(),
        'telefono': _telefonoController.text.trim(),
        'email': _emailController.text.trim(),
      });

      if (response['success']) {
        _mostrarMensaje('Centro creado exitosamente');
        
        // Actualizar usuario
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        final responseUsuario = await _apiService.get('/api/auth/perfil');
        if (responseUsuario['success']) {
          await authProvider.actualizarUsuario(responseUsuario['data']);
        }
        
        await _cargarDatos();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al crear centro');
      }
    } catch (e) {
      _mostrarMensajeError('Error al crear centro: $e');
    } finally {
      setState(() => _cargando = false);
    }
  }

  Future<void> _actualizarCentro() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _cargando = true);

    try {
      final response = await _apiService.put('/api/centros/${_centro!.id}', {
        'nombre': _nombreController.text.trim(),
        'direccion': _direccionController.text.trim(),
        'ciudad': _ciudadController.text.trim(),
        'telefono': _telefonoController.text.trim(),
        'email': _emailController.text.trim(),
      });

      if (response['success']) {
        _mostrarMensaje('Centro actualizado exitosamente');
        setState(() => _modoEdicion = false);
        await _cargarCentro();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al actualizar');
      }
    } catch (e) {
      _mostrarMensajeError('Error al actualizar: $e');
    } finally {
      setState(() => _cargando = false);
    }
  }

  Future<void> _verificarEstudiante(int idEstudiante) async {
    final confirmado = await _mostrarConfirmacion(
      '¿Verificar este estudiante?',
      'El estudiante será marcado como verificado.'
    );
    
    if (!confirmado) return;

    try {
      final response = await _apiService.post('/api/verificacion/verificar/$idEstudiante', {});
      
      if (response['success']) {
        _mostrarMensaje('Estudiante verificado exitosamente');
        await _cargarEstudiantes();
        await _cargarEstadisticas();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al verificar');
      }
    } catch (e) {
      _mostrarMensajeError('Error: $e');
    }
  }

  Future<void> _rechazarEstudiante(int idEstudiante) async {
    final confirmado = await _mostrarConfirmacion(
      '¿Rechazar esta solicitud?',
      'El estudiante permanecerá como pendiente.'
    );
    
    if (!confirmado) return;

    try {
      final response = await _apiService.post('/api/verificacion/rechazar/$idEstudiante', {});
      
      if (response['success']) {
        _mostrarMensaje('Solicitud rechazada');
        await _cargarEstudiantes();
        await _cargarEstadisticas();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al rechazar');
      }
    } catch (e) {
      _mostrarMensajeError('Error: $e');
    }
  }

  Future<void> _removerEstudiante(int idEstudiante) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final usuario = authProvider.usuario;
    
    // Verificar si se está removiendo a sí mismo
    bool confirmado = false;
    
    if (idEstudiante == usuario?.id) {
      // Advertencia especial para auto-remoción
      confirmado = await _mostrarConfirmacion(
        'ADVERTENCIA',
        'Estás a punto de removerte a TI MISMO del centro.\n\n'
        'Si eres el único docente, NO podrás volver a acceder sin ayuda de un administrador.\n\n'
        '¿Estás seguro de continuar?'
      );
    } else {
      // Confirmación normal para otros estudiantes
      confirmado = await _mostrarConfirmacion(
        '¿Remover del centro?',
        'Se eliminará la verificación y asociación al centro.'
      );
    }
    
    if (!confirmado) return;

    try {
      final response = await _apiService.delete('/api/verificacion/remover/$idEstudiante');
      
      if (response['success']) {
        _mostrarMensaje('Estudiante removido del centro');
        await _cargarEstudiantes();
        await _cargarEstadisticas();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al remover');
      }
    } catch (e) {
      _mostrarMensajeError('Error: $e');
    }
  }

  Future<void> _crearCarrera() async {
    if (_nuevaCarreraController.text.trim().isEmpty) return;

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      // Crear carrera
      final responseCrear = await _apiService.post('/api/carreras', {
        'nombre': _nuevaCarreraController.text.trim(),
      });

      if (responseCrear['success']) {
        // Asociar al centro
        final responseAsociar = await _apiService.post('/api/carreras/asociar', {
          'id_carrera': responseCrear['data']['id'],
          'id_centro': usuario!.idCentroEducativo,
        });

        if (responseAsociar['success']) {
          _mostrarMensaje('Carrera agregada exitosamente');
          _nuevaCarreraController.clear();
          await _cargarCarreras();
        }
      }
    } catch (e) {
      _mostrarMensajeError('Error al crear carrera: $e');
    }
  }

  Future<void> _desasociarCarrera(int idCarrera) async {
    final confirmado = await _mostrarConfirmacion(
      '¿Desasociar esta carrera?',
      'Los estudiantes ya inscritos mantendrán su carrera.'
    );
    
    if (!confirmado) return;

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      final response = await _apiService.post('/api/carreras/desasociar', {
        'id_carrera': idCarrera,
        'id_centro': usuario!.idCentroEducativo,
      });

      if (response['success']) {
        _mostrarMensaje('Carrera desasociada');
        await _cargarCarreras();
      } else {
        _mostrarMensajeError(response['mensaje'] ?? 'Error al desasociar');
      }
    } catch (e) {
      _mostrarMensajeError('Error: $e');
    }
  }

  void _mostrarMensaje(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensaje),
        backgroundColor: const Color(0xFF16A34A),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  void _mostrarMensajeError(String mensaje) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(mensaje),
        backgroundColor: Colors.red,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<bool> _mostrarConfirmacion(String titulo, String contenido) async {
    final resultado = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(titulo),
        content: Text(contenido),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF16A34A),
            ),
            child: const Text('Confirmar'),
          ),
        ],
      ),
    );
    return resultado ?? false;
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final usuario = authProvider.usuario;

    // Verificar que sea docente
    if (usuario?.idRol != 4) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Acceso Denegado'),
          backgroundColor: const Color(0xFF16A34A),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock, size: 64, color: Colors.grey),
              const SizedBox(height: 16),
              const Text(
                'Solo los docentes pueden acceder',
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF16A34A),
                ),
                child: const Text('Volver'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Gestión de Centro'),
        backgroundColor: const Color(0xFF16A34A),
        foregroundColor: Colors.white,
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: [
            const Tab(text: 'Centro', icon: Icon(Icons.school, size: 20)),
            Tab(
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.people, size: 20),
                      SizedBox(height: 4),
                      Text('Estudiantes', style: TextStyle(fontSize: 11)),
                    ],
                  ),
                  if ((_estadisticas['pendientes'] ?? 0) > 0)
                    Positioned(
                      top: -2,
                      right: -2,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 18,
                          minHeight: 18,
                        ),
                        child: Text(
                          '${_estadisticas['pendientes']}',
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const Tab(text: 'Carreras', icon: Icon(Icons.menu_book, size: 20)),
          ],
        ),
      ),
      body: _cargando
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildTabCentro(),
                _buildTabEstudiantes(),
                _buildTabCarreras(),
              ],
            ),
    );
  }

  Widget _buildTabCentro() {
    if (_centro == null) {
      // Formulario de creación
      return SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.school, size: 64, color: Color(0xFF16A34A)),
              const SizedBox(height: 16),
              const Text(
                'Crear Centro Educativo',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Como docente, puedes crear un centro educativo para gestionar estudiantes.',
                style: TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _nombreController,
                decoration: const InputDecoration(
                  labelText: 'Nombre del Centro *',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.school),
                ),
                validator: (value) =>
                    value?.isEmpty ?? true ? 'Requerido' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _direccionController,
                decoration: const InputDecoration(
                  labelText: 'Dirección',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_on),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _ciudadController,
                decoration: const InputDecoration(
                  labelText: 'Ciudad',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.location_city),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _telefonoController,
                decoration: const InputDecoration(
                  labelText: 'Teléfono',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.phone),
                ),
                keyboardType: TextInputType.phone,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _crearCentro,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF16A34A),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'Crear Centro Educativo',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // Vista de información del centro
    return RefreshIndicator(
      onRefresh: _cargarDatos,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Estadísticas
            Row(
              children: [
                Expanded(
                  child: _buildEstadistica(
                    'Total',
                    '${_estadisticas['total_estudiantes'] ?? 0}',
                    const Color(0xFF16A34A),
                    Icons.people,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildEstadistica(
                    'Verificados',
                    '${_estadisticas['verificados'] ?? 0}',
                    Colors.green,
                    Icons.check_circle,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildEstadistica(
                    'Pendientes',
                    '${_estadisticas['pendientes'] ?? 0}',
                    Colors.orange,
                    Icons.pending,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            
            // Información del centro
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Información del Centro',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: Icon(_modoEdicion ? Icons.close : Icons.edit),
                          onPressed: () => setState(() => _modoEdicion = !_modoEdicion),
                          color: const Color(0xFF16A34A),
                        ),
                      ],
                    ),
                    const Divider(),
                    if (_modoEdicion)
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            TextFormField(
                              controller: _nombreController,
                              decoration: const InputDecoration(labelText: 'Nombre *'),
                              validator: (value) => value?.isEmpty ?? true ? 'Requerido' : null,
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _direccionController,
                              decoration: const InputDecoration(labelText: 'Dirección'),
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _ciudadController,
                              decoration: const InputDecoration(labelText: 'Ciudad'),
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _telefonoController,
                              decoration: const InputDecoration(labelText: 'Teléfono'),
                            ),
                            const SizedBox(height: 12),
                            TextFormField(
                              controller: _emailController,
                              decoration: const InputDecoration(labelText: 'Email'),
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _actualizarCentro,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF16A34A),
                                minimumSize: const Size(double.infinity, 48),
                              ),
                              child: const Text('Guardar Cambios'),
                            ),
                          ],
                        ),
                      )
                    else
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildInfoRow('Nombre', _centro!.nombre),
                          _buildInfoRow('Dirección', _centro!.direccion ?? 'No especificada'),
                          _buildInfoRow('Ciudad', _centro!.ciudad ?? 'No especificada'),
                          _buildInfoRow('Teléfono', _centro!.telefono ?? 'No especificado'),
                          _buildInfoRow('Email', _centro!.email ?? 'No especificado'),
                        ],
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

  Widget _buildTabEstudiantes() {
    return RefreshIndicator(
      onRefresh: () async {
        await _cargarEstudiantes();
        await _cargarEstadisticas();
      },
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Pendientes
          if (_estudiantesPendientes.isNotEmpty) ...[
            const Text(
              'Solicitudes Pendientes',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ..._estudiantesPendientes.map((estudiante) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Foto de perfil
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => VerPerfilEstudianteScreen(
                              idEstudiante: estudiante['ID'],
                            ),
                          ),
                        );
                      },
                      child: _buildFotoEstudiante(estudiante),
                    ),
                    const SizedBox(width: 12),
                    
                    // Información
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  '${estudiante['Nombres']} ${estudiante['Apellidos']}',
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                                ),
                              ),
                              // Badge de Rol
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: estudiante['ID_rol'] == 4 
                                      ? const Color(0xFFDBEAFE) 
                                      : const Color(0xFFDCFCE7),
                                  border: Border.all(
                                    color: estudiante['ID_rol'] == 4 
                                        ? const Color(0xFF93C5FD) 
                                        : const Color(0xFF86EFAC),
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  estudiante['ID_rol'] == 4 ? '🎓 Docente' : '📚 Estudiante',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: estudiante['ID_rol'] == 4 
                                        ? const Color(0xFF2563EB) 
                                        : const Color(0xFF16A34A),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          _buildInfoRow('Email', estudiante['Email_personal'] ?? 'N/A'),
                          _buildInfoRow('N° Cuenta', estudiante['Num_cuenta'] ?? 'N/A'),
                          _buildInfoRow('Carrera', estudiante['Carrera'] ?? 'No especificada'),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () => _verificarEstudiante(estudiante['ID']),
                                  icon: const Icon(Icons.check, size: 16),
                                  label: const Text('Aprobar', style: TextStyle(fontSize: 12)),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green,
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () => _rechazarEstudiante(estudiante['ID']),
                                  icon: const Icon(Icons.close, size: 16),
                                  label: const Text('Rechazar', style: TextStyle(fontSize: 12)),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.red,
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            )),
            const SizedBox(height: 24),
          ],
          
          // Verificados
          const Text(
            'Estudiantes Verificados',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          if (_estudiantesVerificados.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Text('No hay estudiantes verificados', style: TextStyle(color: Colors.grey)),
              ),
            )
          else
            ..._estudiantesVerificados.map((estudiante) => Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                leading: GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => VerPerfilEstudianteScreen(
                          idEstudiante: estudiante['ID'],
                        ),
                      ),
                    );
                  },
                  child: _buildFotoEstudiante(estudiante, conBadge: true),
                ),
                title: Row(
                  children: [
                    Expanded(
                      child: Text('${estudiante['Nombres']} ${estudiante['Apellidos']}'),
                    ),
                    // Badge de Rol
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: estudiante['ID_rol'] == 4 
                            ? const Color(0xFFDBEAFE) 
                            : const Color(0xFFDCFCE7),
                        border: Border.all(
                          color: estudiante['ID_rol'] == 4 
                              ? const Color(0xFF93C5FD) 
                              : const Color(0xFF86EFAC),
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        estudiante['ID_rol'] == 4 ? '🎓' : '📚',
                        style: const TextStyle(fontSize: 10),
                      ),
                    ),
                  ],
                ),
                subtitle: Text('${estudiante['Carrera'] ?? 'Sin carrera'}\n${estudiante['Num_cuenta'] ?? 'N/A'}'),
                isThreeLine: true,
                trailing: IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.red),
                  onPressed: () => _removerEstudiante(estudiante['ID']),
                ),
              ),
            )),
        ],
      ),
    );
  }

  Widget _buildTabCarreras() {
    return RefreshIndicator(
      onRefresh: _cargarCarreras,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Agregar Carrera',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _nuevaCarreraController,
                    decoration: InputDecoration(
                      labelText: 'Nombre de la Carrera',
                      hintText: 'Ej: Ingeniería en Sistemas',
                      border: const OutlineInputBorder(),
                      suffixIcon: IconButton(
                        icon: const Icon(Icons.add_circle, color: Color(0xFF16A34A)),
                        onPressed: _crearCarrera,
                      ),
                    ),
                    onSubmitted: (_) => _crearCarrera(),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Se asociará automáticamente a tu centro',
                    style: TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Carreras del Centro',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          if (_carreras.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Text('No hay carreras asociadas', style: TextStyle(color: Colors.grey)),
              ),
            )
          else
            ..._carreras.map((carrera) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: ListTile(
                leading: const Icon(Icons.menu_book, color: Color(0xFF16A34A)),
                title: Text(carrera.nombre),
                trailing: IconButton(
                  icon: const Icon(Icons.close, color: Colors.red),
                  onPressed: () => _desasociarCarrera(carrera.id),
                ),
              ),
            )),
        ],
      ),
    );
  }

  Widget _buildEstadistica(String label, String valor, Color color, IconData icon) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: 8),
            Text(
              valor,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              label,
              style: const TextStyle(fontSize: 12, color: Colors.grey),
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
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 15),
            ),
          ),
        ],
      ),
    );
  }

  // Helper para convertir valores a int de forma segura
  int _toInt(dynamic value) {
    if (value == null) return 0;
    if (value is int) return value;
    if (value is String) return int.tryParse(value) ?? 0;
    if (value is double) return value.toInt();
    return 0;
  }

  // Widget para mostrar foto de estudiante
  Widget _buildFotoEstudiante(dynamic estudiante, {bool conBadge = false}) {
    final fotoPerfil = estudiante['foto_perfil'];
    final nombres = estudiante['Nombres'] ?? '';
    final apellidos = estudiante['Apellidos'] ?? '';
    final iniciales = _getIniciales(nombres, apellidos);
    final estaVerificado = estudiante['Esta_verificado'] == 1;

    return Stack(
      children: [
        Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.grey.shade300, width: 2),
          ),
          child: fotoPerfil != null
              ? ClipOval(
                  child: Image.memory(
                    Uri.parse(fotoPerfil).data!.contentAsBytes(),
                    fit: BoxFit.cover,
                    width: 56,
                    height: 56,
                  ),
                )
              : CircleAvatar(
                  radius: 26,
                  backgroundColor: const Color(0xFFF0FDF4),
                  child: Text(
                    iniciales,
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF16A34A),
                    ),
                  ),
                ),
        ),
        // Badge de verificado
        if (conBadge && estaVerificado)
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                color: Colors.green,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
              ),
              child: const Icon(
                Icons.check,
                color: Colors.white,
                size: 12,
              ),
            ),
          ),
      ],
    );
  }

  String _getIniciales(String nombres, String apellidos) {
    final inicial1 = nombres.isNotEmpty ? nombres[0].toUpperCase() : '';
    final inicial2 = apellidos.isNotEmpty ? apellidos[0].toUpperCase() : '';
    return inicial1 + inicial2;
  }
}

