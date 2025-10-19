const CentroEducativo = require('../models/CentroEducativo');

/**
 * Controller de Centros Educativos
 */

exports.obtenerTodos = async (req, res) => {
  try {
    const { ciudad } = req.query;
    const filtros = {};
    if (ciudad) filtros.ciudad = ciudad;

    const centros = await CentroEducativo.obtenerTodos(filtros);

    res.json({
      success: true,
      cantidad: centros.length,
      data: centros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener centros educativos',
      error: error.message
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const centro = await CentroEducativo.obtenerPorId(id);

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
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener centro educativo',
      error: error.message
    });
  }
};

exports.crear = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, telefono, email } = req.body;

    if (!nombre) {
      return res.status(400).json({
        success: false,
        mensaje: 'El nombre del centro educativo es requerido'
      });
    }

    const nuevoCentro = await CentroEducativo.crear({
      nombre,
      direccion,
      ciudad,
      telefono,
      email
    });

    res.status(201).json({
      success: true,
      mensaje: 'Centro educativo creado exitosamente',
      data: nuevoCentro
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear centro educativo',
      error: error.message
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await CentroEducativo.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Centro educativo no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Centro educativo actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar centro educativo',
      error: error.message
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await CentroEducativo.eliminar(id);

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
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar centro educativo',
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

    const centros = await CentroEducativo.buscar(termino);

    res.json({
      success: true,
      cantidad: centros.length,
      data: centros
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar centros educativos',
      error: error.message
    });
  }
};

