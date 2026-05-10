const requestJson = async (path, options) => {
  const response = await fetch(`/api/${path}`, options);

  if (!response.ok) {
    throw new Error(`EduSense API request failed: ${response.status}`);
  }

  return response.json();
};

export const getDashboardData = async () => {
  const [student, courses, assignments, announcements, grades, attendance, schedule, agentThemes] = await Promise.all([
    requestJson('student'),
    requestJson('courses'),
    requestJson('assignments'),
    requestJson('announcements'),
    requestJson('grades'),
    requestJson('attendance'),
    requestJson('schedule'),
    requestJson('agentThemes')
  ]);

  return { student, courses, assignments, announcements, grades, attendance, schedule, agentThemes };
};

export const sendAssistantMessage = ({ studentId, message }) =>
  requestJson('assistant/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, message })
  });
