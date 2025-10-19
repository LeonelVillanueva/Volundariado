const Permiso = require('../models/Permiso');
const UsuarioPermiso = require('../models/UsuarioPermiso');

/**
 * Controller de Permisos
 */

exports.obtenerTodos = async (req, res) => {
  try {
    const { seccion, accion, estado } = req.query;
    
    const filtros = {};
    if (seccion) filtros.seccion = seccion;
    if (accion) filtros.accion = accion;
    if (estado) filtros.estado = estado;

    const permisos = await Permiso.obtenerTodos(filtros);

    res.json({
      success: true,
      cantidad: permisos.length,
      data: permisos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener permisos',
      error: error.message
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const permiso = await Permiso.obtenerPorId(id);

    if (!permiso) {
      return res.status(404).json({
        success: false,
        mensaje: 'Permiso no encontrado'
      });
    }

    res.json({
      success: true,
      data: permiso
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener permiso',
      error: error.message
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, seccion, accion, estado } = req.body;

    if (!nombre || !seccion || !accion) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos requeridos: nombre, seccion, accion'
      });
    }

    const nuevoPermiso = await Permiso.crear({ nombre, seccion, accion, estado });

    res.status(201).json({
      success: true,
      mensaje: 'Permiso creado exitosamente',
      data: nuevoPermiso
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear permiso',
      error: error.message
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await Permiso.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Permiso no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Permiso actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar permiso',
      error: error.message
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Permiso.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Permiso no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Permiso eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar permiso',
      error: error.message
    });
  }
};

/**
 * Obtener permisos por sección
 */
exports.obtenerPorSeccion = async (req, res) => {
  try {
    const { seccion } = req.params;
    const permisos = await Permiso.obtenerPorSeccion(seccion);

    res.json({
      success: true,
      cantidad: permisos.length,
      data: permisos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener permisos por sección',
      error: error.message
    });
  }
};

/**
 * Obtener permisos completos de un usuario
 */
exports.obtenerPermisosUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const permisos = await UsuarioPermiso.obtenerPermisosCompletosUsuario(id_usuario);

    res.json({
      success: true,
      cantidad: permisos.length,
      data: permisos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener permisos del usuario',
      error: error.message
    });
  }
};

/**
 * Asignar permisos a un usuario
 */
exports.asignarPermisosAUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { permisos } = req.body;

    if (!Array.isArray(permisos) || permisos.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debe proporcionar un array de IDs de permisos'
      });
    }

    const cantidad = await UsuarioPermiso.asignarPermisosAUsuario(id_usuario, permisos);

    res.json({
      success: true,
      mensaje: `${cantidad} permisos asignados al usuario`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al asignar permisos',
      error: error.message
    });
  }
};

