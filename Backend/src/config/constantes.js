/**
 * Constantes del Sistema
 * Centraliza todos los valores constantes para fácil mantenimiento
 */

/**
 * Roles del Sistema
 * IDs fijos que corresponden a la tabla Roles
 */
const ROLES = {
  INVITADO: 1,              // Puede visualizar eventos públicos
  ESTUDIANTE_VOLUNTARIO: 2, // Puede inscribirse en eventos para estudiantes
  VOLUNTARIO_GENERAL: 3,    // Puede inscribirse en eventos públicos
  DOCENTE: 4,               // Crea eventos y valida estudiantes de su centro
  ORGANIZADOR: 5,           // Crea eventos y gestiona inscripciones
  ADMINISTRADOR: 6          // Control total del sistema
};

/**
 * Estados de Usuarios
 */
const ESTADOS_USUARIO = {
  ACTIVO: 'Activo',
  INACTIVO: 'Inactivo',
  SUSPENDIDO: 'Suspendido'
};

/**
 * Estados de Eventos
 */
const ESTADOS_EVENTO = {
  BORRADOR: 'Borrador',
  PENDIENTE: 'Pendiente',
  APROBADO: 'Aprobado',
  EN_CURSO: 'En Curso',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
  SUSPENDIDO: 'Suspendido'
};

/**
 * Estados de Inscripción
 */
const ESTADOS_INSCRIPCION = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada',
  RECHAZADA: 'Rechazada',
  ASISTIO: 'Asistió',
  NO_ASISTIO: 'No Asistió'
};

/**
 * Roles que pueden crear eventos
 */
const ROLES_CREAR_EVENTOS = [ROLES.DOCENTE, ROLES.ORGANIZADOR, ROLES.ADMINISTRADOR];

/**
 * Roles que pueden inscribirse en eventos
 */
const ROLES_INSCRIBIRSE = [
  ROLES.ESTUDIANTE_VOLUNTARIO,
  ROLES.VOLUNTARIO_GENERAL,
  ROLES.DOCENTE,
  ROLES.ORGANIZADOR,
  ROLES.ADMINISTRADOR
];

/**
 * Roles con permisos administrativos
 */
const ROLES_ADMIN = [ROLES.ADMINISTRADOR];

/**
 * Roles que pueden validar estudiantes
 */
const ROLES_VALIDAR_ESTUDIANTES = [ROLES.DOCENTE, ROLES.ADMINISTRADOR];

module.exports = {
  ROLES,
  ESTADOS_USUARIO,
  ESTADOS_EVENTO,
  ESTADOS_INSCRIPCION,
  ROLES_CREAR_EVENTOS,
  ROLES_INSCRIBIRSE,
  ROLES_ADMIN,
  ROLES_VALIDAR_ESTUDIANTES
};

