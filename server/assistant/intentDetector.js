export function detectIntent(message) {
  const text = message.toLowerCase();

  if (text.includes('due') || text.includes('assignment') || text.includes('deadline')) {
    return 'deadlines';
  }

  if (text.includes('grade') || text.includes('gpa') || text.includes('progress')) {
    return 'grades';
  }

  if (text.includes('attendance') || text.includes('absent') || text.includes('late') || text.includes('tardy')) {
    return 'attendance';
  }

  if (text.includes('schedule') || text.includes('today') || text.includes('class')) {
    return 'schedule';
  }

  if (text.includes('announcement') || text.includes('rubric') || text.includes('update')) {
    return 'announcements';
  }

  return 'support';
}
