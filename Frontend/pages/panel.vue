<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Navbar -->
    <nav class="bg-primary-700 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-white">Panel de Control</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div v-if="usuario" class="text-right">
              <p class="text-sm font-medium text-white">{{ usuario.Nombres }} {{ usuario.Apellidos }}</p>
              <p class="text-xs text-primary-100">{{ getRolNombre(usuario.ID_rol) }}</p>
            </div>
            <button
              @click="irAPerfil"
              class="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>Mi Perfil</span>
            </button>
            <button
              @click="logout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Mensaje de Bienvenida -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {{ usuario?.Nombres }}! 👋
        </h2>
        <p class="text-gray-600">Has iniciado sesión correctamente en el sistema de voluntariado.</p>
      </div>

      <!-- Tarjetas de Información -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Tarjeta de Perfil -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-primary-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-800">Mi Perfil</h3>
              <p class="text-sm text-gray-500">{{ usuario?.Email_personal || 'Sin email' }}</p>
            </div>
          </div>
          <div class="text-sm space-y-1">
            <p><span class="font-medium">Usuario:</span> {{ usuario?.Usuario_nombre }}</p>
            <p><span class="font-medium">Estado:</span> 
              <span class="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">{{ usuario?.Estado }}</span>
            </p>
          </div>
        </div>

        <!-- Tarjeta de Rol -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-primary-200 p-3 rounded-lg">
              <svg class="w-6 h-6 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-800">Rol</h3>
              <p class="text-sm text-gray-500">{{ getRolNombre(usuario?.ID_rol) }}</p>
            </div>
          </div>
          <p class="text-xs text-gray-600">{{ getRolDescripcion(usuario?.ID_rol) }}</p>
        </div>

        <!-- Tarjeta de Horas -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-primary-300 p-3 rounded-lg">
              <svg class="w-6 h-6 text-primary-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-800">Horas de Voluntariado</h3>
              <p class="text-3xl font-bold text-primary-600">{{ usuario?.Horas_voluntariado_acumuladas || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Información del Usuario</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Email Personal</p>
            <p class="font-medium">{{ usuario?.Email_personal || 'No proporcionado' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Email Académico</p>
            <p class="font-medium">{{ usuario?.Email_academico || 'No proporcionado' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Teléfono</p>
            <p class="font-medium">{{ usuario?.Telefono || 'No proporcionado' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Es Estudiante</p>
            <p class="font-medium">{{ usuario?.Es_estudiante ? 'Sí' : 'No' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Estado de Verificación</p>
            <p class="font-medium">
              <span v-if="usuario?.Esta_verificado" class="text-green-600">✓ Verificado</span>
              <span v-else class="text-yellow-600">Pendiente</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const usuario = ref(null);

// Verificar autenticación inmediatamente
if (process.client) {
  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('usuario');

  if (!token || !usuarioGuardado) {
    // No hay sesión, redirigir a login
    window.location.href = '/';
  } else {
    // Hay sesión, cargar usuario
    usuario.value = JSON.parse(usuarioGuardado);
  }
}

// Ir a perfil
const irAPerfil = () => {
  window.location.href = '/perfil';
};

// Cerrar sesión
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/';
};

// Obtener nombre del rol
const getRolNombre = (idRol) => {
  const roles = {
    1: 'Invitado',
    2: 'Estudiante voluntario',
    3: 'Voluntario general',
    4: 'Docente',
    5: 'Organizador',
    6: 'Administrador'
  };
  return roles[idRol] || 'Sin rol';
};

// Obtener descripción del rol
const getRolDescripcion = (idRol) => {
  const descripciones = {
    1: 'Puede visualizar eventos públicos',
    2: 'Puede inscribirse en eventos para estudiantes',
    3: 'Puede inscribirse en eventos públicos',
    4: 'Crea eventos y valida estudiantes',
    5: 'Crea eventos y gestiona inscripciones',
    6: 'Control total del sistema'
  };
  return descripciones[idRol] || '';
};
</script>
