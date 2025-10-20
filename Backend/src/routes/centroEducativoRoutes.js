const express = require('express');
const router = express.Router();
const centroEducativoController = require('../controllers/centroEducativoController');
const { verificarAutenticacion } = require('../middleware/auth');

// Ruta pública (sin autenticación, para registro de docentes)
router.get('/publico', centroEducativoController.obtenerTodos);

// Rutas que requieren autenticación
router.get('/', verificarAutenticacion, centroEducativoController.obtenerTodos);
router.get('/buscar', verificarAutenticacion, centroEducativoController.buscar);
router.get('/:id', verificarAutenticacion, centroEducativoController.obtenerPorId);

// Rutas para docentes
router.post('/', verificarAutenticacion, centroEducativoController.crear);
router.put('/:id', verificarAutenticacion, centroEducativoController.actualizar);
router.get('/:id/estudiantes', verificarAutenticacion, centroEducativoController.obtenerEstudiantes);

// Rutas para administradores
router.delete('/:id', verificarAutenticacion, centroEducativoController.eliminar);

module.exports = router;
