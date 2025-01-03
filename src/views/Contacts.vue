<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLeads } from '../composables/useLeads'
import { useToast } from '../composables/useToast'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'

interface Contact {
  id: number
  leadId: number
  name: string
  email: string
  phone: string
}

const { leads } = useLeads()
const { showToast } = useToast()
const contacts = ref<Contact[]>([])
const editingContact = ref<Contact | null>(null)
const isEditing = computed(() => !!editingContact.value)
const isLoading = ref(false)
const isSaving = ref(false)

const newContact = ref({
  leadId: 0,
  name: '',
  email: '',
  phone: ''
})

// Simulate API call
const fetchContacts = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Simulated data
    contacts.value = []
  } catch (error) {
    showToast('Failed to load contacts', 'error')
  } finally {
    isLoading.value = false
  }
}

const addContact = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    contacts.value.push({
      id: Date.now(),
      ...newContact.value
    })
    showToast('Contact added successfully')
    resetForm()
  } catch (error) {
    showToast('Failed to add contact', 'error')
  } finally {
    isSaving.value = false
  }
}

const updateContact = async () => {
  if (!editingContact.value) return
  
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = contacts.value.findIndex(c => c.id === editingContact.value?.id)
    if (index !== -1) {
      contacts.value[index] = { ...newContact.value, id: editingContact.value.id }
    }
    showToast('Contact updated successfully')
    resetForm()
  } catch (error) {
    showToast('Failed to update contact', 'error')
  } finally {
    isSaving.value = false
  }
}

const deleteContact = async (id: number) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    contacts.value = contacts.value.filter(contact => contact.id !== id)
    showToast('Contact deleted successfully')
  } catch (error) {
    showToast('Failed to delete contact', 'error')
  }
}

// ... rest of the existing methods ...

// Fetch contacts on component mount
fetchContacts()
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <!-- Form content -->
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ isEditing ? 'Edit Contact' : 'Add New Contact' }}
      </h2>
      <form @submit.prevent="isEditing ? updateContact() : addContact()" class="space-y-4">
        <!-- ... existing form fields ... -->
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

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contacts</h2>
        
        <LoadingSpinner v-if="isLoading" />
        
        <EmptyState 
          v-else-if="contacts.length === 0"
          message="No contacts found. Add your first contact above."
        />
        
        <div v-else class="overflow-x-auto">
          <!-- ... existing table ... -->
        </div>
      </div>
    </div>
  </div>
</template>