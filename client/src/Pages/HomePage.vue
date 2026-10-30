<script setup>
import { onMounted, ref } from 'vue'
import { fetchSubmissions } from '../api/submissions.js'

const count = ref(null)

onMounted(async () => {
    try {
        count.value = (await fetchSubmissions()).length
    } catch {
        count.value = null
    }
})

const steps = [
    { n: '1', title: 'Enter your details', text: 'Add your name, registration number and the assignment title.' },
    { n: '2', title: 'Paste your link', text: 'Share a GitHub, Drive or hosted link to your work. No file uploads needed.' },
    { n: '3', title: 'Done in seconds', text: 'Your submission is validated, saved and instantly visible in the list.' },
]

const features = [
    { icon: '⚡', title: 'Instant validation', text: 'Missing fields and broken links are caught before anything is saved.' },
    { icon: '🗂️', title: 'Everything in one place', text: 'Browse and search every submission from a single clean table.' },
    { icon: '🛡️', title: 'Tested on every update', text: 'Each code change is checked by an automated pipeline before it ships.' },
]
</script>

<template>
    <section class="hero">
        <div class="container hero-inner">
            <span class="pill">Assignment submission, simplified</span>
            <h1>Submit your assignment in seconds.</h1>
            <p class="lead">
                A simple portal for students to hand in work with a link, and for instructors to see everything in one
                place.
            </p>
            <div class="actions">
                <RouterLink to="/submit" class="btn btn-primary">Submit an assignment</RouterLink>
                <RouterLink to="/submissions" class="btn btn-ghost">View submissions</RouterLink>
            </div>
            <p v-if="count !== null" class="hero-stat">
                <strong>{{ count }}</strong> {{ count === 1 ? 'submission' : 'submissions' }} received so far
            </p>
        </div>
    </section>

    <section class="section container">
        <h2 class="section-title">How it works</h2>
        <div class="grid-3">
            <article v-for="s in steps" :key="s.n" class="card step">
                <span class="step-n">{{ s.n }}</span>
                <h3>{{ s.title }}</h3>
                <p class="muted">{{ s.text }}</p>
            </article>
        </div>
    </section>

    <section class="section container">
        <h2 class="section-title">Why you'll like it</h2>
        <div class="grid-3">
            <article v-for="f in features" :key="f.title" class="card feature">
                <span class="feature-icon">{{ f.icon }}</span>
                <h3>{{ f.title }}</h3>
                <p class="muted">{{ f.text }}</p>
            </article>
        </div>
    </section>

    <section class="container cta-wrap">
        <div class="cta">
            <h2>Ready to hand in your work?</h2>
            <p>It takes less than a minute.</p>
            <RouterLink to="/submit" class="btn btn-light">Get started</RouterLink>
        </div>
    </section>
</template>