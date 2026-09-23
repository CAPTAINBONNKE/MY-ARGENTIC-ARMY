import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { AGENTS_DATA } from '../../src/data/agents.ts';
import { INITIAL_KEEP_NOTES, INITIAL_MEMORY } from '../../src/data/androidInitialState.ts';
import {
  AgentProtocolEnvelope,
  AgentModuleTelemetry,
  ConsolidatedReport,
} from '../../src/types.ts';
import { KeepNoteItem } from '../../src/types/androidAgent.ts';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'argentic_os.db');
export const db = new Database(DB_PATH);

// Configure SQLite for high performance and durability (WAL mode)
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');
db.pragma('temp_store = MEMORY');

// Initialize database schema and indexes
export function initDatabase(): void {
  db.exec(`
    -- Google Keep Notes
    CREATE TABLE IF NOT EXISTS keep_notes (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      updated TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT 'yellow',
      pinned INTEGER NOT NULL DEFAULT 0,
      tags_json TEXT NOT NULL DEFAULT '[]',
      checklist_json TEXT NOT NULL DEFAULT '[]',
      author_agent_json TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_keep_notes_pinned ON keep_notes(pinned DESC, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_keep_notes_updated ON keep_notes(updated_at DESC);

    -- Protocol Bus Messages
    CREATE TABLE IF NOT EXISTS protocol_messages (
      message_id TEXT PRIMARY KEY,
      correlation_id TEXT NOT NULL,
      parent_id TEXT,
      timestamp TEXT NOT NULL,
      type TEXT NOT NULL,
      priority TEXT NOT NULL,
      sender_json TEXT NOT NULL,
      receiver_json TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      telemetry_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_protocol_corr ON protocol_messages(correlation_id);
    CREATE INDEX IF NOT EXISTS idx_protocol_type ON protocol_messages(type);
    CREATE INDEX IF NOT EXISTS idx_protocol_created ON protocol_messages(created_at DESC);

    -- Agent Module Telemetry
    CREATE TABLE IF NOT EXISTS agent_telemetry (
      agent_id INTEGER PRIMARY KEY,
      role_name TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      uptime_percent REAL NOT NULL,
      tasks_completed INTEGER NOT NULL,
      avg_latency_ms INTEGER NOT NULL,
      error_rate_percent REAL NOT NULL,
      last_active TEXT NOT NULL,
      current_task TEXT,
      channel TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_telemetry_status ON agent_telemetry(status);
    CREATE INDEX IF NOT EXISTS idx_telemetry_category ON agent_telemetry(category);

    -- Consolidated Mission Reports
    CREATE TABLE IF NOT EXISTS mission_reports (
      report_id TEXT PRIMARY KEY,
      mission_title TEXT NOT NULL,
      objective TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      total_agents_involved INTEGER NOT NULL,
      total_execution_time_ms INTEGER NOT NULL,
      total_tokens_used INTEGER NOT NULL,
      efficiency_score INTEGER NOT NULL,
      executive_summary TEXT NOT NULL,
      deliverables_json TEXT NOT NULL,
      protocol_trace_json TEXT NOT NULL,
      audit_findings_json TEXT NOT NULL,
      recommendations_json TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_reports_created ON mission_reports(created_at DESC);

    -- Device Long-term Memory
    CREATE TABLE IF NOT EXISTS device_memory (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      category TEXT NOT NULL,
      confidence REAL NOT NULL DEFAULT 0.99,
      last_updated TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_memory_category ON device_memory(category);

    -- Security & Audit Logging
    CREATE TABLE IF NOT EXISTS security_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      method TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      status_code INTEGER NOT NULL,
      latency_ms REAL NOT NULL,
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_audit_ip_created ON security_audit_logs(ip, created_at DESC);
  `);

  seedInitialData();
}

