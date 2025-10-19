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
            <h1 class="text-3xl font-bold">Mi Perfil</h1>
          </div>
          <button 
            @click="logout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Mensaje de éxito/error -->
      <div v-if="mensaje" class="mb-6 p-4 rounded-lg" :class="mensajeTipo === 'success' ? 'bg-primary-100 text-primary-800 border border-primary-300' : 'bg-red-100 text-red-800 border border-red-300'">
        <div class="flex items-center">
          <svg v-if="mensajeTipo === 'success'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>{{ mensaje }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna Izquierda - Foto de Perfil -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <div class="text-center">
                <!-- Foto de Perfil -->
                <div class="relative inline-block">
                  <div class="w-40 h-40 mx-auto rounded-full bg-primary-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    <!-- Imagen si existe, iniciales si no -->
                    <img v-if="fotoPerfil" :src="fotoPerfil" alt="Foto de perfil" class="w-full h-full object-cover" />
                    <span v-else class="text-5xl font-bold text-primary-700">
                      {{ getInitials() }}
                    </span>
                  </div>
                  <!-- Input de archivo oculto -->
                  <input 
                    ref="fileInput" 
                    type="file" 
                    accept="image/*" 
                    @change="seleccionarFoto" 
                    class="hidden"
                  />
                  <!-- Botón para cambiar foto -->
                  <button 
                    @click="$refs.fileInput.click()"
                    type="button"
                    class="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 shadow-lg transition-colors"
                    title="Cambiar foto de perfil"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                </div>
                
                <h2 class="mt-4 text-2xl font-bold text-gray-900">
                  {{ form.Nombres }} {{ form.Apellidos }}
                </h2>
                <p class="text-primary-600 font-medium">@{{ usuario?.Usuario_nombre }}</p>
                <p class="mt-2 text-gray-600">{{ getRolNombre() }}</p>
              </div>

              <!-- Información de Solo Lectura -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-4">Información del Sistema</h3>
                
                <!-- Horas de Voluntariado -->
                <div class="bg-primary-50 rounded-lg p-4 mb-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="p-2 bg-primary-100 rounded-lg">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Horas Acumuladas</p>
                        <p class="text-2xl font-bold text-primary-700">{{ usuario?.Horas_voluntariado_acumuladas || 0 }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Estado de Verificación (si es estudiante) -->
                <div v-if="form.Es_estudiante" class="bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="p-2 rounded-lg" :class="usuario?.Esta_verificado ? 'bg-green-100' : 'bg-yellow-100'">
                        <svg v-if="usuario?.Esta_verificado" class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <svg v-else class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm text-gray-600">Estado</p>
                        <p class="text-sm font-semibold" :class="usuario?.Esta_verificado ? 'text-green-700' : 'text-yellow-700'">
                          {{ usuario?.Esta_verificado ? 'Verificado' : 'Pendiente de Verificación' }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna Derecha - Formulario de Edición -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Información Personal</h3>
              
              <form @submit.prevent="actualizarPerfil" class="space-y-6">
                <!-- Nombres y Apellidos -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombres *</label>
                    <input
                      v-model="form.Nombres"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Apellidos *</label>
                    <input
                      v-model="form.Apellidos"
                      type="text"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <!-- Emails -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Personal</label>
                    <input
                      v-model="form.Email_personal"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Académico</label>
                    <input
                      v-model="form.Email_academico"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <!-- Teléfono y Fecha de Nacimiento -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      v-model="form.Telefono"
                      type="tel"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                    <input
                      v-model="form.Fecha_nacimiento"
                      type="date"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>
                </div>

                <!-- Es Estudiante -->
                <div class="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg">
                  <input
                    v-model="form.Es_estudiante"
                    type="checkbox"
                    id="es_estudiante"
                    class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  >
                  <label for="es_estudiante" class="text-sm font-medium text-gray-900 cursor-pointer">
                    Soy estudiante
                  </label>
                </div>

                <!-- Campos de Estudiante (condicionales) -->
                <div v-if="form.Es_estudiante" class="space-y-4 pl-4 border-l-4 border-primary-300">
                  <h4 class="font-semibold text-gray-900">Información de Estudiante</h4>
                  
                  <!-- Centro Educativo -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Centro Educativo</label>
                    <select
                      v-model="form.ID_centro_educativo"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option :value="null">Seleccione un centro educativo</option>
                      <option v-for="centro in centrosEducativos" :key="centro.ID" :value="centro.ID">
                        {{ centro.Nombre }}
                      </option>
                    </select>
                  </div>

                  <!-- Número de Cuenta -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Número de Cuenta
                      <span class="text-gray-500 text-xs">(o número de identidad: 0000-00000-0000)</span>
                    </label>
                    <input
                      v-model="form.Num_cuenta"
                      type="text"
                      placeholder="0000-00000-0000"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                  </div>

                  <!-- Carrera -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                    <select
                      v-model="form.ID_carrera"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :disabled="!form.ID_centro_educativo"
                    >
                      <option :value="null">Seleccione una carrera</option>
                      <option v-for="carrera in carrerasFiltradas" :key="carrera.ID" :value="carrera.ID">
                        {{ carrera.Nombre }}
                      </option>
                    </select>
                    <p v-if="!form.ID_centro_educativo" class="mt-1 text-xs text-gray-500">
                      Selecciona primero un centro educativo
                    </p>
                  </div>
                </div>

                <!-- Botones -->
                <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="cancelar"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    :disabled="guardando"
                    class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <svg v-if="guardando" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{{ guardando ? 'Guardando...' : 'Guardar Cambios' }}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const usuario = ref(null);
const centrosEducativos = ref([]);
const carreras = ref([]);
const guardando = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('success');
const fotoPerfil = ref(null);
const fileInput = ref(null);

const form = ref({
  Nombres: '',
  Apellidos: '',
  Email_personal: '',
  Email_academico: '',
  Telefono: '',
  Fecha_nacimiento: '',
  Es_estudiante: false,
  ID_centro_educativo: null,
  Num_cuenta: '',
  ID_carrera: null,
});

// Cargar datos al montar el componente
onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    console.log('🔍 Debug - Token:', token ? token.substring(0, 20) + '...' : 'NO HAY TOKEN');
    console.log('🔍 Debug - Usuario:', usuarioGuardado ? 'EXISTE' : 'NO EXISTE');

    if (!token || !usuarioGuardado) {
      console.error('❌ No hay token o usuario, redirigiendo a login');
      window.location.href = '/';
      return;
    }

    usuario.value = JSON.parse(usuarioGuardado);
    console.log('🔍 Debug - Usuario cargado:', usuario.value.Nombres);
    
    cargarPerfil();
    cargarCentrosEducativos();
    cargarCarreras();
    cargarFotoPerfil();
  }
});

