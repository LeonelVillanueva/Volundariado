const Usuario = require('../models/Usuario');

/**
 * Controller para gestión de aprobaciones de docentes
 */

/**
 * Obtener docentes pendientes de aprobación
 */
exports.obtenerDocentesPendientes = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador (ID_rol = 6)
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden ver docentes pendientes'
      });
    }

    const { pool } = require('../config/database');
    
    const query = `
      SELECT 
        u.ID,
        u.Nombres,
        u.Apellidos,
        u.Email_personal,
        u.Email_academico,
        u.Telefono,
        u.Usuario_nombre,
        u.ID_centro_educativo,
        c.Nombre as Centro_nombre,
        u.Estado_aprobacion,
        u.created_at
      FROM Usuarios u
      LEFT JOIN Centros_Educativos c ON u.ID_centro_educativo = c.ID
      WHERE u.ID_rol = 4 
        AND u.Estado_aprobacion = 'Pendiente'
      ORDER BY u.created_at DESC
    `;

    const [docentes] = await pool.execute(query);

    res.json({
      success: true,
      data: docentes
    });
  } catch (error) {
    console.error('Error al obtener docentes pendientes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener docentes pendientes',
      error: error.message
    });
  }
};

/**
 * Aprobar un docente
 */
exports.aprobarDocente = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador (ID_rol = 6)
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden aprobar docentes'
      });
    }

    const { id_docente } = req.params;

    // Verificar que el usuario sea realmente un docente
    const docente = await Usuario.obtenerPorId(parseInt(id_docente));
    if (!docente) {
      return res.status(404).json({
        success: false,
        mensaje: 'Docente no encontrado'
      });
    }

    if (docente.ID_rol !== 4) {
      return res.status(400).json({
        success: false,
        mensaje: 'Este usuario no es un docente'
      });
    }

    // Aprobar docente
    await Usuario.actualizar(parseInt(id_docente), {
      estado_aprobacion: 'Aprobado'
    });

    const docenteActualizado = await Usuario.obtenerPorId(parseInt(id_docente));

    res.json({
      success: true,
      mensaje: 'Docente aprobado exitosamente',
      data: docenteActualizado
    });
  } catch (error) {
    console.error('Error al aprobar docente:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al aprobar docente',
      error: error.message
    });
  }
};

/**
 * Rechazar un docente
 */
exports.rechazarDocente = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador (ID_rol = 6)
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden rechazar docentes'
      });
    }

    const { id_docente } = req.params;

    // Verificar que el usuario sea realmente un docente
    const docente = await Usuario.obtenerPorId(parseInt(id_docente));
    if (!docente) {
      return res.status(404).json({
        success: false,
        mensaje: 'Docente no encontrado'
      });
    }

    if (docente.ID_rol !== 4) {
      return res.status(400).json({
        success: false,
        mensaje: 'Este usuario no es un docente'
      });
    }

    // Rechazar docente
    await Usuario.actualizar(parseInt(id_docente), {
      estado_aprobacion: 'Rechazado',
      estado: 'Inactivo'
    });

    const docenteActualizado = await Usuario.obtenerPorId(parseInt(id_docente));

    res.json({
      success: true,
      mensaje: 'Docente rechazado',
      data: docenteActualizado
    });
  } catch (error) {
    console.error('Error al rechazar docente:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al rechazar docente',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de aprobaciones
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Verificar que el usuario sea administrador (ID_rol = 6)
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden ver estadísticas'
      });
    }

    const { pool } = require('../config/database');
    
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN Estado_aprobacion = 'Pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN Estado_aprobacion = 'Aprobado' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN Estado_aprobacion = 'Rechazado' THEN 1 ELSE 0 END) as rechazados
      FROM Usuarios
      WHERE ID_rol = 4
    `;

    const [resultado] = await pool.execute(query);

    res.json({
      success: true,
      data: resultado[0]
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// No necesitamos module.exports adicional porque ya usamos exports.nombreFuncion arriba

