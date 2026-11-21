<script setup>
import { computed } from 'vue'
import { TICKET_PRIORITIES } from '../models/Ticket'

const props = defineProps({ priority: { type: String, required: true } })

const label = computed(() => TICKET_PRIORITIES.find((p) => p.value === props.priority)?.label ?? props.priority)
</script>

<template>
  <span class="badge" :class="`badge--${priority}`">{{ label }}</span>
</template>
