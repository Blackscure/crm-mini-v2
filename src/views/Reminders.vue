<script setup lang="ts">
import { ref } from 'vue'

interface Reminder {
  id: number
  title: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
}

const reminders = ref<Reminder[]>([])
const newReminder = ref({
  title: '',
  dueDate: '',
  priority: 'medium' as const,
  completed: false
})

const addReminder = () => {
  reminders.value.push({
    id: Date.now(),
    ...newReminder.value
  })
  newReminder.value = {
    title: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  }
}

const toggleReminder = (id: number) => {
  const reminder = reminders.value.find(r => r.id === id)
  if (reminder) {
    reminder.completed = !reminder.completed
  }
}

const deleteReminder = (id: number) => {
  reminders.value = reminders.value.filter(reminder => reminder.id !== id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Add New Reminder</h2>
      <form @submit.prevent="addReminder" class="space-y-4">
        <div>
          <label for="title" class="label">Title</label>
          <input id="title" v-model="newReminder.title" type="text" required class="input" />
        </div>
        <div>
          <label for="dueDate" class="label">Due Date</label>
          <input id="dueDate" v-model="newReminder.dueDate" type="datetime-local" required class="input" />
        </div>
        <div>
          <label for="priority" class="label">Priority</label>
          <select id="priority" v-model="newReminder.priority" required class="input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Add Reminder</button>
      </form>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Reminders</h2>
        <div class="space-y-4">
          <div v-for="reminder in reminders" :key="reminder.id" 
               class="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
               :class="{
                 'bg-gray-50 dark:bg-gray-700': reminder.completed
               }">
            <div class="flex items-center space-x-4">
              <input type="checkbox" 
                     :checked="reminder.completed"
                     @change="toggleReminder(reminder.id)"
                     class="rounded text-blue-600 focus:ring-blue-500" />
              <div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white"
                    :class="{ 'line-through': reminder.completed }">
                  {{ reminder.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Due: {{ new Date(reminder.dueDate).toLocaleString() }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="px-2 py-1 text-sm rounded-full"
                    :class="{
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': reminder.priority === 'high',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': reminder.priority === 'medium',
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': reminder.priority === 'low'
                    }">
                {{ reminder.priority }}
              </span>
              <button @click="deleteReminder(reminder.id)" 
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>