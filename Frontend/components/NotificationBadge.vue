<template>
  <!-- NotificationBadge v1.2 - Clean version -->
  <div class="relative">
    <!-- Botón de notificaciones -->
    <button
      @click="toggleNotifications"
      class="relative p-1 text-gray-600 hover:text-primary-600 transition-colors"
      :class="{ 'text-primary-600': showNotifications }"
    >
      <!-- Icono de campana -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4.5 19.5L19.5 4.5M15 17V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6z"/>
      </svg>
      
      <!-- Badge de conteo -->
      <span
        v-if="pendingCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold animate-pulse"
      >
        {{ pendingCount > 9 ? '9+' : pendingCount }}
      </span>
    </button>

    <!-- Panel de notificaciones -->
    <div
      v-if="showNotifications"
      class="fixed top-16 right-4 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style="max-height: calc(100vh - 120px); overflow-y: auto; max-width: calc(100vw - 2rem);"
    >
      <!-- Header -->
      <div class="px-3 py-2 border-b border-gray-200 bg-primary-50">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-800">Notificaciones</h3>
          <button
            @click="showNotifications = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido -->
      <div class="max-h-96 overflow-y-auto">
        <!-- Loading -->
        <div v-if="isLoading" class="p-4 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="text-sm text-gray-500 mt-2">Cargando...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="p-4 text-center">
          <div class="text-red-500 mb-2">
            <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <!-- Sin notificaciones -->
        <div v-else-if="pendingCount === 0" class="p-4 text-center">
          <div class="text-green-500 mb-2">
            <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <p class="text-gray-600 font-medium text-sm">¡Todo al día!</p>
          <p class="text-xs text-gray-500">No hay docentes pendientes</p>
        </div>

        <!-- Con notificaciones -->
        <div v-else class="p-3">
          <!-- Notificación más reciente -->
          <div v-if="notificationData.mas_reciente" class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
            <div class="flex items-start">
              <div class="text-blue-500 mr-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-blue-800 text-sm">Nueva solicitud</h4>
                <p class="text-xs text-blue-700 mt-1">
                  Docente registrado {{ getTimeAgo(notificationData.mas_reciente) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Resumen de pendientes -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
            <div class="flex items-start">
              <div class="text-yellow-500 mr-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-semibold text-yellow-800 text-sm">{{ pendingCount }} pendiente{{ pendingCount > 1 ? 's' : '' }}</h4>
                <p class="text-xs text-yellow-700 mt-1">
                  <span v-if="notificationData.mas_antigua">
                    Más antigua: {{ getTimeAgo(notificationData.mas_antigua) }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Botón para ir a aprobaciones -->
          <button
            @click="goToApprovals"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm"
          >
            Ver Solicitudes
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-3 py-2 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>Hace {{ lastUpdate }}</span>
          <button
            @click="refreshNotifications"
            class="text-primary-600 hover:text-primary-700 font-medium"
            :disabled="isLoading"
          >
            ↻
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para cerrar al hacer click fuera -->
    <div
      v-if="showNotifications"
      @click="showNotifications = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNotifications } from '~/composables/useNotifications'

// Props
const props = defineProps({
  autoStart: {
    type: Boolean,
    default: true
  },
  pollingInterval: {
    type: Number,
    default: 30000 // 30 segundos
  }
})

// Composables
const { 
  pendingCount, 
  isLoading, 
  error, 
  notificationData,
  fetchPendingCount, 
  startPolling, 
  stopPolling 
} = useNotifications()

// Estado local
const showNotifications = ref(false)
const lastUpdateTime = ref(new Date())

// Computed
const lastUpdate = computed(() => {
  const now = new Date()
  const diff = Math.floor((now - lastUpdateTime.value) / 1000)
  
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  return `${Math.floor(diff / 3600)}h`
})

// Métodos
const getTimeAgo = (dateString) => {
  if (!dateString) return 'desconocido'
  
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d`
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchPendingCount()
  }
}

const goToApprovals = () => {
  showNotifications.value = false
  navigateTo('/aprobar-docentes')
}

const refreshNotifications = async () => {
  await fetchPendingCount()
  lastUpdateTime.value = new Date()
}

// Lifecycle
onMounted(() => {
  if (props.autoStart) {
    startPolling(props.pollingInterval)
  }
})

onUnmounted(() => {
  stopPolling()
})
</script>