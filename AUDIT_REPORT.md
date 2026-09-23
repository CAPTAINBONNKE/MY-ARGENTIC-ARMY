# MY-ARGENTIC-ARMY — Conformance Check + Read-Only Audit

**Repo:** `CAPTAINBONNKE/MY-ARGENTIC-ARMY` @ `dd26538` · **Branch:** `arena/01a0cde0-my-argentic-army`
**Date:** 2026-09-23 · **Mode:** read-only analysis (no feature code written)

**Checks actually executed this session**

| Check | Command | Result |
|---|---|---|
| Typecheck | `npm run lint` (`tsc --noEmit`) | ✅ exit 0, no errors |
| Build | `npm run build` (vite + esbuild) | ✅ exit 0 |
| Vuln scan | `npm audit` | ✅ `found 0 vulnerabilities` |
| Server boot | `node dist/server.cjs` | ✅ listening 0.0.0.0:3000 |
| Live API | `curl /api/health`, `/api/agents` | ✅ `total_agents: 50` |
| Conformance diff | custom `tsx` script vs pasted spec | see §1 |

---

## 1. Conformance to `_manifest.json` — **YES on content, NO on storage format**

### 1a. Content conformance: PASS

I diffed the pasted spec against `src/data/agents.ts` field by field (script run via `npx tsx`, real import of the module — not a re-parse of text):

| Assertion | Result |
|---|---|
| `total_agents: 50` vs `AGENTS_DATA.length` | **50 = 50** ✅ |
| `load_order: "sequential"` vs array order | ids are exactly `1..50` in array position ✅ |
| All 50 `files[]` names → `role_name` | **ALL 50 MATCH** ✅ |
| `library_version` / `load_order` / `default_model_config` | reconstructed byte-identical ✅ |
| Agents **#1–#19** `system_prompt` | **character-exact match**, all 19 ✅ |
| Agents **#1–#19** `category`, `tools_required`, `model_config`, `linked_workflows` | **exact match** ✅ |
| Agent **#20** `system_prompt` | spec truncated at 455 chars; actual is 525 chars and starts with it → **prefix OK** |
| Per-agent provider / model | `["ollama"]` / `["qwen2.5:14b"]` — **50/50** ✅ |

**Scope limit (honest gap):** your pasted document is cut off mid-record at agent #20 (`"OUTPUT JSON: {dataset_manifest, quali`). So `tools_required`/`model_config` for #20 and *all* fields for **#21–#50** could not be compared — only their ids, order, and `role_name`s (from the `files[]` list) are assertable. Send me the rest of the doc and I'll finish that half of the diff.

> ⚠️ **Two corrections to my own first pass.** (1) My initial checker title-cased `ai_` → `"Ai"` and reported 50 false "mismatches" — that was a bug in my script, not in your app; fixed and re-run. (2) I then reported agent #20 `tools_required` as diverged (`["supabase","apify","n8n"]` vs `["supabase","apify","ollama"]`) — **that was my error too**: your doc was truncated before that field, so I had invented the expected value. The assertion was removed. **Corrected verdict: agents 1–20 have zero real divergences.**

### 1b. Format conformance: FAIL — three structural deviations

| Spec says | Repo actually has | Verdict |
|---|---|---|
| A `_manifest.json` file | **No such file.** `find . -name "_manifest.json"` → empty; also absent from all git history | ❌ |
| 50 discrete files `01_ai_content_curator.json` … `50_ai_trend_prediction_analyst.json` | **No `agents/` dir, no JSON files.** Everything is one 841-line TS const `AGENTS_DATA` in `src/data/agents.ts` | ❌ |
| Agent objects have 7 keys | Every agent carries **5 extra UI keys**: `description`, `capabilities`, `example_input`, `output_schema_preview`, `iconName` (50/50 each) | ⚠️ superset |

**Why this is better than the spec, not worse:** the app *derives* the manifest instead of shipping it. `src/components/ManifestHub.tsx:19-34` rebuilds it at runtime, and I executed that exact derivation:

```
library_version  : "1.0.0" == spec
total_agents     : 50 == spec
load_order       : "sequential" == spec
default_model_cfg: IDENTICAL to spec
files[] (50)     : ALL 50 FILENAMES REPRODUCED EXACTLY
agent JSON keys  : ["id","role_name","category","system_prompt","tools_required","model_config","linked_workflows"] == spec doc key order: true
```

