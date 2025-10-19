const { pool } = require('../config/database');

/**
 * Modelo de Usuarios_permisos
 * Tabla intermedia que asigna permisos específicos a usuarios
 */
class UsuarioPermiso {
  /**
   * Inicializar la tabla de Usuarios_permisos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Usuarios_permisos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único',
          ID_Usuario INT NULL COMMENT 'ID del usuario',
          ID_Permiso INT NULL COMMENT 'ID del permiso',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_usuario (ID_Usuario),
          INDEX idx_permiso (ID_Permiso),
          UNIQUE KEY unique_usuario_permiso (ID_Usuario, ID_Permiso),
          
          CONSTRAINT fk_usuarios_permisos_usuario 
            FOREIGN KEY (ID_Usuario) REFERENCES Usuarios(ID)
            ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_usuarios_permisos_permiso 
            FOREIGN KEY (ID_Permiso) REFERENCES Permisos(ID)
            ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Usuarios_permisos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Usuarios_permisos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { id_usuario, id_permiso } = datos;
    const query = `INSERT INTO Usuarios_permisos (ID_Usuario, ID_Permiso) VALUES (?, ?)`;

    try {
      const [resultado] = await pool.execute(query, [id_usuario, id_permiso]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear relación usuario-permiso:', error);
      throw error;
    }
  }

  static async obtenerPermisosPorUsuario(id_usuario) {
    const query = `
      SELECT p.* 
      FROM Permisos p
      INNER JOIN Usuarios_permisos up ON p.ID = up.ID_Permiso
      WHERE up.ID_Usuario = ?
      ORDER BY p.Seccion, p.Nombre ASC
    `;

    try {
      const [permisos] = await pool.execute(query, [id_usuario]);
      return permisos;
    } catch (error) {
      console.error('Error al obtener permisos por usuario:', error);
      throw error;
    }
  }

  static async obtenerPermisosCompletosUsuario(id_usuario) {
    // Obtiene los permisos del rol del usuario más los permisos específicos del usuario
    const query = `
      SELECT DISTINCT p.*
      FROM Permisos p
      LEFT JOIN Rol_permisos rp ON p.ID = rp.ID_Permiso
      LEFT JOIN Usuarios u ON u.ID_rol = rp.ID_Rol
      LEFT JOIN Usuarios_permisos up ON p.ID = up.ID_Permiso
      WHERE (u.ID = ? OR up.ID_Usuario = ?) AND p.Estado = 'Activo'
      ORDER BY p.Seccion, p.Nombre ASC
    `;

    try {
      const [permisos] = await pool.execute(query, [id_usuario, id_usuario]);
      return permisos;
    } catch (error) {
      console.error('Error al obtener permisos completos del usuario:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Usuarios_permisos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación:', error);
      throw error;
    }
  }

  static async eliminarPorUsuarioYPermiso(id_usuario, id_permiso) {
    const query = 'DELETE FROM Usuarios_permisos WHERE ID_Usuario = ? AND ID_Permiso = ?';
    try {
      const [resultado] = await pool.execute(query, [id_usuario, id_permiso]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar relación específica:', error);
      throw error;
    }
  }

  static async asignarPermisosAUsuario(id_usuario, ids_permisos) {
    const valores = ids_permisos.map(id_permiso => [id_usuario, id_permiso]);
    const query = 'INSERT IGNORE INTO Usuarios_permisos (ID_Usuario, ID_Permiso) VALUES ?';

    try {
      const [resultado] = await pool.query(query, [valores]);
      return resultado.affectedRows;
    } catch (error) {
      console.error('Error al asignar permisos al usuario:', error);
      throw error;
    }
  }
}

module.exports = UsuarioPermiso;

