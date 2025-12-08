<template>
  <div class="min-h-screen bg-slate-50">
    <Navbar />
    <main class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/NavBar.vue'
</script>
