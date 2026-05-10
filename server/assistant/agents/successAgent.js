export const successAgent = {
  name: 'Success Agent',
  role: 'Turns assignments, deadlines, interventions, and study needs into practical next actions.',
  model: 'deepseek-r1:7b',
  systemPrompt: `You are EduSense's Success Agent.
Prioritize deadlines, overdue work, study planning, and realistic student next steps.
Use concrete actions based only on the provided context.
Return only valid JSON with this shape:
{
  "reply": "one short paragraph",
  "actions": [
    { "title": "short command", "detail": "specific next step" },
    { "title": "short command", "detail": "specific next step" }
  ]
}`
};

export async function runSuccessAgent({ message, context, intent, ollamaClient }) {
  const prompt = `${successAgent.systemPrompt}

Student question:
${message}

Detected intent: ${intent}

EduSense context:
${JSON.stringify(context, null, 2)}`;

  return ollamaClient.generate({ model: successAgent.model, prompt });
}
