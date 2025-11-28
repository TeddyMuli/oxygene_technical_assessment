# Bookmarks — Oxygene Technical Assessment

AI-powered bookmark manager for saving, organizing, and automatically summarizing web bookmarks.

## Overview

A full-stack, containerized microservices application that combines a React frontend, a FastAPI backend, PostgreSQL for storage, and an AI service (Google Gemini) for generating bookmark summaries.

## Honesty Declaration

I confirm that this submission is my own work. I have:

- [x] Not copied code from existing solutions or other candidates
- [x] Used AI assistants only for syntax help and debugging specific errors
- [x] Not received human help during the assignment period
- [x] Built the core logic and architecture myself
- [x] Cited any references used for specific solutions

## Architecture

Components:
- Frontend
    - Next.js (TypeScript)
    - Handles UI, routing, and server-side rendering (SSR)
- Backend
    - FastAPI (Python)
    - Authentication, database operations, background tasks, and REST API
- Database
    - PostgreSQL for persistent storage of users, bookmarks, and tags
- AI Service
    - Google Gemini API for content summarization
- DevOps
    - Docker and Docker Compose for consistent development and deployment
    - Render for the backend
    - Vercel for the frontend

## Data Model

1. User
     - Description: Registered account holder
     - Relationships:
         - One-to-Many with Bookmark (a user owns multiple bookmarks)
         - One-to-Many with Tag (tags are private and scoped to a specific user)

2. Bookmark
     - Description: A saved web link with metadata and AI-generated content
     - Key fields: Title, URL, Description, AI Summary
     - Relationships:
         - Belongs to one User
         - Many-to-Many with Tag (a bookmark can have multiple tags)

3. Tag
     - Description: Label used to categorize bookmarks
     - Key fields: Name
     - Relationships:
         - Belongs to one User
         - Many-to-Many with Bookmark (a tag can be applied to multiple bookmarks)

4. BookmarkTag
     - Description: Association table facilitating the Many-to-Many relationship between Bookmarks and Tags

## Tech Stack

- Frontend
    - Next.js 14
    - TypeScript, React
    - Server-Side Rendering (SSR)
- Styling
    - Tailwind CSS
- Backend
    - FastAPI (async support, automatic OpenAPI/Swagger docs)
- ORM
    - SQLModel (SQLAlchemy + Pydantic)
- Database
    - PostgreSQL
- AI
    - Gemini 1.5 Flash (text summarization)
- DevOps
    - Docker & Docker Compose

## Getting Started

Prerequisites:
- Docker & Docker Compose
- Google Gemini API key

Installation:
1. Clone the repository:
     ```bash
     git clone https://github.com/your-username/bookmark-manager.git
     cd bookmark-manager
     ```
2. Create a `.env` file in the project root with:
     ```env
     GEMINI_API_KEY=your_google_gemini_key_here
     ```
3. Build and run with Docker Compose:
     ```bash
     docker-compose up --build
     ```

Access:
- Frontend: http://localhost:3000
- Backend API docs (Swagger/OpenAPI): http://localhost:8000/docs

## CI/CD Pipeline

- Workflow: .github/workflows/build-and-push.yml
- Trigger: push to main branch
- Action: build optimized Docker images for frontend and backend
- Registry: push images to GitHub Container Registry (GHCR)

## Testing

Run backend tests:
```bash
# Enter the backend container
docker-compose exec backend bash

# Run tests
pytest
```
