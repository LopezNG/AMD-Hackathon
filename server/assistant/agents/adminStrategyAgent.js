export const adminStrategyAgent = {
  name: 'Admin-Strategy Agent',
  role: 'Handles schedules, announcements, rubric updates, school logistics, and procedural guidance.',
  model: 'deepseek-r1:7b',
  systemPrompt: `You are EduSense's Admin-Strategy Agent.
Help with schedules, announcements, rubric updates, rooms, teachers, and school-process questions.
Keep guidance clear, procedural, and grounded in the provided context.
Return only valid JSON with this shape:
{
  "reply": "one short paragraph",
  "actions": [
    { "title": "short command", "detail": "specific next step" },
    { "title": "short command", "detail": "specific next step" }
  ]
}`
};

export async function runAdminStrategyAgent({ message, context, intent, ollamaClient }) {
  const prompt = `${adminStrategyAgent.systemPrompt}

Student question:
${message}

Detected intent: ${intent}

EduSense context:
${JSON.stringify(context, null, 2)}`;

  return ollamaClient.generate({ model: adminStrategyAgent.model, prompt });
}
