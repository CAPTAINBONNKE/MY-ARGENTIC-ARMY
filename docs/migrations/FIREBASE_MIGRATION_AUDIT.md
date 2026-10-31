# Firebase Migration Audit — MY-ARGENTIC-ARMY

**Repository:** `CAPTAINBONNKE/MY-ARGENTIC-ARMY`  
**Audited branch:** `main`  
**Audit date:** 2026-10-31  
**Status:** Discovery and migration design only. No live backend has been switched.

## Executive finding

Argentic OS is a Vite/React + Express application with a local SQLite database using `better-sqlite3` in WAL mode. Its Express server initializes the database at startup and uses modular repositories. No Supabase dependency or Supabase configuration was found in the inspected manifest/environment file. The user's new Firebase standard therefore means a SQLite-to-Firebase migration, not a Supabase replacement.

The local database stores agent protocol messages, telemetry, mission reports, Android-agent notes and related operational state. Before moving to Firestore, identify whether the app is intended for a single operator/local desktop or multi-user hosted deployment. If it is single-operator, Firebase may be unnecessary overhead; if hosted multi-device sync and account ownership are required, Firebase Auth + Firestore is appropriate. This audit records the migration design without assuming an unconfirmed product requirement.

## Verified source inventory

| File | Verified finding | Migration implication |
|---|---|---|
| `package.json` | Express + Vite; `better-sqlite3` is the database dependency | Replace local SQL persistence only after mapping all repository methods |
| `.env.example` | Gemini API key and app URL only; no Supabase/Firebase/SQL remote credentials | Add Firebase project config/Admin credentials only if cloud sync is approved |
| `server.ts` | Calls `initDatabase()` at startup, mounts modular API routes, closes SQLite on graceful shutdown | Initialize Firebase Admin in server lifecycle and preserve fail-closed readiness checks |
| `server/db/database.ts` | Creates `data/argentic_os.db`, enables WAL, synchronous NORMAL, foreign keys and memory temp store; defines multiple relational tables/indexes | Map each table, index and retention rule to Firestore collections and queries |
| `server/db/repositories.ts` | Repository methods issue direct SQL queries for notes and other domain records | Preserve repository interfaces while replacing SQL implementation |
| `server/routes/index.ts` | API routes cover health, agents, protocol, Android, workflow and prompt optimization | Determine which endpoints require durable shared state versus transient AI inference |

## Target Firebase architecture

- **Authentication:** Firebase Authentication only if multi-user identity, access separation or cloud sync is a product requirement. Do not force sign-in for a local single-user tool without product approval.
- **Database:** Firestore for agent notes, protocol messages, mission reports and telemetry if cloud persistence is approved. Use per-user or per-workspace ownership boundaries; never expose another user's agent memory.
- **Trusted server:** Firebase Admin SDK in Express server modules. Admin SDK bypasses Firestore Rules, so every privileged route must enforce ownership and role authorization.
- **AI provider:** Gemini API remains a separate provider integration; Firebase does not replace model inference. Keep API keys server-only.
- **Local/offline:** If offline-first behavior is required, retain a clearly defined local cache/queue and conflict-resolution strategy; do not allow SQLite and Firestore to become competing authorities.
- **Hosting:** Vite client output is static, but Express API routes require a Node runtime. Hostinger deployment must support the server app or the API must be hosted separately.

## Migration design requirements

1. Decide local-single-user versus hosted multi-user product mode before implementing mandatory authentication.
2. Map every SQLite table, column, index, repository method and route to Firestore document structures.
3. Preserve message correlation IDs, parent IDs, ordering and timestamps for protocol messages.
4. Define telemetry retention/aggregation and avoid unbounded document growth.
5. Preserve note CRUD, pinned ordering, tags, checklists and author metadata.
6. Ensure mission reports and agent activity records are tenant/workspace scoped if multiple users are supported.
7. Keep AI inference stateless where possible; do not store sensitive prompts or outputs without a retention/privacy decision.
8. Add Firestore indexes, Security Rules, Emulator Suite tests and Admin SDK authorization tests.
9. Migrate existing SQLite rows with stable IDs and verify record counts/order before cutover.
10. Remove SQLite only after cloud sync, offline behavior and rollback have been tested.

## Acceptance criteria

- Firestore becomes the only cloud source of truth if cloud persistence is approved.
- Every record has explicit user/workspace ownership where multi-user use exists.
- No cross-user agent memory, protocol message or mission report access is possible.
- Protocol correlation and chronological ordering are preserved.
- Telemetry and memory retention are bounded and documented.
- Gemini secrets remain server-only.
- Express API and Vite deployment responsibilities are clearly documented.
- Tests cover offline/retry behavior, duplicate requests, access rules and migration reconciliation.

## Scope boundary

This audit covers `CAPTAINBONNKE/MY-ARGENTIC-ARMY` only. It does not inspect or modify the Church project or any other repository.
