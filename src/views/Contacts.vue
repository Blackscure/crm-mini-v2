<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead: string;
  created_at: string;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_by: string;
  created_at: string;
}

const contacts = ref<Contact[]>([]);
const newContact = ref<Contact>({
  id: 0,
  name: '',
  email: '',
  phone: '',
  lead: '',
  created_at: '',
});

const leads = ref<Lead[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// Fetch leads from localStorage
const fetchLeadsFromLocalStorage = () => {
  const leadsData = localStorage.getItem('leads');
  if (leadsData) {
    leads.value = JSON.parse(leadsData);
  }
};



const fetchContacts = async (page = 1) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    alert('No access token found. Please log in.');
    return;
  }

  // Set loading state
  loading.value = true;

  try {
    // Make the API call
    const response = await axios.get(
      `http://127.0.0.1:8000/apps/crm-mini/api/v1/contact/contacts/?page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Authorization header
        },
      }
    );

    // Parse response data
    const responseData = response.data;

    // Ensure response data has the expected structure
    if (responseData && responseData.data && Array.isArray(responseData.data)) {
      contacts.value = responseData.data; // Set contacts data
      currentPage.value = responseData.current_page || 1;
      totalPages.value = responseData.pages || 1;

      console.log('Fetched contacts:', contacts.value); // Debug log
    } else {
      console.error('Unexpected response structure:', responseData);
      alert('Failed to fetch contacts. Please try again.');
    }

  } catch (error) {
    console.error('Error fetching contacts:', error);
    alert('An error occurred while fetching contacts. Please check your connection and try again.');
  } finally {
    // Reset loading state
    loading.value = false;
  }
};




const saveContact = async () => {
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
    const payload = {
      name: newContact.value.name,
      email: newContact.value.email,
      phone: newContact.value.phone,
      lead: newContact.value.lead, // Use the selected lead ID
    };

    if (newContact.value.id) {
      response = await axios.put(
        `http://127.0.0.1:8000/apps/crm-mini/api/v1/contact/contacts/${newContact.value.id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } else {
      response = await axios.post(
        'http://127.0.0.1:8000/apps/crm-mini/api/v1/contact/contacts/',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (newContact.value.id) {
      const index = contacts.value.findIndex((contact) => contact.id === newContact.value.id);
      if (index !== -1) {
        contacts.value[index] = { ...response.data, created_by: userId, created_at: new Date().toISOString() };
      }
    } else {
      contacts.value.push({
        id: response.data.id,
        ...newContact.value,
        lead: newContact.value.lead, // Set the lead dynamically
        created_at: new Date().toISOString(),
      });
    }

    // Reset the form
    newContact.value = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      lead: '',
      created_at: '',
    };

    fetchContacts(currentPage.value);
  } catch (error) {
    alert('Failed to save contact. Please try again.');
  } finally {
    loading.value = false;
  }
};

const editContact = (contact: Contact) => {
  newContact.value = { ...contact };
};

const deleteContact = (id: number) => {
  contacts.value = contacts.value.filter((contact) => contact.id !== id);
};

onMounted(() => {
  fetchContacts();
  fetchLeadsFromLocalStorage(); 
});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ newContact.id ? 'Edit Contact' : 'Add New Contact' }}
      </h2>
      <form @submit.prevent="saveContact" class="space-y-4">
        <div>
          <label for="name" class="label">Name</label>
          <input
            id="name"
            v-model="newContact.name"
            type="text"
            required
            class="input"
          />
        </div>
        <div>
          <label for="email" class="label">Email</label>
          <input
            id="email"
            v-model="newContact.email"
            type="email"
            required
            class="input"
          />
        </div>
        <div>
          <label for="phone" class="label">Phone</label>
          <input
            id="phone"
            v-model="newContact.phone"
            type="tel"
            required
            class="input"
          />
        </div>
        <div>
          <label for="lead" class="label">Lead</label>
          <select
            id="lead"
            v-model="newContact.lead"
            class="input"
            required
          >
            <option v-for="lead in leads" :key="lead.id" :value="lead.id">
              {{ lead.name }}
            </option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading.value">
          <span v-if="loading.value">Loading...</span>
          <span v-else>{{ newContact.id ? 'Save Changes' : 'Add Lead' }}</span>
        </button>
      </form>
    </div>

    <!-- Contacts Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contacts</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="contact in contacts" :key="contact.id">
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  {{ contact.lead?.name || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ created_at }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  <button @click="editContact(contact)" class="text-blue-500 hover:text-blue-700">Edit</button>
                  <button @click="deleteContact(contact.id)" class="ml-2 text-red-500 hover:text-red-700">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between p-6">
      <button
        @click="fetchContacts(currentPage.value - 1)"
        :disabled="currentPage.value === 1"
        class="btn btn-secondary"
      >
        Previous
      </button>
      <button
        @click="fetchContacts(currentPage.value + 1)"
        :disabled="currentPage.value === totalPages.value"
        class="btn btn-secondary"
      >
        Next
      </button>
    </div>
  </div>
</template>