// Seed initial system data if tables are empty
function seedInitialData(): void {
  // 1. Seed Telemetry
  const countTelemetry = db.prepare('SELECT count(*) as count FROM agent_telemetry').get() as { count: number };
  if (countTelemetry.count === 0) {
    const insertTelemetry = db.prepare(`
      INSERT INTO agent_telemetry (
        agent_id, role_name, category, status, uptime_percent,
        tasks_completed, avg_latency_ms, error_rate_percent, last_active, current_task, channel, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertTx = db.transaction(() => {
      AGENTS_DATA.forEach((agent, index) => {
        const isSpecialActive = index < 6;
        insertTelemetry.run(
          agent.id,
          agent.role_name,
          agent.category,
          isSpecialActive ? 'idle' : 'standby',
          99.8 + Number((Math.random() * 0.19).toFixed(2)),
          Math.floor(Math.random() * 45) + 12,
          Math.floor(Math.random() * 320) + 180,
          Number((Math.random() * 0.8).toFixed(2)),
          new Date(Date.now() - Math.floor(Math.random() * 1800000)).toISOString(),
          null,
          'internal_bus',
          Date.now()
        );
      });
    });
    insertTx();
  }

  // 2. Seed Keep Notes
  const countNotes = db.prepare('SELECT count(*) as count FROM keep_notes').get() as { count: number };
  if (countNotes.count === 0) {
    const insertNote = db.prepare(`
      INSERT INTO keep_notes (
        id, title, content, updated, color, pinned,
        tags_json, checklist_json, author_agent_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertNoteTx = db.transaction(() => {
      INITIAL_KEEP_NOTES.forEach((note, idx) => {
        const now = Date.now() - (idx * 60000);
        insertNote.run(
          note.id,
          note.title,
          note.content,
          note.updated,
          note.color || 'yellow',
          note.pinned ? 1 : 0,
          JSON.stringify(note.tags || []),
          JSON.stringify(note.checklist || []),
          note.authorAgent ? JSON.stringify(note.authorAgent) : null,
          now,
          now
        );
      });
    });
    insertNoteTx();
  }

  // 3. Seed Long-term Memory
  const countMemory = db.prepare('SELECT count(*) as count FROM device_memory').get() as { count: number };
  if (countMemory.count === 0 && INITIAL_MEMORY.longTermMemory) {
    const insertMemory = db.prepare(`
      INSERT INTO device_memory (id, key, value, category, confidence, last_updated, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMemTx = db.transaction(() => {
      INITIAL_MEMORY.longTermMemory.forEach((mem) => {
        insertMemory.run(
          mem.id,
          mem.key,
          mem.value,
          mem.category,
          mem.confidence,
          mem.lastUpdated,
          Date.now()
        );
      });
    });
    insertMemTx();
  }

  // 4. Seed Initial Protocol Bus Envelope
  const countMessages = db.prepare('SELECT count(*) as count FROM protocol_messages').get() as { count: number };
  if (countMessages.count === 0) {
    const messageId = `msg_boot_${Date.now()}`;
    const correlationId = `corr_boot_${Date.now()}`;
    db.prepare(`
      INSERT INTO protocol_messages (
        message_id, correlation_id, parent_id, timestamp, type, priority,
        sender_json, receiver_json, payload_json, telemetry_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      messageId,
      correlationId,
      null,
      new Date().toISOString(),
      'STATUS_UPDATE',
      'LOW',
      JSON.stringify({ id: 'COMMAND_CENTER', role_name: 'HQ Protocol Supervisor', category: 'SYSTEM' }),
      JSON.stringify({ id: 'BROADCAST', role_name: 'All 50 Agent Nodes' }),
      JSON.stringify({
        taskTitle: 'Standardized Agent Mesh Booted',
        directives: ['Enterprise SQLite WAL Persistence Active', 'Strict Zod Runtime Validation Enforced'],
        status: 'idle',
      }),
      JSON.stringify({
        latencyMs: 1,
        channel: 'internal_bus',
        signature: `SIG_ECC256_${Buffer.from(messageId + correlationId).toString('base64').substring(0, 16)}`,
        tokensUsed: { prompt: 100, completion: 200, total: 300 }
      }),
      Date.now()
    );
  }

  // 5. Seed Initial Mission Reports if empty
  const countReports = db.prepare('SELECT count(*) as count FROM mission_reports').get() as { count: number };
  if (countReports.count === 0) {
    const insertReport = db.prepare(`
      INSERT INTO mission_reports (
        report_id, mission_title, objective, timestamp, total_agents_involved,
        total_execution_time_ms, total_tokens_used, efficiency_score, executive_summary,
        deliverables_json, protocol_trace_json, audit_findings_json, recommendations_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = Date.now();
    const initialReports = [
      {
        report_id: `rep_alpha_${now}`,
        mission_title: 'Autonomous Multi-Tier Microservice Orchestration',
        objective: 'Coordinate backend engineering, security audit, and API contract generation across 4 specialized agents.',
        timestamp: new Date(now - 3600000 * 2).toISOString(),
        total_agents_involved: 4,
        total_execution_time_ms: 1240,
        total_tokens_used: 3420,
        efficiency_score: 97.4,
        executive_summary: 'All 4 agent nodes finished within SLAs. Zero schema violations and full zero-billing guardrails maintained.',
        deliverables_json: JSON.stringify([
          { agentId: 4, roleName: 'Backend Core Specialist', category: 'engineering', taskTitle: 'REST Endpoints Spec', summary: 'Designed modular endpoints', latencyMs: 310, status: 'success' },
          { agentId: 7, roleName: 'Security & Auth Guardian', category: 'engineering', taskTitle: 'Zod Security Audit', summary: 'Passed runtime validation rules', latencyMs: 290, status: 'success' },
        ]),
        protocol_trace_json: JSON.stringify([]),
        audit_findings_json: JSON.stringify(['Zero-billing schema enforcement verified', 'Sub-millisecond WAL bus latency']),
        recommendations_json: JSON.stringify(['Maintain SQLite WAL checkpoint at 1000 pages']),
        created_at: now - 3600000 * 2,
      },
      {
        report_id: `rep_beta_${now}`,
        mission_title: 'Global Telemetry & Fleet Health Calibration',
        objective: 'Execute full heartbeat sync across 50 agent nodes and verify ECC-256 signature traces.',
        timestamp: new Date(now - 3600000 * 6).toISOString(),
        total_agents_involved: 50,
        total_execution_time_ms: 820,
        total_tokens_used: 1980,
        efficiency_score: 98.8,
        executive_summary: '50-agent army responded with 100% liveness probe success. Mean latency dropped to 215ms.',
        deliverables_json: JSON.stringify([
          { agentId: 1, roleName: 'Command Dispatcher', category: 'SYSTEM', taskTitle: 'Fleet Liveness Probe', summary: 'All 50 nodes acknowledged', latencyMs: 215, status: 'success' },
        ]),
        protocol_trace_json: JSON.stringify([]),
        audit_findings_json: JSON.stringify(['100% unit availability', 'No dropped packets on internal_bus']),
        recommendations_json: JSON.stringify(['Schedule automated ping probes every 10 seconds']),
        created_at: now - 3600000 * 6,
      },
      {
        report_id: `rep_gamma_${now}`,
        mission_title: 'Content & Visual Generation Pipeline',
        objective: 'Synthesize product messaging pillars and generate UI responsive layout specifications.',
        timestamp: new Date(now - 3600000 * 18).toISOString(),
        total_agents_involved: 3,
        total_execution_time_ms: 1450,
        total_tokens_used: 4110,
        efficiency_score: 95.2,
        executive_summary: 'Pipeline concluded with structured JSON deliverables and verified token budgets.',
        deliverables_json: JSON.stringify([
          { agentId: 1, roleName: 'AI Content Strategist', category: 'content', taskTitle: 'Copy Architecture', summary: 'Brand pillars generated', latencyMs: 420, status: 'success' },
          { agentId: 12, roleName: 'UI/UX Visual Architect', category: 'visual', taskTitle: 'Wireframe Layouts', summary: 'Design specs produced', latencyMs: 510, status: 'success' },
        ]),
        protocol_trace_json: JSON.stringify([]),
        audit_findings_json: JSON.stringify(['Token budget utilization at 78% of max allocation']),
        recommendations_json: JSON.stringify(['Cache recurrent prompt tokens to optimize response times']),
        created_at: now - 3600000 * 18,
      },
    ];

    initialReports.forEach(r => {
      insertReport.run(
        r.report_id,
        r.mission_title,
        r.objective,
        r.timestamp,
        r.total_agents_involved,
        r.total_execution_time_ms,
        r.total_tokens_used,
        r.efficiency_score,
        r.executive_summary,
        r.deliverables_json,
        r.protocol_trace_json,
        r.audit_findings_json,
        r.recommendations_json,
        r.created_at
      );
    });
  }
}
