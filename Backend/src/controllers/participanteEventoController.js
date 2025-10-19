const ParticipanteEvento = require('../models/ParticipanteEvento');
const Evento = require('../models/Evento');

/**
 * Controller de Participantes de Eventos
 * Maneja inscripciones y gestión de participantes
 */

/**
 * Inscribir usuario a un evento
 */
exports.inscribir = async (req, res) => {
  try {
    const { id_evento } = req.params;
    const { comentarios, apor_monetaria } = req.body;
    const id_usuario = req.usuario.id;

    // Verificar que el evento existe
    const evento = await Evento.obtenerPorId(id_evento);
    if (!evento) {
      return res.status(404).json({
        success: false,
        mensaje: 'Evento no encontrado'
      });
    }

    // Verificar disponibilidad de cupos
    const disponibilidad = await Evento.verificarDisponibilidad(id_evento);
    if (disponibilidad && disponibilidad.cupos_disponibles <= 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'No hay cupos disponibles para este evento'
      });
    }

    // Crear inscripción
    const inscripcion = await ParticipanteEvento.crear({
      id_evento: parseInt(id_evento),
      id_usuario,
      comentarios,
      apor_monetaria: apor_monetaria || 0.00
    });

    res.status(201).json({
      success: true,
      mensaje: 'Inscripción realizada exitosamente',
      data: inscripcion
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        mensaje: 'Ya estás inscrito en este evento'
      });
    }

    res.status(500).json({
      success: false,
      mensaje: 'Error al inscribir al evento',
      error: error.message
    });
  }
};

/**
 * Obtener participantes de un evento
 */
exports.obtenerParticipantesPorEvento = async (req, res) => {
  try {
    const { id_evento } = req.params;
    const { estado_inscripcion, asistencia } = req.query;

    const filtros = {};
    if (estado_inscripcion) filtros.estado_inscripcion = estado_inscripcion;
    if (asistencia !== undefined) filtros.asistencia = asistencia === 'true';

    const participantes = await ParticipanteEvento.obtenerParticipantesPorEvento(id_evento, filtros);

    res.json({
      success: true,
      cantidad: participantes.length,
      data: participantes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener participantes',
      error: error.message
    });
  }
};

/**
 * Obtener eventos de un usuario
 */
exports.obtenerEventosPorUsuario = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const { estado_inscripcion } = req.query;

    const filtros = {};
    if (estado_inscripcion) filtros.estado_inscripcion = estado_inscripcion;

    const eventos = await ParticipanteEvento.obtenerEventosPorUsuario(id_usuario, filtros);

    res.json({
      success: true,
      cantidad: eventos.length,
      data: eventos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al obtener eventos del usuario',
      error: error.message
    });
  }
};

/**
 * Cambiar estado de inscripción
 */
exports.cambiarEstadoInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        mensaje: 'El estado es requerido'
      });
    }

    const actualizado = await ParticipanteEvento.cambiarEstadoInscripcion(id, estado);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Inscripción no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Estado de inscripción actualizado'
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
 * Registrar asistencia
 */
exports.registrarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { asistio } = req.body;

    if (asistio === undefined) {
      return res.status(400).json({
        success: false,
        mensaje: 'El campo asistio es requerido (true/false)'
      });
    }

    const actualizado = await ParticipanteEvento.registrarAsistencia(id, asistio);

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Inscripción no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Asistencia registrada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar asistencia',
      error: error.message
    });
  }
};

/**
 * Cancelar inscripción
 */
exports.cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await ParticipanteEvento.eliminar(id);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        mensaje: 'Inscripción no encontrada'
      });
    }

    res.json({
      success: true,
      mensaje: 'Inscripción cancelada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al cancelar inscripción',
      error: error.message
    });
  }
};

