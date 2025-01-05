<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../composables/useToast';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
import axios from 'axios';

interface Contact {
  id: number;
  leadId: number;
  name: string;
  email: string;
  phone: string;
}

const { showToast } = useToast();
const contacts = ref<Contact[]>([]);
const newContact = ref({
  leadId: 0,
  name: '',
  email: '',
  phone: '',
});

const editingContact = ref<Contact | null>(null);
const isEditing = computed(() => !!editingContact.value);
const isLoading = ref(false);
const isSaving = ref(false);

const fetchContacts = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No access token found. Please log in.');
      return;
    }

    const response = await axios.get(
      `http://127.0.0.1:8000/api/contacts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    contacts.value = response.data.data;
  } catch (error) {
    showToast('Failed to load contacts', 'error');
  } finally {
    isLoading.value = false;
  }
};

const addContact = async () => {
  isSaving.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(
      `http://127.0.0.1:8000/api/contacts`,
      newContact.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    contacts.value.push(response.data);
    showToast('Contact added successfully');
    resetForm();
  } catch (error) {
    showToast('Failed to add contact', 'error');
  } finally {
    isSaving.value = false;
  }
};

const updateContact = async () => {
  if (!editingContact.value) return;

  isSaving.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.put(
      `http://127.0.0.1:8000/api/contacts/${editingContact.value.id}`,
      newContact.value,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const index = contacts.value.findIndex(
      (contact) => contact.id === editingContact.value.id
    );
    if (index !== -1) {
      contacts.value[index] = response.data;
    }
    showToast('Contact updated successfully');
    resetForm();
  } catch (error) {
    showToast('Failed to update contact', 'error');
  } finally {
    isSaving.value = false;
  }
};

const deleteContact = async (id: number) => {
  try {
    const token = localStorage.getItem('access_token');
    await axios.delete(`http://127.0.0.1:8000/api/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    contacts.value = contacts.value.filter((contact) => contact.id !== id);
    showToast('Contact deleted successfully');
  } catch (error) {
    showToast('Failed to delete contact', 'error');
  }
};

const resetForm = () => {
  newContact.value = { leadId: 0, name: '', email: '', phone: '' };
  editingContact.value = null;
};

// Fetch contacts when the component is mounted
onMounted(fetchContacts);
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Add/Edit Contact Form -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ isEditing ? 'Edit Contact' : 'Add New Contact' }}
      </h2>
      <form @submit.prevent="isEditing ? updateContact() : addContact()" class="space-y-4">
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
        <div class="flex space-x-4">
          <button 
            type="submit" 
            class="btn btn-primary flex items-center"
            :disabled="isSaving"
          >
            <LoadingSpinner v-if="isSaving" class="mr-2" />
            {{ isEditing ? 'Update Contact' : 'Add Contact' }}
          </button>
          <button 
            v-if="isEditing" 
            type="button" 
            @click="resetForm"
            class="btn bg-gray-500 text-white hover:bg-gray-600"
            :disabled="isSaving"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Contacts List -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contacts</h2>
        <LoadingSpinner v-if="isLoading" />
        <EmptyState v-else-if="contacts.length === 0" message="No contacts found. Add your first contact above." />
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="contact in contacts" :key="contact.id">
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">{{ contact.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                  <button @click="editContact(contact)" class="text-blue-500 hover:text-blue-700">
                    <PencilIcon class="h-5 w-5 inline-block mr-2" />
                    Edit
                  </button>
                  <button @click="deleteContact(contact.id)" class="text-red-500 hover:text-red-700">
                    <TrashIcon class="h-5 w-5 inline-block mr-2" />
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