So a single source of truth (`agents.ts`) regenerates the exact spec you pasted, plus exports Ollama Modelfiles and n8n node specs. **No drift is possible between manifest and agents** — which is the failure mode the file-based layout invites.

**The one real risk of the inline layout:** `src/data/agents.ts` is imported by **both** the browser bundle and the server (`server/controllers/agentController.ts:2`, `server/db/database.ts:4`). Any agent edit is a client-bundle change requiring a rebuild + redeploy — no hot-swap, no DB-level versioning, no `library_version` bump tracking.

### 1c. The material finding: `model_config` is decorative

The spec's whole point is `provider: "ollama"` / `model: "qwen2.5:14b"` with `openai/gpt-4o-mini` fallback. **None of that executes.** Every read of `model_config` in the codebase:

```
server/services/protocolService.ts:105   -> agent.model_config.temperature   (ONLY functional read)
src/components/AgentCard.tsx:38          -> display
src/components/AgentModal.tsx:205,210,214 -> display
src/components/AgentTerminal.tsx:33,48   -> display/initial state
src/components/ManifestHub.tsx:21,42,52  -> display/export
```

`provider` and `model` are **only ever rendered as text**. Every actual inference call is hardcoded to `gemini-3.7-flash` (10 call sites: `missionService.ts:80,175`, `protocolService.ts:106`, `androidReActService.ts:45`, `keepService.ts:59`, `androidController.ts:39`, `missionController.ts:60`, `healthController.ts:17`, `apiSchemas.ts:79`). Confirmed at runtime — `/api/health` returns `"gemini_configured": false, "default_model": "gemini-3.7-flash"`.

There is **no Ollama client and no OpenAI client installed** (`grep` for SDK imports → empty; neither is in `package.json`). So:
- `fallback_provider: "openai"` / `fallback_model: "gpt-4o-mini"` → **0/50 agents carry these**; nothing implements fallback.
- `max_tokens: 4096` → **0/50 agents carry it**; never sent to the API.
- `default_model_config.temperature: 0.7` → only **5/50** agents actually use 0.7.

`PromptLab.tsx:98` even offers a UI option literally labelled `"qwen2.5:14b / gemini-3.7-flash"`, which is sent as `targetModel` and then ignored in favour of the hardcoded value.

**Verdict:** the app is *documentation-conformant* but *execution-divergent*. The 50-agent library is faithfully preserved as a prompt/spec library; the runtime is a Gemini-only app.

---

## 2. Verified defects (reproduced live, not inferred)

### 🔴 D1 — Agent Terminal is completely broken (dead endpoint)
`src/components/AgentTerminal.tsx:61` POSTs to **`/api/execute`**. No such route exists.

```
curl -X POST http://localhost:3000/api/execute  ->  404  "Cannot POST /api/execute"
```

Probing every endpoint the frontend calls — `/api/execute` is the **only** 404; all 16 others resolve.

The correct route is `/api/protocol/dispatch` (`server/routes/protocolRoutes.ts:25`), and the payload AgentTerminal already sends — `{agentId, input, temperature}` — is an exact match for `ProtocolDispatchSchema`. I proved it works:

```
curl -X POST /api/protocol/dispatch -d '{"agentId":1,"input":"hello","taskTitle":"probe"}'
-> 200 {"status":"success","agentId":1,"agentName":"AI Content Curator","output":"```json..."}
```

**Fix: one line** — `AgentTerminal.tsx:61` `'/api/execute'` → `'/api/protocol/dispatch'`.

Secondary bug on the same path (`AgentTerminal.tsx:73`): `throw new Error(err.error || ...)` passes the *object* `{code, message}`, not a string. But because the 404 returns HTML, `response.json()` throws first. The exact message users see today:

```
"Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON"
```

Should be `err.error?.message`.

### 🔴 D2 — Firebase credentials committed to git
`firebase-applet-config.json` is **tracked** (`git ls-files` confirms) and **not ignored** (`git check-ignore` → no match; `.gitignore` patterns `*credentials*.json` / `*secret*` don't match the filename). It contains a Firebase web `apiKey`, `oAuthClientId`, `projectId`, `storageBucket` — present since commit `dd26538`.

Caveat, stated honestly: Firebase **web** API keys are designed to be public identifiers, not secrets, so this is not automatically a breach. But it exposes your project identity, enables quota abuse/enumeration, and the OAuth client ID plus `storageBucket` meaningfully widen the attack surface. Real protection has to be **Firebase Security Rules + App Check** — I did not verify those here (out of repo scope). At minimum: gitignore it, inject at build time, rotate.

### 🟠 D3 — Missing security headers; deprecated one still sent
Live `curl -I http://localhost:3000/`:

