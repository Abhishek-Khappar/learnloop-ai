# LearnLoop AI

A small full-stack demo: **React** UI + **Node/Express** API that explains topics and generates practice questions using the **OpenAI API** (with a built-in demo mode when no key is set).

## Folder structure

```
learnloop-ai/
├── frontend/          # Create React App
├── backend/           # Express + OpenAI
├── prompts/           # Prompt text files used by the backend
├── docker-compose.yml # Run API + UI in Docker
├── DOCKER.md          # Beginner Docker + “why 404?” guide
└── README.md
```

## Why `localhost:5000` showed 404 (or “Cannot GET /”)

Port **5000** is the **API server**, not the React app. Until a route was added for **GET /**, opening `http://localhost:5000/` in the browser returned **404** because only **POST** `/explain` and `/questions` existed. That was not a wrong install — it was a missing “home page” for the API.

- **Use the study UI at** **http://localhost:3000** when you run the frontend with `npm start` (dev).
- **http://localhost:5000** now shows a short **API help page**; **GET /health** returns JSON for a quick check.

**Versions:** Node **20 LTS** recommended (`node -v`). Backend uses Express **5.x**, React **19** via CRA; see each `package.json` for exact ranges.

## Docker (you + teammate, same setup)

See **[DOCKER.md](./DOCKER.md)** for a full beginner guide. Quick start from the repo root:

```bash
copy .env.example .env
docker compose up --build
```

- **App:** [http://localhost:8080](http://localhost:8080)
- **API page:** [http://localhost:5000](http://localhost:5000)

## Setup without Docker (step by step)

1. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Configure environment (optional but recommended for real AI)**

   ```bash
   copy .env.example .env
   ```

   Edit `backend/.env` and set `OPENAI_API_KEY` from [OpenAI API keys](https://platform.openai.com/api-keys).  
   If you skip this, the app still runs using **demo text** (no network call to OpenAI).

3. **Start the API** (port **5000** by default)

   ```bash
   npm start
   ```

4. **Install and run the frontend** (new terminal)

   ```bash
   cd frontend
   npm install
   npm start
   ```

   The dev server (usually **http://localhost:3000**) proxies `/explain` and `/questions` to the backend on port 5000.

## Example requests

**Explain**

```http
POST http://localhost:5000/explain
Content-Type: application/json

{ "topic": "recursion" }
```

Example response:

```json
{
  "explanation": "Recursion is when a function calls itself..."
}
```

**Questions**

```http
POST http://localhost:5000/questions
Content-Type: application/json

{ "topic": "photosynthesis" }
```

Example response:

```json
{
  "questions": [
    "What inputs does photosynthesis need from the environment?",
    "Why is photosynthesis important for most food chains?"
  ]
}
```

## Scripts

| Location   | Command      | Purpose        |
|-----------|---------------|----------------|
| `backend` | `npm start`   | Run API server |
| `frontend`| `npm start`   | Run React dev  |