// Cargar perfil del usuario
const cargarPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No hay token de autenticación');
      window.location.href = '/';
      return;
    }

    console.log('Token encontrado:', token.substring(0, 20) + '...');
    
    const response = await fetch('http://localhost:3000/api/auth/perfil', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      usuario.value = data.data;
      
      // Llenar el formulario
      form.value = {
        Nombres: data.data.Nombres || '',
        Apellidos: data.data.Apellidos || '',
        Email_personal: data.data.Email_personal || '',
        Email_academico: data.data.Email_academico || '',
        Telefono: data.data.Telefono || '',
        Fecha_nacimiento: data.data.Fecha_nacimiento ? data.data.Fecha_nacimiento.split('T')[0] : '',
        Es_estudiante: data.data.Es_estudiante === 1,
        ID_centro_educativo: data.data.ID_centro_educativo,
        Num_cuenta: data.data.Num_cuenta || '',
        ID_carrera: data.data.ID_carrera,
      };
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    mostrarMensaje('Error al cargar perfil', 'error');
  }
};

// Cargar centros educativos
const cargarCentrosEducativos = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/centros-educativos');
    const data = await response.json();
    
    if (data.success) {
      centrosEducativos.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar centros educativos:', error);
  }
};

// Cargar carreras
const cargarCarreras = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/carreras');
    const data = await response.json();
    
    if (data.success) {
      carreras.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar carreras:', error);
  }
};

// Carreras filtradas por centro educativo
const carrerasFiltradas = computed(() => {
  if (!form.value.ID_centro_educativo) return [];
  return carreras.value.filter(c => c.ID_centro_educativo === form.value.ID_centro_educativo);
});

