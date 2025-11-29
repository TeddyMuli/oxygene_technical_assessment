# Bookmarks — Oxygene Technical Assessment

AI-powered bookmark manager for saving, organizing, and automatically summarizing web bookmarks.

## Overview

A full-stack, containerized microservices application that combines a React frontend, a FastAPI backend, PostgreSQL for storage, and an AI service (Google Gemini) for generating bookmark summaries.

## Live Project
- Fronted - https://oxygene-bookmarks.vercel.app/
- Backend - https://oxygene-bookmarks.onrender.com/docs

## Docker Images
- Frontend - https://hub.docker.com/repository/docker/teddymuli/bookmarks-frontend/general
- Backend - https://hub.docker.com/repository/docker/teddymuli/bookmarks-backend/general

## Getting Started

Prerequisites:
- Docker & Docker Compose
- Google Gemini API key
- Python
- Nodejs

Installation:
1. Clone the repository:
     ```bash
     git clone https://github.com/TeddyMuli/oxygene_technical_assessment
     cd oxygene_technical_assessment
     ```
2. Navigate into the Backend:
     ```bash
     cd backend
     ```
3. Create a secret key:
     ```bash
      openssl rand -base64 64 
     ```
4. Create an env file:
     ```bash
     cp .env.example .env
     ```
5. Add you environment variables
6. Navigate into the Frontend:
     ```bash
     cd frontend
     ```
7. Create an env file:
     ```bash
     cp .env.local .env
     ```
8. Add your environment variables
8. Run the backend:
     ```bash
     fastapi run main.py
     ```
9. Run the frontend:
     ```bash
     pnpm dev
     ```

Access:
- Frontend: http://localhost:3000
- Backend API docs (Swagger/OpenAPI): http://localhost:8000/docs

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
    - Aiven for the live database

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

## ML Integration Approach
I integrated the Gemini 2.5 flash api to generate summaries of the included bookmarks.

### Approach
1. Save bookmark
2. Scrape the url using BeautifulSoup
3. Pass the scraped text to the gemini api
4. Save the AI summary

## Tech Stack

- Frontend
    - Next.js 16
    - TypeScript, React
    - Server-Side Rendering (SSR)
- Styling
    - Tailwind CSS
    - Shancn UI
- Backend
    - FastAPI (async support, automatic OpenAPI/Swagger docs)
- ORM
    - SQLModel (SQLAlchemy + Pydantic)
- Database
    - PostgreSQL
- AI
    - Gemini 2.5 Flash
- DevOps
    - Docker & Docker Compose
    - Render
    - Vercel

## CI/CD Pipeline

- Workflow: .github/workflows/build-and-deploy.yml
- Trigger: push to main branch
- Action: build optimized Docker images for frontend and backend
- Registry: push images to DockerHub

## Testing

Run backend tests:
```bash
# Enter the backend container
docker-compose exec backend bash

# Run tests
pytest
```

## Production Roadmap
The current implementation has a few challenges, namely:
1. Weak authentication
 - The user can create a very weak password.
 - The token is stored in local storage.
 - The token lasts for a week rather than a short time with refresh tokens.
2. Poor user experience.
 - The user has to create the description and tags
3. Poor perfomance
 - The api calls are slow
 - The AI response is slow

Suggested fixes in a production environemnt.
1. Authentication
 - Robust validation system to ensure users create strong passwords.
 - Creation of short lived refresh tokens
 - Save the tokens in secure http-only cookies
2. User experience
 - Allow the user to just enter a url and generate the title, description and tags.
3. Perfomance
 - Use of production grade servers.
 - Use of queues and background tasks for AI calls

## Honesty Declaration

I confirm that this submission is my own work. I have:

- [x] Not copied code from existing solutions or other candidates
- [x] Used AI assistants only for syntax help and debugging specific errors
- [x] Not received human help during the assignment period
- [x] Built the core logic and architecture myself
- [x] Cited any references used for specific solutions
