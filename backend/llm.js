/**
 * LearnLoop AI — LLM helpers
 * Uses OpenAI when OPENAI_API_KEY is set; otherwise returns friendly mock text for local learning.
 */

const fs = require("fs");
const path = require("path");

// Resolve repo root: backend/ -> learnloop-ai/
const PROMPTS_DIR = path.join(__dirname, "..", "prompts");

function readPromptFile(filename) {
  const full = path.join(PROMPTS_DIR, filename);
  return fs.readFileSync(full, "utf8").trim();
}

/** Mock explanation when no API key (or on failure) — keeps the app runnable for beginners. */
function mockExplanation(topic) {
  return (
    `[Demo mode — add OPENAI_API_KEY in backend/.env for real AI]\n\n` +
    `**${topic}** is a great topic to learn. In simple terms: imagine you're building a small mental map — ` +
    `start with the main idea, then add 2–3 examples, and finish with why it matters. ` +
    `Try explaining it aloud in one minute; if you can, you've understood the basics.`
  );
}

/** Mock questions for demo mode */
function mockQuestions(topic) {
  return [
    `What is the single most important idea about "${topic}"?`,
    `Give one real-world example where "${topic}" shows up.`,
  ];
}

async function callOpenAI(messages, options = {}) {
  const OpenAI = require("openai");
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: options.temperature ?? 0.7,
  });

  const text = completion.choices[0]?.message?.content;
  return typeof text === "string" ? text.trim() : "";
}

/**
 * @param {string} topic
 * @returns {Promise<string>}
 */
async function generateExplanation(topic) {
  const system = readPromptFile("explain.txt");

  try {
    const text = await callOpenAI(
      [
        { role: "system", content: system },
        { role: "user", content: `Topic: ${topic}` },
      ],
      { temperature: 0.6 }
    );

    if (text) {
      return text;
    }
  } catch (err) {
    console.error("OpenAI explain error:", err.message);
  }

  return mockExplanation(topic);
}

/**
 * Parse JSON from model; tolerate extra whitespace or minor issues.
 * @param {string} raw
 * @returns {{ questions: string[] } | null}
 */
function parseQuestionsJson(raw) {
  if (!raw) return null;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1));
    if (
      parsed &&
      Array.isArray(parsed.questions) &&
      parsed.questions.length >= 2
    ) {
      return {
        questions: [String(parsed.questions[0]), String(parsed.questions[1])],
      };
    }
  } catch (_) {
    /* ignore */
  }
  return null;
}

/**
 * @param {string} topic
 * @returns {Promise<string[]>}
 */
async function generateQuestions(topic) {
  const system = readPromptFile("questions.txt");

  try {
    const text = await callOpenAI(
      [
        { role: "system", content: system },
        { role: "user", content: `Topic: ${topic}` },
      ],
      { temperature: 0.8 }
    );

    if (text) {
      const parsed = parseQuestionsJson(text);
      if (parsed) {
        return parsed.questions;
      }
    }
  } catch (err) {
    console.error("OpenAI questions error:", err.message);
  }

  return mockQuestions(topic);
}

module.exports = {
  generateExplanation,
  generateQuestions,
  mockExplanation,
  mockQuestions,
};
