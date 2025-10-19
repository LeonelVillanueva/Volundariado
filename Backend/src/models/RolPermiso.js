const { pool } = require('../config/database');

/**
 * Modelo de Rol_permisos
 * Tabla intermedia que relaciona roles con permisos
 */
class RolPermiso {
  /**
   * Inicializar la tabla de Rol_permisos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Rol_permisos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único',
          ID_Rol INT NULL COMMENT 'ID del rol',
          ID_Permiso INT NULL COMMENT 'ID del permiso',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_rol (ID_Rol),
          INDEX idx_permiso (ID_Permiso),
          UNIQUE KEY unique_rol_permiso (ID_Rol, ID_Permiso),
          
          CONSTRAINT fk_rol_permisos_rol 
            FOREIGN KEY (ID_Rol) REFERENCES Roles(ID_rol)
            ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_rol_permisos_permiso 
            FOREIGN KEY (ID_Permiso) REFERENCES Permisos(ID)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Rol_permisos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Rol_permisos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { id_rol, id_permiso } = datos;
    const query = `INSERT INTO Rol_permisos (ID_Rol, ID_Permiso) VALUES (?, ?)`;

    try {
      const [resultado] = await pool.execute(query, [id_rol, id_permiso]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear relación rol-permiso:', error);
      throw error;
    }
  }

  static async obtenerPermisosPorRol(id_rol) {
    const query = `
      SELECT p.* 
      FROM Permisos p
      INNER JOIN Rol_permisos rp ON p.ID = rp.ID_Permiso
      WHERE rp.ID_Rol = ?
      ORDER BY p.Seccion, p.Nombre ASC
    `;

    try {
      const [permisos] = await pool.execute(query, [id_rol]);
      return permisos;
    } catch (error) {
      console.error('Error al obtener permisos por rol:', error);
      throw error;
    }
  }

  static async obtenerRolesPorPermiso(id_permiso) {
    const query = `
      SELECT r.* 
      FROM Roles r
      INNER JOIN Rol_permisos rp ON r.ID_rol = rp.ID_Rol
      WHERE rp.ID_Permiso = ?
      ORDER BY r.Nombre ASC
    `;

    try {
      const [roles] = await pool.execute(query, [id_permiso]);
      return roles;
    } catch (error) {
      console.error('Error al obtener roles por permiso:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Rol_permisos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación:', error);
      throw error;
    }
  }

  static async eliminarPorRolYPermiso(id_rol, id_permiso) {
    const query = 'DELETE FROM Rol_permisos WHERE ID_Rol = ? AND ID_Permiso = ?';
    try {
      const [resultado] = await pool.execute(query, [id_rol, id_permiso]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación específica:', error);
      throw error;
    }
  }

  static async asignarPermisosARol(id_rol, ids_permisos) {
    const valores = ids_permisos.map(id_permiso => [id_rol, id_permiso]);
    const query = 'INSERT IGNORE INTO Rol_permisos (ID_Rol, ID_Permiso) VALUES ?';

    try {
      const [resultado] = await pool.query(query, [valores]);
      return resultado.affectedRows;
    } catch (error) {
      console.error('Error al asignar permisos al rol:', error);
      throw error;
    }
  }
}

module.exports = RolPermiso;

