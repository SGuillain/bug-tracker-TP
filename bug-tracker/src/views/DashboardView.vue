<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchTickets } from '../services/ticketApi'
import FilterBar from '../components/FilterBar.vue'
import TicketCard from '../components/TicketCard.vue'
import PaginationBar from '../components/PaginationBar.vue'

const route = useRoute()
const router = useRouter()

const tickets = ref([])
const totalItems = ref(0)
const totalPages = ref(1)
const loading = ref(false)
const error = ref('')

// Page et filtres vivent dans l'URL (?page=2&status=open) :
// le bouton "retour" depuis un détail retrouve donc la même liste.
const page = computed(() => Number(route.query.page) || 1)
const filters = computed(() => ({
  title: route.query.title ?? '',
  status: route.query.status ?? '',
  priority: route.query.priority ?? '',
}))

let lastRequest = 0 // ignore les réponses obsolètes si l'utilisateur tape vite

async function load() {
  if (route.name !== 'dashboard') return // on est en train de quitter la vue

  const current = ++lastRequest
  loading.value = true
  error.value = ''
  try {
    const result = await fetchTickets({ page: page.value, ...filters.value })
    if (current !== lastRequest) return
    tickets.value = result.tickets
    totalItems.value = result.totalItems
    totalPages.value = result.totalPages
  } catch (e) {
    if (current !== lastRequest) return
    tickets.value = []
    error.value = e.message
  } finally {
    if (current === lastRequest) loading.value = false
  }
}

watch(() => route.query, load, { immediate: true })

function updateQuery(values) {
  const query = {}
  for (const [key, value] of Object.entries(values)) {
    if (value) query[key] = value
  }
  router.push({ query })
}

const applyFilters = (newFilters) => updateQuery(newFilters) // revient à la page 1
const goToPage = (newPage) => updateQuery({ ...filters.value, page: newPage > 1 ? newPage : null })
</script>

<template>
  <section>
    <div class="page-head">
      <h1>
        Tickets <small v-if="!error" class="muted">({{ totalItems }})</small>
      </h1>
      <RouterLink :to="{ name: 'ticket-create' }" class="btn btn--primary">+ Nouveau ticket</RouterLink>
    </div>

    <FilterBar :filters="filters" @change="applyFilters" />

    <p v-if="error" class="alert">{{ error }}</p>

    <div class="ticket-list" :class="{ 'is-loading': loading }">
      <TicketCard v-for="ticket in tickets" :key="ticket.id" :ticket="ticket" />
    </div>

    <p v-if="!loading && !error && !tickets.length" class="muted">Aucun ticket ne correspond.</p>

    <PaginationBar :page="page" :total-pages="totalPages" @change="goToPage" />
  </section>
</template>
