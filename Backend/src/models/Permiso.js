const { pool } = require('../config/database');

/**
 * Modelo de Permisos
 * Representa los permisos del sistema para control de acceso
 */
class Permiso {
  /**
   * Inicializar la tabla de Permisos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Permisos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del permiso',
          Nombre VARCHAR(100) NULL COMMENT 'Nombre del permiso',
          Seccion VARCHAR(100) NULL COMMENT 'Sección del sistema',
          Accion VARCHAR(50) NULL COMMENT 'Acción permitida',
          Estado VARCHAR(20) DEFAULT 'Activo' COMMENT 'Estado del permiso',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_seccion (Seccion),
          INDEX idx_accion (Accion),
          INDEX idx_estado (Estado)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Permisos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Permisos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { nombre, seccion = null, accion = null, estado = 'Activo' } = datos;
    const query = `
      INSERT INTO Permisos (Nombre, Seccion, Accion, Estado) 
      VALUES (?, ?, ?, ?)
    `;

    try {
      const [resultado] = await pool.execute(query, [nombre, seccion, accion, estado]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear permiso:', error);
      throw error;
    }
  }

  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Permisos WHERE 1=1';
    const valores = [];

    if (filtros.seccion) {
      query += ' AND Seccion = ?';
      valores.push(filtros.seccion);
    }

    if (filtros.accion) {
      query += ' AND Accion = ?';
      valores.push(filtros.accion);
    }

    if (filtros.estado) {
      query += ' AND Estado = ?';
      valores.push(filtros.estado);
    }

    query += ' ORDER BY Seccion, Nombre ASC';

    try {
      const [permisos] = await pool.execute(query, valores);
      return permisos;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Permisos WHERE ID = ?';
    try {
      const [permisos] = await pool.execute(query, [id]);
      return permisos.length > 0 ? permisos[0] : null;
    } catch (error) {
      console.error('Error al obtener permiso por ID:', error);
      throw error;
    }
  }

  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];

    const camposPermitidos = ['Nombre', 'Seccion', 'Accion', 'Estado'];
    
    for (const [key, value] of Object.entries(datos)) {
      const campo = key.charAt(0).toUpperCase() + key.slice(1).replace(/_([a-z])/g, (_, letra) => '_' + letra);
      if (camposPermitidos.includes(campo)) {
        campos.push(`${campo} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Permisos SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Permisos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      throw error;
    }
  }

  static async obtenerPorSeccion(seccion) {
    const query = 'SELECT * FROM Permisos WHERE Seccion = ? ORDER BY Nombre ASC';
    try {
      const [permisos] = await pool.execute(query, [seccion]);
      return permisos;
    } catch (error) {
      console.error('Error al obtener permisos por sección:', error);
      throw error;
    }
  }
}

module.exports = Permiso;

