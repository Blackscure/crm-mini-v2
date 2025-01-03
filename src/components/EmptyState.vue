<script setup lang="ts">
import { InboxIcon } from '@heroicons/vue/24/outline'

defineProps<{
  message: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
    <InboxIcon class="h-12 w-12 mb-4" />
    <p>{{ message }}</p>
  </div>
</template>