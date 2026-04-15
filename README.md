# QamqorZoo

Monorepo:
- `frontend/` — React + Vite (deploy to **Vercel**)
- `backend/` — FastAPI + SQLAlchemy + SQLite (deploy to **Render**)

## Local development

### Backend
1. Create venv and install deps:
   - `pip install -r backend/requirements.txt`
2. Run API:
   - `uvicorn backend.main:app --reload --port 8000`

### Frontend
1. Install deps:
   - `cd frontend && npm i`
2. Run dev server:
   - `npm run dev`

---

## Deploy backend to Render (FastAPI)

### 1) Render service settings
Create **Web Service** from this repo.

- **Root Directory**: `backend`
- **Environment**: Python
- **Build Command**:
  - `pip install -r requirements.txt`
- **Start Command**:
  - `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2) Environment variables (Render)
Add in Render → *Environment*:

- `DATABASE_URL`
  - for this project: `sqlite:///./qamqorzoo.db`
- `CORS_ORIGINS`
  - recommended: your Vercel domain(s) separated by commas, e.g.
    - `https://your-frontend.vercel.app,https://your-custom-domain.com`
  - temporary for testing: `*`

### 3) Notes (SQLite on Render)
This project uses SQLite file `qamqorzoo.db`. On Render free instances, the filesystem can be ephemeral; data may reset on redeploy/restart.

If you need persistent data, switch to Postgres (Render provides managed Postgres) and set `DATABASE_URL` accordingly.

---

## Deploy frontend to Vercel (React/Vite)

### 1) Vercel project settings
Create a new Vercel project from this repo.

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2) Environment variables (Vercel)
Set in Vercel → *Settings → Environment Variables*:

- `VITE_API_BASE` — URL of Render backend, e.g.
  - `https://your-render-service.onrender.com`

### 3) SPA routing (React Router)
`frontend/vercel.json` contains a rewrite to `index.html` so that routes like `/animals/1` work after refresh.

---

## Required deploy files

### Backend
- `backend/render.yaml` — optional infra-as-code for Render

### Frontend
- `frontend/vercel.json` — SPA rewrite for React Router
.