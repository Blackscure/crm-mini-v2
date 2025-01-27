<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '../composables/useToast';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';

interface Note {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
}

interface Lead {
  id: number;
  name: string;
}

const { showToast } = useToast();
const notes = ref<Note[]>([]);
const editingNote = ref<Note | null>(null);
const isEditing = computed(() => !!editingNote.value);
const isLoading = ref(false);
const isSaving = ref(false);
const newNote = ref({ leadId: 0, content: '' });
const leads = ref<Lead[]>([]);

// Fetch leads from localStorage
const fetchLeadsFromLocalStorage = () => {
  const leadsData = localStorage.getItem('leads');
  if (leadsData) {
    leads.value = JSON.parse(leadsData);
  }
};

const fetchNotes = async () => {
  isLoading.value = true;
  const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
  if (!token) {
    showToast('Token not found', 'error');
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/apps/crm-mini/api/v1/note/notes/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Use Bearer token for authentication
      },
    });

    if (!response.ok) {
      throw new Error('Failed to load notes');
    }

    const data = await response.json();
    if (data.status) {
      notes.value = data.data.map((note: any) => ({
        id: note.id,
        leadId: note.lead,
        content: note.content,
        createdAt: note.created_at,
      }));
    } else {
      showToast(data.message, 'error');
    }
  } catch (error) {
    showToast(error.message || 'Failed to load notes', 'error');
  } finally {
    isLoading.value = false;
  }
};

// Add Note with API call
const addNote = async () => {
  isSaving.value = true;
  const token = localStorage.getItem('access_token'); // Retrieve token from localStorage
  if (!token) {
    showToast('Token not found', 'error');
    isSaving.value = false;
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/apps/crm-mini/api/v1/note/notes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Use Bearer token for authentication
      },
      body: JSON.stringify({
        lead: newNote.value.leadId,  // Use leadId for the lead
        content: newNote.value.content,  // Content of the note
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to add note');
    }

    const data = await response.json();
    notes.value.push({
      id: data.id,  // Assuming the API responds with the note ID
      leadId: newNote.value.leadId,
      content: newNote.value.content,
      createdAt: new Date().toISOString(),
    });
    showToast('Note added successfully');
    resetForm();
  } catch (error) {
    showToast(error.message || 'Failed to add note', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Start Edit for a Note
const startEdit = (note: Note) => {
  editingNote.value = note;
  newNote.value = {
    leadId: note.leadId,
    content: note.content,
  };
};

// Update Note with PUT request
const updateNote = async () => {
  if (!editingNote.value) return;

  isSaving.value = true;
  const token = localStorage.getItem('access_token');
  if (!token) {
    showToast('Token not found', 'error');
    isSaving.value = false;
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/apps/crm-mini/api/v1/note/notes/${editingNote.value.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lead: newNote.value.leadId,
        content: newNote.value.content,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    const data = await response.json();
    const index = notes.value.findIndex(n => n.id === editingNote.value.id);
    if (index !== -1) {
      notes.value[index] = {
        id: data.id,
        leadId: newNote.value.leadId,
        content: newNote.value.content,
        createdAt: new Date().toISOString(),
      };
    }
    showToast('Note updated successfully');
    resetForm();
  } catch (error) {
    showToast(error.message || 'Failed to update note', 'error');
  } finally {
    isSaving.value = false;
  }
};

// Delete Note with DELETE request
const deleteNote = async (id: number) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    showToast('Token not found', 'error');
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:8000/apps/crm-mini/api/v1/note/notes/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    notes.value = notes.value.filter(note => note.id !== id);
    showToast('Note deleted successfully');
  } catch (error) {
    showToast(error.message || 'Failed to delete note', 'error');
  }
};

// Reset the form after adding or editing a note
const resetForm = () => {
  editingNote.value = null;
  newNote.value = { leadId: 0, content: '' };
};

const getLeadName = (leadId: number) => {
  return leads.value.find(lead => lead.id === leadId)?.name || 'Unknown';
};

// Fetch leads and notes on component mount
onMounted(() => {
  fetchLeadsFromLocalStorage();
  fetchNotes();
});
</script>

<template>
  <div class="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        {{ isEditing ? 'Edit Note' : 'Add New Note' }}
      </h2>
      <form @submit.prevent="isEditing ? updateNote() : addNote()" class="space-y-4">
        <div>
          <label for="leadId" class="label">Lead</label>
          <select id="leadId" v-model="newNote.leadId" required class="input">
            <option value="">Select lead</option>
            <option v-for="lead in leads" :key="lead.id" :value="lead.id">
              {{ lead.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="content" class="label">Content</label>
          <textarea 
            id="content" 
            v-model="newNote.content" 
            rows="4" 
            required 
            class="input"
          ></textarea>
        </div>
        <div class="flex space-x-4">
          <button 
            type="submit" 
            class="btn btn-primary flex items-center"
            :disabled="isSaving"
          >
            <LoadingSpinner v-if="isSaving" class="mr-2" />
            {{ isEditing ? 'Update Note' : 'Add Note' }}
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
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notes</h2>
        
        <LoadingSpinner v-if="isLoading" />
        
        <EmptyState 
          v-else-if="notes.length === 0"
          message="No notes found. Add your first note above."
        />
        
        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="note in notes" :key="note.id" class="bg-white dark:bg-gray-700 shadow rounded-lg p-4">
            <p class="text-sm text-gray-600 dark:text-gray-300">{{ note.content }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ getLeadName(note.leadId) }}</span>
              <div class="flex space-x-4">
                <button @click="startEdit(note)" class="text-blue-500 hover:text-blue-600">
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button @click="deleteNote(note.id)" class="text-red-500 hover:text-red-600">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

