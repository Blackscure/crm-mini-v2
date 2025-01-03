import { ref } from 'vue'

export interface Lead {
  id: number
  name: string
  email: string
  phone: string
  createdBy: string
}

export function useLeads() {
  const leads = ref<Lead[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '123-456-7890', createdBy: 'Admin' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '098-765-4321', createdBy: 'Sales' }
  ])

  const addLead = (lead: Omit<Lead, 'id'>) => {
    leads.value.push({
      id: Date.now(),
      ...lead
    })
  }

  const updateLead = (id: number, data: Partial<Lead>) => {
    const index = leads.value.findIndex(lead => lead.id === id)
    if (index !== -1) {
      leads.value[index] = { ...leads.value[index], ...data }
    }
  }

  const deleteLead = (id: number) => {
    leads.value = leads.value.filter(lead => lead.id !== id)
  }

  return {
    leads,
    addLead,
    updateLead,
    deleteLead
  }
}