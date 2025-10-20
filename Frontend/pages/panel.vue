<template>
  <div class="flex h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-xl flex flex-col">
      <!-- Perfil del Usuario -->
      <div class="p-6 bg-primary-700 text-white">
        <div class="flex flex-col items-center">
          <!-- Foto de Perfil (clickable) -->
          <div 
            @click="irAPerfil"
            class="cursor-pointer mb-4 relative group"
          >
            <div v-if="fotoPerfil" class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-primary-300 transition">
              <img :src="fotoPerfil" :alt="usuario?.Nombres" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-3xl border-4 border-white shadow-lg group-hover:border-primary-300 transition">
              {{ getIniciales(usuario?.Nombres, usuario?.Apellidos) }}
            </div>
            <!-- Icono de editar al hover -->
            <div class="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
          </div>
          
          <!-- Nombre y Rol -->
          <h2 class="text-xl font-bold text-center">{{ usuario?.Nombres }} {{ usuario?.Apellidos }}</h2>
          <p class="text-sm text-primary-100 mt-1">{{ getRolNombre(usuario?.ID_rol) }}</p>
        </div>
      </div>

      <!-- Menú de Navegación -->
      <nav class="flex-1 p-4 overflow-y-auto">
        <ul class="space-y-2">
          <!-- Mi Centro (solo Docentes) -->
          <li v-if="usuario?.ID_rol === 4">
            <button
              @click="irAGestionCentro"
              class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition group"
            >
              <svg class="w-5 h-5 text-primary-600 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="font-medium text-gray-700 group-hover:text-primary-700">Mi Centro</span>
            </button>
          </li>

          <!-- Aprobar Docentes (solo Admins) -->
          <li v-if="usuario?.ID_rol === 6">
            <button
              @click="irAAprobaciones"
              class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition group"
            >
              <svg class="w-5 h-5 text-primary-600 group-hover:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="font-medium text-gray-700 group-hover:text-primary-700">Aprobar Docentes</span>
            </button>
          </li>

          <!-- Divider -->
          <li class="py-2">
            <div class="border-t border-gray-200"></div>
          </li>

          <!-- Cerrar Sesión -->
          <li>
            <button
              @click="logout"
              class="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-50 transition group"
            >
              <svg class="w-5 h-5 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span class="font-medium text-red-600 group-hover:text-red-700">Cerrar Sesión</span>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Footer del Sidebar -->
      <div class="p-4 border-t border-gray-200">
        <p class="text-xs text-gray-500 text-center">Sistema de Voluntariado v1.0</p>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-7xl mx-auto px-8 py-8">
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
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const usuario = ref(null);
const cargando = ref(true);
const fotoPerfil = ref(null);

// Cargar foto de perfil
const cargarFotoPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch('http://localhost:3000/api/fotos-perfil/mi-foto', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        fotoPerfil.value = data.data.imagen_url;
      }
    }
  } catch (error) {
    // Silenciar error si no hay foto
  }
};

// Cargar datos actualizados del usuario desde el backend
const cargarDatosUsuario = async () => {
  if (!process.client) return;
  
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/auth/perfil', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        usuario.value = data.data;
        // Actualizar localStorage con datos más recientes
        localStorage.setItem('usuario', JSON.stringify(data.data));
      }
    } else if (response.status === 401) {
      // Token inválido, cerrar sesión
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    // Fallback: usar datos de localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      usuario.value = JSON.parse(usuarioGuardado);
    }
  } finally {
    cargando.value = false;
  }
};

// Verificar autenticación y cargar datos al montar
onMounted(() => {
  if (process.client) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!token || !usuarioGuardado) {
      // No hay sesión, redirigir a login
      window.location.href = '/';
    } else {
      // Cargar datos del usuario desde localStorage primero (carga rápida)
      usuario.value = JSON.parse(usuarioGuardado);
      // Luego actualizar con datos del backend
      cargarDatosUsuario();
      cargarFotoPerfil();
    }

    // Escuchar cuando la ventana recupera el foco (cuando vuelves de otra pestaña/página)
    window.addEventListener('focus', cargarDatosUsuario);
    
    // Escuchar evento de storage (cuando se actualiza en otra pestaña)
    window.addEventListener('storage', (e) => {
      if (e.key === 'usuario' && e.newValue) {
        usuario.value = JSON.parse(e.newValue);
      }
    });
  }
});

// Limpiar listeners al desmontar
onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('focus', cargarDatosUsuario);
  }
});

// Ir a perfil
const irAPerfil = () => {
  window.location.href = '/perfil';
};

// Ir a gestión de centro (solo docentes)
const irAGestionCentro = () => {
  window.location.href = '/gestion-centro';
};

const irAAprobaciones = () => {
  window.location.href = '/aprobar-docentes';
};

// Obtener iniciales para avatar
const getIniciales = (nombres, apellidos) => {
  const inicial1 = nombres?.charAt(0) || '';
  const inicial2 = apellidos?.charAt(0) || '';
  return (inicial1 + inicial2).toUpperCase();
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
