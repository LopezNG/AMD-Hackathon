import { detectIntent } from './intentDetector.js';
import { findWatchCourse, summarizeThemes } from './themeDetector.js';
import { daysUntil, templates } from './responseTemplates.js';

export default class RuleBasedAssistantEngine {
  buildReply(message, context) {
    const intent = detectIntent(message);
    const { student, courses, assignments, announcements, grades, attendance, schedule, interventions, agentThemes } = context;
    const dueSoon = assignments
      .filter((assignment) => assignment.status !== 'completed')
      .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
    const overdue = dueSoon.filter((assignment) => daysUntil(assignment.dueDate) < 0);
    const thisWeek = dueSoon.filter((assignment) => daysUntil(assignment.dueDate) <= 7);
    const watchCourse = findWatchCourse(courses);

    switch (intent) {
      case 'deadlines':
        return templates.deadlines({ student, dueSoon, overdue, thisWeek });
      case 'grades':
        return templates.grades({ student, grades, watchCourse });
      case 'attendance':
        return templates.attendance({ student, attendance });
      case 'schedule':
        return templates.schedule({ schedule });
      case 'announcements':
        return templates.announcements({ announcements });
      default:
        return templates.support({
          student,
          intervention: interventions[0],
          themes: summarizeThemes(agentThemes)
        });
    }
  }
}
