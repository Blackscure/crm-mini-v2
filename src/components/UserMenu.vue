<script setup lang="ts">
import { ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()

// Logout function to clear token and navigate to login
const logout = () => {
  // Remove access_token from local storage
  localStorage.removeItem('access_token')

  // Redirect to the login page
  router.push('/login')
}
</script>

<template>
  <Menu as="div" class="relative">
    <MenuButton class="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white">
      <UserCircleIcon class="w-8 h-8" />
      <span>John Doe</span>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <MenuItem v-slot="{ active }">
          <a href="#" :class="[
            active ? 'bg-gray-100 dark:bg-gray-700' : '',
            'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
          ]">
            <UserCircleIcon class="w-5 h-5 mr-2" />
            Profile
          </a>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <a href="#" :class="[
            active ? 'bg-gray-100 dark:bg-gray-700' : '',
            'flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
          ]">
            <Cog6ToothIcon class="w-5 h-5 mr-2" />
            Settings
          </a>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <button @click="logout" :class="[
            active ? 'bg-gray-100 dark:bg-gray-700' : '',
            'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
          ]">
            <ArrowRightOnRectangleIcon class="w-5 h-5 mr-2" />
            Logout
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
