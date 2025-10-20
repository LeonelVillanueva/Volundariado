const { pool } = require('../config/database');

/**
 * Modelo de Usuario
 * Representa a los usuarios del sistema con toda su información
 */
class Usuario {
  /**
   * Inicializar la base de datos y crear la tabla si no existe
   * @returns {Promise<boolean>} true si se inicializó correctamente
   */
  static async inicializar() {
    try {
      // Crear la base de datos si no existe
      const crearDB = `CREATE DATABASE IF NOT EXISTS db_voluntariado CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`;
      await pool.query(crearDB);
      console.log('✅ Base de datos verificada/creada correctamente');

      // Usar la base de datos
      await pool.query('USE db_voluntariado');

      // Crear la tabla Usuarios si no existe
      const crearTabla = `
        CREATE TABLE IF NOT EXISTS Usuarios (
          ID INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
          Nombres VARCHAR(100) NULL COMMENT 'Nombres del usuario',
          Apellidos VARCHAR(100) NULL COMMENT 'Apellidos del usuario',
          Email_personal VARCHAR(150) NULL COMMENT 'Correo electrónico personal',
          Email_academico VARCHAR(150) NULL COMMENT 'Correo electrónico académico institucional',
          Telefono VARCHAR(12) NULL COMMENT 'Número de teléfono',
          Fecha_nacimiento DATETIME NULL COMMENT 'Fecha de nacimiento del usuario',
          Es_estudiante BOOLEAN DEFAULT FALSE COMMENT 'Indica si el usuario es estudiante',
          ID_centro_educativo INT NULL COMMENT 'ID del centro educativo al que pertenece',
          Num_cuenta VARCHAR(35) NULL COMMENT 'Número de cuenta estudiantil',
          ID_carrera INT NULL COMMENT 'ID de la carrera que estudia',
          Estado VARCHAR(20) DEFAULT 'Activo' COMMENT 'Estado del usuario (Activo, Inactivo, Suspendido)',
          Estado_aprobacion VARCHAR(20) DEFAULT 'Aprobado' COMMENT 'Estado de aprobación (Pendiente, Aprobado, Rechazado) - Solo para docentes',
          Url_foto_perfil VARCHAR(255) NULL COMMENT 'URL de la foto de perfil',
          Esta_verificado BOOLEAN DEFAULT FALSE COMMENT 'Indica si el usuario ha verificado su cuenta',
          Horas_voluntariado_acumuladas INT DEFAULT 0 COMMENT 'Total de horas de voluntariado acumuladas',
          Usuario_nombre VARCHAR(150) NULL UNIQUE COMMENT 'Nombre de usuario para login',
          Clave VARCHAR(150) NULL COMMENT 'Contraseña encriptada',
          ID_rol INT NOT NULL COMMENT 'ID del rol del usuario',
          Configuracion_privacidad JSON NULL COMMENT 'Configuración de privacidad del usuario',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Fecha de última actualización',
          
          INDEX idx_email_personal (Email_personal),
          INDEX idx_email_academico (Email_academico),
          INDEX idx_usuario_nombre (Usuario_nombre),
          INDEX idx_estado (Estado),
          INDEX idx_estado_aprobacion (Estado_aprobacion),
          INDEX idx_es_estudiante (Es_estudiante),
          INDEX idx_rol (ID_rol),
          INDEX idx_centro_educativo (ID_centro_educativo),
          INDEX idx_carrera (ID_carrera),
          
          CONSTRAINT fk_usuarios_rol 
            FOREIGN KEY (ID_rol) REFERENCES Roles(ID_rol)
            ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT fk_usuarios_centro 
            FOREIGN KEY (ID_centro_educativo) REFERENCES Centros_Educativos(ID)
            ON DELETE SET NULL ON UPDATE CASCADE,
          CONSTRAINT fk_usuarios_carrera 
            FOREIGN KEY (ID_carrera) REFERENCES Carreras(ID)
            ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;
      
      await pool.query(crearTabla);
      console.log('✅ Tabla Usuarios verificada/creada correctamente');
      
      return true;
    } catch (error) {
      console.error('❌ Error al inicializar base de datos y tabla:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} datos - Datos del usuario
   * @returns {Promise<Object>} Usuario creado con su ID
   */
  static async crear(datos) {
    const {
      nombres,
      apellidos,
      email_personal,
      email_academico,
      telefono,
      fecha_nacimiento,
      es_estudiante = false,
      id_centro_educativo = null,
      num_cuenta = null,
      id_carrera = null,
      estado = 'Activo',
      estado_aprobacion = 'Aprobado',
      url_foto_perfil = null,
      esta_verificado = false,
      horas_voluntariado_acumuladas = 0,
      usuario_nombre,
      clave,
      id_rol
    } = datos;

    const query = `
      INSERT INTO Usuarios (
        Nombres, Apellidos, Email_personal, Email_academico, Telefono,
        Fecha_nacimiento, Es_estudiante, ID_centro_educativo, Num_cuenta,
        ID_carrera, Estado, Estado_aprobacion, Url_foto_perfil, Esta_verificado,
        Horas_voluntariado_acumuladas, Usuario_nombre, Clave, ID_rol
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
      nombres, apellidos, email_personal, email_academico, telefono,
      fecha_nacimiento, es_estudiante, id_centro_educativo, num_cuenta,
      id_carrera, estado, estado_aprobacion, url_foto_perfil, esta_verificado,
      horas_voluntariado_acumuladas, usuario_nombre, clave, id_rol
    ];

    try {
      const [resultado] = await pool.execute(query, valores);
      return {
        id: resultado.insertId,
        ...datos
      };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios
   * @param {Object} filtros - Filtros opcionales (estado, es_estudiante, etc.)
   * @returns {Promise<Array>} Lista de usuarios
   */
  static async obtenerTodos(filtros = {}) {
    let query = 'SELECT * FROM Usuarios WHERE 1=1';
    const valores = [];

    if (filtros.estado) {
      query += ' AND Estado = ?';
      valores.push(filtros.estado);
    }

    if (filtros.es_estudiante !== undefined) {
      query += ' AND Es_estudiante = ?';
      valores.push(filtros.es_estudiante);
    }

    if (filtros.id_rol) {
      query += ' AND ID_rol = ?';
      valores.push(filtros.id_rol);
    }

    query += ' ORDER BY ID DESC';

    try {
      const [usuarios] = await pool.execute(query, valores);
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por ID
   * @param {number} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async obtenerPorId(id) {
    const query = 'SELECT * FROM Usuarios WHERE ID = ?';
    
    try {
      const [usuarios] = await pool.execute(query, [id]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por nombre de usuario
   * @param {string} usuario_nombre - Nombre de usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async obtenerPorUsuarioNombre(usuario_nombre) {
    const query = 'SELECT * FROM Usuarios WHERE Usuario_nombre = ?';
    
    try {
      const [usuarios] = await pool.execute(query, [usuario_nombre]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario por nombre de usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por email personal
   * @param {string} email - Email personal
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async obtenerPorEmailPersonal(email) {
    const query = 'SELECT * FROM Usuarios WHERE Email_personal = ?';
    
    try {
      const [usuarios] = await pool.execute(query, [email]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario por email personal:', error);
      throw error;
    }
  }

  /**
   * Obtener un usuario por email académico
   * @param {string} email - Email académico
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async obtenerPorEmailAcademico(email) {
    const query = 'SELECT * FROM Usuarios WHERE Email_academico = ?';
    
    try {
      const [usuarios] = await pool.execute(query, [email]);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario por email académico:', error);
      throw error;
    }
  }

  /**
   * Actualizar un usuario
   * @param {number} id - ID del usuario
   * @param {Object} datos - Datos a actualizar
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async actualizar(id, datos) {
    // Mapeo de nombres de campos de snake_case a nombres de columnas MySQL
    const mapaCampos = {
      'nombres': 'Nombres',
      'apellidos': 'Apellidos',
      'email_personal': 'Email_personal',
      'email_academico': 'Email_academico',
      'telefono': 'Telefono',
      'fecha_nacimiento': 'Fecha_nacimiento',
      'es_estudiante': 'Es_estudiante',
      'id_centro_educativo': 'ID_centro_educativo',
      'num_cuenta': 'Num_cuenta',
      'id_carrera': 'ID_carrera',
      'estado': 'Estado',
      'estado_aprobacion': 'Estado_aprobacion',
      'url_foto_perfil': 'Url_foto_perfil',
      'esta_verificado': 'Esta_verificado',
      'horas_voluntariado_acumuladas': 'Horas_voluntariado_acumuladas',
      'usuario_nombre': 'Usuario_nombre',
      'clave': 'Clave',
      'id_rol': 'ID_rol'
    };

    const campos = [];
    const valores = [];

    // Construir la consulta dinámicamente solo con los campos proporcionados
    for (const [key, value] of Object.entries(datos)) {
      const campoMySQL = mapaCampos[key.toLowerCase()];
      
      if (campoMySQL) {
        campos.push(`${campoMySQL} = ?`);
        valores.push(value);
      }
    }

    if (campos.length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    valores.push(id);
    const query = `UPDATE Usuarios SET ${campos.join(', ')} WHERE ID = ?`;

    try {
      const [resultado] = await pool.execute(query, valores);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar horas de voluntariado de un usuario
   * @param {number} id - ID del usuario
   * @param {number} horas - Horas a agregar (pueden ser negativas)
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async actualizarHorasVoluntariado(id, horas) {
    const query = `
      UPDATE Usuarios 
      SET Horas_voluntariado_acumuladas = Horas_voluntariado_acumuladas + ?
      WHERE ID = ?
    `;

    try {
      const [resultado] = await pool.execute(query, [horas, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar horas de voluntariado:', error);
      throw error;
    }
  }

  /**
   * Verificar un usuario
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} true si se verificó correctamente
   */
  static async verificar(id) {
    const query = 'UPDATE Usuarios SET Esta_verificado = TRUE WHERE ID = ?';

    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      throw error;
    }
  }

  /**
   * Cambiar el estado de un usuario
   * @param {number} id - ID del usuario
   * @param {string} nuevoEstado - Nuevo estado del usuario
   * @returns {Promise<boolean>} true si se actualizó correctamente
   */
  static async cambiarEstado(id, nuevoEstado) {
    const query = 'UPDATE Usuarios SET Estado = ? WHERE ID = ?';

    try {
      const [resultado] = await pool.execute(query, [nuevoEstado, id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      throw error;
    }
  }

  /**
   * Eliminar un usuario (eliminación física)
   * @param {number} id - ID del usuario
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  static async eliminar(id) {
    const query = 'DELETE FROM Usuarios WHERE ID = ?';

    try {
      const [resultado] = await pool.execute(query, [id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de usuarios
   * @returns {Promise<Object>} Estadísticas generales
   */
  static async obtenerEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN Estado = 'Activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN Estado = 'Inactivo' THEN 1 ELSE 0 END) as inactivos,
        SUM(CASE WHEN Es_estudiante = TRUE THEN 1 ELSE 0 END) as estudiantes,
        SUM(CASE WHEN Esta_verificado = TRUE THEN 1 ELSE 0 END) as verificados,
        SUM(Horas_voluntariado_acumuladas) as total_horas_voluntariado,
        AVG(Horas_voluntariado_acumuladas) as promedio_horas_por_usuario
      FROM Usuarios
    `;

    try {
      const [resultado] = await pool.execute(query);
      return resultado[0];
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  }

  /**
   * Buscar usuarios por nombre, apellido o email
   * @param {string} termino - Término de búsqueda
   * @returns {Promise<Array>} Lista de usuarios encontrados
   */
  static async buscar(termino) {
    const query = `
      SELECT * FROM Usuarios 
      WHERE Nombres LIKE ? 
         OR Apellidos LIKE ? 
         OR Email_personal LIKE ?
         OR Email_academico LIKE ?
         OR Usuario_nombre LIKE ?
      ORDER BY ID DESC
    `;
    
    const terminoBusqueda = `%${termino}%`;

    try {
      const [usuarios] = await pool.execute(query, [
        terminoBusqueda,
        terminoBusqueda,
        terminoBusqueda,
        terminoBusqueda,
        terminoBusqueda
      ]);
      return usuarios;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtener configuración de privacidad por defecto
   */
  static getConfiguracionPrivacidadPorDefecto() {
    return {
      perfil_publico: true,
      mostrar_email_personal: false,
      mostrar_email_academico: false,
      mostrar_telefono: false,
      mostrar_fecha_nacimiento: false,
      mostrar_centro_educativo: true,
      mostrar_carrera: true,
      mostrar_horas_voluntariado: true
    };
  }

  /**
   * Obtener configuración de privacidad de un usuario
   */
  static getPrivacidad(usuario) {
    try {
      if (!usuario.Configuracion_privacidad) {
        return this.getConfiguracionPrivacidadPorDefecto();
      }
      
      // Si es string JSON, parsearlo
      if (typeof usuario.Configuracion_privacidad === 'string') {
        return JSON.parse(usuario.Configuracion_privacidad);
      }
      
      // Si ya es objeto, retornarlo
      return usuario.Configuracion_privacidad;
    } catch (error) {
      console.error('Error al parsear configuración de privacidad:', error);
      return this.getConfiguracionPrivacidadPorDefecto();
    }
  }

  /**
   * Actualizar configuración de privacidad
   */
  static async actualizarPrivacidad(id, configuracion) {
    try {
      const query = 'UPDATE Usuarios SET Configuracion_privacidad = ? WHERE ID = ?';
      const [resultado] = await pool.execute(query, [JSON.stringify(configuracion), id]);
      return resultado.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar configuración de privacidad:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil público de un usuario (filtrado según privacidad)
   * @param {number} id_usuario - ID del usuario a obtener
   * @param {number} id_solicitante - ID del usuario que solicita (para verificar si es él mismo)
   * @param {number} id_rol_solicitante - Rol del usuario que solicita
   */
  static async obtenerPerfilPublico(id_usuario, id_solicitante = null, id_rol_solicitante = null) {
    try {
      const usuario = await this.obtenerPorId(id_usuario);
      
      if (!usuario) {
        return null;
      }

      // Si el solicitante es el mismo usuario, mostrar todo
      if (id_solicitante === id_usuario) {
        return usuario;
      }

      // Si el solicitante es Docente (4) o Administrador (6), mostrar todo
      if (id_rol_solicitante === 4 || id_rol_solicitante === 6) {
        return usuario;
      }

      const config = this.getPrivacidad(usuario);

      // Si el perfil no es público, retornar solo información básica
      if (!config.perfil_publico) {
        return {
          ID: usuario.ID,
          Nombres: usuario.Nombres,
          Apellidos: usuario.Apellidos,
          Url_foto_perfil: usuario.Url_foto_perfil,
          ID_rol: usuario.ID_rol,
          perfil_privado: true
        };
      }

      // Construir perfil filtrado según configuración
      const perfilFiltrado = {
        ID: usuario.ID,
        Nombres: usuario.Nombres,
        Apellidos: usuario.Apellidos,
        Usuario_nombre: usuario.Usuario_nombre,
        Url_foto_perfil: usuario.Url_foto_perfil,
        ID_rol: usuario.ID_rol,
        Estado: usuario.Estado,
        Esta_verificado: usuario.Esta_verificado,
        Es_estudiante: usuario.Es_estudiante
      };

      // Agregar campos según configuración de privacidad
      if (config.mostrar_email_personal) {
        perfilFiltrado.Email_personal = usuario.Email_personal;
      }
      if (config.mostrar_email_academico) {
        perfilFiltrado.Email_academico = usuario.Email_academico;
      }
      if (config.mostrar_telefono) {
        perfilFiltrado.Telefono = usuario.Telefono;
      }
      if (config.mostrar_fecha_nacimiento) {
        perfilFiltrado.Fecha_nacimiento = usuario.Fecha_nacimiento;
      }
      if (config.mostrar_centro_educativo) {
        perfilFiltrado.ID_centro_educativo = usuario.ID_centro_educativo;
      }
      if (config.mostrar_carrera) {
        perfilFiltrado.ID_carrera = usuario.ID_carrera;
      }
      if (config.mostrar_horas_voluntariado) {
        perfilFiltrado.Horas_voluntariado_acumuladas = usuario.Horas_voluntariado_acumuladas;
      }

      return perfilFiltrado;
    } catch (error) {
      console.error('Error al obtener perfil público:', error);
      throw error;
    }
  }
}

module.exports = Usuario;

