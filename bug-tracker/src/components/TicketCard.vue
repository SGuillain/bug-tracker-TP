<script setup>
import PriorityBadge from './PriorityBadge.vue'
import StatusBadge from './StatusBadge.vue'

defineProps({ ticket: { type: Object, required: true } })
</script>

<template>
  <RouterLink
    :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
    class="ticket-card"
    :class="`ticket-card--${ticket.priority}`"
  >
    <div class="ticket-card__head">
      <h2>{{ ticket.title }}</h2>
      <div class="badges">
        <PriorityBadge :priority="ticket.priority" />
        <StatusBadge :status="ticket.status" />
      </div>
    </div>
    <p class="ticket-card__desc">{{ ticket.description }}</p>
    <small class="muted">#{{ ticket.id }} · {{ ticket.createdAtLabel }}</small>
  </RouterLink>
</template>
