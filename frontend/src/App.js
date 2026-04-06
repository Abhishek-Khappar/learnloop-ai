import { useState } from "react";

/**
 * LearnLoop AI — minimal single-page UI (dummy explanation for now).
 */
function App() {
  const [topic, setTopic] = useState("");
  const [response, setResponse] = useState("");

  const handleExplain = () => {
    const t = topic.trim();
    // Static text until you wire this to your backend / LLM
    setResponse(`This is a simple explanation of ${t}`);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>LearnLoop AI</h1>

      <label htmlFor="topic" style={styles.label}>
        Topic
      </label>
      <input
        id="topic"
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter a topic"
        style={styles.input}
      />

      <button type="button" onClick={handleExplain} disabled={!topic.trim()} style={styles.button}>
        Explain
      </button>

      {response ? (
        <section style={styles.output} aria-live="polite">
          {response}
        </section>
      ) : null}
    </div>
  );
}

// Inline styles keep this file self-contained (no extra CSS files required).
const styles = {
  page: {
    padding: 24,
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1.5,
  },
  title: { marginTop: 0 },
  label: { display: "block", marginBottom: 8, fontWeight: 600 },
  input: {
    width: "100%",
    padding: "8px 10px",
    marginBottom: 12,
    boxSizing: "border-box",
    fontSize: 16,
  },
  button: {
    padding: "8px 16px",
    fontSize: 16,
    cursor: "pointer",
  },
  output: {
    marginTop: 20,
    padding: 12,
    background: "#f4f4f5",
    borderRadius: 8,
  },
};

export default App;
