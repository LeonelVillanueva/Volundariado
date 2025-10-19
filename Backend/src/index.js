/**
 * Servidor principal del Backend
 * Sistema de Voluntariado
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar configuración y modelos
const { verificarConexion } = require('./config/database');
const mongoConnection = require('./config/mongodb');
const Usuario = require('./models/Usuario');
const Evento = require('./models/Evento');
const CategoriaEvento = require('./models/CategoriaEvento');
const CentroEducativo = require('./models/CentroEducativo');
const Carrera = require('./models/Carrera');
const CentroCarrera = require('./models/CentroCarrera');
const Rol = require('./models/Rol');
const Permiso = require('./models/Permiso');
const RolPermiso = require('./models/RolPermiso');
const UsuarioPermiso = require('./models/UsuarioPermiso');
const ParticipanteEvento = require('./models/ParticipanteEvento');

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet()); // Seguridad

// CORS - Configuración permisiva para desarrollo
app.use(cors({
  origin: '*', // Permitir todas las origins en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev')); // Logger
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Importar rutas centralizadas
const apiRoutes = require('./routes');

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Voluntariado - Backend funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      eventos: '/api/eventos',
      inscripciones: '/api/inscripciones',
      roles: '/api/roles',
      categorias: '/api/categorias',
      centros: '/api/centros',
      carreras: '/api/carreras',
      permisos: '/api/permisos'
    },
    documentacion: 'Ver docs/ para más información'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Connected'
  });
});

// Usar todas las rutas de la API
app.use('/api', apiRoutes);

// Importar middleware de errores
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Manejo de rutas no encontradas
app.use(notFound);

// Manejo de errores global
app.use(errorHandler);

// Función para iniciar el servidor
async function iniciarServidor() {
  try {
    console.log('🚀 Iniciando servidor...\n');

    // Verificar conexión a MySQL
    console.log('📡 Verificando conexión a MySQL...');
    const conectado = await verificarConexion();

    if (!conectado) {
      console.error('❌ No se pudo conectar a MySQL');
      console.error('💡 Verifica tu archivo .env con las credenciales correctas');
      console.error('💡 Asegúrate de que MySQL esté ejecutándose');
      process.exit(1);
    }

    // Conectar a MongoDB Atlas (para fotos de perfil)
    console.log('\n📡 Conectando a MongoDB Atlas...');
    try {
      await mongoConnection.conectar();
    } catch (error) {
      console.warn('⚠️  MongoDB no conectado. Las fotos de perfil no estarán disponibles');
      console.warn('💡 Verifica las credenciales de MongoDB en el archivo .env');
    }

    // Inicializar modelos (crear tablas si no existen)
    console.log('📋 Inicializando modelos y tablas...');
    await Usuario.inicializar();
    await CategoriaEvento.inicializar();
    await CentroEducativo.inicializar();
    await Carrera.inicializar();
    await Rol.inicializar();
    await Permiso.inicializar();
    await Evento.inicializar();
    await CentroCarrera.inicializar();
    await RolPermiso.inicializar();
    await UsuarioPermiso.inicializar();
    await ParticipanteEvento.inicializar();
    console.log('✅ Todos los modelos inicializados correctamente\n');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('╔════════════════════════════════════════════╗');
      console.log(`║  ✅ Servidor corriendo en puerto ${PORT}     ║`);
      console.log('╠════════════════════════════════════════════╣');
      console.log(`║  🌐 URL: http://localhost:${PORT}           ║`);
      console.log(`║  📊 Health: http://localhost:${PORT}/health ║`);
      console.log(`║  🔗 API: http://localhost:${PORT}/api       ║`);
      console.log('╚════════════════════════════════════════════╝\n');
      console.log('📝 El servidor está listo para recibir peticiones');
      console.log('⏹️  Presiona CTRL+C para detener el servidor\n');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Deteniendo servidor...');
  console.log('👋 Servidor detenido correctamente');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n⏹️  Deteniendo servidor...');
  console.log('👋 Servidor detenido correctamente');
  process.exit(0);
});

// Iniciar el servidor
iniciarServidor();