```
X-Powered-By: Express                      <- framework fingerprint leaked
X-Content-Type-Options: nosniff            ✓
X-Frame-Options: SAMEORIGIN                (legacy)
Referrer-Policy: strict-origin-when-cross-origin ✓
X-XSS-Protection: 1; mode=block            <- removed from modern browsers; spec says omit or 0
(no Content-Security-Policy)
(no Strict-Transport-Security)
(no Permissions-Policy)
```

`grep` across the repo confirms **no CSP, no HSTS, no Permissions-Policy, no `helmet`** anywhere. `server/middleware/securityHeaders.ts` sets four headers by hand.

2026 baseline (Helmet 8.x, Express 5-era) expects 13+ headers including CSP with `script-src-attr 'none'`, `frame-ancestors 'self'`, `object-src 'none'`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, and `Origin-Agent-Cluster: ?1` — with CSP applied as the **first** middleware so it covers every response, and a per-response nonce rather than `'unsafe-inline'`.

### 🟠 D4 — `sanitizeString` is dead code, and would be unsafe if used
`server/middleware/securityHeaders.ts:29` defines it. `grep -rn "sanitizeString"` returns **exactly one hit — the definition itself**. Never called.

Worse, it's a denylist regex (`<script>`, `javascript:`, `onerror=`, `onload=`) that leaves `onclick=`, `onfocus=`, `onmouseover=` and dozens of other handlers wide open, and it never escapes `<`/`>`. Don't wire it up as-is — use React's default escaping (already in place) plus CSP.

**Good news:** `grep` for `dangerouslySetInnerHTML` / `innerHTML` / `eval(` across `src` and `server` → **zero hits**. No XSS sink exists today.

### 🟠 D5 — Rate limiter is trivially bypassable + leaks a timer
`server/middleware/rateLimiter.ts:27` keys the bucket on:
```ts
const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
```
`x-forwarded-for` is **client-controlled**, and `app.set('trust proxy', ...)` is never configured (`grep` confirms). Any caller rotates one header value per request to get unlimited quota — including on the AI-inference limiter that guards your Gemini spend. Same pattern at `errorHandler.ts:20`, so audit-log IPs are spoofable too.

Also: the cleanup `setInterval(..., 300000)` at `rateLimiter.ts:17` is never `.unref()`'d, so it holds the event loop open and works against the graceful-shutdown path in `server.ts:56-71`. And being an in-process `Map`, it provides zero protection across multiple instances.

### 🟡 D6 — No tests, no CI, no README
`package.json` scripts: `dev, build, start, preview, clean, lint`. **No `test` script.** Zero test libraries installed (checked for vitest/jest/playwright/cypress/testing-library/mocha). No `.github/` directory. No `README`.

The only automated gate in the repo is `tsc --noEmit`. D1 above is precisely the class of bug a single integration test on the route table would have caught.

### 🟡 D7 — Unbounded `security_audit_logs` growth
`server/middleware/errorHandler.ts:21` writes a row on **every** error response. `grep` shows only one `INSERT` (`repositories.ts:378`) and **no `DELETE`, no retention job, no partitioning**. A misbehaving client or a rate-limit storm grows this table without bound. `latency_ms` is also hardcoded to `0`, so the column is meaningless.

### 🟡 D8 — PWA manifest points at files that don't exist
`manifest.json` declares `display: "standalone"`, `orientation: "portrait"` and icons `/icon-192.png` + `/icon-512.png`. There is **no `public/` directory at all**, and neither icon exists anywhere in the repo or in `dist/`. Install prompts will fail or fall back to a blank icon.

