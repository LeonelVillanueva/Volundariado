const Evento = require('../models/Evento');

/**
 * Controller de Eventos
 * Maneja todas las operaciones CRUD de eventos
 */

/**
 * Obtener todos los eventos
 */
exports.obtenerTodos = async (req, res) => {
  try {
    const {
      estado,
      id_organizador,
      id_categoria_evento,
      solo_estudiantes,
      ciudad,
      proximos,
      inscripciones_abiertas
    } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (id_organizador) filtros.id_organizador = parseInt(id_organizador);
    if (id_categoria_evento) filtros.id_categoria_evento = parseInt(id_categoria_evento);
    if (solo_estudiantes !== undefined) filtros.solo_estudiantes = solo_estudiantes === 'true';
    if (ciudad) filtros.ciudad = ciudad;
    if (proximos === 'true') filtros.proximos = true;
    if (inscripciones_abiertas === 'true') filtros.inscripciones_abiertas = true;

    const eventos = await Evento.obtenerTodos(filtros);

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener eventos',
      error: error.message
    });
  }
};

/**
 * Obtener evento por ID
 */
exports.obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Evento.obtenerPorId(id);

    if (!evento) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: evento
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener evento',
      error: error.message
    });
  }
};

/**
 * Crear nuevo evento
 */
exports.crear = async (req, res) => {
  try {
    const datos = req.body;

    // Validar campos requeridos
    if (!datos.nombre_evento || !datos.fecha_ini_evento || !datos.fecha_fin_evento) {
      return res.status(400).json({
        success: false,
        mensaje: 'Campos requeridos: nombre_evento, fecha_ini_evento, fecha_fin_evento'
      });
    }

    const nuevoEvento = await Evento.crear(datos);

    res.status(201).json({
      success: true,
      mensaje: 'Evento creado exitosamente',
      data: { id: nuevoEvento.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al crear evento',
      error: error.message
    });
  }
};

/**
 * Actualizar evento
 */
exports.actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;

    const actualizado = await Evento.actualizar(id, datos);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al actualizar evento',
      error: error.message
    });
  }
};

/**
 * Eliminar evento
 */
exports.eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await Evento.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      mensaje: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al eliminar evento',
      error: error.message
    });
  }
};

/**
 * Obtener eventos próximos
 */
exports.obtenerProximos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10;
    const eventos = await Evento.obtenerProximos(limite);

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener eventos próximos',
      error: error.message
    });
  }
};

/**
 * Obtener eventos con inscripciones abiertas
 */
exports.obtenerConInscripcionesAbiertas = async (req, res) => {
  try {
    const eventos = await Evento.obtenerConInscripcionesAbiertas();

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener eventos con inscripciones abiertas',
      error: error.message
    });
  }
};

/**
 * Buscar eventos
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

    const eventos = await Evento.buscar(termino);

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al buscar eventos',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de eventos
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Evento.obtenerEstadisticas();

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
 * Cambiar estado de evento
 */
exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        mensaje: 'El estado es requerido'
      });
    }

    const actualizado = await Evento.cambiarEstado(id, estado, notas);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
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

/**
 * Verificar disponibilidad de cupos
 */
exports.verificarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const disponibilidad = await Evento.verificarDisponibilidad(id);

    if (!disponibilidad) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: disponibilidad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al verificar disponibilidad',
      error: error.message
    });
  }
};

/**
 * Obtener eventos por organizador
 */
exports.obtenerPorOrganizador = async (req, res) => {
  try {
    const { id_organizador } = req.params;
    const eventos = await Evento.obtenerPorOrganizador(id_organizador);

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener eventos del organizador',
      error: error.message
    });
  }
};

