<script setup>
defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
defineEmits(['change'])
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination">
    <button class="btn" :disabled="page <= 1" @click="$emit('change', page - 1)">← Précédent</button>
    <span>Page {{ page }} / {{ totalPages }}</span>
    <button class="btn" :disabled="page >= totalPages" @click="$emit('change', page + 1)">Suivant →</button>
  </nav>
</template>