Also **no service worker** (`grep` for `serviceWorker` / `vite-plugin-pwa` / `workbox` → zero hits), so `standalone` gives you no offline capability — relevant because `AndroidPhoneFrame.tsx:129` and the dashboards poll on timers and will silently dead-end offline.

---

## 3. Performance & architecture

### Bundle: 620 kB main chunk, served uncompressed
Real build output:
```
dist/assets/index-Ba8oOosP.js         620.25 kB │ gzip: 163.04 kB   <- main chunk
dist/assets/vendor-zod-B1qbSNpH.js     92.24 kB │ gzip:  26.24 kB
dist/assets/vendor-icons-Us-4W1fH.js   59.77 kB │ gzip:  13.97 kB
dist/assets/vendor-react-Cnuun3eP.js    4.22 kB │ gzip:   1.58 kB
dist/assets/index-DMUTnRpe.css        126.27 kB │ gzip:  16.87 kB
dist/server.cjs                       171.5 kB
```

Three concrete problems:

1. **`manualChunks` isn't working for React.** `vite.config.ts:26-30` declares `vendor-react: ['react','react-dom']`, but that chunk is **4.22 kB** — react-dom alone is ~180 kB minified. I grepped the built assets for react-dom internals: they're in `index-Ba8oOosP.js`, not the vendor chunk. The split is a no-op.
2. **No route/tab-level code splitting.** `App.tsx:12-20` statically imports all 9 swarm components, and `App.tsx:2-9` all 8 Android components — including `KotlinCodebaseExplorer` (356 lines) backed by `kotlinCodebase.ts` (**854 lines of static data**). All of it ships on first paint even though the user sees one tab. Tabs are conditionally rendered (`App.tsx:411-627`), so `React.lazy` + `Suspense` is a drop-in win.
3. **`compression` middleware is absent.** `curl -I -H "Accept-Encoding: gzip, br"` on the main chunk returns **no `content-encoding`**. 620 kB goes over the wire raw unless a reverse proxy saves you.

### API/data patterns
- ✅ **SQLite is genuinely well configured**: WAL mode, `synchronous=NORMAL`, `foreign_keys=ON`, `temp_store=MEMORY`, and indexes on every hot column (`database.ts:23-26`, plus 10 explicit `CREATE INDEX` statements).
- ✅ **SQL injection: clean.** All 17 `db.prepare()` calls are parameterized. The only two `${` in `repositories.ts` are a generated note id (line 60) and a `LIKE` pattern bound as a parameter (line 126) — neither interpolates into SQL.
- ⚠️ **`/api/agents` returns all 50 full agent records including all 50 system prompts on every call**, with no pagination and no field projection — and `AgentController` re-filters the whole array per request. Small now; the prompts are the bulk of that 620 kB chunk.
- ⚠️ **Three concurrent pollers**: `ProtocolInspector.tsx:63` every **4 s**, `SwarmSummaryDashboard.tsx:149` every **6 s**, `CentralCommand.tsx:96` every **10 s**. Mitigating factor I verified: tabs are conditionally rendered, so only one runs at a time. Still, `SwarmSummaryDashboard`'s 6 s tick issues **two** fetches (`/summary-dashboard` + `/agents/telemetry`) — 20 req/min per open tab, all hand-rolled `useEffect` + `useState`.
- ⚠️ **No caching layer.** Every dashboard tick re-reads SQLite and rebuilds JSON. `protocol_messages` is fetched with `?limit=100` every 4 s.

### Dependency currency (`npm outdated`, run this session)
```
Package               Current    Latest
express               4.22.3  -> 5.2.1      ⚠ EOL imminent
vite                  6.4.3   -> 8.3.0      ⚠ two majors behind
typescript            5.8.3   -> 7.0.2      ⚠
@types/node           22.20.4 -> 26.6.2
@types/express        4.17.25 -> 5.0.6
@vitejs/plugin-react  5.2.0   -> 6.1.1
lucide-react          0.546.0 -> 1.47.0
motion                12.43.0 -> 13.4.1
esbuild               0.25.12 -> 0.28.2
dotenv                17.4.2  -> 18.0.3
```
Current and healthy: `react` 19.3.0, `react-dom` 19.3.0, `zod` 4.6.5, `better-sqlite3` 13.0.3, `@google/genai` 2.24.0, `tailwindcss` 4.3.3, `tsx` 4.23.15.

