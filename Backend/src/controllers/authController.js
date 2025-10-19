const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // Encriptar contraseña
    const claveEncriptada = await bcrypt.hash(clave, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.crear({
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono,
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

    // Construir objeto de actualización solo con campos proporcionados
    const datosActualizar = {};
    if (nombres !== undefined) datosActualizar.nombres = nombres;
    if (apellidos !== undefined) datosActualizar.apellidos = apellidos;
    if (email_personal !== undefined) datosActualizar.email_personal = email_personal;
    if (email_academico !== undefined) datosActualizar.email_academico = email_academico;
    if (telefono !== undefined) datosActualizar.telefono = telefono;
    if (fecha_nacimiento !== undefined) datosActualizar.fecha_nacimiento = fecha_nacimiento;
    if (es_estudiante !== undefined) datosActualizar.es_estudiante = es_estudiante;
    if (id_centro_educativo !== undefined) datosActualizar.id_centro_educativo = id_centro_educativo;
    if (num_cuenta !== undefined) datosActualizar.num_cuenta = num_cuenta;
    if (id_carrera !== undefined) datosActualizar.id_carrera = id_carrera;

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

