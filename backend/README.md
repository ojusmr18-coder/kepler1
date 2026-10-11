# Kepler Learning Platform: Backend Engineering Directory

Welcome to the **Backend Package** for the Kepler Learning Platform / PySustain system. This folder contains all the files, contracts, specifications, route implementations, and data stores needed for backend engineers to develop, extend, or migrate the API.

---

## Folder Structure

```
backend/
├── README.md                 # This overview guide for backend engineers
├── openapi.yaml              # Authoritative OpenAPI 3.1.0 Contract
├── API_DOCUMENTATION.md      # Full REST API documentation for all 34 endpoints
├── AGENTS.md                 # Architecture & handler guidelines
│
├── docs/                     # Specifications & API Documentation
│   ├── openapi.yaml          # OpenAPI 3.1.0 specification
│   ├── API_DOCUMENTATION.md  # Detailed endpoint guide
│   └── AGENTS.md             # Architecture matrix
│
├── api/                      # Next.js App Router API Handlers (REST Endpoints)
│   ├── auth/                 # Login, Logout, Profile, Change Password
│   ├── classroom/            # Blackboard To-Do tasks
│   ├── dashboard/            # Calendar & Schedule
│   ├── learn/                # Subjects, Chapters, Materials, Flashcards, Notes
│   ├── test/                 # Quiz details, Submit (+1/0), Results, Custom Tests
│   ├── ai/                   # Socratic Doubt Solver & Allie AI Tutor Chat Session
│   ├── score-booster/        # Score status & gamified practice tasks
│   ├── mistakes/             # Improvement book mistake logging & review
│   ├── papers/               # Sample and PYQ examination papers
│   └── pdf/                  # Dynamic PDF binary streaming
│
├── types/                    # Strongly Typed Contracts
│   └── api.ts                # TypeScript interfaces for requests & responses
│
├── lib/                      # Backend Data Layer & State Store
│   └── serverStore.ts        # In-memory database, scoring logic, session memory
│
└── services/                 # Frontend Client SDK
    └── apiClient.ts          # Typed fetch SDK communicating with the API
```

---

## Key Files for Backend Developers

1. **OpenAPI 3.1.0 Spec (`openapi.yaml` & `docs/openapi.yaml`)**:
   - Ready for import into **Postman**, **Swagger UI / Swagger Editor**, **Insomnia**, or code generators (`openapi-generator`, `datamodel-code-generator`).
   - Defines all 34 routes, JSON schemas, parameters, and Bearer token security.

2. **API Documentation (`API_DOCUMENTATION.md`)**:
   - Complete human-readable breakdown of every endpoint with HTTP Method, Path, Purpose, JSON request body, JSON response body, and status codes.

3. **Data Contracts (`types/api.ts`)**:
   - Authoritative source of truth for all payload shapes.
   - Includes interfaces like `StudentProfile`, `UpdateProfileRequest`, `ChangePasswordRequest`, `TestResultData`, `DoubtSolveResponse`, `ScoreBoosterStatusResponse`, etc.

4. **Data Logic & In-Memory Store (`lib/serverStore.ts`)**:
   - Implementation of scoring engine (+1 per correct answer, 0 penalty), CBSE Class 10 curriculum tree, AI dialogue history persistence, and student profile/password state.

5. **Route Handlers (`api/`)**:
   - Production Next.js 14 App Router API endpoint implementations. Can easily be ported to Express, FastAPI, NestJS, or Go.
