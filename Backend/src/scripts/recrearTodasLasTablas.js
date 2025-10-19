/**
 * Script para ELIMINAR y RECREAR todas las tablas con Foreign Keys
 * ⚠️ ADVERTENCIA: Esto eliminará TODOS los datos
 * Ejecutar con: node src/scripts/recrearTodasLasTablas.js
 */

require('dotenv').config();
const { pool } = require('../config/database');
const readline = require('readline');

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

function preguntarConfirmacion() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    ⚠️  ADVERTENCIA ⚠️                      ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log('║  Este script ELIMINARÁ todas las tablas y sus datos      ║');
    console.log('║  y las recreará con Foreign Keys incluidas.              ║');
    console.log('║                                                           ║');
    console.log('║  ❌ SE PERDERÁN TODOS LOS DATOS EXISTENTES ❌            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    rl.question('¿Estás seguro de continuar? (escribe "SI" para confirmar): ', (respuesta) => {
      rl.close();
      resolve(respuesta.toUpperCase() === 'SI');
    });
  });
}

async function recrearTablas() {
  console.log('\n🚀 Iniciando proceso de recreación de tablas...\n');

  try {
    // Confirmar con el usuario
    const confirmado = await preguntarConfirmacion();
    
    if (!confirmado) {
      console.log('\n❌ Operación cancelada por el usuario.');
      process.exit(0);
    }

    console.log('\n✅ Confirmación recibida. Procediendo...\n');

    await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

    // Deshabilitar foreign key checks temporalmente
    console.log('🔓 Deshabilitando verificación de Foreign Keys...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // Eliminar tablas en orden inverso de dependencias
    console.log('\n🗑️  Eliminando tablas existentes...\n');
    
    const tablas = [
      'Participantes_Eventos',
      'Usuarios_permisos',
      'Rol_permisos',
      'Centros_Carreras',
      'Eventos',
      'Permisos',
      'Roles',
      'Carreras',
      'Centros_Educativos',
      'Categoria_Eventos',
      'Usuarios'
    ];

    for (const tabla of tablas) {
      try {
        await pool.query(`DROP TABLE IF EXISTS ${tabla}`);
        console.log(`   ✓ Tabla ${tabla} eliminada`);
      } catch (error) {
        console.log(`   ⚠️  No se pudo eliminar ${tabla}: ${error.message}`);
      }
    }

    // Reactivar foreign key checks
    console.log('\n🔒 Reactivando verificación de Foreign Keys...');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Recrear tablas con Foreign Keys
    console.log('\n📋 Creando tablas con Foreign Keys incluidas...\n');

    // Tablas base (sin dependencias)
    console.log('1️⃣  Creando tabla Roles...');
    await Rol.inicializar();
    
    console.log('2️⃣  Creando tabla Categoria_Eventos...');
    await CategoriaEvento.inicializar();
    
    console.log('3️⃣  Creando tabla Centros_Educativos...');
    await CentroEducativo.inicializar();
    
    console.log('4️⃣  Creando tabla Carreras...');
    await Carrera.inicializar();
    
    console.log('5️⃣  Creando tabla Permisos...');
    await Permiso.inicializar();
    
    // Tablas con dependencias nivel 1
    console.log('6️⃣  Creando tabla Usuarios (con FK)...');
    await Usuario.inicializar();
    
    console.log('7️⃣  Creando tabla Centros_Carreras (con FK)...');
    await CentroCarrera.inicializar();
    
    console.log('8️⃣  Creando tabla Rol_permisos (con FK)...');
    await RolPermiso.inicializar();
    
    console.log('9️⃣  Creando tabla Usuarios_permisos (con FK)...');
    await UsuarioPermiso.inicializar();
    
    // Tablas con dependencias nivel 2
    console.log('🔟 Creando tabla Eventos (con FK)...');
    await Evento.inicializar();
    
    console.log('1️⃣1️⃣ Creando tabla Participantes_Eventos (con FK)...');
    await ParticipanteEvento.inicializar();

    console.log('\n✅ ¡Todas las tablas recreadas exitosamente!\n');
    console.log('📊 Resumen de tablas creadas con Foreign Keys:');
    console.log('  ✓ Roles');
    console.log('  ✓ Categoria_Eventos');
    console.log('  ✓ Centros_Educativos');
    console.log('  ✓ Carreras');
    console.log('  ✓ Permisos');
    console.log('  ✓ Usuarios (3 FK)');
    console.log('  ✓ Centros_Carreras (2 FK)');
    console.log('  ✓ Rol_permisos (2 FK)');
    console.log('  ✓ Usuarios_permisos (2 FK)');
    console.log('  ✓ Eventos (3 FK)');
    console.log('  ✓ Participantes_Eventos (2 FK)');
    console.log('\n💡 Total de Foreign Keys: 14');
    console.log('💡 Todas las tablas tienen created_at y updated_at');
    console.log('\n🎉 ¡Listo para usar!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la recreación:', error.message);
    console.error('\n🔍 Detalles del error:', error);
    process.exit(1);
  }
}

// Ejecutar
recrearTablas();

