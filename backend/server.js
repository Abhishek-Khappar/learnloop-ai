/**
 * LearnLoop AI — Express API
 * POST /explain  — JSON { "topic": "..." } → { "explanation": "..." }
 * POST /questions — same body → { "questions": ["...", "..."] }
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { generateExplanation, generateQuestions } = require("./llm");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Browsers request GET / when you open http://localhost:5000/
 * The API only had POST routes before, so that showed "Cannot GET /" (404).
 * This route explains that the UI lives on the React dev server (or Docker frontend).
 */
app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>LearnLoop AI — API</title>
<style>body{font-family:system-ui,sans-serif;max-width:36rem;margin:2rem auto;padding:0 1rem;line-height:1.5}
code{background:#eee;padding:2px 6px;border-radius:4px}</style>
</head>
<body>
<h1>LearnLoop AI — backend API</h1>
<p>This port runs the <strong>API only</strong> (not the clickable study app). That is normal.</p>
<p><strong>To use the app:</strong> run the React frontend and open it in the browser (usually <code>http://localhost:3000</code>), or use Docker and open the URL shown in the guide.</p>
<h2>Endpoints (POST + JSON)</h2>
<ul>
<li><code>POST /explain</code> — body: <code>{"topic":"your topic"}</code></li>
<li><code>POST /questions</code> — same body → two practice questions</li>
<li><code>GET /health</code> — quick check that the server is up</li>
</ul>
</body>
</html>`);
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "learnloop-ai-backend" });
});

/** Shared validation for topic-based routes */
function getTopic(req, res) {
  const topic = typeof req.body?.topic === "string" ? req.body.topic.trim() : "";
  if (!topic) {
    res.status(400).json({ error: 'Send JSON body: { "topic": "your topic" }' });
    return null;
  }
  return topic;
}

app.post("/explain", async (req, res) => {
  const topic = getTopic(req, res);
  if (!topic) return;

  try {
    const explanation = await generateExplanation(topic);
    res.json({ explanation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate explanation." });
  }
});

app.post("/questions", async (req, res) => {
  const topic = getTopic(req, res);
  if (!topic) return;

  try {
    const questions = await generateQuestions(topic);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate questions." });
  }
});

app.listen(PORT, () => {
  console.log(`LearnLoop AI backend: http://localhost:${PORT}`);
  console.log(`  POST /explain   — explain a topic`);
  console.log(`  POST /questions — 2 practice questions`);
});
