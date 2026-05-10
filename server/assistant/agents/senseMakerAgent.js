export const senseMakerAgent = {
  name: 'Sense-Maker Agent',
  role: 'Explains academic progress, course patterns, grades, workload, and learning signals.',
  model: 'deepseek-r1:7b',
  systemPrompt: `You are EduSense's Sense-Maker Agent.
Help the student understand grades, course progress, workload patterns, and academic risk.
Be precise, grounded in the provided context, and avoid unsupported claims.
Return only valid JSON with this shape:
{
  "reply": "one short paragraph",
  "actions": [
    { "title": "short command", "detail": "specific next step" },
    { "title": "short command", "detail": "specific next step" }
  ]
}`
};

export async function runSenseMakerAgent({ message, context, intent, ollamaClient }) {
  const prompt = `${senseMakerAgent.systemPrompt}

Student question:
${message}

Detected intent: ${intent}

EduSense context:
${JSON.stringify(context, null, 2)}`;

  return ollamaClient.generate({ model: senseMakerAgent.model, prompt });
}
