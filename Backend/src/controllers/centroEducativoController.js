const CentroEducativo = require('../models/CentroEducativo');
const Usuario = require('../models/Usuario');

/**
 * Controlador para gestión de Centros Educativos
 */

// Obtener todos los centros educativos
exports.obtenerTodos = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const filtros = ciudad ? { ciudad } : {};
    
    const centros = await CentroEducativo.obtenerTodos(filtros);
    
    res.json({
      success: true,
      data: centros,
      total: centros.length
    });
  } catch (error) {
    console.error('Error al obtener centros educativos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener centros educativos',
      error: error.message
    });
  }
};

// Obtener un centro educativo por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const centro = await CentroEducativo.obtenerPorId(parseInt(id));
    
    if (!centro) {
      return res.status(404).json({
        success: false,
        mensaje: 'Centro educativo no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: centro
    });
  } catch (error) {
    console.error('Error al obtener centro educativo:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener centro educativo',
      error: error.message
    });
  }
};

// Crear un nuevo centro educativo (Solo Docentes)
exports.crear = async (req, res) => {
  try {
    // Verificar que el usuario sea Docente (ID_rol = 4)
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden crear centros educativos'
      });
    }

    const { nombre, direccion, ciudad, telefono, email, dominio_email } = req.body;

    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre del centro es requerido'
      });
    }

    const nuevoCentro = await CentroEducativo.crear({
      nombre,
      direccion,
      ciudad,
      telefono,
      email,
      dominio_email
    });

    // Asociar el centro al docente que lo creó
    await Usuario.actualizar(req.usuario.id, {
      ID_centro_educativo: nuevoCentro.id
    });

    res.status(201).json({
      success: true,
      mensaje: 'Centro educativo creado exitosamente',
      data: nuevoCentro
    });
  } catch (error) {
    console.error('Error al crear centro educativo:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear centro educativo',
      error: error.message
    });
  }
};

// Actualizar un centro educativo (Solo Docentes del mismo centro)
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, ciudad, telefono, email, dominio_email } = req.body;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden actualizar centros educativos'
      });
    }

    // Verificar que el docente pertenezca al centro
    if (req.usuario.id_centro_educativo !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes actualizar tu propio centro educativo'
      });
    }

    const datosActualizar = {};
    if (nombre !== undefined) datosActualizar.nombre = nombre;
    if (direccion !== undefined) datosActualizar.direccion = direccion;
    if (ciudad !== undefined) datosActualizar.ciudad = ciudad;
    if (telefono !== undefined) datosActualizar.telefono = telefono;
    if (email !== undefined) datosActualizar.email = email;
    if (dominio_email !== undefined) datosActualizar.dominio_email = dominio_email;

    const actualizado = await CentroEducativo.actualizar(parseInt(id), datosActualizar);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Centro educativo no encontrado'
      });
    }

    const centroActualizado = await CentroEducativo.obtenerPorId(parseInt(id));

    res.json({
      success: true,
      mensaje: 'Centro educativo actualizado exitosamente',
      data: centroActualizado
    });
  } catch (error) {
    console.error('Error al actualizar centro educativo:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar centro educativo',
      error: error.message
    });
  }
};

// Eliminar un centro educativo (Solo Administradores)
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario sea Administrador (ID_rol = 6)
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden eliminar centros educativos'
      });
    }

    const eliminado = await CentroEducativo.eliminar(parseInt(id));

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Centro educativo no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Centro educativo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar centro educativo:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar centro educativo',
      error: error.message
    });
  }
};

// Buscar centros educativos
exports.buscar = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({
        success: false,
        mensaje: 'El término de búsqueda es requerido'
      });
    }

    const centros = await CentroEducativo.buscar(termino);

    res.json({
      success: true,
      data: centros,
      total: centros.length
    });
  } catch (error) {
    console.error('Error al buscar centros educativos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar centros educativos',
      error: error.message
    });
  }
};

// Obtener estudiantes de un centro educativo (Solo Docentes del mismo centro)
exports.obtenerEstudiantes = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden ver los estudiantes de un centro'
      });
    }

    // Verificar que el docente pertenezca al centro
    if (req.usuario.id_centro_educativo !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes ver los estudiantes de tu centro educativo'
      });
    }

    const { pool } = require('../config/database');
    
    const query = `
      SELECT 
        u.ID,
        u.Usuario_nombre,
        u.Nombres,
        u.Apellidos,
        u.Email_personal,
        u.Email_academico,
        u.Telefono,
        u.Num_cuenta,
        u.Esta_verificado,
        u.Es_estudiante,
        u.ID_rol,
        c.Nombre as Carrera,
        u.created_at as Fecha_registro
      FROM Usuarios u
      LEFT JOIN Carreras c ON u.ID_carrera = c.ID
      WHERE u.ID_centro_educativo = ?
        AND u.Es_estudiante = 1
      ORDER BY u.Esta_verificado ASC, u.Nombres ASC
    `;

    const [estudiantes] = await pool.execute(query, [parseInt(id)]);

    res.json({
      success: true,
      data: estudiantes,
      total: estudiantes.length,
      verificados: estudiantes.filter(e => e.Esta_verificado === 1).length,
      pendientes: estudiantes.filter(e => e.Esta_verificado === 0).length
    });
  } catch (error) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estudiantes del centro',
      error: error.message
    });
  }
};
