const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { verificarAutenticacion, verificarRol } = require('../middleware/auth');

/**
 * Rutas de Eventos
 * Base: /api/eventos
 */

// Obtener todos los eventos (público)
router.get('/', eventoController.obtenerTodos);

// Obtener eventos próximos (público)
router.get('/proximos', eventoController.obtenerProximos);

// Obtener eventos con inscripciones abiertas (público)
router.get('/inscripciones-abiertas', eventoController.obtenerConInscripcionesAbiertas);

// Buscar eventos (público)
router.get('/buscar', eventoController.buscar);

// Obtener estadísticas (requiere autenticación y rol admin)
router.get('/estadisticas', verificarAutenticacion, verificarRol(6), eventoController.obtenerEstadisticas);

// Obtener eventos por organizador (requiere autenticación)
router.get('/organizador/:id_organizador', verificarAutenticacion, eventoController.obtenerPorOrganizador);

// Obtener evento por ID (público)
router.get('/:id', eventoController.obtenerPorId);

// Verificar disponibilidad de cupos (público)
router.get('/:id/disponibilidad', eventoController.verificarDisponibilidad);

// Crear evento (requiere autenticación)
router.post('/', verificarAutenticacion, eventoController.crear);

// Actualizar evento (requiere autenticación)
router.put('/:id', verificarAutenticacion, eventoController.actualizar);

// Eliminar evento (requiere autenticación y rol admin o ser el organizador)
router.delete('/:id', verificarAutenticacion, eventoController.eliminar);

// Cambiar estado de evento (requiere autenticación y rol admin)
router.patch('/:id/estado', verificarAutenticacion, verificarRol(6), eventoController.cambiarEstado);

module.exports = router;

