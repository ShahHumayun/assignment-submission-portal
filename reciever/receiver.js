import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 4000
const TOKEN = process.env.REPORT_TOKEN || ''
const LATEST = path.join(__dirname, 'testreport.json')
const HISTORY = path.join(__dirname, 'reports')
const MAX_BYTES = 1_000_000

function validate(r) {
  if (!r || typeof r !== 'object') return 'Report must be a JSON object'
  for (const key of ['repository', 'branch', 'commitSha', 'pipelineRunId', 'executionTimestamp']) {
    if (!r[key]) return `Missing field: ${key}`
  }
  if (!['passed', 'failed'].includes(r.overallStatus)) return 'overallStatus must be "passed" or "failed"'
  const s = r.summary
  if (!s || ![s.total, s.passed, s.failed].every(Number.isInteger)) return 'summary needs integer total, passed and failed'
  if (!Array.isArray(r.tests)) return 'tests must be an array'
  return null
}

const server = http.createServer((req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(body))
  }

  if (req.method === 'GET' && req.url === '/health') {
    return send(200, { status: 'ok' })
  }

  if (req.method === 'POST' && req.url === '/report') {
    if (TOKEN && req.headers['x-report-token'] !== TOKEN) {
      console.log('Rejected a request with a missing or wrong token')
      return send(401, { error: 'Unauthorized' })
    }

    const chunks = []
    let size = 0
    let tooBig = false

    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BYTES) {
        tooBig = true
        return
      }
      chunks.push(chunk)
    })

    req.on('end', () => {
      if (tooBig) return send(413, { error: 'Report too large' })

      let report
      try {
        report = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      } catch {
        return send(400, { error: 'Invalid JSON' })
      }

      const problem = validate(report)
      if (problem) return send(422, { error: problem })

      const json = JSON.stringify(report, null, 2)
      fs.writeFileSync(LATEST, json)

      fs.mkdirSync(HISTORY, { recursive: true })
      const stamp = new Date().toISOString().replace(/[:.]/g, '-')
      const copy = `${stamp}_${report.overallStatus}_${String(report.commitSha).slice(0, 7)}.json`
      fs.writeFileSync(path.join(HISTORY, copy), json)

      console.log(
        `[${new Date().toLocaleTimeString()}] ${report.overallStatus.toUpperCase()} ` +
          `${report.summary.passed}/${report.summary.total} passed, commit ${String(report.commitSha).slice(0, 7)} -> testreport.json`
      )
      send(200, { saved: 'testreport.json' })
    })
    return
  }

  send(404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Report receiver listening on http://localhost:${PORT}`)
  console.log(`POST reports to /report. Latest report is saved as ${LATEST}`)
})