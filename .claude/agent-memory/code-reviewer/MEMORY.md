# Code Reviewer Agent Memory

## Project: EAIP (Enterprise AI Chatbot Platform)

### Key Facts
- 8 NestJS services (api-billing REMOVED, api-google-drive ADDED), 3 Next.js apps, 6 shared packages
- Ports: auth=8001, platform=8002, agents=8003, chat=8004, kb=8005, analytics=8006, embed=8007, google-drive=8008
- Infrastructure: MongoDB, Redis, Qdrant, MinIO, Traefik (NO Postgres, NO LiteLLM)
- Direct AI SDK integration (OpenAI, Anthropic, Google) -- no proxy

### Backend Audit Findings (2026-02-27)
- Report: `/home/ubuntu/eaip/plans/reports/code-review-260227-1700-backend-audit.md`
- **C1**: internalAuthSecret NOT in SENSITIVE_PATHS -> exposed in GET /platform/admin/settings
- **C2**: CORS wide open (origin: *) on 6/7 services (embed has DomainValidationGuard)
- **C3**: OAuth tokens leaked in redirect URL query params (should use auth code pattern)
- **H1**: api-platform missing RequestContextMiddleware (only service without it)
- **H3**: getConfigByWidgetId scans ALL tenant DBs sequentially (O(n) per cache miss)
- **H5**: LLM model-provider map stale after settings update (no reload mechanism)
- **M1**: Cross-tenant admin list/get pattern duplicated 4+ times (~200 lines)
- **M6**: DomainValidationGuard allows localhost bypass in production
- Files >200 lines: agents.service:331, auth.service:356, admin-settings:294, oauth.service:300

### Frontend Audit Findings (2026-02-27)
- Report: `/home/ubuntu/eaip/plans/reports/code-review-260227-1700-frontend-audit.md`
- `@repo/ui` package empty; all UI components duplicated in web-user + web-admin
- Admin OAuth button uses wrong URL path
- Admin `setAccessToken` does NOT persist to localStorage
- No security headers (CSP, X-Frame-Options, HSTS) in any next.config.ts
- ErrorBoundary exists in web-user but never used; missing in web-admin
- 0% frontend test coverage

### Documentation Staleness Patterns (2026-02-27 audit)
- README.md is the most stale doc (still lists api-billing, LiteLLM, Postgres, wrong ports)
- code-standards.md has entire billing section (~L1932-2038) that needs removal
- Report: `/home/ubuntu/eaip/plans/reports/code-reviewer-260227-1700-docs-staleness-audit.md`

### Removed Items (verify docs don't reference)
- api-billing service, BillingClient, SubscriptionSchema, BillingEventSchema, UsageQuotaSchema
- LiteLLM proxy, Postgres (was for LiteLLM spend tracking)
- LLM_MODEL_MAP, MODEL_TO_PROVIDER, LLM_PRICING, inferProvider, calculateCost
- Stripe/planLimits config, billingPlan/billingStatus on OrganizationSchema
- TenantGuard (split into TenantPublicGuard + TenantInternalGuard)
- @TenantDb() decorator, @CurrentUser() decorator

### Review Conventions
- Reports go to: `plans/reports/` with naming from hook injection
- Project follows YAGNI/KISS/DRY principles
- Guard patterns: JwtGuard, TenantPublicGuard, TenantInternalGuard, InternalGuard, PlatformAdminGuard
- All guards in @repo/utils (not per-service)

### Phase 14 Knowledge Pipeline Reviews (2026-02-27)
- Initial report: `/home/ubuntu/eaip/plans/260227-1913-phase-14-knowledge-pipeline/reports/code-review-phase14.md`
- Final report: `/home/ubuntu/eaip/plans/reports/code-review-260227-2212-phase-14-kb-pipeline-final.md`
- Post-fix verification: `/home/ubuntu/eaip/plans/reports/code-reviewer-260227-2248-phase14-kb-backend.md`
- **ALL PRIOR FIXES VERIFIED**: H1 archive guard, H2 MIME charset, H3 status precondition, M7 type field
- **APPROVED** -- 101 tests pass, TS compiles clean, 1 ESLint error (prefer-const)
- Remaining medium: EC-5 catch block no precondition, EC-7 Qdrant delete 404, EC-9 indexing processor precondition, EC-11 reindex skips stuck, EC-25 archive stale cleanup
- Still open suggestions: hardcoded gpt-4o-mini, ~12 `as any` casts, search service hardcodes strategy names
- Modules: file-upload, content-retrieval, content-indexing (strategies: vector, pageindex)
- 2-queue pipeline: content-retrieval (extract+chunk) -> content-indexing (per-strategy)
- Workers use sdk.tenantManager directly (not TenantContext) -- correct, no ALS in queue context

### Phase 15 Google Drive KB Review (2026-02-28)
- Cycle 1 report: `/home/ubuntu/eaip/plans/reports/code-review-260228-0612-auto-cycle1.md`
- Cycle 2 report: `/home/ubuntu/eaip/plans/reports/code-review-260228-0620-auto-cycle2.md`
- Cycle 3 report: `/home/ubuntu/eaip/plans/reports/code-review-260228-0637-auto-cycle1.md`
- Prior report: `/home/ubuntu/eaip/plans/reports/code-review-260228-0554-phase15-google-drive-kb.md`
- **ALL cycle 1/2 fixes VERIFIED in cycle 3**: C1 XSS, C2 secrets, H1/H2 IDOR, H3 Traefik, EC-2/EC-3 IDOR, EC-1 backoff, M7 job removal, M9 reschedule
- Cycle 3 findings: C1 postMessage targetOrigin='*', H1 Drive query injection, H2 delete order (counts after deleteOne)
- Medium: sync concurrency (no lock), deleteDocument 404, double DB query, Redis leak, Sheets unsupported
- Minor: fileIds no max size, Error vs NotFoundException, encrypted fields leaked to frontend

