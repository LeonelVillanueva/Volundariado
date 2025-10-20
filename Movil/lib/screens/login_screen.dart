import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'panel_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usuarioController = TextEditingController();
  final _claveController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _usuarioController.dispose();
    _claveController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      
      final success = await authProvider.login(
        _usuarioController.text.trim(),
        _claveController.text,
      );

      if (success && mounted) {
        // Navegar al panel
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const PanelScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFFF0FDF4), // Verde muy claro
              const Color(0xFFDCFCE7), // Verde claro
            ],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Logo/Título
                  const Icon(
                    Icons.volunteer_activism,
                    size: 80,
                    color: Color(0xFF16A34A), // Verde medio
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Voluntariado',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF166534), // Verde oscuro
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sistema de Gestión de Eventos',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade600,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Formulario
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Iniciar Sesión',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),

                          // Campo Usuario
                          TextFormField(
                            controller: _usuarioController,
                            decoration: InputDecoration(
                              labelText: 'Usuario',
                              prefixIcon: const Icon(Icons.person, color: Color(0xFF16A34A)),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: Color(0xFF16A34A), width: 2),
                              ),
                              filled: true,
                              fillColor: const Color(0xFFF0FDF4),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'El usuario es requerido';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 16),

                          // Campo Contraseña
                          TextFormField(
                            controller: _claveController,
                            obscureText: _obscurePassword,
                            decoration: InputDecoration(
                              labelText: 'Contraseña',
                              prefixIcon: const Icon(Icons.lock, color: Color(0xFF16A34A)),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword ? Icons.visibility : Icons.visibility_off,
                                  color: const Color(0xFF16A34A),
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  });
                                },
                              ),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: const BorderSide(color: Color(0xFF16A34A), width: 2),
                              ),
                              filled: true,
                              fillColor: const Color(0xFFF0FDF4),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'La contraseña es requerida';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 24),

                          // Mensaje de Error
                          Consumer<AuthProvider>(
                            builder: (context, auth, _) {
                              if (auth.error != null) {
                                return Container(
                                  padding: const EdgeInsets.all(12),
                                  margin: const EdgeInsets.only(bottom: 16),
                                  decoration: BoxDecoration(
                                    color: Colors.red.shade50,
                                    border: Border.all(color: Colors.red.shade200),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    auth.error!,
                                    style: TextStyle(color: Colors.red.shade700),
                                    textAlign: TextAlign.center,
                                  ),
                                );
                              }
                              return const SizedBox.shrink();
                            },
                          ),

                          // Botón Login
                          Consumer<AuthProvider>(
                            builder: (context, auth, _) {
                              return ElevatedButton(
                                onPressed: auth.isLoading ? null : _handleLogin,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF16A34A), // Verde medio
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  elevation: 3,
                                ),
                                child: auth.isLoading
                                    ? const SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                        ),
                                      )
                                    : const Text(
                                        'Iniciar Sesión',
                                        style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                              );
                            },
                          ),

                          const SizedBox(height: 24),

                          // Separador
                          Row(
                            children: [
                              const Expanded(child: Divider(color: Colors.grey)),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                child: Text(
                                  'o',
                                  style: TextStyle(color: Colors.grey.shade600, fontWeight: FontWeight.w500),
                                ),
                              ),
                              const Expanded(child: Divider(color: Colors.grey)),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Botones de Registro
                          const Text(
                            '¿No tienes cuenta? Regístrate como:',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF166534),
                            ),
                          ),
                          const SizedBox(height: 16),

                          Row(
                            children: [
                              // Botón Estudiante/Voluntario
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    Navigator.pushNamed(context, '/registro-voluntario');
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [Color(0xFFF0FDF4), Color(0xFFDCFCE7)],
                                      ),
                                      border: Border.all(color: const Color(0xFF86EFAC), width: 2),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      children: [
                                        Image.asset(
                                          'assets/images/Vl_img.png',
                                          width: 48,
                                          height: 48,
                                        ),
                                        const SizedBox(height: 8),
                                        const Text(
                                          'Estudiante/\nVoluntario',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF16A34A),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              // Botón Docente
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    Navigator.pushNamed(context, '/registro-docente');
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [Color(0xFFEFF6FF), Color(0xFFDBEAFE)],
                                      ),
                                      border: Border.all(color: const Color(0xFF93C5FD), width: 2),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Column(
                                      children: [
                                        Image.asset(
                                          'assets/images/Dc_img.png',
                                          width: 48,
                                          height: 48,
                                        ),
                                        const SizedBox(height: 8),
                                        const Text(
                                          'Docente',
                                          textAlign: TextAlign.center,
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: Color(0xFF2563EB),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 24),

                          // Credenciales de prueba
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD1FAE5), // Verde muy claro
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFF86EFAC)), // Verde claro
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Credenciales de prueba:',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFF166534), // Verde oscuro
                                  ),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Usuario: admin',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF166534),
                                  ),
                                ),
                                const Text(
                                  'Contraseña: admin123',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Color(0xFF166534),
                                  ),
                                ),
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
          ),
        ),
      ),
    );
  }
}

