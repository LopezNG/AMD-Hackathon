const today = new Date('2026-05-10T00:00:00');

export function daysUntil(dateString) {
  const due = new Date(`${dateString}T00:00:00`);
  return Math.round((due - today) / 86400000);
}

export function formatAssignment(assignment) {
  const delta = daysUntil(assignment.dueDate);
  const dueLabel = delta < 0 ? `${Math.abs(delta)} day overdue` : delta === 0 ? 'due today' : `due in ${delta} day${delta === 1 ? '' : 's'}`;

  return `${assignment.title} for ${assignment.course} is ${dueLabel}`;
}

export const templates = {
  deadlines({ student, dueSoon, overdue, thisWeek }) {
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
  },

  grades({ student, grades, watchCourse }) {
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
  },

  attendance({ student, attendance }) {
    return {
      agent: 'Pulse Agent',
      intent: 'attendance',
      reply: `Attendance is ${attendance.rate}% with ${attendance.absences} absences and ${attendance.tardies} tardies. The main pattern is: ${attendance.trend}. A small morning routine adjustment could protect Calculus performance.`,
      actions: [
        { title: 'Morning plan', detail: 'Pack materials at night and target 7:35 AM arrival' },
        { title: 'Advisor check-in', detail: `Ask ${student.advisor} for a quick schedule reset` }
      ]
    };
  },

  schedule({ schedule }) {
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
  },

  announcements({ announcements }) {
    return {
      agent: 'Admin-Strategy Agent',
      intent: 'announcements',
      reply: `The newest update is "${announcements[0].title}" from ${announcements[0].source}. Also, Biology updated the lab report rubric, especially the conclusion checklist.`,
      actions: [
        { title: 'Open rubric task', detail: 'Review Biology conclusion checklist before submitting' },
        { title: 'Support lab', detail: 'Library tutoring is open after school Monday through Thursday' }
      ]
    };
  },

  support({ student, intervention, themes }) {
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
};
