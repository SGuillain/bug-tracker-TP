<template>
  <header class="app-header">
    <div class="container app-header__inner">
      <RouterLink :to="{ name: 'dashboard' }" class="app-header__brand">🐞 Mini Bug-Tracker</RouterLink>
      <nav>
        <RouterLink :to="{ name: 'dashboard' }">Tickets</RouterLink>
        <RouterLink :to="{ name: 'ticket-create' }">Nouveau ticket</RouterLink>
      </nav>
    </div>
  </header>
</template>
