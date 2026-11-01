import { groqConfig } from "../config/groq-config";
import { Logger } from "../utils/logger";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class GroqClient {
  private apiKey: string;
  private apiUrl: string;
  private model: string;

  constructor(apiKey = groqConfig.apiKey, model = groqConfig.model) {
    this.apiKey = apiKey;
    this.apiUrl = groqConfig.apiUrl;
    this.model = model;
  }

  async complete(messages: ChatMessage[], responseFormatJson = false): Promise<string | null> {
    if (!this.apiKey) {
      Logger.warn("GROQ_API_KEY environment variable is not set. Using local heuristic engine.");
      return null;
    }
    try {
      const payload: Record<string, unknown> = {
        model: this.model,
        messages,
        temperature: 0.2,
      };

      if (responseFormatJson) {
        payload.response_format = { type: "json_object" };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        Logger.warn(`Groq API responded with status ${response.status}: ${errorBody}`);
        return null;
      }

      const data = (await response.json()) as any;
      return data.choices?.[0]?.message?.content || null;
    } catch (err: any) {
      Logger.warn(`Groq LLM request failed or timed out: ${err.message}`);
      return null;
    }
  }
}
