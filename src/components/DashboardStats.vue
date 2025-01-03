<script setup lang="ts">
import { 
  UsersIcon, 
  PhoneIcon, 
  DocumentTextIcon, 
  BellIcon 
} from '@heroicons/vue/24/outline'

const stats = [
  { name: 'Total Leads', value: '120', icon: UsersIcon, change: '+12%', changeType: 'increase' },
  { name: 'Active Contacts', value: '85', icon: PhoneIcon, change: '+8%', changeType: 'increase' },
  { name: 'Notes Created', value: '45', icon: DocumentTextIcon, change: '+24%', changeType: 'increase' },
  { name: 'Pending Reminders', value: '15', icon: BellIcon, change: '-2%', changeType: 'decrease' }
]
</script>

<template>
  <div class="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
    <div v-for="item in stats" :key="item.name" 
         class="px-6 py-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ item.name }}</span>
        <component :is="item.icon" 
                  class="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <div class="flex items-center justify-between mt-4">
        <div>
          <h4 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ item.value }}
          </h4>
          <div class="flex items-center mt-2">
            <span :class="[
              'text-sm font-medium',
              item.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            ]">
              {{ item.change }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>