export interface GroqConfig {
  apiKey: string;
  apiUrl: string;
  model: string;
  fallbackModel: string;
}

export const groqConfig: GroqConfig = {
  apiKey: process.env.GROQ_API_KEY || "",
  apiUrl: "https://api.groq.com/openai/v1/chat/completions",
  model: "openai/gpt-oss-120b",
  fallbackModel: "openai/gpt-oss-20b",
};
