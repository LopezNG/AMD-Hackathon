import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import RuleBasedAssistantEngine from './assistant/RuleBasedAssistantEngine.js';
import createAssistantRoutes from './routes/assistantRoutes.js';
import createStudentRoutes from './routes/studentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const app = express();
const port = process.env.PORT || 3001;
const assistantEngine = new RuleBasedAssistantEngine();

app.use(cors());
app.use(express.json());

async function readJson(fileName) {
  const file = await readFile(path.join(dataDir, fileName), 'utf8');
  return JSON.parse(file);
}

async function loadContext() {
  const [student, courses, assignments, announcements, grades, attendance, schedule, interventions, agentThemes] = await Promise.all([
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

app.use('/api', createStudentRoutes({ readJson }));
app.use('/api', createAssistantRoutes({ assistantEngine, loadContext }));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'EduSense mock API error' });
});

app.listen(port, () => {
  console.log(`EduSense API running on http://127.0.0.1:${port}`);
});
