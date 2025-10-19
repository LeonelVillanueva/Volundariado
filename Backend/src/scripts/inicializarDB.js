/**
 * Script para inicializar la base de datos y crear las tablas necesarias
 * Ejecutar con: node src/scripts/inicializarDB.js
 */

require('dotenv').config();
const { verificarConexion } = require('../config/database');

// Importar todos los modelos
const Usuario = require('../models/Usuario');
const Evento = require('../models/Evento');
const CategoriaEvento = require('../models/CategoriaEvento');
const CentroEducativo = require('../models/CentroEducativo');
const Carrera = require('../models/Carrera');
const CentroCarrera = require('../models/CentroCarrera');
const Rol = require('../models/Rol');
const Permiso = require('../models/Permiso');
const RolPermiso = require('../models/RolPermiso');
const UsuarioPermiso = require('../models/UsuarioPermiso');
const ParticipanteEvento = require('../models/ParticipanteEvento');

async function inicializar() {
  console.log('🚀 Iniciando proceso de inicialización de base de datos...\n');

  try {
    // Verificar conexión
    console.log('📡 Verificando conexión a MySQL...');
    const conectado = await verificarConexion();
    
    if (!conectado) {
      console.error('❌ No se pudo conectar a MySQL. Verifica tu configuración en el archivo .env');
      process.exit(1);
    }

    console.log('\n📋 Creando base de datos y tablas...\n');

    // Tablas principales (sin dependencias)
    console.log('1️⃣  Creando tabla Usuarios...');
    await Usuario.inicializar();
    
    console.log('2️⃣  Creando tabla Categoria_Eventos...');
    await CategoriaEvento.inicializar();
    
    console.log('3️⃣  Creando tabla Centros_Educativos...');
    await CentroEducativo.inicializar();
    
    console.log('4️⃣  Creando tabla Carreras...');
    await Carrera.inicializar();
    
    console.log('5️⃣  Creando tabla Roles...');
    await Rol.inicializar();
    
    console.log('6️⃣  Creando tabla Permisos...');
    await Permiso.inicializar();
    
    // Tablas con dependencias
    console.log('7️⃣  Creando tabla Eventos...');
    await Evento.inicializar();
    
    console.log('8️⃣  Creando tabla Centros_Carreras...');
    await CentroCarrera.inicializar();
    
    console.log('9️⃣  Creando tabla Rol_permisos...');
    await RolPermiso.inicializar();
    
    console.log('🔟 Creando tabla Usuarios_permisos...');
    await UsuarioPermiso.inicializar();
    
    console.log('1️⃣1️⃣ Creando tabla Participantes_Eventos...');
    await ParticipanteEvento.inicializar();

    console.log('\n✅ ¡Inicialización completada exitosamente!');
    console.log('\n📊 Resumen de tablas creadas:');
    console.log('  ✓ Base de datos: db_voluntariado');
    console.log('  ✓ Usuarios');
    console.log('  ✓ Eventos');
    console.log('  ✓ Categoria_Eventos');
    console.log('  ✓ Centros_Educativos');
    console.log('  ✓ Carreras');
    console.log('  ✓ Centros_Carreras');
    console.log('  ✓ Roles');
    console.log('  ✓ Permisos');
    console.log('  ✓ Rol_permisos');
    console.log('  ✓ Usuarios_permisos');
    console.log('  ✓ Participantes_Eventos');
    console.log('\n💡 Todas las tablas tienen campos created_at y updated_at');
    console.log('💡 Puedes comenzar a usar la aplicación.');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la inicialización:', error.message);
    console.error('\n🔍 Detalles del error:', error);
    process.exit(1);
  }
}

// Ejecutar la inicialización
inicializar();

