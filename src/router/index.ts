import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Leads from '../views/Leads.vue'
import Contacts from '../views/Contacts.vue'
import Notes from '../views/Notes.vue'
import Reminders from '../views/Reminders.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        { path: 'leads', component: Leads },
        { path: 'contacts', component: Contacts },
        { path: 'notes', component: Notes },
        { path: 'reminders', component: Reminders }
      ]
    }
  ]
})

export default router