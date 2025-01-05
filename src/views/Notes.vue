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
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulated data fetch
  } catch (error) {
    showToast('Failed to load notes', 'error');
  } finally {
    isLoading.value = false;
  }
};

const addNote = async () => {
  isSaving.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    notes.value.push({
      id: Date.now(),
      ...newNote.value,
      createdAt: new Date().toISOString(),
    });
    showToast('Note added successfully');
    resetForm();
  } catch (error) {
    showToast('Failed to add note', 'error');
  } finally {
    isSaving.value = false;
  }
};

const startEdit = (note: Note) => {
  editingNote.value = note;
  newNote.value = {
    leadId: note.leadId,
    content: note.content,
  };
};

const updateNote = async () => {
  if (!editingNote.value) return;

  isSaving.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const index = notes.value.findIndex(n => n.id === editingNote.value?.id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...newNote.value,
      };
    }
    showToast('Note updated successfully');
    resetForm();
  } catch (error) {
    showToast('Failed to update note', 'error');
  } finally {
    isSaving.value = false;
  }
};

const deleteNote = async (id: number) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    notes.value = notes.value.filter(note => note.id !== id);
    showToast('Note deleted successfully');
  } catch (error) {
    showToast('Failed to delete note', 'error');
  }
};

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
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="note in notes" :key="note.id" 
               class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border dark:border-gray-700">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ getLeadName(note.leadId) }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ new Date(note.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="flex space-x-2">
                <button @click="startEdit(note)" 
                        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button @click="deleteNote(note.id)" 
                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300">{{ note.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
