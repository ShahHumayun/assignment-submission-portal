import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const resultsFile = path.join(root, 'server', 'test-results.json')
const outDir = path.join(root, 'report')
const outFile = path.join(outDir, 'testreport.json')

const env = process.env
const stripAnsi = (s) => String(s).replace(/\u001b\[[0-9;]*m/g, '')

const fullName = env.GITHUB_REPOSITORY || 'local/assignment-submission-portal'
const base = {
  repository: fullName.split('/').pop(),
  repositoryFullName: fullName,
  branch: env.GITHUB_REF_NAME || 'local',
  commitSha: env.GITHUB_SHA || 'local',
  pipelineRunId: env.GITHUB_RUN_ID || 'local',
  pipelineRunNumber: env.GITHUB_RUN_NUMBER || 'local',
  pipelineRunUrl:
    env.GITHUB_SERVER_URL && env.GITHUB_RUN_ID
      ? `${env.GITHUB_SERVER_URL}/${fullName}/actions/runs/${env.GITHUB_RUN_ID}`
      : null,
  executionTimestamp: new Date().toISOString(),
}

let report

if (!fs.existsSync(resultsFile)) {
  report = {
    ...base,
    overallStatus: 'failed',
    summary: { total: 0, passed: 0, failed: 0 },
    tests: [],
    error: 'test-results.json was not produced; the test runner may have crashed.',
  }
} else {
  const raw = JSON.parse(fs.readFileSync(resultsFile, 'utf8'))
  const tests = []

  for (const file of raw.testResults) {
    if (file.assertionResults.length === 0 && file.status === 'failed') {
      tests.push({
        name: `${path.basename(file.name)} (test file failed to run)`,
        result: 'failed',
        failureMessage: stripAnsi(file.message || 'Test file failed to run').slice(0, 2000),
      })
      continue
    }
    for (const t of file.assertionResults) {
      const result = t.status === 'passed' ? 'passed' : t.status === 'failed' ? 'failed' : 'skipped'
      tests.push({
        name: t.fullName || t.title,
        result,
        failureMessage:
          result === 'failed'
            ? stripAnsi((t.failureMessages || []).join('\n')).slice(0, 2000) || 'Test did not pass'
            : null,
      })
    }
  }

  const passed = tests.filter((t) => t.result === 'passed').length
  const failed = tests.filter((t) => t.result === 'failed').length

  report = {
    ...base,
    overallStatus: failed === 0 && tests.length > 0 && raw.success !== false ? 'passed' : 'failed',
    summary: { total: tests.length, passed, failed },
    tests,
  }
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(report, null, 2))
console.log(`Report written to ${outFile}`)
console.log(`${report.overallStatus.toUpperCase()}: ${report.summary.passed}/${report.summary.total} passed, ${report.summary.failed} failed`)