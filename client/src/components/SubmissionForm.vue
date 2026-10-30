<script setup>
import { reactive, ref } from 'vue'
import { createSubmission } from '../api/submissions.js'

const emit = defineEmits(['saved'])

const empty = () => ({ name: '', registrationNumber: '', assignmentTitle: '', submissionUrl: '' })
const form = reactive(empty())
const errors = ref({})
const serverError = ref('')
const submitting = ref(false)

function isValidUrl(value) {
    try {
        const url = new URL(value)
        const okProtocol = url.protocol === 'http:' || url.protocol === 'https:'
        const okHost = url.hostname === 'localhost' || url.hostname.includes('.')
        return okProtocol && okHost
    } catch {
        return false
    }
}

function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.registrationNumber.trim()) e.registrationNumber = 'Registration number is required'
    if (!form.assignmentTitle.trim()) e.assignmentTitle = 'Assignment title is required'
    if (!form.submissionUrl.trim()) e.submissionUrl = 'Submission URL is required'
    else if (!isValidUrl(form.submissionUrl.trim())) e.submissionUrl = 'Enter a valid http(s) URL'
    return e
}

async function onSubmit() {
    serverError.value = ''
    errors.value = validate()
    if (Object.keys(errors.value).length) return

    submitting.value = true
    try {
        const saved = await createSubmission({ ...form })
        emit('saved', saved)
        Object.assign(form, empty())
        errors.value = {}
    } catch (e) {
        if (e.errors && Object.keys(e.errors).length) errors.value = e.errors
        else serverError.value = 'Could not reach the server. Is the API running?'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <form class="card form" novalidate @submit.prevent="onSubmit">
        <div class="two-col">
            <div class="field">
                <label for="name">Full name</label>
                <input id="name" v-model="form.name" type="text" placeholder="Shah Humayun"
                    :class="{ invalid: errors.name }" />
                <small v-if="errors.name" class="error">{{ errors.name }}</small>
            </div>
            <div class="field">
                <label for="registrationNumber">Registration number</label>
                <input id="registrationNumber" v-model="form.registrationNumber" type="text" placeholder="FA22-BCS-000"
                    :class="{ invalid: errors.registrationNumber }" />
                <small v-if="errors.registrationNumber" class="error">{{ errors.registrationNumber }}</small>
            </div>
        </div>

        <div class="field">
            <label for="assignmentTitle">Assignment title</label>
            <input id="assignmentTitle" v-model="form.assignmentTitle" type="text" placeholder="DevOps Lab Mid"
                :class="{ invalid: errors.assignmentTitle }" />
            <small v-if="errors.assignmentTitle" class="error">{{ errors.assignmentTitle }}</small>
        </div>

        <div class="field">
            <label for="submissionUrl">Submission URL</label>
            <input id="submissionUrl" v-model="form.submissionUrl" type="text"
                placeholder="https://github.com/username/repository" :class="{ invalid: errors.submissionUrl }" />
            <small v-if="errors.submissionUrl" class="error">{{ errors.submissionUrl }}</small>
            <small v-else class="hint">A link to your work: GitHub, Google Drive or a hosted site.</small>
        </div>

        <p v-if="serverError" class="banner error-banner">{{ serverError }}</p>

        <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
            {{ submitting ? 'Submitting…' : 'Submit assignment' }}
        </button>
    </form>
</template>