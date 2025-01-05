<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_by: string;
  created_at: string;
}

// Reactive references
const leads = ref<Lead[]>([]); // To store leads
const newLead = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  created_by: '',
}); // To add or edit a lead
const loading = ref(false); // Loading state

// Pagination state
const currentPage = ref(1);
const totalPages = ref(1);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
};

// Function to fetch leads from the API with pagination
const fetchLeads = async (page = 1) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    alert('No access token found. Please log in.');
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/apps/crm-mini/api/v1/lead/leads/?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = response.data;
    leads.value = responseData.data.data;
    currentPage.value = responseData.current_page;
    totalPages.value = responseData.pages;

    console.log('Fetched leads:', leads.value);
  } catch (error) {
    console.error('Error fetching leads:', error);
    alert('Failed to fetch leads. Please check the token and API.');
  } finally {
    loading.value = false;
  }
};

// Function to add or edit a lead
const saveLead = async () => {
  const token = localStorage.getItem('access_token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user ? user.id : null;

  if (!token || !userId) {
    alert('You must be logged in to add or edit a lead.');
    return;
  }

  loading.value = true;
  try {
    let response;
    if (newLead.value.id) {
      // Edit existing lead (PUT request)
      response = await axios.put(
        `http://127.0.0.1:8000/apps/crm-mini/api/v1/lead/leads/${newLead.value.id}/`,
        {
          name: newLead.value.name,
          email: newLead.value.email,
          phone: newLead.value.phone,
          created_by: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      // Add new lead (POST request)
      response = await axios.post(
        'http://127.0.0.1:8000/apps/crm-mini/api/v1/lead/leads/',
        {
          name: newLead.value.name,
          email: newLead.value.email,
          phone: newLead.value.phone,
          created_by: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Update leads list after saving
    if (newLead.value.id) {
      // Edit case
      const index = leads.value.findIndex((lead) => lead.id === newLead.value.id);
      if (index !== -1) {
        leads.value[index] = { ...response.data, created_by: userId, created_at: new Date().toISOString() };
      }
    } else {
      // Add case
      leads.value.push({
        id: response.data.id,
        ...newLead.value,
        created_by: userId,
        created_at: new Date().toISOString(),
      });
    }

    // Reset the form
    newLead.value = {
      id: null,
      name: '',
      email: '',
      phone: '',
      created_by: '',
    };

    fetchLeads(currentPage.value);

    console.log(newLead.value.id ? 'Lead updated successfully' : 'Lead created successfully:', response.data);
  } catch (error) {
    console.error('Error saving lead:', error);
    alert('Failed to save lead. Please try again.');
  } finally {
    loading.value = false;
  }
};

// Function to edit an existing lead
const editLead = (lead: Lead) => {
  newLead.value = { ...lead }; // Populate the form with the selected lead's data
};

// Function to delete a lead locally
const deleteLead = (id: number) => {
  leads.value = leads.value.filter((lead) => lead.id !== id);
};

// Fetch leads when the component is mounted
onMounted(() => fetchLeads());
</script>

<template>
  <div class="space-y-6">
    <!-- Add/Edit Lead Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ newLead.id ? 'Edit Lead' : 'Add New Lead' }}
      </h2>
      <form @submit.prevent="saveLead" class="space-y-4">
        <div>
          <label for="name" class="label">Name</label>
          <input
            id="name"
            v-model="newLead.name"
            type="text"
            required
            class="input"
          />
        </div>
        <div>
          <label for="email" class="label">Email</label>
          <input
            id="email"
            v-model="newLead.email"
            type="email"
            required
            class="input"
          />
        </div>
        <div>
          <label for="phone" class="label">Phone</label>
          <input
            id="phone"
            v-model="newLead.phone"
            type="tel"
            required
            class="input"
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading.value">
          <span v-if="loading.value">Loading...</span>
          <span v-else>{{ newLead.id ? 'Save Changes' : 'Add Lead' }}</span>
        </button>
      </form>
    </div>

    <!-- Leads List Table -->
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
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="lead in leads" :key="lead.id">
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ lead.created_by }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ formatDate(lead.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editLead(lead)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button @click="deleteLead(lead.id)" class="text-red-600 hover:text-red-900 ml-2">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination -->
        <div class="mt-4">
          <button @click="fetchLeads(currentPage.value - 1)" :disabled="currentPage.value === 1" class="btn btn-secondary">
            Previous
          </button>
          <span class="mx-2">{{ currentPage.value }} of {{ totalPages.value }}</span>
          <button @click="fetchLeads(currentPage.value + 1)" :disabled="currentPage.value === totalPages.value" class="btn btn-secondary">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
