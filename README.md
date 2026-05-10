# EduSense

EduSense is a hackathon prototype of an AI-powered student success assistant embedded inside a simulated LMS dashboard. It combines a polished React dashboard, local mock school data, and a multi-agent assistant layer that can answer contextual questions about attendance, assignments, grades, schedules, announcements, and support interventions.

## Why This Project

Students often have the right data available somewhere in their LMS, but the data is fragmented across courses, announcements, calendars, gradebooks, and advisor notes. EduSense explores how a student-facing AI assistant can turn that scattered context into clear, timely guidance: what needs attention, why it matters, and what the student can do next.

The project is intentionally mock-data driven so it can be demonstrated reliably during judging without depending on a live school integration.

## Key Features

- **Contextual LMS dashboard** - Displays student profile details, course progress, assignments, announcements, schedule, attendance, and agent activity from local JSON data.
- **Floating AI assistant** - Provides an embedded chat experience inside the dashboard rather than a separate chatbot page.
- **Multi-agent routing** - Routes student questions by intent to specialized assistant agents for attendance, grades, deadlines, support, schedules, and announcements.
- **Ollama provider with fallback** - Attempts local Ollama generation first, then falls back to deterministic rule-based responses if the local model provider is unavailable.
- **Action-oriented replies** - Assistant responses include short next-step actions where applicable.
- **Persistent chat state** - The popup chat persists in browser `localStorage`.
- **Archive and clear chat controls** - Users can archive a conversation locally or clear the visible chat transcript.
- **Responsive composer** - The chat input expands dynamically for multi-line messages.
- **Mock API boundary** - The client talks to an Express API, keeping frontend rendering separate from assistant and data logic.

## Workflow / Architecture

```text
Student opens dashboard
  -> React + Vite client requests dashboard context
  -> Express API reads local JSON LMS data
  -> Dashboard renders student, course, assignment, schedule, and agent panels
  -> Student asks assistant a question
  -> Assistant route loads full mock LMS context
  -> Intent detector selects an agent
  -> Ollama model is called when available
  -> Rule-based assistant responds if Ollama is unavailable
  -> Reply and suggested actions return to the floating chat UI
```

## Agent Details

| Agent | Responsibility | Current Model Setting |
| --- | --- | --- |
| Pulse Agent | Attendance, wellbeing, daily friction, and early warning signals | `llama3.2:1b` |
| Sense-Maker Agent | Academic progress, grades, course patterns, and learning signals | `deepseek-r1:7b` |
| Success Agent | Assignments, deadlines, interventions, and practical next actions | `deepseek-r1:7b` |
| Admin-Strategy Agent | Schedules, announcements, rubric updates, rooms, teachers, and logistics | `deepseek-r1:7b` |

The model names above are configured in `server/assistant/agents/*.js`. They are used only when a compatible local Ollama server is running.

## Provider Modes

| Mode | How It Works | Status |
| --- | --- | --- |
| Ollama-backed assistant | `AssistantEngine` calls `OllamaAssistantEngine`, which sends JSON-mode prompts to local Ollama through `OLLAMA_BASE_URL`. | Implemented |
| Rule-based fallback | If Ollama fails, `AssistantEngine` logs the failure and returns a deterministic response from `RuleBasedAssistantEngine`. | Implemented |
| Hosted LLM provider | A cloud provider integration is not currently wired in. | Planned / not live |

## Validation Status

| Area | Evidence | Status |
| --- | --- | --- |
| Production build | `npm.cmd run build` completes successfully with Vite. | Passing |
| Local client/server run path | `npm.cmd run dev` starts the Express API and Vite client concurrently. | Implemented |
| API data routes | Student, courses, assignments, announcements, grades, attendance, schedule, interventions, and agent themes are served from JSON files. | Implemented |
| Assistant endpoint | `POST /api/assistant/message` validates `studentId` and `message`, loads full context, and returns an assistant response. | Implemented |
| Automated tests | No test runner or automated test suite is currently configured in `package.json`. | Not configured |
| Real LMS integration | Uses local mock JSON data only. | Not live |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 6 |
| Styling | Tailwind CSS, custom theme tokens |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Local data | JSON files in `server/data` |
| Assistant provider | Ollama local generation with rule-based fallback |
| Dev orchestration | `concurrently` |

