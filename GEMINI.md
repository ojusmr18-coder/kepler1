# Antigravity Workspace Rule: Backend Handler Directives

Refer to [`AGENTS.md`](file:///c:/pysustain%201/AGENTS.md) and [`openapi.yaml`](file:///c:/pysustain%201/openapi.yaml) for the authoritative API specification.

## Core Directives for Backend Handlers
1. **Target Protocol**: REST API JSON endpoints matching OpenAPI 3.1.0 specification at `openapi.yaml`.
2. **Type Safety**: Strongly-typed payload contracts defined in `src/types/api.ts`.
3. **Authentication**: JWT Bearer token authentication required for student-specific resources (`/api/classroom/*`, `/api/score-booster/*`, `/api/ai/*`).
4. **CORS Configuration**: Allow requests from `http://localhost:3000` and `http://localhost:3001` with headers `Content-Type`, `Authorization`.
5. **AI Integration**:
   - `/api/ai/doubt-solve`: Must support the 3 pedagogical modes (`socratic`, `detailed`, `exam`).
   - `/api/ai/chat`: Must maintain multi-turn memory session for Allie AI tutor.
