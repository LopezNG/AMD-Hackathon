const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_TIMEOUT_MS = 45000;

export default class OllamaClient {
  constructor({ baseUrl = process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeoutMs = timeoutMs;
  }

  async generate({ model, prompt, format = 'json', options = {} }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          format,
          options: {
            temperature: 0.2,
            ...options
          }
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Ollama ${model} request failed with ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error(`Ollama ${model} returned an empty response`);
      }

      return data.response;
    } finally {
      clearTimeout(timeout);
    }
  }
}
