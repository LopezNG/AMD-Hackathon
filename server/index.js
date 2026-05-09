import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function readJson(fileName) {
  const file = await readFile(path.join(dataDir, fileName), 'utf8');
  return JSON.parse(file);
}

async function loadContext() {
  const [student, courses, assignments, announcements, grades, attendance, schedule, interventions, agentThemes] =
    await Promise.all([
      readJson('student.json'),
      readJson('courses.json'),
      readJson('assignments.json'),
      readJson('announcements.json'),
      readJson('grades.json'),
      readJson('attendance.json'),
      readJson('schedule.json'),
      readJson('interventions.json'),
      readJson('agentThemes.json')
    ]);

  return { student, courses, assignments, announcements, grades, attendance, schedule, interventions, agentThemes };
}

const routes = {
  student: 'student.json',
  courses: 'courses.json',
  assignments: 'assignments.json',
  announcements: 'announcements.json',
  grades: 'grades.json',
  attendance: 'attendance.json',
  schedule: 'schedule.json',
  interventions: 'interventions.json',
  agentThemes: 'agentThemes.json'
};

Object.entries(routes).forEach(([route, file]) => {
  app.get(`/api/${route}`, async (_req, res, next) => {
    try {
      res.json(await readJson(file));
    } catch (error) {
      next(error);
    }
  });
});

function daysUntil(dateString) {
  const today = new Date('2026-05-10T00:00:00');
  const due = new Date(`${dateString}T00:00:00`);
  return Math.round((due - today) / 86400000);
}

function formatAssignment(assignment) {
  const delta = daysUntil(assignment.dueDate);
  const dueLabel = delta < 0 ? `${Math.abs(delta)} day overdue` : delta === 0 ? 'due today' : `due in ${delta} day${delta === 1 ? '' : 's'}`;
  return `${assignment.title} for ${assignment.course} is ${dueLabel}`;
}

function buildAssistantReply(message, context) {
  const text = message.toLowerCase();
  const { student, courses, assignments, announcements, grades, attendance, schedule, interventions, agentThemes } = context;
  const dueSoon = assignments
    .filter((assignment) => assignment.status !== 'completed')
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
  const overdue = dueSoon.filter((assignment) => daysUntil(assignment.dueDate) < 0);
  const thisWeek = dueSoon.filter((assignment) => daysUntil(assignment.dueDate) <= 7);
  const watchCourse = courses.find((course) => course.status === 'watch') || courses[0];

  if (text.includes('due') || text.includes('assignment') || text.includes('deadline')) {
    const items = thisWeek.slice(0, 4).map(formatAssignment);
    return {
      agent: 'Success Agent',
      intent: 'deadlines',
      reply: `Here is the priority view for ${student.name}: ${items.join('; ')}. I would start with ${dueSoon[0].title} because it is the nearest high-impact task.`,
      actions: [
        { title: 'Start next task', detail: `${dueSoon[0].estimatedMinutes} min focus block for ${dueSoon[0].course}` },
        { title: 'Handle overdue item', detail: overdue[0] ? `Send a quick update about ${overdue[0].title}` : 'No overdue assignments right now' }
      ]
    };
  }

  if (text.includes('grade') || text.includes('gpa') || text.includes('progress')) {
    const gradeLine = grades.map((grade) => `${grade.course}: ${grade.average}%`).join(', ');
    return {
      agent: 'Sense-Maker Agent',
      intent: 'grades',
      reply: `${student.name}'s GPA is ${student.gpa}. Course averages are ${gradeLine}. ${watchCourse.name} is the one I would watch most closely because it is at ${watchCourse.currentGrade}% with ${watchCourse.progress}% course progress.`,
      actions: [
        { title: 'Review watch course', detail: `${watchCourse.name} with ${watchCourse.teacher}` },
        { title: 'Protect strong course', detail: 'Keep English Literature journal habits steady' }
      ]
    };
  }

  if (text.includes('attendance') || text.includes('absent') || text.includes('late') || text.includes('tardy')) {
    return {
      agent: 'Pulse Agent',
      intent: 'attendance',
      reply: `Attendance is ${attendance.rate}% with ${attendance.absences} absences and ${attendance.tardies} tardies. The main pattern is: ${attendance.trend}. A small morning routine adjustment could protect Calculus performance.`,
      actions: [
        { title: 'Morning plan', detail: 'Pack materials at night and target 7:35 AM arrival' },
        { title: 'Advisor check-in', detail: `Ask ${student.advisor} for a quick schedule reset` }
      ]
    };
  }

  if (text.includes('schedule') || text.includes('today') || text.includes('class')) {
    const classLine = schedule.map((item) => `${item.time} ${item.course} in ${item.room}`).join('; ');
    return {
      agent: 'Admin-Strategy Agent',
      intent: 'schedule',
      reply: `Today's schedule is ${classLine}. Biology has a rubric update, so I would check that before the lab report work block.`,
      actions: [
        { title: 'Next class', detail: `${schedule[0].course}, ${schedule[0].time}, ${schedule[0].room}` },
        { title: 'Prep note', detail: `Bring questions for ${schedule[1].teacher}` }
      ]
    };
  }

  if (text.includes('announcement') || text.includes('rubric') || text.includes('update')) {
    return {
      agent: 'Admin-Strategy Agent',
      intent: 'announcements',
      reply: `The newest update is "${announcements[0].title}" from ${announcements[0].source}. Also, Biology updated the lab report rubric, especially the conclusion checklist.`,
      actions: [
        { title: 'Open rubric task', detail: 'Review Biology conclusion checklist before submitting' },
        { title: 'Support lab', detail: 'Library tutoring is open after school Monday through Thursday' }
      ]
    };
  }

  const intervention = interventions[0];
  const themes = agentThemes.map((theme) => theme.theme).join(', ');
  return {
    agent: intervention.agent,
    intent: 'support',
    reply: `I found a few support signals for ${student.name}: ${themes}. The most immediate recommendation is: ${intervention.recommendation}`,
    actions: [
      { title: intervention.action, detail: intervention.theme },
      { title: 'Ask a focused question', detail: 'Try "What is due this week?" or "How are my grades?"' }
    ]
  };
}

app.post('/api/assistant/message', async (req, res, next) => {
  try {
    const { message, studentId } = req.body;
    if (!message || !studentId) {
      return res.status(400).json({ error: 'studentId and message are required' });
    }

    const context = await loadContext();
    const response = buildAssistantReply(message, context);
    res.json({
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...response
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'EduSense mock API error' });
});

app.listen(port, () => {
  console.log(`EduSense API running on http://127.0.0.1:${port}`);
});
