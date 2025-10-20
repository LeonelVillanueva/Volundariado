const Usuario = require('../models/Usuario');
const { pool } = require('../config/database');

/**
 * Controlador para verificación de estudiantes por docentes
 */

// Verificar (aprobar) a un estudiante
exports.verificarEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.params;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden verificar estudiantes'
      });
    }

    // Obtener información del estudiante
    const estudiante = await Usuario.obtenerPorId(parseInt(id_estudiante));

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    // Verificar que el estudiante pertenezca al mismo centro que el docente
    if (estudiante.ID_centro_educativo !== req.usuario.id_centro_educativo) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes verificar estudiantes de tu centro educativo'
      });
    }

    // Verificar que el usuario sea estudiante
    if (!estudiante.Es_estudiante) {
      return res.status(400).json({
        success: false,
        mensaje: 'El usuario no está registrado como estudiante'
      });
    }

    // Verificar al estudiante
    await Usuario.actualizar(parseInt(id_estudiante), {
      Esta_verificado: 1
    });

    const estudianteActualizado = await Usuario.obtenerPorId(parseInt(id_estudiante));

    res.json({
      success: true,
      mensaje: 'Estudiante verificado exitosamente',
      data: estudianteActualizado
    });
  } catch (error) {
    console.error('Error al verificar estudiante:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al verificar estudiante',
      error: error.message
    });
  }
};

// Rechazar verificación de un estudiante (poner en 0)
exports.rechazarEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.params;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden rechazar estudiantes'
      });
    }

    // Obtener información del estudiante
    const estudiante = await Usuario.obtenerPorId(parseInt(id_estudiante));

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    // Verificar que el estudiante pertenezca al mismo centro que el docente
    if (estudiante.ID_centro_educativo !== req.usuario.id_centro_educativo) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes gestionar estudiantes de tu centro educativo'
      });
    }

    // Rechazar (poner verificación en 0)
    await Usuario.actualizar(parseInt(id_estudiante), {
      Esta_verificado: 0
    });

    const estudianteActualizado = await Usuario.obtenerPorId(parseInt(id_estudiante));

    res.json({
      success: true,
      mensaje: 'Verificación rechazada',
      data: estudianteActualizado
    });
  } catch (error) {
    console.error('Error al rechazar estudiante:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al rechazar estudiante',
      error: error.message
    });
  }
};

// Remover estudiante del centro educativo
exports.removerEstudiante = async (req, res) => {
  try {
    const { id_estudiante } = req.params;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden remover estudiantes'
      });
    }

    // Obtener información del estudiante
    const estudiante = await Usuario.obtenerPorId(parseInt(id_estudiante));

    if (!estudiante) {
      return res.status(404).json({
        success: false,
        mensaje: 'Estudiante no encontrado'
      });
    }

    // Verificar que el estudiante pertenezca al mismo centro que el docente
    if (estudiante.ID_centro_educativo !== req.usuario.id_centro_educativo) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes remover estudiantes de tu centro educativo'
      });
    }

    // IMPORTANTE: Verificar si el docente se está removiendo a sí mismo
    if (parseInt(id_estudiante) === req.usuario.id) {
      // Verificar si hay otros docentes en el mismo centro
      const { pool } = require('../config/database');
      const queryDocentes = `
        SELECT COUNT(*) as total_docentes
        FROM Usuarios
        WHERE ID_centro_educativo = ?
          AND ID_rol = 4
          AND ID != ?
          AND Estado = 'Activo'
      `;
      
      const [resultado] = await pool.execute(queryDocentes, [
        req.usuario.id_centro_educativo,
        req.usuario.id
      ]);
      
      const totalOtrosDocentes = resultado[0].total_docentes;
      
      // Si no hay otros docentes, no puede removerse
      if (totalOtrosDocentes === 0) {
        return res.status(403).json({
          success: false,
          mensaje: 'No puedes removerte del centro porque eres el único docente. Primero debe haber otro docente activo en el centro.'
        });
      }
      
      // Si hay otros docentes, permitir pero con advertencia en el mensaje
      console.log(`⚠️ Docente ${req.usuario.id} se está removiendo del centro. Hay ${totalOtrosDocentes} docente(s) más en el centro.`);
    }

    // Remover del centro (limpiar datos de centro y carrera)
    await Usuario.actualizar(parseInt(id_estudiante), {
      ID_centro_educativo: null,
      ID_carrera: null,
      Esta_verificado: 0
    });

    const estudianteActualizado = await Usuario.obtenerPorId(parseInt(id_estudiante));

    res.json({
      success: true,
      mensaje: 'Estudiante removido del centro educativo',
      data: estudianteActualizado
    });
  } catch (error) {
    console.error('Error al remover estudiante:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al remover estudiante',
      error: error.message
    });
  }
};

// Obtener estadísticas del centro (para el docente)
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden ver estadísticas'
      });
    }

    const centroId = req.usuario.id_centro_educativo;

    if (!centroId) {
      return res.status(400).json({
        success: false,
        mensaje: 'No tienes un centro educativo asociado'
      });
    }

    const query = `
      SELECT 
        COUNT(*) as total_estudiantes,
        SUM(CASE WHEN Esta_verificado = 1 THEN 1 ELSE 0 END) as verificados,
        SUM(CASE WHEN Esta_verificado = 0 THEN 1 ELSE 0 END) as pendientes
      FROM Usuarios
      WHERE ID_centro_educativo = ?
        AND Es_estudiante = 1
    `;

    const [estadisticas] = await pool.execute(query, [centroId]);

    res.json({
      success: true,
      data: estadisticas[0]
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

// Obtener solo estudiantes pendientes de verificación
exports.obtenerPendientes = async (req, res) => {
  try {
    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden ver estudiantes pendientes'
      });
    }

    const centroId = req.usuario.id_centro_educativo;

    if (!centroId) {
      return res.status(400).json({
        success: false,
        mensaje: 'No tienes un centro educativo asociado'
      });
    }

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
        u.ID_rol,
        c.Nombre as Carrera,
        u.created_at as Fecha_solicitud
      FROM Usuarios u
      LEFT JOIN Carreras c ON u.ID_carrera = c.ID
      WHERE u.ID_centro_educativo = ?
        AND u.Es_estudiante = 1
        AND u.Esta_verificado = 0
      ORDER BY u.created_at DESC
    `;

    const [pendientes] = await pool.execute(query, [centroId]);

    res.json({
      success: true,
      data: pendientes,
      total: pendientes.length
    });
  } catch (error) {
    console.error('Error al obtener pendientes:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener estudiantes pendientes',
      error: error.message
    });
  }
};

