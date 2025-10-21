const Usuario = require('../models/Usuario');
const CentroEducativo = require('../models/CentroEducativo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validarEmail, validarTelefono, validarEmailAcademico, normalizarTelefono } = require('../utils/validaciones');

/**
 * Controller de Autenticación
 * Maneja registro, login, logout y verificación de tokens
 */

/**
 * Registrar un nuevo usuario
 */
exports.registrar = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono,
      fecha_nacimiento,
      es_estudiante,
      id_centro_educativo,
      num_cuenta,
      id_carrera,
      usuario_nombre,
      clave,
      id_rol
    } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !usuario_nombre || !clave || !id_rol) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos requeridos: nombres, apellidos, usuario_nombre, clave, id_rol'
      });
    }

    // VALIDACIÓN: Email personal debe ser válido
    if (email_personal && !validarEmail(email_personal)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email personal no es válido. Debe contener @ y un dominio válido'
      });
    }

    // VALIDACIÓN: Teléfono debe tener exactamente 8 dígitos
    if (telefono && !validarTelefono(telefono)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El teléfono debe tener exactamente 8 dígitos'
      });
    }

    // VALIDACIÓN: Email académico para docentes
    if (id_rol === 4 && id_centro_educativo) { // 4 = Docente
      if (!email_academico) {
        return res.status(400).json({
          success: false,
          mensaje: 'Los docentes deben proporcionar un email académico'
        });
      }

      if (!validarEmail(email_academico)) {
        return res.status(400).json({
          success: false,
          mensaje: 'El email académico no es válido. Debe contener @ y un dominio válido'
        });
      }

      // Obtener el centro educativo para verificar el dominio
      const centro = await CentroEducativo.obtenerPorId(id_centro_educativo);
      if (centro && centro.Dominio_email) {
        if (!validarEmailAcademico(email_academico, centro.Dominio_email)) {
          return res.status(400).json({
            success: false,
            mensaje: 'El email académico no corresponde al dominio institucional del centro educativo seleccionado'
          });
        }
      }
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.obtenerPorUsuarioNombre(usuario_nombre);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre de usuario ya está en uso'
      });
    }

    // Verificar si el email ya existe
    if (email_personal) {
      const emailExistente = await Usuario.obtenerPorEmailPersonal(email_personal);
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          mensaje: 'El email personal ya está registrado'
        });
      }
    }

    // Normalizar teléfono (eliminar caracteres especiales)
    const telefonoNormalizado = telefono ? normalizarTelefono(telefono) : null;

    // Encriptar contraseña
    const claveEncriptada = await bcrypt.hash(clave, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.crear({
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono: telefonoNormalizado,
      fecha_nacimiento,
      es_estudiante: es_estudiante || false,
      id_centro_educativo,
      num_cuenta,
      id_carrera,
      usuario_nombre,
      clave: claveEncriptada,
      id_rol
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, usuario_nombre, id_rol },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente',
      data: {
        id: nuevoUsuario.id,
        nombres,
        apellidos,
        usuario_nombre,
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Iniciar sesión
 */
exports.login = async (req, res) => {
  try {
    const { usuario_nombre, clave } = req.body;

    // Validar campos requeridos
    if (!usuario_nombre || !clave) {
      return res.status(400).json({
        success: false,
        mensaje: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const usuario = await Usuario.obtenerPorUsuarioNombre(usuario_nombre);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const claveValida = await bcrypt.compare(clave, usuario.Clave);
    if (!claveValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar que el usuario esté activo
    if (usuario.Estado !== 'Activo') {
      return res.status(403).json({
        success: false,
        mensaje: 'Usuario inactivo. Consulta a tu supervisor'
      });
    }

    // Verificar estado de aprobación (solo para docentes)
    if (usuario.ID_rol === 4 && usuario.Estado_aprobacion !== 'Aprobado') {
      const mensajeAprobacion = usuario.Estado_aprobacion === 'Pendiente'
        ? 'Tu cuenta está pendiente de aprobación por un administrador. Por favor espera a que tu cuenta sea verificada.'
        : 'Tu cuenta fue rechazada. Contacta al administrador para más información.';
      
      return res.status(403).json({
        success: false,
        mensaje: mensajeAprobacion,
        estado_aprobacion: usuario.Estado_aprobacion
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.ID,
        usuario_nombre: usuario.Usuario_nombre,
        id_rol: usuario.ID_rol
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    // No enviar la contraseña en la respuesta
    delete usuario.Clave;

    res.json({
      success: true,
      mensaje: 'Login exitoso',
      data: {
        usuario,
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

/**
 * Registro de nuevo usuario
 */
exports.registro = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      usuario_nombre,
      clave,
      id_rol,
      email_personal,
      email_academico,
      telefono,
      fecha_nacimiento,
      es_estudiante,
      id_centro_educativo,
      nuevo_centro
    } = req.body;

    // Validar campos requeridos
    if (!nombres || !apellidos || !usuario_nombre || !clave || !id_rol || !email_personal) {
      return res.status(400).json({
        success: false,
        mensaje: 'Nombre, apellido, usuario, contraseña, email personal y rol son requeridos'
      });
    }

    // VALIDACIÓN: Email académico obligatorio para docentes
    if (id_rol === 4 && !email_academico) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email académico es requerido para docentes'
      });
    }

    // VALIDACIÓN: Email personal debe ser válido
    if (email_personal && !validarEmail(email_personal)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email personal no es válido. Debe contener @ y un dominio válido'
      });
    }

    // VALIDACIÓN: Email académico debe ser válido
    if (email_academico && !validarEmail(email_academico)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email académico no es válido. Debe contener @ y un dominio válido'
      });
    }

    // VALIDACIÓN: Teléfono debe tener exactamente 8 dígitos
    if (telefono && !validarTelefono(telefono)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El teléfono debe tener exactamente 8 dígitos'
      });
    }

    // Validar que el nombre de usuario no exista
    const usuarioExistente = await Usuario.obtenerPorUsuarioNombre(usuario_nombre);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre de usuario ya está en uso'
      });
    }

    // Encriptar contraseña
    const claveEncriptada = await bcrypt.hash(clave, 10);
    
    // Normalizar teléfono
    const telefonoNormalizado = telefono ? normalizarTelefono(telefono) : null;

    // Variable para almacenar el ID del centro
    let centroId = id_centro_educativo;

    // Si es docente y va a crear un nuevo centro
    if (id_rol === 4 && nuevo_centro && nuevo_centro.nombre) {
      try {
        const centroCreado = await CentroEducativo.crear({
          nombre: nuevo_centro.nombre,
          direccion: nuevo_centro.direccion,
          ciudad: nuevo_centro.ciudad,
          telefono: nuevo_centro.telefono,
          email: nuevo_centro.email,
          dominio_email: nuevo_centro.dominio_email
        });
        centroId = centroCreado.id;
      } catch (error) {
        return res.status(400).json({
          success: false,
          mensaje: 'Error al crear el centro educativo',
          error: error.message
        });
      }
    }

    // VALIDACIÓN: Email académico para docentes debe coincidir con dominio institucional
    if (id_rol === 4 && centroId && email_academico) {
      const centro = await CentroEducativo.obtenerPorId(centroId);
      if (centro && centro.Dominio_email) {
        if (!validarEmailAcademico(email_academico, centro.Dominio_email)) {
          return res.status(400).json({
            success: false,
            mensaje: 'El email académico no corresponde al dominio institucional del centro educativo seleccionado'
          });
        }
      }
    }

    // Determinar estado de aprobación (docentes requieren aprobación)
    const estadoAprobacion = (id_rol === 4) ? 'Pendiente' : 'Aprobado';

    // Crear usuario
    const nuevoUsuario = await Usuario.crear({
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono: telefonoNormalizado,
      fecha_nacimiento,
      es_estudiante: es_estudiante || false,
      id_centro_educativo: centroId,
      num_cuenta: null,
      id_carrera: null,
      estado_aprobacion: estadoAprobacion,
      esta_verificado: false, // Siempre empezar como no verificado
      usuario_nombre,
      clave: claveEncriptada, // Usar contraseña hasheada
      id_rol
    });

    // Mensaje diferente para docentes pendientes
    const mensaje = (id_rol === 4) 
      ? 'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador.'
      : 'Usuario registrado exitosamente';

    res.status(201).json({
      success: true,
      mensaje: mensaje,
      data: {
        id: nuevoUsuario.id,
        usuario_nombre: nuevoUsuario.usuario_nombre,
        nombres: nuevoUsuario.nombres,
        apellidos: nuevoUsuario.apellidos,
        requiere_aprobacion: id_rol === 4
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};

/**
 * Verificar token
 */
exports.verificarToken = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        mensaje: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');

    // Obtener información actualizada del usuario
    const usuario = await Usuario.obtenerPorId(decoded.id);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    delete usuario.Clave;

    res.json({
      success: true,
      mensaje: 'Token válido',
      data: usuario
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      mensaje: 'Token inválido o expirado',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    delete usuario.Clave;

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener perfil',
      error: error.message
    });
  }
};

/**
 * Cambiar contraseña
 */
exports.cambiarClave = async (req, res) => {
  try {
    const { clave_actual, clave_nueva } = req.body;

    if (!clave_actual || !clave_nueva) {
      return res.status(400).json({
        success: false,
        mensaje: 'Contraseña actual y nueva son requeridas'
      });
    }

    // Obtener usuario
    const usuario = await Usuario.obtenerPorId(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const claveValida = await bcrypt.compare(clave_actual, usuario.Clave);
    if (!claveValida) {
      return res.status(401).json({
        success: false,
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const claveEncriptada = await bcrypt.hash(clave_nueva, 10);

    // Actualizar
    await Usuario.actualizar(req.usuario.id, { clave: claveEncriptada });

    res.json({
      success: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
exports.actualizarPerfil = async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono,
      fecha_nacimiento,
      es_estudiante,
      id_centro_educativo,
      num_cuenta,
      id_carrera
    } = req.body;

    // VALIDACIONES antes de construir el objeto
    // VALIDACIÓN: Email personal debe ser válido
    if (email_personal !== undefined && email_personal && !validarEmail(email_personal)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email personal no es válido. Debe contener @ y un dominio válido'
      });
    }

    // VALIDACIÓN: Email académico debe ser válido
    if (email_academico !== undefined && email_academico && !validarEmail(email_academico)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El email académico no es válido. Debe contener @ y un dominio válido'
      });
    }

    // VALIDACIÓN: Teléfono debe tener exactamente 8 dígitos
    if (telefono !== undefined && telefono && !validarTelefono(telefono)) {
      return res.status(400).json({
        success: false,
        mensaje: 'El teléfono debe tener exactamente 8 dígitos'
      });
    }

    // VALIDACIÓN: Email académico para docentes debe coincidir con dominio institucional
    const usuarioActualTemp = await Usuario.obtenerPorId(req.usuario.id);
    if (email_academico && id_centro_educativo && usuarioActualTemp.ID_rol === 4) { // 4 = Docente
      const centro = await CentroEducativo.obtenerPorId(id_centro_educativo);
      if (centro && centro.Dominio_email) {
        if (!validarEmailAcademico(email_academico, centro.Dominio_email)) {
          return res.status(400).json({
            success: false,
            mensaje: 'El email académico no corresponde al dominio institucional del centro educativo seleccionado'
          });
        }
      }
    }

    // Construir objeto de actualización solo con campos proporcionados
    const datosActualizar = {};
    if (nombres !== undefined) datosActualizar.nombres = nombres;
    if (apellidos !== undefined) datosActualizar.apellidos = apellidos;
    if (email_personal !== undefined) datosActualizar.email_personal = email_personal;
    if (email_academico !== undefined) datosActualizar.email_academico = email_academico;
    if (telefono !== undefined) datosActualizar.telefono = telefono ? normalizarTelefono(telefono) : null;
    if (fecha_nacimiento !== undefined) datosActualizar.fecha_nacimiento = fecha_nacimiento;
    if (es_estudiante !== undefined) datosActualizar.es_estudiante = es_estudiante;
    if (id_centro_educativo !== undefined) datosActualizar.id_centro_educativo = id_centro_educativo;
    if (num_cuenta !== undefined) datosActualizar.num_cuenta = num_cuenta;
    if (id_carrera !== undefined) datosActualizar.id_carrera = id_carrera;

    // VALIDACIÓN: Si se marca como estudiante, validar campos obligatorios
    if (es_estudiante === 1) {
      if (!id_centro_educativo) {
        return res.status(400).json({
          success: false,
          mensaje: 'Si eres estudiante, debes seleccionar un centro educativo'
        });
      }
      if (!num_cuenta || num_cuenta.trim() === '') {
        return res.status(400).json({
          success: false,
          mensaje: 'Si eres estudiante, debes proporcionar tu número de cuenta o identidad'
        });
      }
      if (!id_carrera) {
        return res.status(400).json({
          success: false,
          mensaje: 'Si eres estudiante, debes seleccionar una carrera'
        });
      }
    }

    // IMPORTANTE: Si el usuario cambia de no estudiante a estudiante, 
    // o cambia de centro educativo, debe resetear la verificación
    if (es_estudiante !== undefined || id_centro_educativo !== undefined) {
      // Obtener el usuario actual para comparar
      const usuarioActual = await Usuario.obtenerPorId(req.usuario.id);
      
      // Si está marcando como estudiante o cambiando centro, resetear verificación
      if (es_estudiante === 1 || 
          (usuarioActual.Es_estudiante === 1 && id_centro_educativo !== undefined && id_centro_educativo !== usuarioActual.ID_centro_educativo)) {
        datosActualizar.esta_verificado = false;
      }
    }

    // Si no hay datos para actualizar
    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No se proporcionaron datos para actualizar'
      });
    }

    // Actualizar usuario
    await Usuario.actualizar(req.usuario.id, datosActualizar);

    // Obtener usuario actualizado
    const usuarioActualizado = await Usuario.obtenerPorId(req.usuario.id);
    delete usuarioActualizado.Clave;

    res.json({
      success: true,
      mensaje: 'Perfil actualizado exitosamente',
      data: usuarioActualizado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

