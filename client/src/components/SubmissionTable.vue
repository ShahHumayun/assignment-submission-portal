<script setup>
defineProps({ submissions: { type: Array, required: true } })

const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('')

const formatDate = (iso) =>
    new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
</script>

<template>
    <div class="card table-wrap">
        <table class="responsive">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Reg. no.</th>
                    <th>Assignment</th>
                    <th>Link</th>
                    <th>Submitted</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="s in submissions" :key="s.id">
                    <td data-label="Student">
                        <div class="student">
                            <span class="avatar">{{ initials(s.name) }}</span>
                            <span>{{ s.name }}</span>
                        </div>
                    </td>
                    <td data-label="Reg. no."><span class="tag">{{ s.registrationNumber }}</span></td>
                    <td data-label="Assignment">{{ s.assignmentTitle }}</td>
                    <td data-label="Link">
                        <a :href="s.submissionUrl" target="_blank" rel="noopener noreferrer">Open ↗</a>
                    </td>
                    <td data-label="Submitted" class="muted">{{ formatDate(s.submittedAt) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>