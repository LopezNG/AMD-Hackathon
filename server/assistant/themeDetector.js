export function summarizeThemes(agentThemes) {
  return agentThemes.map((theme) => theme.theme).join(', ');
}

export function findWatchCourse(courses) {
  return courses.find((course) => course.status === 'watch') || courses[0];
}