**Express 4 is the urgent one.** It entered formal Maintenance on **April 1, 2025** with a published target EOL of **no sooner than October 1, 2026** — i.e. ~5 weeks from today. Express 5.x has been active since March 2025 (5.2.1 current) and is the TC's production-recommended release. Only the newest release in a line gets fixes, so a pinned 4.x minor is not covered.

Migration risk for *this* repo is unusually low: one `server.ts`, 5 route files, no template engine. But note two Express-5 breaking changes that touch your code specifically — `req.query` becomes a getter (your `validator.ts:49` does `req.query = result.data as any`, which **will throw** on Express 5) and the query parser switches from `extended` to `simple`.

**Vite 6 → 8** is two majors: Vite 7 (June 2025) requires Node 20.19+/22.12+, moved the default browser target from `modules` to `baseline-widely-available`, and introduced the Rolldown bundler; Vite 8 beta landed December 2025. You're on Node 22.22.3, so the runtime floor is already satisfied.

---

## 4. Prioritised action plan (Impact vs Effort)

### 🟢 QUICK WINS — high impact, hours not days

| # | Action | File | Effort |
|---|---|---|---|
| Q1 | Fix dead endpoint `/api/execute` → `/api/protocol/dispatch` | `src/components/AgentTerminal.tsx:61` | 1 line |
| Q2 | Fix error surfacing `err.error` → `err.error?.message` | `src/components/AgentTerminal.tsx:73` | 1 line |
| Q3 | Delete dead+unsafe `sanitizeString` | `server/middleware/securityHeaders.ts:29-36` | 8 lines |
| Q4 | `app.disable('x-powered-by')` before all middleware | `server.ts:13` | 1 line |
| Q5 | Un-gitignore-proof Firebase config: add to `.gitignore`, inject at build, rotate key | `.gitignore`, `firebase-applet-config.json` | 30 min |
| Q6 | `.unref()` the rate-limiter cleanup interval | `server/middleware/rateLimiter.ts:17` | 1 line |
| Q7 | Add `compression` middleware | `server.ts:21` + `package.json` | 15 min |
| Q8 | Generate the two missing PWA icons into a new `public/` dir | `manifest.json` refs | 20 min |
| Q9 | Add `README.md` with run/build/env instructions | repo root | 30 min |

**Q1+Q2 together restore the entire Agent Terminal tab — currently 100% non-functional.**

### 🟠 HIGH-IMPACT ARCHITECTURE — days

| # | Action | Files | Notes |
|---|---|---|---|
| A1 | **Adopt `helmet`** with a real CSP (nonce-based, `script-src-attr 'none'`, `frame-ancestors 'self'`), HSTS, Permissions-Policy; mount **first** | `server/middleware/securityHeaders.ts`, `server.ts:21` | Must allowlist `fonts.googleapis.com` / `fonts.gstatic.com` (`index.html:13-15`) and Tailwind's inline styles |
| A2 | **Fix rate-limiter trust** — set `trust proxy` correctly, derive IP from the proxy chain, or move to a store-backed limiter | `server/middleware/rateLimiter.ts:27`, `server.ts`, `errorHandler.ts:20` | Currently protects nothing |
| A3 | **Route-level code splitting** — `React.lazy` + `Suspense` on the 17 tab components | `src/App.tsx:2-9` + `:12-20`, tabs at `:411-627` | Biggest single bundle win; also defer `kotlinCodebase.ts` (854 lines) |
| A4 | **Fix `manualChunks`** — verify react-dom actually isolates; add a `vendor-motion` chunk | `vite.config.ts:26-30` | 4.22 kB vendor-react proves the current config is inert |
| A5 | **Introduce TanStack Query** for the 4 polling components | `CentralCommand.tsx:96`, `ProtocolInspector.tsx:63`, `SwarmSummaryDashboard.tsx:149`, `App.tsx:73` | The 2026 consensus for server state: built-in caching, dedup, refetch-on-focus, retry, and it removes hand-rolled loading/error state. Pairs with your existing optimistic-update rollback in `App.tsx:132` |
| A6 | **Add an `ErrorBoundary`** | new `src/components/ui/ErrorBoundary.tsx` | `grep` for `componentDidCatch`/`getDerivedStateFromError` → **zero hits**. One bad render currently whitescreens the whole OS |
| A7 | **Add Vitest + a route-table smoke test** and wire `npm test` | `package.json`, new `*.test.ts` | A single "every URL the frontend fetches returns non-404" test would have caught D1 |
| A8 | **Resolve the `model_config` contradiction** — either (a) implement a real provider router honouring `provider`/`model`/`fallback_*`, or (b) document that `model_config` is export metadata and stop implying it drives execution | `protocolService.ts:106`, `types.ts:16-23`, `AgentModal.tsx:205`, `PromptLab.tsx:98` | This is the spec-conformance question you actually asked |
| A9 | **Audit-log retention** — scheduled prune + record real latency | `errorHandler.ts:21`, `repositories.ts:378` | |

