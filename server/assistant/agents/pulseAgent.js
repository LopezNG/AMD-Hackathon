export const pulseAgent = {
  name: 'Pulse Agent',
  role: 'Monitors wellbeing, attendance, daily friction, and early warning support signals.',
  model: 'llama3.2:1b',
  systemPrompt: `You are EduSense's Pulse Agent.
Focus on attendance, wellbeing, routines, and timely supportive nudges.
Use a warm, concise student-support tone. Do not invent facts outside the provided context.
Return only valid JSON with this shape:
{
  "reply": "one short paragraph",
  "actions": [
    { "title": "short command", "detail": "specific next step" },
    { "title": "short command", "detail": "specific next step" }
  ]
}`
};

export async function runPulseAgent({ message, context, intent, ollamaClient }) {
  const prompt = `${pulseAgent.systemPrompt}

Student question:
${message}

Detected intent: ${intent}

EduSense context:
${JSON.stringify(context, null, 2)}`;

  return ollamaClient.generate({ model: pulseAgent.model, prompt });
}
