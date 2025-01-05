<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { EyeIcon, EyeSlashIcon, AtSymbolIcon } from '@heroicons/vue/24/outline'; // Import the email (At) icon

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false); // Track password visibility

const login = async () => {
  isLoading.value = true;
  errorMessage.value = ''; // Clear previous error message

  try {
    const response = await fetch('http://127.0.0.1:8000/apps/crm-mini/api/v1/authentication/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to log in. Please check your credentials.');
    }

    const data = await response.json();
    console.log('Login successful:', data);

    // Save access token in local storage
    localStorage.setItem('access_token', data.data.access_token);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    // Navigate to the dashboard
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred during login.';
    console.error('Login error:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="login">
        <div class="rounded-md shadow-sm -space-y-px">
          <!-- Email input with icon -->
          <div class="relative">
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              v-model="email"
              class="appearance-none rounded-none relative block w-full pl-10 pr-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
            <AtSymbolIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" /> <!-- Email icon -->
          </div>

          <!-- Password input with icon inside the field -->
          <div class="relative">
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              required
              v-model="password"
              class="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
            >
              <span v-if="showPassword">
                <EyeSlashIcon class="w-6 h-6" /> <!-- Eye Slash icon -->
              </span>
              <span v-else>
                <EyeIcon class="w-6 h-6" /> <!-- Eye icon -->
              </span>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            :class="{
              'bg-indigo-600': !isLoading,
              'bg-indigo-400 cursor-wait': isLoading,
            }"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4V2m0 20v-2M4.93 4.93l1.41 1.41M19.07 19.07l1.41-1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M19.07 4.93l1.41 1.41"
                />
              </svg>
              Loading...
            </span>
            <span v-else>Sign in</span>
          </button>
        </div>

        <div class="text-center">
          <router-link to="/register" class="text-indigo-400 hover:text-indigo-300">
            Need an account? Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
