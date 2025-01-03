<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
const isLoading = ref(false)

const register = async () => {
  isLoading.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isLoading.value = false
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-200">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-200">First Name</label>
            <input
              id="firstName"
              type="text"
              required
              v-model="firstName"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-200">Last Name</label>
            <input
              id="lastName"
              type="text"
              required
              v-model="lastName"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-200">Password</label>
            <input
              id="password"
              type="password"
              required
              v-model="password"
              class="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <LoadingSpinner v-if="isLoading" />
          <span v-else>Register</span>
        </button>
        <div class="text-center">
          <router-link to="/login" class="text-indigo-400 hover:text-indigo-300">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>