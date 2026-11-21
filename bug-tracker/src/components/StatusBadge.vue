<script setup>
import { computed } from 'vue'
import { TICKET_STATUSES } from '../models/Ticket'

const props = defineProps({ status: { type: String, required: true } })

const label = computed(() => TICKET_STATUSES.find((s) => s.value === props.status)?.label ?? props.status)
</script>

<template>
  <span class="badge" :class="`badge--${status}`">{{ label }}</span>
</template>
