const Carrera = require('../models/Carrera');
const CentroCarrera = require('../models/CentroCarrera');

/**
 * Controller de Carreras
 */

exports.obtenerTodos = async (req, res) => {
  try {
    const carreras = await Carrera.obtenerTodos();

    res.json({
      success: true,
      cantidad: carreras.length,
      data: carreras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carreras',
      error: error.message
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.obtenerPorId(id);

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
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carrera',
      error: error.message
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre } = req.body;

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
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear carrera',
      error: error.message
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await Carrera.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Carrera no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Carrera actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar carrera',
      error: error.message
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Carrera.eliminar(id);

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
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar carrera',
      error: error.message
    });
  }
};

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
      cantidad: carreras.length,
      data: carreras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar carreras',
      error: error.message
    });
  }
};

/**
 * Obtener carreras de un centro educativo
 */
exports.obtenerPorCentro = async (req, res) => {
  try {
    const { id_centro } = req.params;
    const carreras = await CentroCarrera.obtenerCarrerasPorCentro(id_centro);

    res.json({
      success: true,
      cantidad: carreras.length,
      data: carreras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener carreras del centro',
      error: error.message
    });
  }
};

