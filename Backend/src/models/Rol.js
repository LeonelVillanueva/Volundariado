const { pool } = require('../config/database');

/**
 * Modelo de Roles
 * Representa los roles del sistema para control de acceso
 */
class Rol {
  /**
   * Inicializar la tabla de Roles
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Roles (
          ID_rol INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del rol',
          Nombre VARCHAR(50) NULL COMMENT 'Nombre del rol',
          Estado VARCHAR(20) DEFAULT 'Activo' COMMENT 'Estado del rol',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_nombre (Nombre),
          INDEX idx_estado (Estado)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Roles verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Roles:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { nombre, estado = 'Activo' } = datos;
    const query = `INSERT INTO Roles (Nombre, Estado) VALUES (?, ?)`;

    try {
      const [resultado] = await pool.execute(query, [nombre, estado]);
      return { id_rol: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear rol:', error);
      throw error;
    }
  }

  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Roles WHERE 1=1';
    const valores = [];

    if (filtros.estado) {
      query += ' AND Estado = ?';
      valores.push(filtros.estado);
    }

    query += ' ORDER BY Nombre ASC';

    try {
      const [roles] = await pool.execute(query, valores);
      return roles;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Roles WHERE ID_rol = ?';
    try {
      const [roles] = await pool.execute(query, [id]);
      return roles.length > 0 ? roles[0] : null;
    } catch (error) {
      console.error('Error al obtener rol por ID:', error);
      throw error;
    }
  }

  static async actualizar(id, datos) {
    const campos = [];
    const valores = [];

    if (datos.nombre !== undefined) {
      campos.push('Nombre = ?');
      valores.push(datos.nombre);
    }
    if (datos.estado !== undefined) {
      campos.push('Estado = ?');
      valores.push(datos.estado);
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Roles SET ${campos.join(', ')} WHERE ID_rol = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Roles WHERE ID_rol = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      throw error;
    }
  }

  static async cambiarEstado(id, nuevoEstado) {
    const query = 'UPDATE Roles SET Estado = ? WHERE ID_rol = ?';
    try {
      const [resultado] = await pool.execute(query, [nuevoEstado, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al cambiar estado del rol:', error);
      throw error;
    }
  }
}

module.exports = Rol;

