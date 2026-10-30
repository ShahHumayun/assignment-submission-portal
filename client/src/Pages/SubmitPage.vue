<script setup>
import { ref } from 'vue'
import SubmissionForm from '../components/SubmissionForm.vue'

const lastSaved = ref(null)
</script>

<template>
    <div class="container narrow page">
        <h1>Submit an assignment</h1>
        <p class="muted">Fill in your details and the link to your work.</p>

        <div v-if="lastSaved" class="banner success-banner">
            <strong>Submitted!</strong> “{{ lastSaved.assignmentTitle }}” was saved for {{ lastSaved.name }}.
            <RouterLink to="/submissions">View all submissions →</RouterLink>
        </div>

        <SubmissionForm @saved="lastSaved = $event" />
    </div>
</template>