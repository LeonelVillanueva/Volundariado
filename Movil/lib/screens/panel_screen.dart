import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/usuario.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'perfil_screen.dart';
import 'gestion_centro_screen.dart';

class PanelScreen extends StatefulWidget {
  const PanelScreen({super.key});

  @override
  State<PanelScreen> createState() => _PanelScreenState();
}

class _PanelScreenState extends State<PanelScreen> {
  final _apiService = ApiService();
  String? _fotoPerfil;
  bool _cargandoFoto = false;

  @override
  void initState() {
    super.initState();
    _cargarDatosUsuario();
  }

  Future<void> _cargarDatosUsuario() async {
    try {
      final response = await _apiService.get('/api/auth/perfil');
      if (response['success']) {
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        await authProvider.actualizarUsuario(response['data']);
        
        // Cargar foto de perfil si existe
        await _cargarFotoPerfil();
      }
    } catch (e) {
      print('Error al cargar datos del usuario: $e');
    }
  }

  Future<void> _cargarFotoPerfil() async {
    setState(() => _cargandoFoto = true);
    
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final usuario = authProvider.usuario;
      
      // Verificar si el usuario tiene referencia a foto en MySQL
      if (usuario?.urlFotoPerfil != null &&
          usuario!.urlFotoPerfil!.startsWith('mongodb://foto_usuario_')) {
        
        // Cargar la foto desde MongoDB
        final response = await _apiService.get('/api/fotos-perfil/mi-foto');
        if (response['success'] && response['data'] != null) {
          setState(() {
            _fotoPerfil = response['data']['imagen_url'];
          });
          print('✅ Foto de perfil cargada en el panel');
        }
      } else {
        print('ℹ️ Usuario no tiene foto de perfil');
        setState(() => _fotoPerfil = null);
      }
    } catch (e) {
      print('❌ Error al cargar foto de perfil: $e');
      setState(() => _fotoPerfil = null);
    } finally {
      setState(() => _cargandoFoto = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final usuario = authProvider.usuario;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Panel de Control'),
        backgroundColor: const Color(0xFF16A34A), // Verde medio
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          // Botón "Mi Centro" solo para Docentes (ID_rol = 4)
          if (usuario?.idRol == 4)
            IconButton(
              icon: const Icon(Icons.school),
              onPressed: () async {
                await Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const GestionCentroScreen()),
                );
                // Cuando vuelve, refrescar datos
                _cargarDatosUsuario();
              },
              tooltip: 'Mi Centro',
            ),
          IconButton(
            icon: const Icon(Icons.person),
            onPressed: () async {
              // Navegar a perfil y esperar el resultado
              await Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const PerfilScreen()),
              );
              // Cuando vuelve, refrescar datos
              _cargarDatosUsuario();
            },
            tooltip: 'Mi Perfil',
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
            tooltip: 'Cerrar Sesión',
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _cargarDatosUsuario,
        child: Container(
          color: Colors.grey.shade100,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
              // Header con info del usuario
              Container(
                color: const Color(0xFF16A34A), // Verde medio
                padding: const EdgeInsets.all(24),
                child: Column(
                  children: [
                    // Foto de perfil o iniciales
                    Stack(
                      children: [
                        CircleAvatar(
                          radius: 50,
                          backgroundColor: Colors.white,
                          backgroundImage: _fotoPerfil != null
                              ? MemoryImage(
                                  Uri.parse(_fotoPerfil!).data!.contentAsBytes(),
                                )
                              : null,
                          child: _fotoPerfil == null
                              ? Text(
                                  _getInitials(usuario?.nombres, usuario?.apellidos),
                                  style: const TextStyle(
                                    fontSize: 32,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF16A34A),
                                  ),
                                )
                              : null,
                        ),
                        if (_cargandoFoto)
                          Positioned.fill(
                            child: CircleAvatar(
                              radius: 50,
                              backgroundColor: Colors.black26,
                              child: const CircularProgressIndicator(
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            ),
                          ),
                        // Badge de verificado (estilo Instagram/Twitter)
                        if (usuario?.estaVerificado == 1)
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              padding: const EdgeInsets.all(3),
                              decoration: BoxDecoration(
                                color: Colors.green,
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
                              child: const Icon(
                                Icons.check,
                                color: Colors.white,
                                size: 16,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '${usuario?.nombres ?? ''} ${usuario?.apellidos ?? ''}',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        authProvider.getRolNombre(usuario?.idRol),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Mensaje de bienvenida
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '¡Bienvenido, ${usuario?.nombres ?? 'Usuario'}! 👋',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Has iniciado sesión correctamente en el sistema de voluntariado.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),

              // Tarjetas de información
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  children: [
                    // Tarjeta de Perfil
                    _buildInfoCard(
                      icon: Icons.person,
                      color: Colors.indigo,
                      title: 'Mi Perfil',
                      subtitle: usuario?.emailPersonal ?? 'Sin email',
                      details: [
                        'Usuario: ${usuario?.usuarioNombre ?? ''}',
                        'Estado: ${usuario?.estado ?? ''}',
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Tarjeta de Rol
                    _buildInfoCard(
                      icon: Icons.shield,
                      color: Colors.purple,
                      title: 'Rol',
                      subtitle: authProvider.getRolNombre(usuario?.idRol),
                      details: [
                        authProvider.getRolDescripcion(usuario?.idRol),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Tarjeta de Horas
                    _buildInfoCard(
                      icon: Icons.access_time,
                      color: Colors.green,
                      title: 'Horas de Voluntariado',
                      subtitle: '${usuario?.horasVoluntariadoAcumuladas ?? 0} horas',
                      details: const [
                        'Horas acumuladas en eventos',
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Información adicional
                    _buildDetailCard(context, usuario),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      ),
    );
  }

  Widget _buildInfoCard({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required List<String> details,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 32),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey.shade600,
                  ),
                ),
                if (details.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  ...details.map((detail) => Text(
                        detail,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade500,
                        ),
                      )),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailCard(BuildContext context, Usuario? usuario) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Información del Usuario',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          _buildDetailRow('Email Personal', usuario?.emailPersonal ?? 'No proporcionado'),
          _buildDetailRow('Email Académico', usuario?.emailAcademico ?? 'No proporcionado'),
          _buildDetailRow('Teléfono', usuario?.telefono ?? 'No proporcionado'),
          _buildDetailRow('Es Estudiante', usuario?.esEstudiante == 1 ? 'Sí' : 'No'),
          _buildDetailRow(
            'Verificado',
            usuario?.estaVerificado == 1 ? '✓ Verificado' : 'Pendiente',
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            flex: 2,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getInitials(String? nombres, String? apellidos) {
    final n = nombres?.isNotEmpty == true ? nombres![0] : '';
    final a = apellidos?.isNotEmpty == true ? apellidos![0] : '';
    return (n + a).toUpperCase();
  }
}

