<script setup>
import { reactive, watch, onBeforeUnmount } from 'vue'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '../models/Ticket'

const props = defineProps({ filters: { type: Object, required: true } })
const emit = defineEmits(['change'])

const form = reactive({ ...props.filters })

// Resynchronise le formulaire si l'URL change (bouton "précédent" du navigateur)
watch(() => props.filters, (filters) => Object.assign(form, filters))

let timer
const emitChange = () => emit('change', { ...form })

// Le titre est envoyé après une courte pause de frappe pour ne pas spammer l'API
function onTitleInput() {
  clearTimeout(timer)
  timer = setTimeout(emitChange, 300)
}

function reset() {
  clearTimeout(timer)
  Object.assign(form, { title: '', status: '', priority: '' })
  emitChange()
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <form class="filter-bar" @submit.prevent="emitChange">
    <input v-model="form.title" type="search" placeholder="Rechercher dans le titre…" @input="onTitleInput" />

    <select v-model="form.status" @change="emitChange">
      <option value="">Tous les statuts</option>
      <option v-for="s in TICKET_STATUSES" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>

    <select v-model="form.priority" @change="emitChange">
      <option value="">Toutes les priorités</option>
      <option v-for="p in TICKET_PRIORITIES" :key="p.value" :value="p.value">{{ p.label }}</option>
    </select>

    <button type="button" class="btn" @click="reset">Réinitialiser</button>
  </form>
</template>
