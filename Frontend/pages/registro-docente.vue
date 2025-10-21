<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="flex items-center justify-center mb-3">
          <img src="/images/Dc_img.png" alt="Docente" class="w-16 h-16" />
        </div>
        <h1 class="text-3xl font-bold text-blue-700 mb-1">Registro de Docente - Paso {{ pasoActual }} de 2</h1>
        <p class="text-sm text-blue-600 font-medium">
          {{ pasoActual === 1 ? 'Información Personal' : 'Información Académica' }}
        </p>
        
        <!-- Indicador de progreso -->
        <div class="flex items-center justify-center gap-2 mt-4 max-w-md mx-auto">
          <div class="flex-1 h-2 bg-blue-600 rounded-full"></div>
          <div class="flex-1 h-2 rounded-full" :class="pasoActual >= 2 ? 'bg-blue-600' : 'bg-gray-300'"></div>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-lg shadow-xl p-6">
        <form @submit.prevent="pasoActual === 1 ? siguientePaso() : handleRegistro()">
          <!-- PASO 1: INFORMACIÓN PERSONAL -->
          <div v-if="pasoActual === 1" class="mb-4">
            <h3 class="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
              Información Personal <span class="text-red-500">*</span>
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nombres"
                  type="text"
                  placeholder="Tu nombre"
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                  title="Solo se permiten letras y espacios"
                  @keypress="soloLetras"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <!-- Apellido -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Apellido <span class="text-red-500">*</span></label>
                <input
                  v-model="form.apellidos"
                  type="text"
                  placeholder="Tu apellido"
                  pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                  title="Solo se permiten letras y espacios"
                  @keypress="soloLetras"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-gray-700 font-medium mb-2">Usuario <span class="text-red-500">*</span></label>
              <input
                v-model="form.usuario_nombre"
                type="text"
                placeholder="Nombre de usuario único"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div class="mt-4">
              <!-- Email Personal -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Email Personal <span class="text-red-500">*</span></label>
                <input
                  v-model="form.email_personal"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <!-- Contraseña -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Contraseña <span class="text-red-500">*</span></label>
                <input
                  v-model="form.clave"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="6"
                />
              </div>

              <!-- Confirmar Contraseña -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Confirmar Contraseña <span class="text-red-500">*</span></label>
                <input
                  v-model="form.confirmar_clave"
                  type="password"
                  placeholder="Repite la contraseña"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  minlength="6"
                />
              </div>
            </div>
          </div>

          <!-- Campos Opcionales -->
          <div class="mb-4">
            <h3 class="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-200">
              Información Adicional (Opcional)
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Teléfono -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
                <input
                  v-model="form.telefono"
                  type="tel"
                  pattern="[0-9]{8}"
                  maxlength="8"
                  placeholder="12345678"
                  title="Debe contener exactamente 8 dígitos"
                  @keypress="soloNumeros"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <!-- Fecha de Nacimiento -->
              <div>
                <label class="block text-gray-700 font-medium mb-2">Fecha de Nacimiento</label>
                <input
                  v-model="form.fecha_nacimiento"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <!-- PASO 2: INFORMACIÓN ACADÉMICA -->
          <div v-if="pasoActual === 2">
            <!-- Mensaje informativo -->
            <div class="mb-4 p-4 bg-blue-100 rounded-lg border border-blue-300">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-blue-800">
                  Tu email académico debe ser el correo oficial de tu institución educativa.
                </p>
              </div>
            </div>

            <!-- Email Académico -->
            <div class="mb-4">
              <label class="block text-gray-700 font-medium mb-2">Email Académico Institucional <span class="text-red-500">*</span></label>
              <input
                v-model="form.email_academico"
                type="email"
                placeholder="profesor@institucion.edu"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p class="text-xs text-gray-500 mt-1">
                Debe ser tu correo oficial de la institución
              </p>
            </div>

            <!-- Centro Educativo -->
            <div class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 class="text-base font-semibold text-gray-800 mb-3">Centro Educativo</h3>
            
            <div class="mb-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  v-model="tipoCentro"
                  value="existente"
                  class="w-4 h-4 text-blue-600"
                />
                <span class="text-gray-700 font-medium">Seleccionar centro educativo existente</span>
              </label>
            </div>

            <div v-if="tipoCentro === 'existente'" class="mb-4">
              <select
                v-model="form.id_centro_educativo"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option :value="null">Selecciona un centro</option>
                <option v-for="centro in centros" :key="centro.ID" :value="centro.ID">
                  {{ centro.Nombre }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  v-model="tipoCentro"
                  value="nuevo"
                  class="w-4 h-4 text-blue-600"
                />
                <span class="text-gray-700 font-medium">Registrar nuevo centro educativo</span>
              </label>
            </div>

            <div v-if="tipoCentro === 'nuevo'" class="space-y-3">
              <div>
                <label class="block text-gray-700 font-medium mb-2">Nombre del Centro</label>
                <input
                  v-model="nuevoCentro.nombre"
                  type="text"
                  placeholder="Universidad Nacional Autónoma..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Ciudad</label>
                  <input
                    v-model="nuevoCentro.ciudad"
                    type="text"
                    placeholder="Tegucigalpa"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Teléfono</label>
                  <input
                    v-model="nuevoCentro.telefono"
                    type="tel"
                    placeholder="+504 0000-0000"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label class="block text-gray-700 font-medium mb-2">Dirección</label>
                <input
                  v-model="nuevoCentro.direccion"
                  type="text"
                  placeholder="Dirección completa"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">Email de Contacto</label>
                  <input
                    v-model="nuevoCentro.email"
                    type="email"
                    placeholder="info@universidad.edu"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    Dominio Email Institucional
                    <span class="text-xs text-gray-500">(opcional)</span>
                  </label>
                  <input
                    v-model="nuevoCentro.dominio_email"
                    type="text"
                    placeholder="@unitec.edu"
                    pattern="@[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}"
                    title="Debe iniciar con @ (ej: @unitec.edu)"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Ej: @unitec.edu
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>

          <!-- Mensaje de Error/Éxito -->
          <div v-if="mensaje" class="mb-4 p-3 rounded-lg" :class="mensajeTipo === 'error' ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'">
            {{ mensaje }}
          </div>

          <!-- Botones -->
          <div class="flex space-x-4">
            <button
              type="button"
              @click="pasoActual === 1 ? volver() : pasoAnterior()"
              class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-200"
            >
              {{ pasoActual === 1 ? 'Cancelar' : 'Atrás' }}
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="loading">Registrando...</span>
              <span v-else>{{ pasoActual === 1 ? 'Siguiente' : 'Registrarme' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
});

const form = ref({
  nombres: '',
  apellidos: '',
  usuario_nombre: '',
  clave: '',
  confirmar_clave: '',
  email_personal: '',
  email_academico: '',
  telefono: '',
  fecha_nacimiento: '',
  id_centro_educativo: null
});

const nuevoCentro = ref({
  nombre: '',
  direccion: '',
  ciudad: '',
  telefono: '',
  email: '',
  dominio_email: ''
});

const tipoCentro = ref('existente');
const centros = ref([]);
const loading = ref(false);
const mensaje = ref('');
const mensajeTipo = ref('');
const pasoActual = ref(1); // Control de pasos (1 = Personal, 2 = Académico)

// Cargar centros educativos al montar
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/centros/publico');
    const data = await response.json();
    if (data.success) {
      centros.value = data.data;
    }
  } catch (error) {
    console.error('Error al cargar centros:', error);
  }
});

