<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Header -->
    <div class="bg-primary-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="volverPanel"
              class="p-2 hover:bg-primary-600 rounded-lg transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold">Aprobación de Docentes</h1>
              <p class="text-primary-200 text-sm">Gestiona las solicitudes de registro de docentes</p>
            </div>
          </div>
          <button 
            @click="logout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pendientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.pendientes || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Aprobados</p>
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.aprobados || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rechazados</p>
              <p class="text-2xl font-bold text-gray-900">{{ estadisticas.rechazados || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Docentes Pendientes -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Docentes Pendientes de Aprobación</h2>
          <button
            @click="cargarDatos"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Actualizar</span>
          </button>
        </div>

        <div v-if="cargando" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p class="mt-4 text-gray-600">Cargando docentes...</p>
        </div>

        <div v-else-if="docentesPendientes.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-gray-600 text-lg">No hay docentes pendientes de aprobación</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="docente in docentesPendientes" :key="docente.ID" class="border border-gray-200 rounded-lg p-6 hover:border-primary-300 transition">
                <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-600 font-bold text-lg">{{ getIniciales(docente.Nombres, docente.Apellidos) }}</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-gray-800">{{ docente.Nombres }} {{ docente.Apellidos }}</h3>
                    <p class="text-sm text-gray-500">@{{ docente.Usuario_nombre }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-4 border-primary-200">
                  <div>
                    <p class="text-sm text-gray-500">Email Personal</p>
                    <p class="font-medium text-gray-900">{{ docente.Email_personal }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Email Académico</p>
                    <p class="font-medium text-gray-900">{{ docente.Email_academico || 'No proporcionado' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Teléfono</p>
                    <p class="font-medium text-gray-900">{{ docente.Telefono || 'No proporcionado' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Centro Educativo</p>
                    <p class="font-medium text-gray-900">{{ docente.Centro_nombre || 'Sin centro asignado' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <p class="text-sm text-gray-500">Fecha de Registro</p>
                    <p class="font-medium text-gray-900">{{ formatearFecha(docente.created_at) }}</p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col space-y-2 ml-6">
                <button
                  @click="aprobarDocente(docente.ID)"
                  class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Aprobar</span>
                </button>
                <button
                  @click="rechazarDocente(docente.ID)"
                  class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center space-x-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  <span>Rechazar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sistema de Notificaciones Toast -->
    <div
      v-if="notificacion.visible"
      :class="[
        'fixed top-20 right-4 px-6 py-4 rounded-lg shadow-2xl transition-all transform',
        notificacion.tipo === 'success' ? 'bg-green-500' : 'bg-red-500',
        'text-white flex items-center space-x-3 animate-slide-in'
      ]"
    >
      <svg v-if="notificacion.tipo === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="font-medium">{{ notificacion.mensaje }}</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>

<script setup>
const docentesPendientes = ref([]);
const estadisticas = ref({
  total: 0,
  pendientes: 0,
  aprobados: 0,
  rechazados: 0
});

// Sistema de notificaciones
const notificacion = ref({
  visible: false,
  mensaje: '',
  tipo: 'success' // 'success' o 'error'
});

const mostrarNotificacion = (mensaje, tipo = 'success') => {
  notificacion.value = {
    visible: true,
    mensaje,
    tipo
  };
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.value.visible = false;
  }, 3000);
};
const cargando = ref(false);

// Cargar datos al montar
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!token || !usuarioGuardado) {
      window.location.href = '/';
      return;
    }

    const usuario = JSON.parse(usuarioGuardado);
    
    // Verificar que sea administrador
    if (usuario.ID_rol !== 6) {
      window.location.href = '/panel';
      return;
    }

    cargarDatos();
  }
});

const cargarDatos = async () => {
  cargando.value = true;
  await Promise.all([
    cargarDocentesPendientes(),
    cargarEstadisticas()
  ]);
  cargando.value = false;
};

const cargarDocentesPendientes = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/aprobaciones/docentes/pendientes', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      docentesPendientes.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar docentes pendientes:', error);
  }
};

const cargarEstadisticas = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/aprobaciones/estadisticas', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      estadisticas.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
};

const aprobarDocente = async (idDocente) => {
  if (!confirm('¿Estás seguro de aprobar a este docente?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/aprobaciones/docentes/${idDocente}/aprobar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      mostrarNotificacion('✓ Docente aprobado exitosamente', 'success');
      cargarDatos();
    } else {
      mostrarNotificacion(data.mensaje || 'Error al aprobar docente', 'error');
    }
  } catch (error) {
    console.error('Error al aprobar docente:', error);
    mostrarNotificacion('Error al aprobar docente', 'error');
  }
};

const rechazarDocente = async (idDocente) => {
  if (!confirm('¿Estás seguro de rechazar a este docente? Esta acción bloqueará su cuenta.')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/aprobaciones/docentes/${idDocente}/rechazar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      mostrarNotificacion('Docente rechazado correctamente', 'success');
      cargarDatos();
    } else {
      mostrarNotificacion(data.mensaje || 'Error al rechazar docente', 'error');
    }
  } catch (error) {
    console.error('Error al rechazar docente:', error);
    mostrarNotificacion('Error al rechazar docente', 'error');
  }
};

const getIniciales = (nombres, apellidos) => {
  const inicial1 = nombres?.charAt(0) || '';
  const inicial2 = apellidos?.charAt(0) || '';
  return (inicial1 + inicial2).toUpperCase();
};

const formatearFecha = (fecha) => {
  if (!fecha) return 'No disponible';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-HN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const volverPanel = () => {
  window.location.href = '/panel';
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/';
};
</script>

