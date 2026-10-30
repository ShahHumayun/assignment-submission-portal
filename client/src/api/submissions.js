const DEMO = import.meta.env.VITE_DEMO_MODE === 'true'
const BASE = import.meta.env.VITE_API_BASE || '/api'
const KEY = 'submission-portal-demo'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export async function fetchSubmissions() {
  if (DEMO) return readLocal()

  const res = await fetch(`${BASE}/submissions`)
  if (!res.ok) throw new Error('Could not load submissions')
  return res.json()
}

export async function createSubmission(payload) {
  if (DEMO) {
    const record = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      registrationNumber: payload.registrationNumber.trim(),
      assignmentTitle: payload.assignmentTitle.trim(),
      submissionUrl: payload.submissionUrl.trim(),
      submittedAt: new Date().toISOString(),
    }
    localStorage.setItem(KEY, JSON.stringify([...readLocal(), record]))
    return record
  }

  const res = await fetch(`${BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.errors = data.errors || {}
    throw err
  }
  return data
}