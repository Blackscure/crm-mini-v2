<script setup lang="ts">
defineProps<{
  fullScreen?: boolean
}>()
</script>

<template>
  <div :class="[
    'flex items-center justify-center',
    fullScreen ? 'fixed inset-0 bg-gray-900/50 z-50' : 'p-4'
  ]">
    <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
  </div>
</template>