// Actualizar perfil
const actualizarPerfil = async () => {
  guardando.value = true;
  mensaje.value = '';

  try {
    const token = localStorage.getItem('token');
    
    const datosEnviar = {
      nombres: form.value.Nombres,
      apellidos: form.value.Apellidos,
      email_personal: form.value.Email_personal,
      email_academico: form.value.Email_academico,
      telefono: form.value.Telefono,
      fecha_nacimiento: form.value.Fecha_nacimiento,
      es_estudiante: form.value.Es_estudiante ? 1 : 0,
    };

    // Solo enviar datos de estudiante si es estudiante
    if (form.value.Es_estudiante) {
      datosEnviar.id_centro_educativo = form.value.ID_centro_educativo;
      datosEnviar.num_cuenta = form.value.Num_cuenta;
      datosEnviar.id_carrera = form.value.ID_carrera;
    } else {
      // Si no es estudiante, limpiar estos campos
      datosEnviar.id_centro_educativo = null;
      datosEnviar.num_cuenta = null;
      datosEnviar.id_carrera = null;
    }

    const response = await fetch('http://localhost:3000/api/auth/perfil', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(datosEnviar)
    });

    const data = await response.json();

    if (data.success) {
      usuario.value = data.data;
      localStorage.setItem('usuario', JSON.stringify(data.data));
      mostrarMensaje('Perfil actualizado exitosamente', 'success');
    } else {
      mostrarMensaje(data.mensaje || 'Error al actualizar perfil', 'error');
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    mostrarMensaje('Error al conectar con el servidor', 'error');
  } finally {
    guardando.value = false;
  }
};

// Cancelar edición
const cancelar = () => {
  cargarPerfil();
  mensaje.value = '';
};

// Mostrar mensaje
const mostrarMensaje = (texto, tipo) => {
  mensaje.value = texto;
  mensajeTipo.value = tipo;
  setTimeout(() => {
    mensaje.value = '';
  }, 5000);
};

// Obtener iniciales
const getInitials = () => {
  const nombres = form.value.Nombres || '';
  const apellidos = form.value.Apellidos || '';
  return (nombres.charAt(0) + apellidos.charAt(0)).toUpperCase() || 'U';
};

// Obtener nombre del rol
const getRolNombre = () => {
  const roles = {
    1: 'Invitado',
    2: 'Estudiante Voluntario',
    3: 'Voluntario General',
    4: 'Docente',
    5: 'Organizador',
    6: 'Administrador',
  };
  return roles[usuario.value?.ID_rol] || 'Usuario';
};

// Volver al panel
const volverPanel = () => {
  window.location.href = '/panel';
};

// Cerrar sesión
const logout = () => {
  if (process.client) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  }
};

// Cargar foto de perfil desde MongoDB
const cargarFotoPerfil = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No hay token, saltando carga de foto');
      return;
    }

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
        console.log('Referencia MySQL:', data.data.referencia_mysql);
      }
    }
  } catch (error) {
    console.log('No hay foto de perfil o error al cargar:', error);
  }
};

// Seleccionar y subir foto
const seleccionarFoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    mostrarMensaje('Por favor selecciona una imagen válida', 'error');
    return;
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    mostrarMensaje('La imagen no debe superar los 5MB', 'error');
    return;
  }

  try {
    // Mostrar loading
    guardando.value = true;
    mostrarMensaje('Subiendo foto...', 'success');

    // Convertir a Base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result;
        
        // Subir a MongoDB
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/fotos-perfil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            imagen_base64: base64,
            mime_type: file.type,
            nombre_original: file.name
          })
        });

        const data = await response.json();

        if (data.success) {
          fotoPerfil.value = base64;
          mostrarMensaje('Foto de perfil actualizada exitosamente', 'success');
          console.log('Referencia MySQL:', data.data.referencia_mysql);
        } else {
          mostrarMensaje(data.mensaje || 'Error al subir foto', 'error');
        }
      } catch (error) {
        console.error('Error al subir foto:', error);
        mostrarMensaje('Error al subir la foto', 'error');
      } finally {
        guardando.value = false;
      }
    };

    reader.onerror = () => {
      mostrarMensaje('Error al leer el archivo', 'error');
      guardando.value = false;
    };

    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error:', error);
    mostrarMensaje('Error al procesar la imagen', 'error');
    guardando.value = false;
  }
};
</script>

