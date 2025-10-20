const express = require('express');
const router = express.Router();
const aprobacionController = require('../controllers/aprobacionController');
const { verificarAutenticacion } = require('../middleware/auth');

/**
 * Rutas de Aprobación de Docentes
 * Base: /api/aprobaciones
 * Todas requieren autenticación de administrador
 */

// Obtener docentes pendientes de aprobación
router.get('/docentes/pendientes', verificarAutenticacion, aprobacionController.obtenerDocentesPendientes);

// Obtener estadísticas de aprobaciones
router.get('/estadisticas', verificarAutenticacion, aprobacionController.obtenerEstadisticas);

// Aprobar un docente
router.put('/docentes/:id_docente/aprobar', verificarAutenticacion, aprobacionController.aprobarDocente);

// Rechazar un docente
router.put('/docentes/:id_docente/rechazar', verificarAutenticacion, aprobacionController.rechazarDocente);

module.exports = router;

