import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  const toasts = ref<Toast[]>([])

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      removeToast(id)
    }, 3000)
  }

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(toast => toast.id !== id)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}