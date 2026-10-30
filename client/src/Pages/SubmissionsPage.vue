<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchSubmissions } from '../api/submissions.js'
import SubmissionTable from '../components/SubmissionTable.vue'

const submissions = ref([])
const loading = ref(true)
const error = ref('')
const query = ref('')

async function load() {
    loading.value = true
    error.value = ''
    try {
        const data = await fetchSubmissions()
        submissions.value = [...data].reverse() // newest first
    } catch {
        error.value = 'Could not load submissions. Is the API running?'
    } finally {
        loading.value = false
    }
}

const filtered = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return submissions.value
    return submissions.value.filter((s) =>
        [s.name, s.registrationNumber, s.assignmentTitle].some((v) => v.toLowerCase().includes(q))
    )
})

onMounted(load)
</script>

<template>
    <div class="container page">
        <div class="row">
            <div>
                <h1>Submissions</h1>
                <p class="muted">
                    {{ submissions.length }} total<span v-if="query"> · {{ filtered.length }} match “{{ query }}”</span>
                </p>
            </div>
            <div class="row-actions">
                <input v-model="query" class="search" type="search" placeholder="Search name, reg. no. or title" />
                <button class="btn btn-soft" :disabled="loading" @click="load">Refresh</button>
            </div>
        </div>

        <div v-if="loading" class="card empty">Loading submissions…</div>
        <div v-else-if="error" class="banner error-banner">{{ error }}</div>
        <div v-else-if="!submissions.length" class="card empty">
            <h3>No submissions yet</h3>
            <p class="muted">Be the first to hand something in.</p>
            <RouterLink to="/submit" class="btn btn-primary">Submit an assignment</RouterLink>
        </div>
        <div v-else-if="!filtered.length" class="card empty">
            <h3>No results</h3>
            <p class="muted">Nothing matches “{{ query }}”.</p>
        </div>
        <SubmissionTable v-else :submissions="filtered" />
    </div>
</template>