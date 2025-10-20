import { ref, onMounted, onUnmounted } from 'vue'

// useNotifications v1.2 - Added timestamp info
export const useNotifications = () => {
  const pendingCount = ref(0)
  const isLoading = ref(false)
  const error = ref(null)
  const pollingInterval = ref(null)
  const notificationData = ref({
    pendientes: 0,
    mas_antigua: null,
    mas_reciente: null
  })

  // Función para obtener el conteo de docentes pendientes
  const fetchPendingCount = async () => {
    try {
      isLoading.value = true
      error.value = null

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await $fetch('http://localhost:3000/api/aprobaciones/conteo-pendientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.success) {
        pendingCount.value = response.data.pendientes
        notificationData.value = {
          pendientes: response.data.pendientes,
          mas_antigua: response.data.mas_antigua,
          mas_reciente: response.data.mas_reciente
        }
      } else {
        throw new Error(response.mensaje || 'Error al obtener conteo')
      }
    } catch (err) {
      console.error('Error al obtener conteo de pendientes:', err)
      
      // No mostrar error si es 403 (no es admin) o si no hay conexión
      if (err.statusCode === 403) {
        // Usuario no es admin, no mostrar error
        pendingCount.value = 0
        return
      }
      
      if (err.statusCode === 401) {
        // Token expirado o inválido
        error.value = 'Sesión expirada'
        return
      }
      
      if (err.name === 'FetchError' || err.message.includes('fetch')) {
        // Error de conexión
        error.value = 'Sin conexión al servidor'
        return
      }
      
      error.value = err.message || 'Error al obtener notificaciones'
    } finally {
      isLoading.value = false
    }
  }

  // Función para iniciar el polling
  const startPolling = (intervalMs = 30000) => { // 30 segundos por defecto
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
    }

    // Ejecutar inmediatamente
    fetchPendingCount()

    // Configurar polling
    pollingInterval.value = setInterval(() => {
      fetchPendingCount()
    }, intervalMs)
  }

  // Función para detener el polling
  const stopPolling = () => {
    if (pollingInterval.value) {
      clearInterval(pollingInterval.value)
      pollingInterval.value = null
    }
  }

  // Función para mostrar notificación del navegador
  const showBrowserNotification = (title, options = {}) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        })
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, {
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              ...options
            })
          }
        })
      }
    }
  }

  // Función para verificar si hay nuevas solicitudes
  const checkForNewRequests = (previousCount) => {
    if (pendingCount.value > previousCount) {
      const newRequests = pendingCount.value - previousCount
      showBrowserNotification(
        'Nuevas solicitudes de docentes',
        {
          body: `${newRequests} nuevo${newRequests > 1 ? 's' : ''} docente${newRequests > 1 ? 's' : ''} esperando aprobación`,
          tag: 'new-teacher-requests'
        }
      )
    }
  }

  // Limpiar al desmontar
  onUnmounted(() => {
    stopPolling()
  })

  return {
    pendingCount,
    isLoading,
    error,
    notificationData,
    fetchPendingCount,
    startPolling,
    stopPolling,
    showBrowserNotification,
    checkForNewRequests
  }
}
