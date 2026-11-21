<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTicket, updateTicket, deleteTicket } from '../services/ticketApi'
import { TICKET_STATUSES, TICKET_PRIORITIES, TicketPatchDto } from '../models/Ticket'
import PriorityBadge from '../components/PriorityBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()

const ticket = ref(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saved = ref(false)

// Valeurs en cours d'édition (liées aux <select> avec v-model)
const status = ref('')
const priority = ref('')

const isDirty = computed(
  () => ticket.value && (status.value !== ticket.value.status || priority.value !== ticket.value.priority),
)

function setTicket(value) {
  ticket.value = value
  status.value = value.status
  priority.value = value.priority
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    setTicket(await fetchTicket(props.id))
  } catch (e) {
    ticket.value = null
    error.value = e.status === 404 ? "Ce ticket n'existe pas." : e.message
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  saved.value = false
  error.value = ''
  try {
    // On n'envoie que ce qui a changé (merge-patch)
    const dto = new TicketPatchDto({
      status: status.value !== ticket.value.status ? status.value : undefined,
      priority: priority.value !== ticket.value.priority ? priority.value : undefined,
    })
    setTicket(await updateTicket(props.id, dto))
    saved.value = true
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}

async function remove() {
  if (!confirm(`Supprimer définitivement le ticket #${props.id} ?`)) return
  try {
    await deleteTicket(props.id)
    router.push({ name: 'dashboard' })
  } catch (e) {
    error.value = e.message
  }
}

watch(() => props.id, load, { immediate: true })
</script>

<template>
  <section class="narrow">
    <RouterLink :to="{ name: 'dashboard' }" class="back-link">← Retour à la liste</RouterLink>

    <p v-if="loading" class="muted">Chargement…</p>
    <p v-if="error" class="alert">{{ error }}</p>

    <article v-if="ticket" class="detail">
      <header>
        <h1>{{ ticket.title }}</h1>
        <div class="badges">
          <PriorityBadge :priority="ticket.priority" />
          <StatusBadge :status="ticket.status" />
        </div>
        <small class="muted">#{{ ticket.id }} · créé le {{ ticket.createdAtLabel }}</small>
      </header>

      <p class="detail__description">{{ ticket.description }}</p>

      <form class="detail__edit" @submit.prevent="save">
        <label>
          Statut
          <select v-model="status">
            <option v-for="s in TICKET_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </label>

        <label>
          Priorité
          <select v-model="priority">
            <option v-for="p in TICKET_PRIORITIES" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>
        </label>

        <button type="submit" class="btn btn--primary" :disabled="!isDirty || saving">
          {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
        </button>
        <span v-if="saved && !isDirty" class="success">✓ Modifications enregistrées</span>
      </form>

      <footer>
        <button type="button" class="btn btn--danger" @click="remove">Supprimer le ticket</button>
      </footer>
    </article>
  </section>
</template>
