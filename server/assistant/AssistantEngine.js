import OllamaAssistantEngine from './OllamaAssistantEngine.js';
import RuleBasedAssistantEngine from './RuleBasedAssistantEngine.js';

export default class AssistantEngine {
  constructor({
    ollamaAssistantEngine = new OllamaAssistantEngine(),
    ruleBasedAssistantEngine = new RuleBasedAssistantEngine()
  } = {}) {
    this.ollamaAssistantEngine = ollamaAssistantEngine;
    this.ruleBasedAssistantEngine = ruleBasedAssistantEngine;
  }

  async buildReply(message, context) {
    try {
      return await this.ollamaAssistantEngine.buildReply(message, context);
    } catch (error) {
      console.warn(`Ollama assistant unavailable, using rule-based fallback: ${error.message}`);
      return {
        ...this.ruleBasedAssistantEngine.buildReply(message, context),
        engine: 'rule-based',
        fallbackReason: error.message
      };
    }
  }
}
