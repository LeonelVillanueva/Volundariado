const CategoriaEvento = require('../models/CategoriaEvento');

/**
 * Controller de Categorías de Eventos
 */

exports.obtenerTodos = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtros = {};
    if (estado) filtros.estado = estado;

    const categorias = await CategoriaEvento.obtenerTodos(filtros);

    res.json({
      success: true,
      cantidad: categorias.length,
      data: categorias
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener categorías',
      error: error.message
    });
  }
};

exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = await CategoriaEvento.obtenerPorId(id);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        mensaje: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: categoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener categoría',
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
        mensaje: 'El nombre de la categoría es requerido'
      });
    }

    const nuevaCategoria = await CategoriaEvento.crear({ nombre, estado });

    res.status(201).json({
      success: true,
      mensaje: 'Categoría creada exitosamente',
      data: nuevaCategoria
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear categoría',
      error: error.message
    });
  }
};

exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await CategoriaEvento.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Categoría actualizada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await CategoriaEvento.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar categoría',
      error: error.message
    });
  }
};

