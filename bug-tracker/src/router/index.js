import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/tickets/new', name: 'ticket-create', component: CreateTicketView },
    {
      path: '/tickets/:id(\\d+)',
      name: 'ticket-detail',
      component: TicketDetailView,
      props: true,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
