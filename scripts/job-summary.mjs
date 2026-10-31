import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const file = path.join(root, 'server', 'test-results.json')

if (!fs.existsSync(file)) {
  console.log('No test-results.json found, nothing to summarise.')
  process.exit(0)
}

const result = JSON.parse(fs.readFileSync(file, 'utf8'))
const tests = result.testResults.flatMap((f) => f.assertionResults)
const rows = tests.map((t) => `| ${t.status === 'passed' ? '✅' : '❌'} | ${t.fullName || t.title} |`)

const markdown = [
  `## Test results: ${result.numFailedTests === 0 ? '✅ PASSED' : '❌ FAILED'}`,
  '',
  `**Total:** ${result.numTotalTests} · **Passed:** ${result.numPassedTests} · **Failed:** ${result.numFailedTests}`,
  '',
  '| Result | Test |',
  '|---|---|',
  ...rows,
  '',
].join('\n')

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown + '\n')
} else {
  console.log(markdown)
}