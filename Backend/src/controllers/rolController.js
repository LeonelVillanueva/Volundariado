const Rol = require('../models/Rol');
const RolPermiso = require('../models/RolPermiso');

/**
 * Controller de Roles
 */

exports.obtenerTodos = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtros = {};
    if (estado) filtros.estado = estado;

    const roles = await Rol.obtenerTodos(filtros);

    res.json({
      success: true,
      cantidad: roles.length,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener roles',
      error: error.message
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await Rol.obtenerPorId(id);

    if (!rol) {
      return res.status(404).json({
        success: false,
        mensaje: 'Rol no encontrado'
      });
    }

    res.json({
      success: true,
      data: rol
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener rol',
      error: error.message
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, estado } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre del rol es requerido'
      });
    }

    const nuevoRol = await Rol.crear({ nombre, estado });

    res.status(201).json({
      success: true,
      mensaje: 'Rol creado exitosamente',
      data: nuevoRol
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear rol',
      error: error.message
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await Rol.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Rol no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Rol actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar rol',
      error: error.message
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Rol.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Rol no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Rol eliminado exitosamente'
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({
        success: false,
        mensaje: 'No se puede eliminar el rol porque tiene usuarios asignados'
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar rol',
      error: error.message
    });
  }
};

/**
 * Obtener permisos de un rol
 */
exports.obtenerPermisos = async (req, res) => {
  try {
    const { id } = req.params;
    const permisos = await RolPermiso.obtenerPermisosPorRol(id);

    res.json({
      success: true,
      cantidad: permisos.length,
      data: permisos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener permisos del rol',
      error: error.message
    });
  }
};

/**
 * Asignar permisos a un rol
 */
exports.asignarPermisos = async (req, res) => {
  try {
    const { id } = req.params;
    const { permisos } = req.body; // Array de IDs de permisos

    if (!Array.isArray(permisos) || permisos.length === 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Debe proporcionar un array de IDs de permisos'
      });
    }

    const cantidad = await RolPermiso.asignarPermisosARol(id, permisos);

    res.json({
      success: true,
      mensaje: `${cantidad} permisos asignados al rol`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al asignar permisos',
      error: error.message
    });
  }
};

