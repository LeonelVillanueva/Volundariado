const { pool } = require('../config/database');

/**
 * Modelo de Categoria_Eventos
 * Representa las categorías de eventos de voluntariado
 */
class CategoriaEvento {
  /**
   * Inicializar la tabla de Categoria_Eventos
   */
  static async inicializar() {
    try {
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Categoria_Eventos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único de la categoría',
          Nombre VARCHAR(100) NULL COMMENT 'Nombre de la categoría',
          Estado VARCHAR(20) DEFAULT 'Activo' COMMENT 'Estado de la categoría',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de actualización',
          
          INDEX idx_estado (Estado),
          INDEX idx_nombre (Nombre)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Categoria_Eventos verificada/creada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Categoria_Eventos:', error);
      throw error;
    }
  }

  static async crear(datos) {
    const { nombre, estado = 'Activo' } = datos;
    const query = `INSERT INTO Categoria_Eventos (Nombre, Estado) VALUES (?, ?)`;

    try {
      const [resultado] = await pool.execute(query, [nombre, estado]);
      return { id: resultado.insertId, ...datos };
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }

  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Categoria_Eventos WHERE 1=1';
    const valores = [];

    if (filtros.estado) {
      query += ' AND Estado = ?';
      valores.push(filtros.estado);
    }

    query += ' ORDER BY Nombre ASC';

    try {
      const [categorias] = await pool.execute(query, valores);
      return categorias;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }

  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Categoria_Eventos WHERE ID = ?';
    try {
      const [categorias] = await pool.execute(query, [id]);
      return categorias.length > 0 ? categorias[0] : null;
    } catch (error) {
      console.error('Error al obtener categoría por ID:', error);
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
    const query = `UPDATE Categoria_Eventos SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    const query = 'DELETE FROM Categoria_Eventos WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      throw error;
    }
  }

  static async cambiarEstado(id, nuevoEstado) {
    const query = 'UPDATE Categoria_Eventos SET Estado = ? WHERE ID = ?';
    try {
      const [resultado] = await pool.execute(query, [nuevoEstado, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      throw error;
    }
  }
}

module.exports = CategoriaEvento;

