# SupportPilot AI Setup Guide

This guide covers local development and deployment basics for the SupportPilot AI platform.

## Prerequisites

- Node.js 20+
- Python 3.11
- Docker (optional for local orchestration)
- PostgreSQL (local or Docker)

## Backend Setup

1) Create a virtual environment and activate it.
2) Install dependencies: pip install -r requirements.txt
3) Copy .env.example to .env and fill in values.
4) Run the API:

```
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

1) cd frontend
2) npm install
3) Copy frontend/.env.example to frontend/.env
4) Run the app:

```
npm run dev
```

## Docker Setup

```
docker compose up --build
```

## Common Environment Variables

Backend:
- DATABASE_URL
- GEMINI_API_KEY
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN

Frontend:
- VITE_API_BASE_URL
