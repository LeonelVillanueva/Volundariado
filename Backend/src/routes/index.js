const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./authRoutes');
const usuarioRoutes = require('./usuarioRoutes');
const eventoRoutes = require('./eventoRoutes');
const participanteEventoRoutes = require('./participanteEventoRoutes');
const rolRoutes = require('./rolRoutes');
const categoriaEventoRoutes = require('./categoriaEventoRoutes');
const centroEducativoRoutes = require('./centroEducativoRoutes');
const carreraRoutes = require('./carreraRoutes');
const permisoRoutes = require('./permisoRoutes');
const fotoPerfilRoutes = require('./fotoPerfilRoutes');
const verificacionRoutes = require('./verificacionRoutes');
const privacidadRoutes = require('./privacidadRoutes');
const aprobacionRoutes = require('./aprobacionRoutes');

/**
 * Configuración central de todas las rutas de la API
 * Base: /api
 */

// Información de la API
router.get('/', (req, res) => {
  res.json({
    success: true,
    mensaje: 'API de Voluntariado',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      eventos: '/api/eventos',
      inscripciones: '/api/inscripciones',
      roles: '/api/roles',
      categorias: '/api/categorias',
      centros: '/api/centros',
      carreras: '/api/carreras',
      permisos: '/api/permisos',
      fotos_perfil: '/api/fotos-perfil',
      verificacion: '/api/verificacion',
      privacidad: '/api/privacidad'
    },
    documentacion: {
      postman: 'Importa la colección de Postman para ver todos los endpoints',
      swagger: 'En desarrollo'
    }
  });
});

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de usuarios
router.use('/usuarios', usuarioRoutes);

// Rutas de eventos
router.use('/eventos', eventoRoutes);

// Rutas de inscripciones/participantes
router.use('/inscripciones', participanteEventoRoutes);

// Rutas de roles
router.use('/roles', rolRoutes);

// Rutas de categorías de eventos
router.use('/categorias', categoriaEventoRoutes);

// Rutas de centros educativos
router.use('/centros', centroEducativoRoutes);

// Rutas de carreras
router.use('/carreras', carreraRoutes);

// Rutas de permisos
router.use('/permisos', permisoRoutes);

// Rutas de fotos de perfil (MongoDB)
router.use('/fotos-perfil', fotoPerfilRoutes);

// Rutas de verificación de estudiantes
router.use('/verificacion', verificacionRoutes);

// Rutas de configuración de privacidad
router.use('/privacidad', privacidadRoutes);

// Rutas de aprobación de docentes
router.use('/aprobaciones', aprobacionRoutes);

module.exports = router;

