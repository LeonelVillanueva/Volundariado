/**
 * Script para agregar Foreign Keys a todas las tablas
 * Ejecutar con: node src/scripts/agregarForeignKeys.js
 */

require('dotenv').config();
const { pool } = require('../config/database');

async function agregarForeignKeys() {
  console.log('🔗 Agregando Foreign Keys a las tablas...\n');

  try {
    await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

    // 1. FK en Usuarios
    console.log('1️⃣  Agregando FK en tabla Usuarios...');
    try {
      await pool.query(`
        ALTER TABLE Usuarios
        ADD CONSTRAINT fk_usuarios_rol 
          FOREIGN KEY (ID_rol) REFERENCES Roles(ID_rol)
          ON DELETE RESTRICT ON UPDATE CASCADE,
        ADD CONSTRAINT fk_usuarios_centro 
          FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
          ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT fk_usuarios_carrera 
          FOREIGN KEY (ID_carrera) REFERENCES Carreras(ID)
          ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Usuarios');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Usuarios');
      } else {
        throw error;
      }
    }

    // 2. FK en Eventos
    console.log('2️⃣  Agregando FK en tabla Eventos...');
    try {
      await pool.query(`
        ALTER TABLE Eventos
        ADD CONSTRAINT fk_eventos_organizador 
          FOREIGN KEY (ID_organizador) REFERENCES Usuarios(ID)
          ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT fk_eventos_categoria 
          FOREIGN KEY (ID_categoria_evento) REFERENCES Categoria_Eventos(ID)
          ON DELETE SET NULL ON UPDATE CASCADE,
        ADD CONSTRAINT fk_eventos_centro 
          FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
          ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Eventos');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Eventos');
      } else {
        throw error;
      }
    }

    // 3. FK en Centros_Carreras
    console.log('3️⃣  Agregando FK en tabla Centros_Carreras...');
    try {
      await pool.query(`
        ALTER TABLE Centros_Carreras
        ADD CONSTRAINT fk_centros_carreras_centro 
          FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
          ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT fk_centros_carreras_carrera 
          FOREIGN KEY (ID_carrera) REFERENCES Carreras(ID)
          ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Centros_Carreras');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Centros_Carreras');
      } else {
        throw error;
      }
    }

    // 4. FK en Rol_permisos
    console.log('4️⃣  Agregando FK en tabla Rol_permisos...');
    try {
      await pool.query(`
        ALTER TABLE Rol_permisos
        ADD CONSTRAINT fk_rol_permisos_rol 
          FOREIGN KEY (ID_Rol) REFERENCES Roles(ID_rol)
          ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT fk_rol_permisos_permiso 
          FOREIGN KEY (ID_Permiso) REFERENCES Permisos(ID)
          ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Rol_permisos');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Rol_permisos');
      } else {
        throw error;
      }
    }

    // 5. FK en Usuarios_permisos
    console.log('5️⃣  Agregando FK en tabla Usuarios_permisos...');
    try {
      await pool.query(`
        ALTER TABLE Usuarios_permisos
        ADD CONSTRAINT fk_usuarios_permisos_usuario 
          FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID)
          ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT fk_usuarios_permisos_permiso 
          FOREIGN KEY (ID_Permiso) REFERENCES Permisos(ID)
          ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Usuarios_permisos');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Usuarios_permisos');
      } else {
        throw error;
      }
    }

    // 6. FK en Participantes_Eventos
    console.log('6️⃣  Agregando FK en tabla Participantes_Eventos...');
    try {
      await pool.query(`
        ALTER TABLE Participantes_Eventos
        ADD CONSTRAINT fk_participantes_evento 
          FOREIGN KEY (ID_Evento) REFERENCES Eventos(ID)
          ON DELETE CASCADE ON UPDATE CASCADE,
        ADD CONSTRAINT fk_participantes_usuario 
          FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID)
          ON DELETE CASCADE ON UPDATE CASCADE
      `);
      console.log('   ✅ FK agregadas en Participantes_Eventos');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('   ⚠️  FK ya existen en Participantes_Eventos');
      } else {
        throw error;
      }
    }

    console.log('\n✅ ¡Foreign Keys agregadas exitosamente!');
    console.log('\n📊 Resumen de relaciones:');
    console.log('  ✓ Usuarios → Roles, Centros_Educativos, Carreras');
    console.log('  ✓ Eventos → Usuarios, Categoria_Eventos, Centros_Educativos');
    console.log('  ✓ Centros_Carreras → Centros_Educativos, Carreras');
    console.log('  ✓ Rol_permisos → Roles, Permisos');
    console.log('  ✓ Usuarios_permisos → Usuarios, Permisos');
    console.log('  ✓ Participantes_Eventos → Eventos, Usuarios');

    console.log('\n💡 Comportamiento de las FK:');
    console.log('  - ON DELETE CASCADE: Elimina registros relacionados');
    console.log('  - ON DELETE SET NULL: Establece NULL al eliminar');
    console.log('  - ON DELETE RESTRICT: Previene eliminación si hay relaciones');
    console.log('  - ON UPDATE CASCADE: Actualiza registros relacionados');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al agregar Foreign Keys:', error.message);
    console.error('\n🔍 Detalles:', error);
    process.exit(1);
  }
}

// Ejecutar
agregarForeignKeys();

