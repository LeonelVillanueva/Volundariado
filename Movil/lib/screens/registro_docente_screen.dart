import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/api_service.dart';
import '../models/centro_educativo.dart';

class RegistroDocenteScreen extends StatefulWidget {
  const RegistroDocenteScreen({super.key});

  @override
  State<RegistroDocenteScreen> createState() => _RegistroDocenteScreenState();
}

class _RegistroDocenteScreenState extends State<RegistroDocenteScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  
  // Controladores
  final _nombresController = TextEditingController();
  final _apellidosController = TextEditingController();
  final _usuarioController = TextEditingController();
  final _emailPersonalController = TextEditingController();
  final _emailAcademicoController = TextEditingController();
  final _telefonoController = TextEditingController();
  final _claveController = TextEditingController();
  final _confirmarClaveController = TextEditingController();
  
  // Nuevo Centro
  final _nombreCentroController = TextEditingController();
  final _direccionCentroController = TextEditingController();
  final _ciudadCentroController = TextEditingController();
  final _telefonoCentroController = TextEditingController();
  final _emailCentroController = TextEditingController();
  final _dominioEmailCentroController = TextEditingController();
  
  DateTime? _fechaNacimiento;
  List<CentroEducativo> _centros = [];
  int? _centroSeleccionado;
  String _tipoCentro = 'existente'; // 'existente' o 'nuevo'
  bool _cargando = false;
  String? _mensaje;
  bool _esExito = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  int _pasoActual = 1; // Control de pasos (1 = Personal, 2 = Académico)

  @override
  void initState() {
    super.initState();
    _cargarCentros();
  }

  @override
  void dispose() {
    _nombresController.dispose();
    _apellidosController.dispose();
    _usuarioController.dispose();
    _emailPersonalController.dispose();
    _emailAcademicoController.dispose();
    _telefonoController.dispose();
    _claveController.dispose();
    _confirmarClaveController.dispose();
    _nombreCentroController.dispose();
    _direccionCentroController.dispose();
    _ciudadCentroController.dispose();
    _telefonoCentroController.dispose();
    _emailCentroController.dispose();
    _dominioEmailCentroController.dispose();
    super.dispose();
  }

  Future<void> _cargarCentros() async {
    try {
      final response = await _apiService.get('/api/centros/publico');
      if (response['success']) {
        setState(() {
          _centros = (response['data'] as List)
              .map((c) => CentroEducativo.fromJson(c))
              .toList();
        });
      }
    } catch (e) {
      // Silenciar error, centros no críticos
    }
  }

  Future<void> _registrar() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    // Validar contraseñas
    if (_claveController.text != _confirmarClaveController.text) {
      setState(() {
        _mensaje = 'Las contraseñas no coinciden';
        _esExito = false;
      });
      return;
    }

    // Validar centro nuevo si aplica
    if (_tipoCentro == 'nuevo' && _nombreCentroController.text.trim().isEmpty) {
      setState(() {
        _mensaje = 'Debes proporcionar el nombre del centro educativo';
        _esExito = false;
      });
      return;
    }

    // VALIDACIÓN: Email personal
    if (_emailPersonalController.text.isNotEmpty && 
        !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailPersonalController.text)) {
      setState(() {
        _mensaje = 'El email personal no es válido. Debe contener @ y un dominio válido';
        _esExito = false;
      });
      return;
    }

    // VALIDACIÓN: Email académico
    if (_emailAcademicoController.text.isNotEmpty && 
        !RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailAcademicoController.text)) {
      setState(() {
        _mensaje = 'El email académico no es válido. Debe contener @ y un dominio válido';
        _esExito = false;
      });
      return;
    }

    // VALIDACIÓN: Teléfono (8 dígitos)
    if (_telefonoController.text.isNotEmpty) {
      final digitos = _telefonoController.text.replaceAll(RegExp(r'\D'), '');
      if (digitos.length != 8) {
        setState(() {
          _mensaje = 'El teléfono debe tener exactamente 8 dígitos';
          _esExito = false;
        });
        return;
      }
    }

    // VALIDACIÓN: Email académico es requerido para docentes
    if (_emailAcademicoController.text.trim().isEmpty) {
      setState(() {
        _mensaje = 'Los docentes deben proporcionar un email académico institucional';
        _esExito = false;
      });
      return;
    }

    // VALIDACIÓN: Debe seleccionar un centro
    if (_tipoCentro == 'existente' && _centroSeleccionado == null) {
      setState(() {
        _mensaje = 'Debes seleccionar un centro educativo';
        _esExito = false;
      });
      return;
    }

    setState(() => _cargando = true);

    try {
      final datos = {
        'nombres': _nombresController.text.trim(),
        'apellidos': _apellidosController.text.trim(),
        'usuario_nombre': _usuarioController.text.trim(),
        'clave': _claveController.text,
        'id_rol': 4, // Docente
        'email_personal': _emailPersonalController.text.trim(),
        'email_academico': _emailAcademicoController.text.trim(),
        'telefono': _telefonoController.text.trim().isEmpty 
            ? null 
            : _telefonoController.text.trim(),
        'fecha_nacimiento': _fechaNacimiento?.toIso8601String(),
        'es_estudiante': false,
      };

      // Centro existente
      if (_tipoCentro == 'existente' && _centroSeleccionado != null) {
        datos['id_centro_educativo'] = _centroSeleccionado;
      }

      // Nuevo centro
      if (_tipoCentro == 'nuevo') {
        datos['nuevo_centro'] = {
          'nombre': _nombreCentroController.text.trim(),
          'direccion': _direccionCentroController.text.trim().isEmpty 
              ? null 
              : _direccionCentroController.text.trim(),
          'ciudad': _ciudadCentroController.text.trim().isEmpty 
              ? null 
              : _ciudadCentroController.text.trim(),
          'telefono': _telefonoCentroController.text.trim().isEmpty 
              ? null 
              : _telefonoCentroController.text.trim(),
          'email': _emailCentroController.text.trim().isEmpty 
              ? null 
              : _emailCentroController.text.trim(),
          'dominio_email': _dominioEmailCentroController.text.trim().isEmpty 
              ? null 
              : _dominioEmailCentroController.text.trim(),
        };
      }

      final response = await _apiService.post('/api/auth/registro', datos);

      if (response['success']) {
        final mensajeExito = response['data']['requiere_aprobacion'] == true
            ? '¡Registro exitoso! Tu cuenta será revisada por un administrador. Te notificaremos cuando sea aprobada.'
            : '¡Registro exitoso! Redirigiendo al login...';
        
        setState(() {
          _mensaje = mensajeExito;
          _esExito = true;
        });

        // Esperar 3 segundos y volver
        await Future.delayed(const Duration(seconds: 3));
        if (mounted) {
          Navigator.pop(context);
        }
      } else {
        setState(() {
          _mensaje = _convertirMensajeAmigable(response['mensaje']);
          _esExito = false;
        });
      }
    } catch (e) {
      setState(() {
        _mensaje = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        _esExito = false;
      });
    } finally {
      setState(() => _cargando = false);
    }
  }

  void _siguientePaso() {
    // Validar paso 1 antes de continuar
    if (_pasoActual == 1) {
      // Validar campos obligatorios del paso 1
      if (_nombresController.text.trim().isEmpty) {
        setState(() {
          _mensaje = 'El nombre es requerido';
          _esExito = false;
        });
        return;
      }
      if (_apellidosController.text.trim().isEmpty) {
        setState(() {
          _mensaje = 'El apellido es requerido';
          _esExito = false;
        });
        return;
      }
      if (_usuarioController.text.trim().isEmpty) {
        setState(() {
          _mensaje = 'El nombre de usuario es requerido';
          _esExito = false;
        });
        return;
      }
      if (_emailPersonalController.text.trim().isEmpty) {
        setState(() {
          _mensaje = 'El email personal es requerido';
          _esExito = false;
        });
        return;
      }
      if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailPersonalController.text)) {
        setState(() {
          _mensaje = 'El email personal no es válido';
          _esExito = false;
        });
        return;
      }
      if (_claveController.text.length < 6) {
        setState(() {
          _mensaje = 'La contraseña debe tener al menos 6 caracteres';
          _esExito = false;
        });
        return;
      }
      if (_claveController.text != _confirmarClaveController.text) {
        setState(() {
          _mensaje = 'Las contraseñas no coinciden';
          _esExito = false;
        });
        return;
      }

      // Todo válido, avanzar al paso 2
      setState(() {
        _pasoActual = 2;
        _mensaje = null;
      });
    }
  }

  void _pasoAnterior() {
    if (_pasoActual > 1) {
      setState(() {
        _pasoActual = 1;
        _mensaje = null;
      });
    }
  }

  String _convertirMensajeAmigable(String? mensajeOriginal) {
    if (mensajeOriginal == null) return 'Error al registrar usuario';
    
    final mensajes = {
      'El nombre de usuario ya está en uso': 'Este usuario ya existe. Elige otro nombre de usuario.',
      'El email personal ya está registrado': 'Este email ya está registrado. Usa otro email.',
      'El email académico es requerido para docentes': 'Debes proporcionar un email académico institucional.',
      'El email académico no corresponde al dominio institucional del centro educativo seleccionado': 'El email académico no es válido para el centro educativo seleccionado. Verifica que sea tu correo institucional oficial.',
      'El email personal no es válido. Debe contener @ y un dominio válido': 'El email personal no es válido. Verifica el formato.',
      'El email académico no es válido. Debe contener @ y un dominio válido': 'El email académico no es válido. Verifica el formato.',
      'El teléfono debe tener exactamente 8 dígitos': 'El teléfono debe tener exactamente 8 dígitos.',
      'Debes proporcionar el nombre del centro educativo': 'Si vas a crear un centro nuevo, debes proporcionar su nombre.',
      'Error al crear el centro educativo': 'No se pudo crear el centro educativo. Verifica los datos.',
    };
    
    return mensajes[mensajeOriginal] ?? mensajeOriginal;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEFF6FF),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                // Header
                Image.asset(
                  'assets/images/Dc_img.png',
                  width: 64,
                  height: 64,
                ),
                const SizedBox(height: 16),
                Text(
                  'Registro de Docente - Paso $_pasoActual de 2',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF2563EB),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  _pasoActual == 1 
                    ? 'Información Personal' 
                    : 'Información Académica',
                  style: const TextStyle(fontSize: 14, color: Colors.grey),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                // Indicador de progreso
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFF2563EB),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Container(
                        height: 4,
                        decoration: BoxDecoration(
                          color: _pasoActual >= 2 
                            ? const Color(0xFF2563EB) 
                            : Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Card con formulario
                Card(
                  elevation: 4,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // PASO 1: INFORMACIÓN PERSONAL
                        if (_pasoActual == 1) ...[
                        const Text(
                          'Información Personal',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const Divider(),
                        const SizedBox(height: 16),

                        // Nombre y Apellido
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _nombresController,
                                decoration: const InputDecoration(
                                  labelText: 'Nombre *',
                                  border: OutlineInputBorder(),
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(color: Color(0xFF2563EB)),
                                  ),
                                ),
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]')),
                                ],
                                validator: (value) => value?.isEmpty ?? true ? 'Requerido' : null,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextFormField(
                                controller: _apellidosController,
                                decoration: const InputDecoration(
                                  labelText: 'Apellido *',
                                  border: OutlineInputBorder(),
                                  focusedBorder: OutlineInputBorder(
                                    borderSide: BorderSide(color: Color(0xFF2563EB)),
                                  ),
                                ),
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(RegExp(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]')),
                                ],
                                validator: (value) => value?.isEmpty ?? true ? 'Requerido' : null,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),

                        // Usuario
                        TextFormField(
                          controller: _usuarioController,
                          decoration: const InputDecoration(
                            labelText: 'Usuario *',
                            border: OutlineInputBorder(),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Color(0xFF2563EB)),
                            ),
                          ),
                          validator: (value) => value?.isEmpty ?? true ? 'Requerido' : null,
                        ),
                        const SizedBox(height: 16),

                        // Email Personal
                        TextFormField(
                          controller: _emailPersonalController,
                          decoration: const InputDecoration(
                            labelText: 'Email Personal *',
                            border: OutlineInputBorder(),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Color(0xFF2563EB)),
                            ),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value?.isEmpty ?? true) return 'Requerido';
                            if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                              return 'Email inválido';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        // Contraseñas
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _claveController,
                                obscureText: _obscurePassword,
                                decoration: InputDecoration(
                                  labelText: 'Contraseña *',
                                  border: const OutlineInputBorder(),
                                  focusedBorder: const OutlineInputBorder(
                                    borderSide: BorderSide(color: Color(0xFF2563EB)),
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off),
                                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                                  ),
                                ),
                                validator: (value) {
                                  if (value?.isEmpty ?? true) return 'Requerido';
                                  if (value!.length < 6) return 'Mínimo 6 caracteres';
                                  return null;
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextFormField(
                                controller: _confirmarClaveController,
                                obscureText: _obscureConfirmPassword,
                                decoration: InputDecoration(
                                  labelText: 'Confirmar *',
                                  border: const OutlineInputBorder(),
                                  focusedBorder: const OutlineInputBorder(
                                    borderSide: BorderSide(color: Color(0xFF2563EB)),
                                  ),
                                  suffixIcon: IconButton(
                                    icon: Icon(_obscureConfirmPassword ? Icons.visibility : Icons.visibility_off),
                                    onPressed: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                                  ),
                                ),
                                validator: (value) => value?.isEmpty ?? true ? 'Requerido' : null,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Información Opcional - Paso 1
                        const Text(
                          'Información Adicional (Opcional)',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                        ),
                        const Divider(),
                        const SizedBox(height: 16),

                        // Teléfono y Fecha
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _telefonoController,
                                decoration: const InputDecoration(
                                  labelText: 'Teléfono',
                                  hintText: '12345678',
                                  helperText: '8 dígitos',
                                  border: OutlineInputBorder(),
                                ),
                                keyboardType: TextInputType.number,
                                maxLength: 8,
                                inputFormatters: [
                                  FilteringTextInputFormatter.digitsOnly,
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: InkWell(
                                onTap: () async {
                                  final fecha = await showDatePicker(
                                    context: context,
                                    initialDate: DateTime.now().subtract(const Duration(days: 365 * 20)),
                                    firstDate: DateTime(1900),
                                    lastDate: DateTime.now(),
                                  );
                                  if (fecha != null) {
                                    setState(() => _fechaNacimiento = fecha);
                                  }
                                },
                                child: InputDecorator(
                                  decoration: const InputDecoration(
                                    labelText: 'Fecha Nacimiento',
                                    border: OutlineInputBorder(),
                                  ),
                                  child: Text(
                                    _fechaNacimiento != null
                                        ? '${_fechaNacimiento!.day}/${_fechaNacimiento!.month}/${_fechaNacimiento!.year}'
                                        : 'Seleccionar',
                                    style: TextStyle(
                                      color: _fechaNacimiento != null ? Colors.black : Colors.grey,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        ], // Fin del Paso 1

                        // PASO 2: INFORMACIÓN ACADÉMICA
                        if (_pasoActual == 2) ...[
                        const Text(
                          'Información Académica',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const Divider(),
                        const SizedBox(height: 16),

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
                                  'Tu email académico debe ser el correo oficial de tu institución',
                                  style: TextStyle(fontSize: 12, color: Color(0xFF1565C0)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Email Académico
                        TextFormField(
                          controller: _emailAcademicoController,
                          decoration: const InputDecoration(
                            labelText: 'Email Académico Institucional *',
                            hintText: 'profesor@institucion.edu',
                            helperText: 'Debe ser tu correo oficial de la institución',
                            border: OutlineInputBorder(),
                            focusedBorder: OutlineInputBorder(
                              borderSide: BorderSide(color: Color(0xFF2563EB)),
                            ),
                            prefixIcon: Icon(Icons.school, color: Color(0xFF2563EB)),
                          ),
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value?.isEmpty ?? true) return 'Requerido';
                            if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                              return 'Email inválido';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // Sección: Centro Educativo
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF93C5FD)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Centro Educativo',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 12),

                              // Radio: Centro existente
                              RadioListTile<String>(
                                title: const Text('Seleccionar centro existente'),
                                value: 'existente',
                                groupValue: _tipoCentro,
                                onChanged: (value) => setState(() => _tipoCentro = value!),
                                activeColor: const Color(0xFF2563EB),
                              ),

                              if (_tipoCentro == 'existente') ...[
                                const SizedBox(height: 8),
                                DropdownButtonFormField<int>(
                                  value: _centroSeleccionado,
                                  decoration: const InputDecoration(
                                    labelText: 'Centro',
                                    border: OutlineInputBorder(),
                                  ),
                                  items: [
                                    const DropdownMenuItem<int>(
                                      value: null,
                                      child: Text('Selecciona un centro'),
                                    ),
                                    ..._centros.map((centro) => DropdownMenuItem<int>(
                                      value: centro.id,
                                      child: Text(centro.nombre),
                                    )),
                                  ],
                                  onChanged: (value) => setState(() => _centroSeleccionado = value),
                                ),
                              ],

                              const SizedBox(height: 8),

                              // Radio: Nuevo centro
                              RadioListTile<String>(
                                title: const Text('Registrar nuevo centro'),
                                value: 'nuevo',
                                groupValue: _tipoCentro,
                                onChanged: (value) => setState(() => _tipoCentro = value!),
                                activeColor: const Color(0xFF2563EB),
                              ),

                              if (_tipoCentro == 'nuevo') ...[
                                const SizedBox(height: 12),
                                TextFormField(
                                  controller: _nombreCentroController,
                                  decoration: const InputDecoration(
                                    labelText: 'Nombre del Centro',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextFormField(
                                        controller: _ciudadCentroController,
                                        decoration: const InputDecoration(
                                          labelText: 'Ciudad',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: TextFormField(
                                        controller: _telefonoCentroController,
                                        decoration: const InputDecoration(
                                          labelText: 'Teléfono',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                TextFormField(
                                  controller: _direccionCentroController,
                                  decoration: const InputDecoration(
                                    labelText: 'Dirección',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                TextFormField(
                                  controller: _emailCentroController,
                                  decoration: const InputDecoration(
                                    labelText: 'Email de Contacto',
                                    border: OutlineInputBorder(),
                                  ),
                                  keyboardType: TextInputType.emailAddress,
                                ),
                                const SizedBox(height: 12),
                                TextFormField(
                                  controller: _dominioEmailCentroController,
                                  decoration: const InputDecoration(
                                    labelText: 'Dominio Email Institucional',
                                    hintText: '@unitec.edu',
                                    helperText: 'Ej: @unitec.edu (opcional)',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                        ], // Fin del Paso 2

                        // Mensaje
                        if (_mensaje != null)
                          Container(
                            padding: const EdgeInsets.all(12),
                            margin: const EdgeInsets.only(bottom: 16),
                            decoration: BoxDecoration(
                              color: _esExito ? Colors.green.shade50 : Colors.red.shade50,
                              border: Border.all(
                                color: _esExito ? Colors.green.shade200 : Colors.red.shade200,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              _mensaje!,
                              style: TextStyle(
                                color: _esExito ? Colors.green.shade700 : Colors.red.shade700,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),

                        // Botones
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: _pasoActual == 1 
                                  ? () => Navigator.pop(context)
                                  : _pasoAnterior,
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                  side: const BorderSide(color: Colors.grey),
                                ),
                                child: Text(_pasoActual == 1 ? 'Cancelar' : 'Atrás'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _cargando 
                                  ? null 
                                  : (_pasoActual == 1 ? _siguientePaso : _registrar),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF2563EB),
                                  padding: const EdgeInsets.symmetric(vertical: 16),
                                ),
                                child: _cargando
                                    ? const SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2,
                                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                        ),
                                      )
                                    : Text(
                                        _pasoActual == 1 ? 'Siguiente' : 'Registrarme',
                                        style: const TextStyle(fontWeight: FontWeight.bold),
                                      ),
                              ),
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
        ),
      ),
    );
  }
}

