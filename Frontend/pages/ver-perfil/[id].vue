<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
    <!-- Header -->
    <div class="bg-primary-700 text-white shadow-lg">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold">Perfil de Usuario</h1>
          <button 
            @click="cerrar"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="cargando" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h2 class="text-xl font-bold text-red-800 mb-2">Error</h2>
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else-if="estudiante" class="space-y-6">
        <!-- Tarjeta Principal con Foto -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-primary-600 h-32"></div>
          <div class="px-6 pb-6">
            <!-- Foto de perfil centrada -->
            <div class="flex flex-col items-center -mt-16">
              <div class="relative">
                <div v-if="fotoPerfil" class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img :src="fotoPerfil" :alt="estudiante.Nombres" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-4xl border-4 border-white shadow-lg">
                  {{ getIniciales(estudiante.Nombres, estudiante.Apellidos) }}
                </div>
                
                <!-- Badge de verificado (tipo Instagram/Twitter) -->
                <div v-if="estudiante.Esta_verificado === 1" class="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Nombre centrado -->
              <div class="text-center mt-4">
                <h2 class="text-3xl font-bold text-gray-800">{{ estudiante.Nombres }} {{ estudiante.Apellidos }}</h2>
                <div class="flex items-center justify-center space-x-2 mt-2">
                  <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {{ getRolNombre(estudiante.ID_rol) }}
                  </span>
                  <span v-if="estudiante.Esta_verificado === 0" class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Pendiente
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información Personal -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Información Personal</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Usuario</p>
              <p class="font-medium">{{ estudiante.Usuario_nombre }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email Personal</p>
              <p class="font-medium">{{ estudiante.Email_personal || 'No proporcionado' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Email Académico</p>
              <p class="font-medium">{{ estudiante.Email_academico || 'No proporcionado' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Teléfono</p>
              <p class="font-medium">{{ estudiante.Telefono || 'No proporcionado' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Fecha de Nacimiento</p>
              <p class="font-medium">{{ formatearFecha(estudiante.Fecha_nacimiento) || 'No proporcionada' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Estado</p>
              <p class="font-medium">
                <span :class="estudiante.Estado === 'Activo' ? 'text-green-600' : 'text-red-600'">
                  {{ estudiante.Estado }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <!-- Información Académica -->
        <div v-if="estudiante.Es_estudiante === 1" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Información Académica</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Centro Educativo</p>
              <p class="font-medium">{{ centroEducativo?.Nombre || 'No asignado' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Carrera</p>
              <p class="font-medium">{{ carrera?.Nombre || 'No asignada' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Número de Cuenta</p>
              <p class="font-medium">{{ estudiante.Num_cuenta || 'No proporcionado' }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Estado de Verificación</p>
              <p class="font-medium">
                <span v-if="estudiante.Esta_verificado === 1" class="text-green-600">✓ Verificado</span>
                <span v-else class="text-yellow-600">Pendiente</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Horas de Voluntariado -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Actividad de Voluntariado</h3>
          <div class="flex items-center space-x-4">
            <div class="bg-primary-100 p-4 rounded-lg">
              <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-3xl font-bold text-primary-600">{{ estudiante.Horas_voluntariado_acumuladas || 0 }}</p>
              <p class="text-gray-500">Horas de voluntariado acumuladas</p>
            </div>
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

const route = useRoute();
const idEstudiante = ref(parseInt(route.params.id));
const estudiante = ref(null);
const centroEducativo = ref(null);
const carrera = ref(null);
const fotoPerfil = ref(null);
const cargando = ref(true);
const error = ref('');

onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      error.value = 'No estás autenticado';
      cargando.value = false;
      return;
    }

    await cargarPerfilEstudiante();
  }
});

const cargarPerfilEstudiante = async () => {
  cargando.value = true;
  
  try {
    const token = localStorage.getItem('token');
    
    // Cargar información del estudiante
    const response = await fetch(`http://localhost:3000/api/usuarios/${idEstudiante.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      estudiante.value = data.data;
      
      // Cargar foto de perfil
      await cargarFotoPerfil();
      
      // Cargar centro educativo si tiene
      if (estudiante.value.ID_centro_educativo) {
        await cargarCentroEducativo();
      }
      
      // Cargar carrera si tiene
      if (estudiante.value.ID_carrera) {
        await cargarCarrera();
      }
    } else {
      error.value = data.mensaje || 'No se pudo cargar el perfil';
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err);
    error.value = 'Error al cargar el perfil del estudiante';
  } finally {
    cargando.value = false;
  }
};

const cargarFotoPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/fotos-perfil/usuario/${idEstudiante.value}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success && data.data) {
      fotoPerfil.value = data.data.imagen_url;
    }
  } catch (err) {
    // No tiene foto, no pasa nada
  }
};

const cargarCentroEducativo = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/centros/${estudiante.value.ID_centro_educativo}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      centroEducativo.value = data.data;
    }
  } catch (err) {
    console.error('Error al cargar centro:', err);
  }
};

const cargarCarrera = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:3000/api/carreras/${estudiante.value.ID_carrera}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.success) {
      carrera.value = data.data;
    }
  } catch (err) {
    console.error('Error al cargar carrera:', err);
  }
};

const getIniciales = (nombres, apellidos) => {
  const inicial1 = nombres?.charAt(0)?.toUpperCase() || '';
  const inicial2 = apellidos?.charAt(0)?.toUpperCase() || '';
  return inicial1 + inicial2;
};

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

const formatearFecha = (fecha) => {
  if (!fecha) return null;
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const cerrar = () => {
  window.close();
};
</script>

