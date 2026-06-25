<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// Persist the current slide to localStorage so the demo site's "back to the
// slides" links can resume where the user left off. With hash routing the URL
// looks like …/slides/#/12, and the deck + demo share an origin
// (…/Evals-101/slides ↔ …/Evals-101/demo), so localStorage is shared.
// Reading the hash directly keeps this independent of Slidev internals.
function save() {
  const m = window.location.hash.match(/#\/(\d+)/)
  if (m) {
    try { localStorage.setItem('evals101:lastSlide', m[1]) } catch { /* ignore */ }
  }
}

onMounted(() => {
  save()
  window.addEventListener('hashchange', save)
})
onUnmounted(() => window.removeEventListener('hashchange', save))
</script>

<template>
  <span style="display:none" aria-hidden="true" />
</template>
