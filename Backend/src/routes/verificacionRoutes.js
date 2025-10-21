const express = require('express');
const router = express.Router();
const verificacionController = require('../controllers/verificacionController');
const { verificarAutenticacion } = require('../middleware/auth');

// Todas las rutas requieren autenticación y que el usuario sea Docente

// Obtener estadísticas del centro
router.get('/estadisticas', verificarAutenticacion, verificacionController.obtenerEstadisticas);

// Obtener estudiantes pendientes de verificación
router.get('/pendientes', verificarAutenticacion, verificacionController.obtenerPendientes);

// Verificar (aprobar) estudiante
router.post('/verificar/:id_estudiante', verificarAutenticacion, verificacionController.verificarEstudiante);

// Rechazar verificación de estudiante
router.post('/rechazar/:id_estudiante', verificarAutenticacion, verificacionController.rechazarEstudiante);

// Remover estudiante del centro
router.delete('/remover/:id_estudiante', verificarAutenticacion, verificacionController.removerEstudiante);

// Obtener estado de verificación de un estudiante específico
router.get('/estado/:id_estudiante', verificarAutenticacion, verificacionController.obtenerEstadoVerificacion);

module.exports = router;

