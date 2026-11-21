<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createTicket, ApiError } from '../services/ticketApi'
import TicketForm from '../components/TicketForm.vue'

const router = useRouter()
const submitting = ref(false)
const error = ref('')
const fieldErrors = ref({})

async function create(dto) {
  submitting.value = true
  error.value = ''
  fieldErrors.value = {}
  try {
    const ticket = await createTicket(dto)
    router.push({ name: 'ticket-detail', params: { id: ticket.id } })
  } catch (e) {
    if (e instanceof ApiError && e.violations.length) {
      // 422 : l'API indique quel champ est invalide
      fieldErrors.value = Object.fromEntries(e.violations.map((v) => [v.propertyPath, v.message]))
    } else {
      error.value = e.message
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="narrow">
    <h1>Nouveau ticket</h1>
    <p v-if="error" class="alert">{{ error }}</p>
    <TicketForm :submitting="submitting" :server-errors="fieldErrors" @submit="create" />
  </section>
</template>