### 🔵 STRATEGIC — weeks

| # | Action | Rationale |
|---|---|---|
| S1 | **Express 4 → 5 migration** | EOL target ~Oct 1 2026. Fix `req.query` assignment in `validator.ts:49` (becomes a getter in v5) and re-check `extended`→`simple` query parsing |
| S2 | **Vite 6 → 8** (evaluate Rolldown) | Two majors behind; Rolldown is the path to materially faster builds |
| S3 | **OpenTelemetry agent tracing** | 2026 agent-observability standard is per-step typed spans (tool-call / reasoning / state / memory), not per-request logs. Your `protocol_messages` table already models `correlationId`/`parentId` — that's 80% of a span tree. Emit OTLP and you get trace trees, cost attribution per agent, and step-latency distributions |
| S4 | **Durable mission state + human-in-the-loop checkpoints** | `MissionPlan` runs nodes in-memory (`types.ts:127`, nodes typed at `types.ts:112`). Checkpointing each node to SQLite enables resume-after-crash, replay, and approval gates — the LangGraph-style pattern that's now the production default for stateful agent graphs |
| S5 | **Real agent registry in SQLite** | `agents` table with `library_version`, enabling hot-swap, per-agent versioning, and A/B prompt rollout without a client rebuild |
| S6 | **Offline-first PWA** | Service worker + `vite-plugin-pwa`, cached agent registry, queued mutations. You already declare `standalone` and have optimistic updates — this makes them meaningful |

---

## 5. Suggested execution order

**Sprint 1 — stabilise (1–2 days):** Q1, Q2 → *Agent Terminal works again.* Then Q3, Q4, Q6, Q7. Add A7 (Vitest + route smoke test) so nothing regresses. Ship A6 (ErrorBoundary).

**Sprint 2 — harden (3–5 days):** A1 (helmet/CSP) → A2 (rate limiter) → Q5 (Firebase) → A9. Then D6 follow-through: GitHub Actions running `lint` + `test` + `build` + `audit`.

**Sprint 3 — performance (3–5 days):** A3 (code splitting) → A4 (chunks) → A5 (TanStack Query). Re-measure the bundle against today's 620.25 kB / 163.04 kB gzip baseline.

**Sprint 4 — platform (2–3 weeks):** A8 (the `model_config` decision — **needs your call**) → S3 (OTel) → S4 (durable missions) → S1 (Express 5) → S2 (Vite 8).

---

## 6. Decision I need from you

**A8 is a fork in the road, and it's the answer to your original question.** The 50-agent library is *intact* — all 50 agents, correct ids, correct names, character-exact prompts for #1–#19. But `provider: "ollama"`, `model: "qwen2.5:14b"` and the OpenAI fallback are **inert metadata**; every call goes to `gemini-3.7-flash`. Pick one:

- **(a) Make the manifest true** — build a provider router so `model_config` actually selects Ollama/OpenAI/Gemini with real fallback. Substantial work, requires an Ollama host.
- **(b) Make the manifest honest** — keep `model_config` as export-only metadata for Ollama/n8n deployment (which `ManifestHub` already does well), rename it to say so, and fix `PromptLab.tsx:98`'s misleading `"qwen2.5:14b / gemini-3.7-flash"` label.

Also still open: **send me agents #20–#50 from the source document** and I'll complete the field-exact diff for the remaining 31 agents.
