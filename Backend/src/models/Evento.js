const { pool } = require('../config/database');

/**
 * Modelo de Evento
 * Representa a los eventos de voluntariado del sistema
 */
class Evento {
  /**
   * Inicializar la tabla de Eventos si no existe
   * @returns {Promise<boolean>} true si se inicializó correctamente
   */
  static async inicializar() {
    try {
      // Usar la base de datos
      await pool.query(`USE ${process.env.DB_NAME || 'db_voluntariado'}`);

      // Crear la tabla Eventos si no existe
      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Eventos (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del evento',
          Nombre_evento VARCHAR(150) NULL COMMENT 'Nombre del evento',
          Descrip_evento TEXT NULL COMMENT 'Descripción detallada del evento',
          ID_organizador INT NULL COMMENT 'ID del usuario organizador',
          Fecha_ini_evento DATETIME NULL COMMENT 'Fecha y hora de inicio del evento',
          Fecha_fin_evento DATETIME NULL COMMENT 'Fecha y hora de finalización del evento',
          Ubicacion_link VARCHAR(255) NULL COMMENT 'Link de ubicación (Google Maps, etc.)',
          Latitud DECIMAL(10,6) NULL COMMENT 'Coordenada de latitud',
          Longitud DECIMAL(10,6) NULL COMMENT 'Coordenada de longitud',
          Cap_max INT DEFAULT 0 COMMENT 'Capacidad máxima de participantes',
          Cap_min INT DEFAULT 0 COMMENT 'Capacidad mínima de participantes',
          ID_categoria_evento INT NULL COMMENT 'ID de la categoría del evento',
          Estado VARCHAR(20) DEFAULT 'Pendiente' COMMENT 'Estado del evento (Pendiente, Aprobado, En Curso, Finalizado, Cancelado)',
          Notas_extra_estado TEXT NULL COMMENT 'Notas adicionales sobre el estado',
          Enlaces_referencia TEXT NULL COMMENT 'Enlaces de referencia relacionados al evento',
          Solo_estudiantes BOOLEAN DEFAULT FALSE COMMENT 'Indica si el evento es solo para estudiantes',
          ID_centro_educativo INT NULL COMMENT 'ID del centro educativo (si aplica)',
          Fecha_ini_inscripciones DATETIME NULL COMMENT 'Fecha de inicio de inscripciones',
          Fecha_fin_inscripciones DATETIME NULL COMMENT 'Fecha de fin de inscripciones',
          Aport_monetaria DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Aporte monetario requerido',
          Direccion_completa VARCHAR(255) NULL COMMENT 'Dirección física completa',
          Ciudad VARCHAR(100) NULL COMMENT 'Ciudad donde se realiza el evento',
          Beneficiario VARCHAR(150) NULL COMMENT 'Beneficiario del evento',
          Org_colaborativa VARCHAR(255) DEFAULT NULL COMMENT 'Nombre de la organización colaborativa',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
          
          INDEX idx_organizador (ID_organizador),
          INDEX idx_categoria (ID_categoria_evento),
          INDEX idx_estado (Estado),
          INDEX idx_fecha_inicio (Fecha_ini_evento),
          INDEX idx_fecha_fin (Fecha_fin_evento),
          INDEX idx_fecha_inscripciones (Fecha_ini_inscripciones, Fecha_fin_inscripciones),
          INDEX idx_solo_estudiantes (Solo_estudiantes),
          INDEX idx_centro_educativo (ID_centro_educativo),
          INDEX idx_ciudad (Ciudad),
          
          CONSTRAINT fk_eventos_organizador 
            FOREIGN KEY (ID_organizador) REFERENCES Usuarios(ID)
            ON DELETE SET NULL ON UPDATE CASCADE,
          CONSTRAINT fk_eventos_categoria 
            FOREIGN KEY (ID_categoria_evento) REFERENCES Categoria_Eventos(ID)
            ON DELETE SET NULL ON UPDATE CASCADE,
          CONSTRAINT fk_eventos_centro 
            FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
            ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Eventos verificada/creada correctamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar tabla Eventos:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo evento
   * @param {Object} datos - Datos del evento
   * @returns {Promise<Object>} Evento creado con su ID
   */
  static async crear(datos) {
    const {
      nombre_evento,
      descrip_evento = null,
      id_organizador,
      fecha_ini_evento,
      fecha_fin_evento,
      ubicacion_link = null,
      latitud = null,
      longitud = null,
      cap_max = 0,
      cap_min = 0,
      id_categoria_evento = null,
      estado = 'Pendiente',
      notas_extra_estado = null,
      enlaces_referencia = null,
      solo_estudiantes = false,
      id_centro_educativo = null,
      fecha_ini_inscripciones = null,
      fecha_fin_inscripciones = null,
      aport_monetaria = 0.00,
      direccion_completa = null,
      ciudad = null,
      beneficiario = null,
      org_colaborativa = null
    } = datos;

    const query = `
      INSERT INTO Eventos (
        Nombre_evento, Descrip_evento, ID_organizador, Fecha_ini_evento, Fecha_fin_evento,
        Ubicacion_link, Latitud, Longitud, Cap_max, Cap_min,
        ID_categoria_evento, Estado, Notas_extra_estado, Enlaces_referencia, Solo_estudiantes,
        ID_centro_educativo, Fecha_ini_inscripciones, Fecha_fin_inscripciones, Aport_monetaria,
        Direccion_completa, Ciudad, Beneficiario, Org_colaborativa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      nombre_evento, descrip_evento, id_organizador, fecha_ini_evento, fecha_fin_evento,
      ubicacion_link, latitud, longitud, cap_max, cap_min,
      id_categoria_evento, estado, notas_extra_estado, enlaces_referencia, solo_estudiantes,
      id_centro_educativo, fecha_ini_inscripciones, fecha_fin_inscripciones, aport_monetaria,
      direccion_completa, ciudad, beneficiario, org_colaborativa
    ];

    try {
      const [resultado] = await pool.execute(query, valores);
      return {
        id: resultado.insertId,
        ...datos
      };
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los eventos
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} Lista de eventos
   */
  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Eventos WHERE 1=1';
    const valores = [];

    if (filtros.estado) {
      query += ' AND Estado = ?';
      valores.push(filtros.estado);
    }

    if (filtros.id_organizador) {
      query += ' AND ID_organizador = ?';
      valores.push(filtros.id_organizador);
    }

    if (filtros.id_categoria_evento) {
      query += ' AND ID_categoria_evento = ?';
      valores.push(filtros.id_categoria_evento);
    }

    if (filtros.solo_estudiantes !== undefined) {
      query += ' AND Solo_estudiantes = ?';
      valores.push(filtros.solo_estudiantes);
    }

    if (filtros.ciudad) {
      query += ' AND Ciudad = ?';
      valores.push(filtros.ciudad);
    }

    // Filtro por fechas futuras
    if (filtros.proximos) {
      query += ' AND Fecha_ini_evento > NOW()';
    }

    // Filtro por eventos activos (inscripciones abiertas)
    if (filtros.inscripciones_abiertas) {
      query += ' AND Fecha_ini_inscripciones <= NOW() AND Fecha_fin_inscripciones >= NOW()';
    }

    query += ' ORDER BY Fecha_ini_evento DESC';

    try {
      const [eventos] = await pool.execute(query, valores);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  }

  /**
   * Obtener un evento por ID
   * @param {number} id - ID del evento
   * @returns {Promise<Object|null>} Evento encontrado o null
   */
  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Eventos WHERE ID = ?';
    
    try {
      const [eventos] = await pool.execute(query, [id]);
      return eventos.length > 0 ? eventos[0] : null;
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos por organizador
   * @param {number} id_organizador - ID del organizador
   * @returns {Promise<Array>} Lista de eventos del organizador
   */
  static async obtenerPorOrganizador(id_organizador) {
    const query = 'SELECT * FROM Eventos WHERE ID_organizador = ? ORDER BY Fecha_ini_evento DESC';
    
    try {
      const [eventos] = await pool.execute(query, [id_organizador]);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos por organizador:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos próximos
   * @param {number} limite - Cantidad de eventos a retornar
   * @returns {Promise<Array>} Lista de eventos próximos
   */
  static async obtenerProximos(limite = 10) {
    const query = `
      SELECT * FROM Eventos 
      WHERE Fecha_ini_evento > NOW() 
        AND Estado IN ('Pendiente', 'Aprobado')
      ORDER BY Fecha_ini_evento ASC 
      LIMIT ?
    `;
    
    try {
      const [eventos] = await pool.execute(query, [limite]);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos con inscripciones abiertas
   * @returns {Promise<Array>} Lista de eventos con inscripciones abiertas
   */
  static async obtenerConInscripcionesAbiertas() {
    const query = `
      SELECT * FROM Eventos 
      WHERE Fecha_ini_inscripciones <= NOW() 
        AND Fecha_fin_inscripciones >= NOW()
        AND Estado = 'Aprobado'
      ORDER BY Fecha_ini_evento ASC
    `;
    
    try {
      const [eventos] = await pool.execute(query);
      return eventos;
    } catch (error) {
      console.error('Error al obtener eventos con inscripciones abiertas:', error);
      throw error;
    }
  }

  /**
   * Actualizar un evento
   * @param {number} id - ID del evento
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async actualizar(id, datos) {
    const camposPermitidos = [
      'Nombre_evento', 'Descrip_evento', 'ID_organizador', 'Fecha_ini_evento', 'Fecha_fin_evento',
      'Ubicacion_link', 'Latitud', 'Longitud', 'Cap_max', 'Cap_min',
      'ID_categoria_evento', 'Estado', 'Notas_extra_estado', 'Enlaces_referencia', 'Solo_estudiantes',
      'ID_centro_educativo', 'Fecha_ini_inscripciones', 'Fecha_fin_inscripciones', 'Aport_monetaria',
      'Direccion_completa', 'Ciudad', 'Beneficiario', 'Org_colaborativa'
    ];

    const campos = [];
    const valores = [];

    // Construir la consulta dinámicamente
    for (const [key, value] of Object.entries(datos)) {
      // Convertir snake_case a PascalCase con guiones bajos
      const campo = key.split('_')
        .map((word, index) => index === 0 
          ? word.charAt(0).toUpperCase() + word.slice(1) 
          : word.charAt(0).toUpperCase() + word.slice(1))
        .join('_');
      
      if (camposPermitidos.includes(campo)) {
        campos.push(`${campo} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Eventos SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  }

  /**
   * Cambiar el estado de un evento
   * @param {number} id - ID del evento
   * @param {string} nuevoEstado - Nuevo estado
   * @param {string} notas - Notas sobre el cambio de estado
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async cambiarEstado(id, nuevoEstado, notas = null) {
    const query = `
      UPDATE Eventos 
      SET Estado = ?, Notas_extra_estado = ?
      WHERE ID = ?
    `;

    try {
      const [resultado] = await pool.execute(query, [nuevoEstado, notas, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al cambiar estado del evento:', error);
      throw error;
    }
  }

  /**
   * Eliminar un evento
   * @param {number} id - ID del evento
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async eliminar(id) {
    const query = 'DELETE FROM Eventos WHERE ID = ?';

    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  }

  /**
   * Buscar eventos por nombre, descripción o ciudad
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<Array>} Lista de eventos encontrados
   */
  static async buscar(termino) {
    const query = `
      SELECT * FROM Eventos 
      WHERE Nombre_evento LIKE ? 
         OR Descrip_evento LIKE ?
         OR Ciudad LIKE ?
         OR Beneficiario LIKE ?
      ORDER BY Fecha_ini_evento DESC
    `;
    
    const terminoBusqueda = `%${termino}%`;

    try {
      const [eventos] = await pool.execute(query, [
        terminoBusqueda,
        terminoBusqueda,
        terminoBusqueda,
        terminoBusqueda
      ]);
      return eventos;
    } catch (error) {
      console.error('Error al buscar eventos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de eventos
   * @returns {Promise<Object>} Estadísticas generales
   */
  static async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN Estado = 'Pendiente' THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN Estado = 'Aprobado' THEN 1 ELSE 0 END) as aprobados,
        SUM(CASE WHEN Estado = 'En Curso' THEN 1 ELSE 0 END) as en_curso,
        SUM(CASE WHEN Estado = 'Finalizado' THEN 1 ELSE 0 END) as finalizados,
        SUM(CASE WHEN Estado = 'Cancelado' THEN 1 ELSE 0 END) as cancelados,
        SUM(CASE WHEN Fecha_ini_evento > NOW() THEN 1 ELSE 0 END) as proximos,
        SUM(CASE WHEN Solo_estudiantes = TRUE THEN 1 ELSE 0 END) as solo_estudiantes,
        AVG(Cap_max) as promedio_capacidad,
        SUM(Cap_max) as capacidad_total
      FROM Eventos
    `;

    try {
      const [resultado] = await pool.execute(query);
      return resultado[0];
    } catch (error) {
      console.error('Error al obtener estadísticas de eventos:', error);
      throw error;
    }
  }

  /**
   * Verificar disponibilidad de cupos
   * @param {number} id - ID del evento
   * @returns {Promise<Object>} Información de disponibilidad
   */
  static async verificarDisponibilidad(id) {
    const query = `
      SELECT 
        e.Cap_max,
        e.Cap_min,
        COUNT(i.ID) as inscritos,
        (e.Cap_max - COUNT(i.ID)) as cupos_disponibles
      FROM Eventos e
      LEFT JOIN Inscripciones i ON e.ID = i.ID_evento AND i.Estado != 'Cancelado'
      WHERE e.ID = ?
      GROUP BY e.ID
    `;

    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.length > 0 ? resultado[0] : null;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }
}

module.exports = Evento;