const volver = () => {
  navigateTo('/');
};

const siguientePaso = () => {
  // Validar paso 1 antes de continuar
  if (!form.value.nombres || !form.value.apellidos) {
    mensaje.value = 'Nombre y apellido son requeridos';
    mensajeTipo.value = 'error';
    return;
  }
  if (!form.value.usuario_nombre) {
    mensaje.value = 'El nombre de usuario es requerido';
    mensajeTipo.value = 'error';
    return;
  }
  if (!form.value.email_personal) {
    mensaje.value = 'El email personal es requerido';
    mensajeTipo.value = 'error';
    return;
  }
  if (!form.value.clave || form.value.clave.length < 6) {
    mensaje.value = 'La contraseña debe tener al menos 6 caracteres';
    mensajeTipo.value = 'error';
    return;
  }
  if (form.value.clave !== form.value.confirmar_clave) {
    mensaje.value = 'Las contraseñas no coinciden';
    mensajeTipo.value = 'error';
    return;
  }

  // Todo válido, avanzar al paso 2
  pasoActual.value = 2;
  mensaje.value = '';
};

const pasoAnterior = () => {
  pasoActual.value = 1;
  mensaje.value = '';
};

const handleRegistro = async () => {
  loading.value = true;
  mensaje.value = '';

  try {
    // Validar email académico
    if (!form.value.email_academico) {
      mensaje.value = 'El email académico es requerido';
      mensajeTipo.value = 'error';
      loading.value = false;
      return;
    }

    // Validar formato de email académico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.value.email_academico)) {
      mensaje.value = 'El email académico no es válido';
      mensajeTipo.value = 'error';
      loading.value = false;
      return;
    }

    // Validar que se seleccione un centro (si es existente)
    if (tipoCentro.value === 'existente' && !form.value.id_centro_educativo) {
      mensaje.value = 'Debes seleccionar un centro educativo';
      mensajeTipo.value = 'error';
      loading.value = false;
      return;
    }

    // Si se va a crear un nuevo centro, validar que tenga nombre
    if (tipoCentro.value === 'nuevo' && !nuevoCentro.value.nombre) {
      mensaje.value = 'Debes proporcionar el nombre del centro educativo';
      mensajeTipo.value = 'error';
      loading.value = false;
      return;
    }

    // Preparar datos para enviar (rol 4 = Docente)
    const datosRegistro = {
      nombres: form.value.nombres,
      apellidos: form.value.apellidos,
      usuario_nombre: form.value.usuario_nombre,
      clave: form.value.clave,
      id_rol: 4, // Docente
      email_personal: form.value.email_personal || null,
      email_academico: form.value.email_academico || null,
      telefono: form.value.telefono || null,
      fecha_nacimiento: form.value.fecha_nacimiento || null,
      es_estudiante: false
    };

    // Si seleccionó un centro existente
    if (tipoCentro.value === 'existente' && form.value.id_centro_educativo) {
      datosRegistro.id_centro_educativo = form.value.id_centro_educativo;
    }

    // Si va a crear un nuevo centro
    if (tipoCentro.value === 'nuevo') {
      datosRegistro.nuevo_centro = {
        nombre: nuevoCentro.value.nombre,
        direccion: nuevoCentro.value.direccion || null,
        ciudad: nuevoCentro.value.ciudad || null,
        telefono: nuevoCentro.value.telefono || null,
        email: nuevoCentro.value.email || null,
        dominio_email: nuevoCentro.value.dominio_email || null
      };
    }

    const response = await fetch('http://localhost:3000/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosRegistro)
    });

    const data = await response.json();

    if (data.success) {
      // Mensaje especial para docentes (requieren aprobación)
      const mensajeExito = data.data.requiere_aprobacion 
        ? '¡Registro exitoso! Tu cuenta será revisada por un administrador. Te notificaremos cuando sea aprobada.'
        : '¡Registro exitoso! Redirigiendo al login...';
      
      mensaje.value = mensajeExito;
      mensajeTipo.value = 'success';
      
      // Limpiar formulario
      form.value = {
        nombres: '',
        apellidos: '',
        usuario_nombre: '',
        clave: '',
        confirmar_clave: '',
        email_personal: '',
        email_academico: '',
        telefono: '',
        fecha_nacimiento: '',
        id_centro_educativo: null
      };
      nuevoCentro.value = {
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        email: '',
        dominio_email: ''
      };

      // Redirigir después de 3 segundos (más tiempo para leer el mensaje)
      setTimeout(() => {
        navigateTo('/');
      }, 3000);
    } else {
      // Convertir mensaje técnico a amigable
      const mensajesAmigables = {
        'El nombre de usuario ya está en uso': 'Este usuario ya existe. Elige otro nombre de usuario.',
        'El email personal ya está registrado': 'Este email ya está registrado. Usa otro email.',
        'El email académico es requerido para docentes': 'Debes proporcionar un email académico institucional.',
        'El email académico no corresponde al dominio institucional del centro educativo seleccionado': 'El email académico no es válido para el centro educativo seleccionado. Verifica que sea tu correo institucional oficial.',
        'Nombre, apellido, usuario, contraseña, email personal y rol son requeridos': 'Por favor completa todos los campos obligatorios.',
        'Debes proporcionar el nombre del centro educativo': 'Si vas a crear un centro nuevo, debes proporcionar su nombre.',
        'Error al crear el centro educativo': 'No se pudo crear el centro educativo. Verifica los datos.',
      };
      
      const mensajeOriginal = data.mensaje || 'Error al registrar usuario';
      mensaje.value = mensajesAmigables[mensajeOriginal] || mensajeOriginal;
      mensajeTipo.value = 'error';
    }
  } catch (error) {
    mensaje.value = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    mensajeTipo.value = 'error';
  } finally {
    loading.value = false;
  }
};

// Funciones para validar entrada de teclado
const soloLetras = (event) => {
  const char = String.fromCharCode(event.keyCode);
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
  if (!regex.test(char)) {
    event.preventDefault();
  }
};

const soloNumeros = (event) => {
  const char = String.fromCharCode(event.keyCode);
  if (!/^[0-9]$/.test(char)) {
    event.preventDefault();
  }
};
</script>

