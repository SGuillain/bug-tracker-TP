<script setup>
import { reactive, ref, computed } from 'vue'
import { TICKET_PRIORITIES, TicketCreateDto } from '../models/Ticket'

const props = defineProps({
  submitting: Boolean,
  serverErrors: { type: Object, default: () => ({}) }, // erreurs 422 de l'API, par champ
})
const emit = defineEmits(['submit'])

const form = reactive({ title: '', description: '', priority: 'low' })
const clientErrors = ref({})

// Mêmes contraintes que l'API : title 3-255, description >= 15, priority obligatoire
function validate() {
  const errors = {}
  const titleLength = form.title.trim().length
  if (titleLength < 3 || titleLength > 255) {
    errors.title = 'Le titre doit contenir entre 3 et 255 caractères.'
  }
  if (form.description.trim().length < 15) {
    errors.description = 'La description doit contenir au moins 15 caractères.'
  }
  if (!TICKET_PRIORITIES.some((p) => p.value === form.priority)) {
    errors.priority = 'Choisissez une priorité.'
  }
  clientErrors.value = errors
  return Object.keys(errors).length === 0
}

const errors = computed(() => ({ ...props.serverErrors, ...clientErrors.value }))

function onSubmit() {
  if (validate()) emit('submit', new TicketCreateDto(form))
}
</script>

<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <label>
      Titre
      <input v-model="form.title" type="text" maxlength="255" />
      <span v-if="errors.title" class="field-error">{{ errors.title }}</span>
    </label>

    <label>
      Description
      <textarea v-model="form.description" rows="6"></textarea>
      <span v-if="errors.description" class="field-error">{{ errors.description }}</span>
    </label>

    <label>
      Priorité
      <select v-model="form.priority">
        <option v-for="p in TICKET_PRIORITIES" :key="p.value" :value="p.value">{{ p.label }}</option>
      </select>
      <span v-if="errors.priority" class="field-error">{{ errors.priority }}</span>
    </label>

    <div class="form__actions">
      <RouterLink :to="{ name: 'dashboard' }" class="btn">Annuler</RouterLink>
      <button type="submit" class="btn btn--primary" :disabled="submitting">
        {{ submitting ? 'Création…' : 'Créer le ticket' }}
      </button>
    </div>
  </form>
</template>
