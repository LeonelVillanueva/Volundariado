const express = require('express');
const router = express.Router();
const participanteEventoController = require('../controllers/participanteEventoController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Participantes de Eventos (Inscripciones)
 * Base: /api/inscripciones
 */

// Inscribirse a un evento (requiere autenticación)
router.post('/eventos/:id_evento/inscribir', verificarAutenticacion, participanteEventoController.inscribir);

// Obtener participantes de un evento (requiere autenticación)
router.get('/eventos/:id_evento/participantes', verificarAutenticacion, participanteEventoController.obtenerParticipantesPorEvento);

// Obtener mis inscripciones (requiere autenticación)
router.get('/mis-eventos', verificarAutenticacion, participanteEventoController.obtenerEventosPorUsuario);

// Cambiar estado de inscripción (requiere autenticación y rol admin)
router.patch('/:id/estado', verificarAutenticacion, verificarRol(6), participanteEventoController.cambiarEstadoInscripcion);

// Registrar asistencia (requiere autenticación y rol admin)
router.post('/:id/asistencia', verificarAutenticacion, verificarRol(6), participanteEventoController.registrarAsistencia);

// Cancelar inscripción (requiere autenticación)
router.delete('/:id', verificarAutenticacion, participanteEventoController.cancelarInscripcion);

module.exports = router;

