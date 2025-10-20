const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

/**
 * Controller de Usuarios
 * Maneja todas las operaciones CRUD de usuarios
 */

/**
 * Obtener todos los usuarios
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const { estado, es_estudiante, id_rol } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (es_estudiante !== undefined) filtros.es_estudiante = es_estudiante === 'true';
    if (id_rol) filtros.id_rol = parseInt(id_rol);

    const usuarios = await Usuario.obtenerTodos(filtros);

    // No enviar contraseñas
    usuarios.forEach(usuario => delete usuario.Clave);

    res.json({
      success: true,
      cantidad: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * Obtener usuario por ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const idSolicitante = req.usuario?.id || null;
    const idRolSolicitante = req.usuario?.id_rol || null;
    
    // Obtener perfil filtrado según privacidad
    // Docentes (4) y Administradores (6) siempre ven todo
    const usuario = await Usuario.obtenerPerfilPublico(
      parseInt(id), 
      idSolicitante, 
      idRolSolicitante
    );

    if (!usuario) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    // Nunca enviar la contraseña
    delete usuario.Clave;

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener usuario',
      error: error.message
    });
  }
};

/**
 * Crear nuevo usuario
 */
exports.crear = async (req, res) => {
  try {
    const datos = req.body;

    // Validar campos requeridos
    if (!datos.nombres || !datos.apellidos || !datos.usuario_nombre || !datos.clave || !datos.id_rol) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos requeridos: nombres, apellidos, usuario_nombre, clave, id_rol'
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.obtenerPorUsuarioNombre(datos.usuario_nombre);
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre de usuario ya está en uso'
      });
    }

    // Encriptar contraseña
    datos.clave = await bcrypt.hash(datos.clave, 10);

    const nuevoUsuario = await Usuario.crear(datos);

    res.status(201).json({
      success: true,
      mensaje: 'Usuario creado exitosamente',
      data: { id: nuevoUsuario.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear usuario',
      error: error.message
    });
  }
};

/**
 * Actualizar usuario
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    // Si se intenta cambiar la contraseña, encriptarla
    if (datos.clave) {
      datos.clave = await bcrypt.hash(datos.clave, 10);
    }

    const actualizado = await Usuario.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

/**
 * Eliminar usuario
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Usuario.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

/**
 * Buscar usuarios
 */
exports.buscar = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({
        success: false,
        mensaje: 'El término de búsqueda es requerido'
      });
    }

    const usuarios = await Usuario.buscar(termino);
    usuarios.forEach(usuario => delete usuario.Clave);

    res.json({
      success: true,
      cantidad: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar usuarios',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de usuarios
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Usuario.obtenerEstadisticas();

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

/**
 * Verificar usuario
 */
exports.verificar = async (req, res) => {
  try {
    const { id } = req.params;

    const verificado = await Usuario.verificar(id);

    if (!verificado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Usuario verificado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al verificar usuario',
      error: error.message
    });
  }
};

/**
 * Cambiar estado de usuario
 */
exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        mensaje: 'El estado es requerido'
      });
    }

    const actualizado = await Usuario.cambiarEstado(id, estado);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Estado actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al cambiar estado',
      error: error.message
    });
  }
};

