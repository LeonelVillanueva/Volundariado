const Carrera = require('../models/Carrera');
const { pool } = require('../config/database');

/**
 * Controlador para gestión de Carreras
 */

// Obtener todas las carreras
exports.obtenerTodas = async (req, res) => {
  try {
    const carreras = await Carrera.obtenerTodos();
    
    res.json({
      success: true,
      data: carreras,
      total: carreras.length
    });
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carreras',
      error: error.message
    });
  }
};

// Obtener carreras por centro educativo
exports.obtenerPorCentro = async (req, res) => {
  try {
    const { id_centro } = req.params;
    
    const query = `
      SELECT c.ID, c.Nombre, c.created_at, c.updated_at
      FROM Carreras c
      INNER JOIN Centros_Carreras cc ON c.ID = cc.ID_carrera
      WHERE cc.ID_centro_educativo = ?
      ORDER BY c.Nombre ASC
    `;
    
    const [carreras] = await pool.execute(query, [parseInt(id_centro)]);
    
    res.json({
      success: true,
      data: carreras,
      total: carreras.length
    });
  } catch (error) {
    console.error('Error al obtener carreras por centro:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carreras del centro',
      error: error.message
    });
  }
};

// Obtener una carrera por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const carrera = await Carrera.obtenerPorId(parseInt(id));
    
    if (!carrera) {
      return res.status(404).json({
        success: false,
        mensaje: 'Carrera no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: carrera
    });
  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carrera',
      error: error.message
    });
  }
};

// Crear una nueva carrera (Solo Docentes y Administradores)
exports.crear = async (req, res) => {
  try {
    // Verificar que el usuario sea Docente o Administrador
    if (req.usuario.id_rol !== 4 && req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes y administradores pueden crear carreras'
      });
    }

    const { nombre } = req.body;

    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre de la carrera es requerido'
      });
    }

    const nuevaCarrera = await Carrera.crear({ nombre });

    res.status(201).json({
      success: true,
      mensaje: 'Carrera creada exitosamente',
      data: nuevaCarrera
    });
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear carrera',
      error: error.message
    });
  }
};

// Actualizar una carrera (Solo Administradores)
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    // Verificar que el usuario sea Administrador
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden actualizar carreras'
      });
    }

    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre de la carrera es requerido'
      });
    }

    const actualizado = await Carrera.actualizar(parseInt(id), { nombre });

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Carrera no encontrada'
      });
    }

    const carreraActualizada = await Carrera.obtenerPorId(parseInt(id));

    res.json({
      success: true,
      mensaje: 'Carrera actualizada exitosamente',
      data: carreraActualizada
    });
  } catch (error) {
    console.error('Error al actualizar carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar carrera',
      error: error.message
    });
  }
};

// Eliminar una carrera (Solo Administradores)
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario sea Administrador
    if (req.usuario.id_rol !== 6) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los administradores pueden eliminar carreras'
      });
    }

    const eliminado = await Carrera.eliminar(parseInt(id));

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Carrera no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Carrera eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar carrera',
      error: error.message
    });
  }
};

// Buscar carreras
exports.buscar = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({
        success: false,
        mensaje: 'El término de búsqueda es requerido'
      });
    }

    const carreras = await Carrera.buscar(termino);

    res.json({
      success: true,
      data: carreras,
      total: carreras.length
    });
  } catch (error) {
    console.error('Error al buscar carreras:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar carreras',
      error: error.message
    });
  }
};

// Asociar carrera a un centro educativo (Solo Docentes del centro)
exports.asociarACentro = async (req, res) => {
  try {
    const { id_carrera, id_centro } = req.body;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden asociar carreras a centros'
      });
    }

    // Verificar que el docente pertenezca al centro
    if (req.usuario.id_centro_educativo !== parseInt(id_centro)) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes asociar carreras a tu centro educativo'
      });
    }

    // Verificar si la asociación ya existe
    const queryVerificar = `
      SELECT * FROM Centros_Carreras 
      WHERE ID_centro_educativo = ? AND ID_carrera = ?
    `;
    const [existe] = await pool.execute(queryVerificar, [parseInt(id_centro), parseInt(id_carrera)]);

    if (existe.length > 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'Esta carrera ya está asociada al centro'
      });
    }

    // Crear la asociación
    const queryCrear = `
      INSERT INTO Centros_Carreras (ID_centro_educativo, ID_carrera)
      VALUES (?, ?)
    `;
    await pool.execute(queryCrear, [parseInt(id_centro), parseInt(id_carrera)]);

    res.status(201).json({
      success: true,
      mensaje: 'Carrera asociada al centro exitosamente'
    });
  } catch (error) {
    console.error('Error al asociar carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al asociar carrera al centro',
      error: error.message
    });
  }
};

// Desasociar carrera de un centro educativo (Solo Docentes del centro)
exports.desasociarDeCentro = async (req, res) => {
  try {
    const { id_carrera, id_centro } = req.body;

    // Verificar que el usuario sea Docente
    if (req.usuario.id_rol !== 4) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo los docentes pueden desasociar carreras'
      });
    }

    // Verificar que el docente pertenezca al centro
    if (req.usuario.id_centro_educativo !== parseInt(id_centro)) {
      return res.status(403).json({
        success: false,
        mensaje: 'Solo puedes desasociar carreras de tu centro educativo'
      });
    }

    const query = `
      DELETE FROM Centros_Carreras 
      WHERE ID_centro_educativo = ? AND ID_carrera = ?
    `;
    
    const [resultado] = await pool.execute(query, [parseInt(id_centro), parseInt(id_carrera)]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Asociación no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Carrera desasociada del centro exitosamente'
    });
  } catch (error) {
    console.error('Error al desasociar carrera:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error al desasociar carrera del centro',
      error: error.message
    });
  }
};
