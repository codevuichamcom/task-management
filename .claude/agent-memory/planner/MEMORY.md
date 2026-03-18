# Planner Agent Memory

## Project Context
- 7 NestJS services (ports 8001-8007), 3 Next.js apps (3000-3002)
- Single GCP VM, Docker Compose = production
- Platform settings in MongoDB `platform_settings` collection
- Inter-service calls via @repo/service-sdk typed clients

## Architecture Decisions
- Prefer internal NestJS modules over new services (container overhead ~200MB each, YAGNI)
- Module extraction to service: only when independent scaling needed
- Strategy pattern for extensibility points (file extractors, indexing strategies)

## Key Patterns Observed
- SharedServicesModule (@Global) for cross-cutting infra — consider replacing with explicit imports per module
- BullMQ processors extend WorkerHost, must be in same module as queue registration
- tenant DB via `sdk.tenantManager.getTenantDb(orgId)` in workers (no ALS context)
- TenantContext DI in request-scoped services (controllers/services with ALS)
- KnowledgeBaseClient.searchDocuments() is only inter-service search API (consumed by api-chat)

## Phase 14 Plan Location
- Plan dir: `plans/260227-1913-phase-14-knowledge-pipeline/`
- 7 phases, recommended execution order: 6 -> 1 -> 2 -> 3 -> 4 -> 5 -> 7
- Total effort estimate: 20h

## Phase 15 Plan Location
- Plan dir: `plans/260227-2311-phase15-google-drive-kb/`
- 5 phases: OAuth setup -> Drive import -> Sync/reindex -> Vertex alternative (ref only) -> Testing
- Recommended order: 1 -> 2 -> 3 -> 5 (Phase 4 is reference-only)
- Total effort estimate: 16h
- Two approaches compared: Self-implement (recommended) vs Vertex AI RAG Engine
- Key decision: Self-implement wins on cost ($0 vs $65+/mo), control (pageindex preserved), and no lock-in

## KB Service Architecture Notes
- IIndexingStrategy: vector + pageindex strategies, multi-provider injection via INDEXING_STRATEGIES token
- IContentExtractor: 5 extractors (PDF, DOCX, plaintext, JSON, XML), keyed by MIME type
- Upload pipeline: validate -> S3 -> KbDocument(pending) -> content-retrieval queue -> extract -> content-indexing queue
- BullMQ queues: content-retrieval, content-indexing (both concurrency:5, 3 retries exponential)
- KbDocument tracks indexingStatus as Map<strategy, {status, error, itemCount}>
- KnowledgeBase schema has indexingStrategies[] enum: 'vector' | 'pageindex'
- Existing Google OAuth in api-auth is login-only (openid scope, no Drive access) — Drive OAuth is separate

## Rename Chatbot-to-Agent Plan
- Plan dir: `plans/260228-2253-rename-chatbot-to-agent/`
- 7 phases: shared-packages -> api-agents -> consuming-services -> frontend -> infra -> mongodb-migration -> docs
- Execution order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 (strict dependency chain)
- Total effort estimate: 12h
- ~3155 occurrences across ~144 files (incl docs, plans, skills data)
- Key decisions: full rename (service dir, URL prefix, DB collections, Docker name)
- Skills controller path bug FIXED during rename: `@Controller('agents/public/skills')` with globalPrefix `agents` was a double prefix — corrected to `@Controller('public/skills')`
- web-admin ADMIN_AGENTS_STATS path fixed during rename to match controller route

## Tool Loop Migration + New Tools Plan
- Plan dir: `plans/260301-0953-tool-loop-migration-and-new-tools/`
- 9 phases: LLM move -> Tool exec move -> Skill resolver move -> Orchestration endpoint -> query_database -> ask_human -> api-chat thin -> Frontend UI -> Cleanup
- Parallel phases: 1,2,3 can run together; 5 after 2; 6 after 4; 7 after 4; 8 after 6+7; 9 last
- Total effort estimate: 24h
- Key decisions: LLM stays local to api-agents (no shared package), ask_human uses Redis BRPOP, query_database read-only with collection whitelist
- New endpoint: POST /agents/internal/orchestrate (streaming SSE)
- New ISSEChunk fields: finalContent, toolCalls, ask_human_prompt (all optional, backward compat)
- Copy-then-delete strategy: files copied to api-agents first, deleted from api-chat in Phase 7
- api-chat after migration: thin proxy (messages, conversations, context builder, SSE relay)
- api-agents after migration: owns LLM orchestration, tool execution, skill resolution, 6 builtin tools

## Port Assignments
- 8001: api-auth, 8002: api-platform, 8003: api-agents (was api-chatbots)
- 8004: api-chat, 8005: api-knowledge-base, 8006: api-analytics, 8007: api-embed
