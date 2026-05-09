# SupportPilot AI

Enterprise-grade AI customer support platform built with FastAPI, React, and LangGraph.

## Platform Summary

- AI customer support orchestration with LangGraph
- RAG pipeline for PDF knowledge ingestion (SentenceTransformers + FAISS)
- WhatsApp integration via Twilio webhooks
- Modern SaaS UI with analytics and chat workspace

## Architecture

- Backend: FastAPI (Python 3.11), SQLAlchemy, PostgreSQL
- Frontend: React + Vite + Tailwind CSS
- AI stack: LangChain, LangGraph, Gemini API, Sentence Transformers, FAISS
- Integrations: Twilio WhatsApp Sandbox

## Repository Structure

- backend/: FastAPI service
- frontend/: React web app
- docker-compose.yml: Local dev orchestration
- requirements.txt: Python dependencies
- .env.example: Environment variable template

## Setup Guide

See [docs/SETUP.md](docs/SETUP.md) for local setup details.

## Environment Variables

Backend (example values in [.env.example](.env.example)):
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `TWILIO_VALIDATE_WEBHOOK`

Frontend (example values in [frontend/.env.example](frontend/.env.example)):
- `VITE_API_BASE_URL`

## Local Development

Backend:

1) Create a virtual environment
2) Install dependencies: pip install -r requirements.txt
3) Start API: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Frontend:

1) cd frontend
2) npm install
3) npm run dev

Docker:

1) docker compose up --build

## Deployment

- Render: use [render.yaml](render.yaml)
- Vercel: use [vercel.json](vercel.json)
- Docker (prod): `docker compose -f docker/docker-compose.prod.yml up --build`

## Notes

- Update environment variables before running in production.