### Phase 16 Tools & Skills Review (2026-02-28)
- Cycle 1 report: `/home/ubuntu/eaip/plans/reports/code-review-260228-1927-phase16-cycle1.md`
- **C1**: SSRF bypass via hex IPv6-mapped IPv4 (::ffff:7f00:1 = 127.0.0.1, ::ffff:a9fe:a9fe = 169.254.169.254)
- **C2**: SSRF bypass via HTTP redirect (fetch follows 301/302 by default)
- **C3**: Admin agent API in api-platform leaks tool credentials (not updated with redactToolCredentials)
- **H1**: HTTP tool headers not filtered (Host, Transfer-Encoding injectable)
- **H3**: No URL format validation in ToolHandlerDto
- **H5**: AgentAdminService dead code (exported but never consumed)
- New modules: tools (execution, validation, rate-limit, SSRF, handlers), skills (resolver, CRUD)
- Tool loop: bounded by maxToolIterations (capped at 20), supports abort signal
- Three provider converters: OpenAI/Anthropic/Gemini tool format

### Review Checklist (learned patterns)
- Always check settings-masking.util.ts SENSITIVE_PATHS when secrets change
- Always verify RequestContextMiddleware in new service AppModules
- Check guard consistency: every controller must have appropriate guard decorator
- Internal endpoints often lack DTOs -- flag this each review
- Watch for cross-tenant scan patterns (O(n) orgs) in admin/internal services
- `as any` on .lean() results defeats TS -- prefer generic typing
- BullMQ processors run outside HTTP scope -- no ALS/TenantContext, must use sdk.tenantManager
- LLM prompts with user-generated content: always check for prompt injection
- BullMQ queues: always set removeOnComplete/removeOnFail to prevent Redis memory growth
- Concurrent queue jobs modifying same document: use atomic MongoDB operations
- Status enum checks in guards/conditions: verify they cover ALL intermediate pipeline states
- MIME type lookups: strip charset suffix before matching (`mimeType.split(';')[0].trim()`)
- Shared type interfaces: verify they include ALL fields that DTOs/frontend actually send
- OpenAI SDK `maxRetries` already retries -- avoid double-retry with manual loops on top
- React Query: same queryKey with different refetchInterval uses shortest interval across observers
- S3 batch deletes: prefer DeleteObjectsCommand over individual DeleteObjectCommand calls
- JSON.stringify does NOT escape `</script>` -- use `.replace(/</g, '\\u003c')` in inline scripts
- IDOR check: when endpoint takes resourceId + orgId, verify ownership (especially userId for user-scoped resources)
- Traefik PathPrefix routes expose ALL sub-paths including /internal/* -- always add deny rules
- BullMQ repeatable job removal: `.find(j => j.key.includes(id))` must NOT have fallback matching all jobs
- BullMQ backoff reschedule: after incrementing failure count, must call rescheduleConnection to update interval
- BullMQ backoff recovery: after successful sync, must reschedule back to base interval (otherwise stays on backoff)
- IDOR pattern: when resolveConnectionId accepts explicit ID, MUST verify ownership -- auto-resolve is safe but explicit bypass is not
- Fix verification: when IDOR fix adds ownership check to one endpoint, audit ALL endpoints that accept the same resourceId
- postMessage targetOrigin: NEVER use '*' -- always specify the expected receiver origin
- Drive API query strings: user-supplied IDs interpolated into `q:` param need quote escaping or format validation
- DB delete ordering: decrement counters BEFORE deleteOne to prevent permanently inflated counts on partial failure
- .lean() returns ALL fields including secrets -- always use projection when returning to clients
- Redis instances created in constructors need OnModuleDestroy cleanup (quit/disconnect)
- BullMQ concurrent jobs on same resource: use distributed lock (Redis SETNX) or jobId dedup for both repeatable and immediate jobs
- DTO arrays from user input: always add @ArrayMaxSize to prevent DoS via resource amplification
- NestJS exception consistency: throw NotFoundException/ForbiddenException, never generic Error (causes 500 instead of proper status)
- SSRF validators: IPv6-mapped IPv4 has TWO forms -- dotted (::ffff:127.0.0.1) AND hex (::ffff:7f00:1) -- must check BOTH
- SSRF validators: fetch() follows redirects by default -- use redirect:'error' or re-validate Location header
- SSRF validators: dns.lookup() returns only ONE address -- use { all: true } for multi-homed hosts
- HTTP outbound: filter dangerous request headers (Host, Transfer-Encoding, Connection, internal auth headers)
- When extracting admin logic to new service: verify ALL consumers are updated (not just api-agents, also api-platform)
- Scope escalation: UpdateDTOs that use $set can overwrite fields not intended for user modification (like scope)
- Gemini tool format: type names must be uppercased AND complex types (array, object) need recursive conversion