## Agent Overview
![image alt](https://github.com/LopezNG/EduSense/blob/2f4fe29dbb93614012512669ff399a373e3350d7/Multi-Agent%20System%20Overview.png)

## Project Structure

```text
.
|-- client/
|   `-- src/
|       |-- App.jsx
|       |-- components/
|       |   |-- assistant/          # Floating EduSense chat UI
|       |   |-- dashboard/          # Dashboard panels and shared card styles
|       |   `-- layout/             # Dashboard shell and navigation
|       `-- services/api.js         # Browser API client
|-- server/
|   |-- assistant/                  # Intent detection, agents, Ollama, fallback logic
|   |-- data/                       # Mock LMS JSON data
|   |-- routes/                     # Express API route modules
|   `-- index.js                    # API server and static production host
|-- index.html
|-- package.json
|-- tailwind.config.js
`-- vite.config.js
```

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/student` | Student profile and summary data |
| `GET` | `/api/courses` | Course list and progress data |
| `GET` | `/api/assignments` | Assignment list and due dates |
| `GET` | `/api/announcements` | LMS announcements |
| `GET` | `/api/grades` | Course grade data |
| `GET` | `/api/attendance` | Attendance summary |
| `GET` | `/api/schedule` | Daily schedule |
| `GET` | `/api/interventions` | Mock support interventions |
| `GET` | `/api/agentThemes` | Agent activity themes |
| `POST` | `/api/assistant/message` | Assistant chat response |

Example assistant request:

```json
{
  "studentId": "student_001",
  "message": "What assignments are due this week?"
}
```

## Local Setup

Install dependencies:

```bash
npm.cmd install
```

Start the full local app:

```bash
npm.cmd run dev
```

Open the client:

```text
http://127.0.0.1:5173
```

The API runs on:

```text
http://127.0.0.1:3001
```

Build for production:

```bash
npm.cmd run build
```

Preview the production build locally:

```bash
npm.cmd run preview
```

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `concurrently "npm:server" "npm:client"` | Runs the Express API and Vite client together. |
| `server` | `node server/index.js` | Runs the API server on `PORT` or `3001`. |
| `client` | `vite --host 127.0.0.1` | Runs the Vite dev server. |
| `build` | `vite build` | Builds the frontend into `dist/`. |
| `preview` | `vite preview --host 127.0.0.1` | Serves the built frontend with Vite preview. |

## Environment Variables

No secrets are required for the default rule-based fallback demo.

Optional variables:

```bash
# Express API port. Defaults to 3001.
PORT=3001

# Local Ollama server URL. Defaults to http://localhost:11434.
OLLAMA_BASE_URL=http://localhost:11434
```

To use the Ollama-backed agent mode, run Ollama locally and make sure the configured models are available. If Ollama is not running or a model is missing, EduSense continues to work through the rule-based fallback.

## Deployment Notes

- `npm.cmd run build` creates the production frontend in `dist/`.
- `server/index.js` serves `dist/` as static assets and falls back to `dist/index.html` for client-side routes.
- The Express API and production frontend can be hosted from the same Node process.
- The current app uses local JSON files as its data source; replacing them with real LMS APIs would require a data adapter and authentication layer.
- Do not commit API keys or provider credentials. This repository does not require any secrets for the default demo.

## Final Submission Notes

EduSense is submission-ready as a polished local prototype: it demonstrates the student dashboard, assistant UI, multi-agent routing, local data context, Ollama-first provider behavior, and deterministic fallback mode. The project is designed for reliable judging and demo flow while clearly marking real LMS integration, hosted provider support, and automated test coverage as future work rather than completed production features.
