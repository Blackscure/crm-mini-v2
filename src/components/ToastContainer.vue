<script setup lang="ts">
import { TransitionGroup } from 'vue'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircleIcon
    case 'error': return XCircleIcon
    default: return InformationCircleIcon
  }
}

const getToastClass = (type: string) => {
  switch (type) {
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    default: return 'bg-blue-500'
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <TransitionGroup 
      name="toast"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[getToastClass(toast.type), 'text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 min-w-[200px]']"
      >
        <component :is="getIcon(toast.type)" class="h-5 w-5" />
        <span>{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="ml-auto">
          <XCircleIcon class="h-5 w-5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>