import { Router } from 'express';

const resources = {
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

export default function createStudentRoutes({ readJson }) {
  const router = Router();

  Object.entries(resources).forEach(([route, fileName]) => {
    router.get(`/${route}`, async (_req, res, next) => {
      try {
        res.json(await readJson(fileName));
      } catch (error) {
        next(error);
      }
    });
  });

  return router;
}
