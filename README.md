# Assignment Submission Portal

A simple assignment submission portal built for **DevOps for Cloud Computing (CSC418)** at COMSATS University Islamabad, Attock Campus. Students submit their name, registration number, assignment title and a link to their work. Every code change is tested automatically, and the test report is delivered to a local receiver as JSON.

**Live demo:** https://shahhumayun.github.io/assignment-submission-portal/
*(The live site runs in demo mode: submissions are stored in the visitor's browser, because GitHub Pages cannot run the Express backend.)*

## Features

- Submission form with client-side and server-side validation
- Submission list with search, newest first
- REST API built with Express
- Automated tests (Vitest + Supertest)
- CI pipeline on GitHub Actions that tests every push
- Local report receiver that saves the test report as `testreport.json`

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, Vite, Vue Router |
| Backend | Node.js, Express |
| Tests | Vitest, Supertest |
| CI/CD | GitHub Actions |

## Project structure

```
Assignment-Portal/
├── client/            Vue frontend
├── server/            Express API
│   ├── src/           app, store, validation
│   └── tests/         automated tests
├── receiver/          local HTTP receiver for test reports
├── scripts/           report builder used by the pipeline
├── postman/           Postman collection for API testing
└── .github/workflows/ CI pipeline
```

## Prerequisites

- Node.js 20 or newer
- Git

## Run the application

Use two terminals.

**Terminal 1: API (http://localhost:3000)**

```bash
cd server
npm install
npm run dev
```

**Terminal 2: frontend (http://localhost:5173)**

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. Submissions are saved to `server/data/submissions.json`.

## Run the tests

```bash
cd server
npm install
npm test
```

The three required cases are covered:

| Test case | Expected result |
|---|---|
| Complete details and a valid submission URL | Saved and listed |
| Missing registration number | Rejected with a validation message |
| Invalid submission URL | Rejected and not saved |

A failing test exits with a non-zero code, which fails the CI test stage.

## Start the report receiver

The receiver listens on `http://localhost:4000` and saves each incoming report as `receiver/testreport.json`.

```bash
cd receiver
node receiver.js
```

Keep it running while the pipeline executes. A GitHub-hosted runner cannot reach your computer's `localhost`, so a tunnel (for example ngrok or Cloudflare Tunnel) forwards the report to the receiver. Set the tunnel's public URL as the `REPORT_URL` secret in the repository settings.

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/submissions` | List all submissions |
| POST | `/api/submissions` | Create a submission |

`POST /api/submissions` body:

```json
{
  "name": "Student Name",
  "registrationNumber": "FA22-BCS-000",
  "assignmentTitle": "Lab 3",
  "submissionUrl": "https://github.com/user/repo"
}
```

Responses: `201` with the saved record, or `400` with `{ "message": "Validation failed", "errors": { ... } }`.

## Continuous integration

Every push triggers the workflow in `.github/workflows/`, which installs dependencies, runs the tests, builds the report, and sends it to the receiver for both passing and failing runs.

## Author

Shah Humayun, BSCS, COMSATS University Islamabad, Attock Campus