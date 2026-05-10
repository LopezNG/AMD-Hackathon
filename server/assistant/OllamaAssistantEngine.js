import { detectIntent } from './intentDetector.js';
import { adminStrategyAgent, runAdminStrategyAgent } from './agents/adminStrategyAgent.js';
import { pulseAgent, runPulseAgent } from './agents/pulseAgent.js';
import { senseMakerAgent, runSenseMakerAgent } from './agents/senseMakerAgent.js';
import { successAgent, runSuccessAgent } from './agents/successAgent.js';
import OllamaClient from './ollamaClient.js';

const agentByIntent = {
  attendance: { definition: pulseAgent, run: runPulseAgent },
  grades: { definition: senseMakerAgent, run: runSenseMakerAgent },
  deadlines: { definition: successAgent, run: runSuccessAgent },
  support: { definition: successAgent, run: runSuccessAgent },
  schedule: { definition: adminStrategyAgent, run: runAdminStrategyAgent },
  announcements: { definition: adminStrategyAgent, run: runAdminStrategyAgent }
};

function extractJson(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Ollama response did not include JSON');
    }

    return JSON.parse(match[0]);
  }
}

function normalizeActions(actions) {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions
    .filter((action) => action && action.title && action.detail)
    .slice(0, 3)
    .map((action) => ({
      title: String(action.title),
      detail: String(action.detail)
    }));
}

export default class OllamaAssistantEngine {
  constructor({ ollamaClient = new OllamaClient() } = {}) {
    this.ollamaClient = ollamaClient;
  }

  async buildReply(message, context) {
    const intent = detectIntent(message);
    const selected = agentByIntent[intent] || agentByIntent.support;
    const rawResponse = await selected.run({
      message,
      context,
      intent,
      ollamaClient: this.ollamaClient
    });
    const parsed = extractJson(rawResponse);

    if (!parsed.reply) {
      throw new Error(`${selected.definition.name} returned no reply`);
    }

    return {
      agent: selected.definition.name,
      intent,
      reply: String(parsed.reply),
      actions: normalizeActions(parsed.actions),
      engine: 'ollama',
      model: selected.definition.model
    };
  }
}
