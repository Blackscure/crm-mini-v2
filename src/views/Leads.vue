<script setup lang="ts">
import { ref } from 'vue'

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  createdBy: string
}

const leads = ref<Lead[]>([])
const newLead = ref({
  name: '',
  email: '',
  phone: '',
  createdBy: ''
})

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
]

const addLead = () => {
  leads.value.push({
    id: Date.now(),
    ...newLead.value
  })
  newLead.value = {
    name: '',
    email: '',
    phone: '',
    createdBy: ''
  }
}

const deleteLead = (id: number) => {
  leads.value = leads.value.filter(lead => lead.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Lead</h2>
      <form @submit.prevent="addLead" class="space-y-4">
        <div>
          <label for="name" class="label">Name</label>
          <input id="name" v-model="newLead.name" type="text" required class="input" />
        </div>
        <div>
          <label for="email" class="label">Email</label>
          <input id="email" v-model="newLead.email" type="email" required class="input" />
        </div>
        <div>
          <label for="phone" class="label">Phone</label>
          <input id="phone" v-model="newLead.phone" type="tel" required class="input" />
        </div>
        <div>
          <label for="createdBy" class="label">Created By</label>
          <select id="createdBy" v-model="newLead.createdBy" required class="input">
            <option value="">Select user</option>
            <option v-for="user in users" :key="user.id" :value="user.name">
              {{ user.name }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Add Lead</button>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Leads</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="lead in leads" :key="lead.id">
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.createdBy }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="deleteLead(lead.id)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>