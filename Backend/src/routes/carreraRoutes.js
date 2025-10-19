const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');
const { verificarAutenticacion } = require('../middleware/auth');

// Rutas públicas (requieren autenticación)
router.get('/', verificarAutenticacion, carreraController.obtenerTodas);
router.get('/buscar', verificarAutenticacion, carreraController.buscar);
router.get('/centro/:id_centro', verificarAutenticacion, carreraController.obtenerPorCentro);
router.get('/:id', verificarAutenticacion, carreraController.obtenerPorId);

// Rutas para docentes y administradores
router.post('/', verificarAutenticacion, carreraController.crear);
router.post('/asociar', verificarAutenticacion, carreraController.asociarACentro);
router.post('/desasociar', verificarAutenticacion, carreraController.desasociarDeCentro);

// Rutas para administradores
router.put('/:id', verificarAutenticacion, carreraController.actualizar);
router.delete('/:id', verificarAutenticacion, carreraController.eliminar);

module.exports = router;
