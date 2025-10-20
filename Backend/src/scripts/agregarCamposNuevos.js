/**
 * Script para agregar campos nuevos a la tabla Usuarios sin eliminar datos existentes
 */

require('dotenv').config();
const { pool } = require('../config/database');

async function agregarCampos() {
  try {
    console.log('🔧 Verificando y agregando campos nuevos a Usuarios...');

    // Verificar si existe el campo Estado_aprobacion
    const [columnas] = await pool.execute(`
      SHOW COLUMNS FROM Usuarios LIKE 'Estado_aprobacion'
    `);

    if (columnas.length === 0) {
      console.log('➕ Agregando campo Estado_aprobacion...');
      await pool.execute(`
        ALTER TABLE Usuarios 
        ADD COLUMN Estado_aprobacion VARCHAR(20) DEFAULT 'Aprobado' 
        COMMENT 'Estado de aprobación (Pendiente, Aprobado, Rechazado) - Solo para docentes'
        AFTER Estado
      `);
      console.log('✅ Campo Estado_aprobacion agregado');

      // Agregar índice
      await pool.execute(`
        ALTER TABLE Usuarios 
        ADD INDEX idx_estado_aprobacion (Estado_aprobacion)
      `);
      console.log('✅ Índice idx_estado_aprobacion agregado');
    } else {
      console.log('✅ Campo Estado_aprobacion ya existe');
    }

    // Verificar si existe el campo Configuracion_privacidad
    const [columnasPriv] = await pool.execute(`
      SHOW COLUMNS FROM Usuarios LIKE 'Configuracion_privacidad'
    `);

    if (columnasPriv.length === 0) {
      console.log('➕ Agregando campo Configuracion_privacidad...');
      await pool.execute(`
        ALTER TABLE Usuarios 
        ADD COLUMN Configuracion_privacidad JSON NULL 
        COMMENT 'Configuración de privacidad del usuario'
        AFTER ID_rol
      `);
      console.log('✅ Campo Configuracion_privacidad agregado');
    } else {
      console.log('✅ Campo Configuracion_privacidad ya existe');
    }

    console.log('\n✅ Todos los campos están actualizados\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al agregar campos:', error);
    process.exit(1);
  }
}

agregarCampos();

