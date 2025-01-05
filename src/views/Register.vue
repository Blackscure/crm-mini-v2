<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from '../composables/useToast'

const router = useRouter()


// Define form data variables
const email = ref('')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
const isLoading = ref(false)
const isToastVisible = ref(false)
const toastMessage = ref('')

// Register function to handle form submission
const register = async () => {
  isLoading.value = true;

  try {
    // Make the POST request
    const response = await axios.post(
      'http://127.0.0.1:8000/apps/crm-mini/api/v1/authentication/register/',
      {
        email: email.value,
        first_name: firstName.value,
        last_name: lastName.value,
        password: password.value,
      }
    );

    // Log the full response for debugging
    console.log('API Response:', response);

    // Extract the access_token
    const accessToken = response.data?.data?.access_token;
    console.log('Extracted Access Token:', accessToken);

    if (accessToken) {
      // Save to localStorage
      localStorage.setItem('access_token', accessToken);

      // Confirm it's saved
      console.log('Access token saved in localStorage:', localStorage.getItem('access_token'));
    } else {
      console.error('Access token is missing from the response.');
    }
  } catch (error) {
    console.error('Registration Error:', error);
  } finally {
    isLoading.value = false;
  }
};





// Toast handling
const addToast = (message, type) => {
  toastMessage.value = message
  isToastVisible.value = true
  setTimeout(() => {
    isToastVisible.value = false
  }, 3000)
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
          <!-- Email input field -->
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

          <!-- First Name input field -->
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

          <!-- Last Name input field -->
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

          <!-- Password input field -->
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

        <!-- Submit Button -->
        <button 
          type="submit" 
          :disabled="isLoading" 
          :class="{
            'bg-indigo-600': !isLoading,
            'bg-indigo-400 cursor-wait': isLoading,
          }"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <!-- Show a loading spinner inside button while loading -->
          <span v-if="isLoading" class="flex items-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4V2m0 20v-2M4.93 4.93l1.41 1.41M19.07 19.07l1.41-1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M19.07 4.93l1.41 1.41" />
            </svg>
            Loading...
          </span>
          <span v-else>Register</span>
        </button>

        <!-- Link to Login page if the user already has an account -->
        <div class="text-center">
          <router-link to="/login" class="text-indigo-400 hover:text-indigo-300">
            Already have an account? Sign in
          </router-link>
        </div>
      </form>
    </div>

    <!-- Toast component for showing success or failure messages -->
    <Toast v-if="isToastVisible" :message="toastMessage" :duration="3000" />
  </div>
</template>

<style scoped>
/* Optional: You can customize your styles further */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
