<script setup>
import { ref } from 'vue'

const demo = import.meta.env.VITE_DEMO_MODE === 'true'
const menuOpen = ref(false)
const year = new Date().getFullYear()
</script>

<template>
  <div v-if="demo" class="demo-bar">
    Demo mode: submissions are stored in your browser only and are not sent to a server.
  </div>

  <header class="topbar">
    <div class="container bar">
      <RouterLink to="/" class="brand" @click="menuOpen = false">
        <span class="logo">✓</span>
        <span>Assignment Portal</span>
      </RouterLink>

      <button class="menu-btn" aria-label="Toggle menu" @click="menuOpen = !menuOpen">
        {{ menuOpen ? '✕' : '☰' }}
      </button>

      <nav :class="{ open: menuOpen }" @click="menuOpen = false">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/submissions">Submissions</RouterLink>
        <RouterLink to="/submit" class="nav-cta">Submit now</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <span>© {{ year }} Assignment Portal</span>
      <span class="muted">DevOps for Cloud Computing · CSC418 · COMSATS University Islamabad, Attock</span>
    </div>
  </footer>
</template>