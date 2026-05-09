# EduSense

EduSense is a polished hackathon prototype of an AI Support Assistant embedded inside a simulated school/LMS dashboard.

The LMS is intentionally mock-only. It exists to demonstrate how an assistant can answer contextual student questions about courses, assignments, deadlines, grades, announcements, attendance, schedules, risk signals, and support interventions.

## Stack

- React + Vite
- Tailwind CSS
- Node.js + Express
- Local JSON data
- Rule-based assistant endpoint designed for later LLM replacement

## Run

```bash
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:5173
```

API runs on:

```text
http://127.0.0.1:3001
```

## Key Endpoints

- `GET /api/student`
- `GET /api/courses`
- `GET /api/assignments`
- `GET /api/announcements`
- `GET /api/grades`
- `GET /api/attendance`
- `GET /api/schedule`
- `GET /api/interventions`
- `GET /api/agentThemes`
- `POST /api/assistant/message`

Example assistant request:

```json
{
  "studentId": "student_001",
  "message": "What assignments are due this week?"
}
```
