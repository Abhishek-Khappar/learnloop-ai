# Docker guide — LearnLoop AI (for beginners)

This file is for you and your sister while you learn together. Read it once, then follow the steps.

## What you are running (big picture)

| Piece | What it is | In this project |
|--------|------------|-----------------|
| **Frontend** | The website you click (React) | `frontend/` — built into static files, served by **nginx** in Docker |
| **Backend** | A small server that answers API requests (Express) | `backend/` — listens on port **5000** inside the network |
| **LLM** | The “brain” that writes explanations (OpenAI) | Called from `backend/llm.js` when `OPENAI_API_KEY` is set; otherwise **demo text** |

**“Agentic AI”** in real products often means: an app that can *plan steps*, *call tools* (like search or APIs), and *loop* until a goal is met. This project is a **simple first step**: one topic in → one explanation or two questions out. You can grow it later with tools, memory, and agents.

## Why `http://localhost:5000` showed an error before

- Port **5000** is the **API only** (JSON over HTTP). It was never meant to be the main “app page.”
- Opening `/` in a browser sends **GET** `/`, but the API only defined **POST** `/explain` and `/questions`, so Express returned **404** (“Cannot GET /”).
- **Fix:** The backend now serves a small **GET /** help page and **GET /health**. The **real UI** is still the React app (dev: port **3000**, Docker: port **8080** below).

## Versions we expect

| Tool | Suggested |
|------|-----------|
| **Node.js** (local dev) | **20 LTS** (18+ usually works) — `node -v` |
| **Docker Desktop** (Windows/Mac) | Latest stable — includes Docker Compose |
| **npm** | Comes with Node — `npm -v` |

Inside Docker we use **node:20-alpine** and **nginx:alpine** so everyone gets the same environment.

## Run everything with Docker

From the **project root** (`learnloop-ai/`, where `docker-compose.yml` lives):

1. **Optional — real OpenAI answers**

   Copy the example env file and add your key:

   ```bash
   copy .env.example .env
   ```

   Edit `.env` and set `OPENAI_API_KEY=sk-...` (from [OpenAI API keys](https://platform.openai.com/api-keys)).  
   If you skip this, the app still runs using **demo** text (good for learning without spending money).

2. **Build and start**

   ```bash
   docker compose up --build
   ```

   First run downloads images and installs dependencies — it can take a few minutes.

3. **Open in the browser**

   - **Study app (use this):** [http://localhost:8080](http://localhost:8080)  
   - **API info page:** [http://localhost:5000](http://localhost:5000)  
   - **Health check:** [http://localhost:5000/health](http://localhost:5000/health)

4. **Stop**

   Press `Ctrl+C` in the terminal, or run `docker compose down` in another terminal from the same folder.

## How the pieces talk to each other in Docker

- The React build is served by **nginx** on port **8080** (mapped from container port 80).
- The browser loads the app from **8080**. When you click **Explain**, the app sends `POST /explain` to the **same host** (8080). Nginx forwards that to the **backend** service at `http://backend:5000/explain`.
- So you do **not** need to change `App.js` for Docker: paths stay `/explain` and `/questions`.

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| **Port already in use** | Another app uses 5000 or 8080. Stop that app, or edit `docker-compose.yml` to map different host ports (e.g. `"8081:80"`). |
| **Cannot connect from the app** | Run `docker compose ps` — both services should be “Up”. Check backend logs: `docker compose logs backend`. |
| **Still demo text** | Key missing or wrong in `.env`; restart: `docker compose up --build`. |

## Local dev without Docker (reminder)

- Terminal 1: `cd backend` → `npm start` (port **5000**)
- Terminal 2: `cd frontend` → `npm start` (port **3000** — CRA **proxy** sends API calls to 5000)

Use **http://localhost:3000** for the UI in that setup.
