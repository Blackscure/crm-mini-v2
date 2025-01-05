<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitcher from '../components/ThemeSwitcher.vue'
import UserMenu from '../components/UserMenu.vue'
import DashboardStats from '../components/DashboardStats.vue'
import {
  HomeIcon,
  UserGroupIcon,
  PhoneIcon,
  DocumentTextIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const isSidebarOpen = ref(true)

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
  { name: 'Leads', icon: UserGroupIcon, to: '/dashboard/leads' },
  { name: 'Contacts', icon: PhoneIcon, to: '/dashboard/contacts' },
  { name: 'Notes', icon: DocumentTextIcon, to: '/dashboard/notes' },
  { name: 'Reminders', icon: BellIcon, to: '/dashboard/reminders' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200"
           :class="{ '-translate-x-full': !isSidebarOpen }">
      <div class="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
        <h1 class="text-xl font-bold text-gray-900 dark:text-white">CRM</h1>
        <ThemeSwitcher />
      </div>
      <nav class="mt-4">
        <router-link 
          v-for="item in navigation" 
          :key="item.name"
          :to="item.to"
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'bg-gray-200 dark:bg-gray-700 font-bold': $route.path === item.to }">
          <component :is="item.icon" class="w-5 h-5 mr-2" />
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="ml-64">
      <!-- Top navigation -->
      <div class="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-end px-4">
        <UserMenu />
      </div>

      <main class="p-8">
        <DashboardStats v-if="$route.path === '/dashboard'" />
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
