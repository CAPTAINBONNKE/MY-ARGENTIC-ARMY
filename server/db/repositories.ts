import { db } from './database.ts';
import {
  AgentProtocolEnvelope,
  AgentModuleTelemetry,
  ConsolidatedReport,
  PriorityLevel,
  ProtocolMessageType,
} from '../../src/types.ts';
import { KeepNoteItem } from '../../src/types/androidAgent.ts';

// ----------------------------------------------------
// Google Keep Notes Repository
// ----------------------------------------------------
export const NoteRepository = {
  getAll(): KeepNoteItem[] {
    const rows = db.prepare(`
      SELECT id, title, content, updated, color, pinned,
             tags_json, checklist_json, author_agent_json
      FROM keep_notes
      ORDER BY pinned DESC, updated_at DESC
    `).all() as any[];

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      updated: r.updated,
      color: r.color,
      pinned: Boolean(r.pinned),
      tags: JSON.parse(r.tags_json || '[]'),
      checklist: JSON.parse(r.checklist_json || '[]'),
      authorAgent: r.author_agent_json ? JSON.parse(r.author_agent_json) : undefined,
    }));
  },

  getById(id: string): KeepNoteItem | null {
    const r = db.prepare(`
      SELECT id, title, content, updated, color, pinned,
             tags_json, checklist_json, author_agent_json
      FROM keep_notes
      WHERE id = ?
    `).get(id) as any;

    if (!r) return null;
    return {
      id: r.id,
      title: r.title,
      content: r.content,
      updated: r.updated,
      color: r.color,
      pinned: Boolean(r.pinned),
      tags: JSON.parse(r.tags_json || '[]'),
      checklist: JSON.parse(r.checklist_json || '[]'),
      authorAgent: r.author_agent_json ? JSON.parse(r.author_agent_json) : undefined,
    };
  },

  create(note: KeepNoteItem): KeepNoteItem {
    const now = Date.now();
    const id = note.id || `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const updated = note.updated || 'Just now';

    db.prepare(`
      INSERT INTO keep_notes (
        id, title, content, updated, color, pinned,
        tags_json, checklist_json, author_agent_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      note.title,
      note.content || '',
      updated,
      note.color || 'yellow',
      note.pinned ? 1 : 0,
      JSON.stringify(note.tags || []),
      JSON.stringify(note.checklist || []),
      note.authorAgent ? JSON.stringify(note.authorAgent) : null,
      now,
      now
    );

    return {
      ...note,
      id,
      updated,
    };
  },

  update(id: string, updates: Partial<KeepNoteItem>): KeepNoteItem | null {
    const current = this.getById(id);
    if (!current) return null;

    const merged: KeepNoteItem = {
      ...current,
      ...updates,
      updated: updates.updated || 'Just now',
    };

    db.prepare(`
      UPDATE keep_notes
      SET title = ?, content = ?, updated = ?, color = ?, pinned = ?,
          tags_json = ?, checklist_json = ?, author_agent_json = ?, updated_at = ?
      WHERE id = ?
    `).run(
      merged.title,
      merged.content || '',
      merged.updated,
      merged.color || 'yellow',
      merged.pinned ? 1 : 0,
      JSON.stringify(merged.tags || []),
      JSON.stringify(merged.checklist || []),
      merged.authorAgent ? JSON.stringify(merged.authorAgent) : null,
      Date.now(),
      id
    );

    return merged;
  },

  delete(id: string): boolean {
    const info = db.prepare('DELETE FROM keep_notes WHERE id = ?').run(id);
    return info.changes > 0;
  },

  search(q: string): KeepNoteItem[] {
    const searchPattern = `%${q.toLowerCase()}%`;
    const rows = db.prepare(`
      SELECT id, title, content, updated, color, pinned,
             tags_json, checklist_json, author_agent_json
      FROM keep_notes
      WHERE lower(title) LIKE ? OR lower(content) LIKE ? OR lower(tags_json) LIKE ?
      ORDER BY pinned DESC, updated_at DESC
    `).all(searchPattern, searchPattern, searchPattern) as any[];

    return rows.map(r => ({
      id: r.id,
      title: r.title,
      content: r.content,
      updated: r.updated,
      color: r.color,
      pinned: Boolean(r.pinned),
      tags: JSON.parse(r.tags_json || '[]'),
      checklist: JSON.parse(r.checklist_json || '[]'),
      authorAgent: r.author_agent_json ? JSON.parse(r.author_agent_json) : undefined,
    }));
  }
};

// ----------------------------------------------------
// Protocol Messages Repository
// ----------------------------------------------------
export const ProtocolRepository = {
  create(envelope: AgentProtocolEnvelope): AgentProtocolEnvelope {
    db.prepare(`
      INSERT INTO protocol_messages (
        message_id, correlation_id, parent_id, timestamp, type, priority,
        sender_json, receiver_json, payload_json, telemetry_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      envelope.messageId,
      envelope.correlationId,
      envelope.parentId || null,
      envelope.timestamp,
      envelope.type,
      envelope.priority,
      JSON.stringify(envelope.sender),
      JSON.stringify(envelope.receiver),
      JSON.stringify(envelope.payload),
      JSON.stringify(envelope.telemetry),
      Date.now()
    );

    // Keep message log bounded to the most recent 1000 messages to prevent unbounded growth
    db.prepare(`
      DELETE FROM protocol_messages
      WHERE message_id NOT IN (
        SELECT message_id FROM protocol_messages ORDER BY created_at DESC LIMIT 1000
      )
    `).run();

    return envelope;
  },

  getMessages(filter: { correlationId?: string; agentId?: number; type?: string; limit?: number }): AgentProtocolEnvelope[] {
    let query = `SELECT * FROM protocol_messages WHERE 1=1`;
    const params: any[] = [];

    if (filter.correlationId) {
      query += ` AND correlation_id = ?`;
      params.push(filter.correlationId);
    }
    if (filter.type) {
      query += ` AND type = ?`;
      params.push(filter.type);
    }

    query += ` ORDER BY created_at DESC LIMIT ?`;
    params.push(filter.limit || 50);

    const rows = db.prepare(query).all(...params) as any[];

    let results = rows.map(r => ({
      messageId: r.message_id,
      correlationId: r.correlation_id,
      parentId: r.parent_id || undefined,
      timestamp: r.timestamp,
      type: r.type as ProtocolMessageType,
      priority: r.priority as PriorityLevel,
      sender: JSON.parse(r.sender_json),
      receiver: JSON.parse(r.receiver_json),
      payload: JSON.parse(r.payload_json),
      telemetry: JSON.parse(r.telemetry_json),
    }));

    if (filter.agentId !== undefined) {
      const aid = Number(filter.agentId);
      results = results.filter(
        m => m.sender.id === aid || m.receiver.id === aid || m.receiver.id === 'BROADCAST'
      );
    }

    return results;
  },

  count(): number {
    const res = db.prepare('SELECT count(*) as count FROM protocol_messages').get() as { count: number };
    return res.count;
  }
};

// ----------------------------------------------------
// Telemetry Repository
// ----------------------------------------------------
export const TelemetryRepository = {
  getAll(): AgentModuleTelemetry[] {
    const rows = db.prepare(`
      SELECT * FROM agent_telemetry ORDER BY agent_id ASC
    `).all() as any[];

    return rows.map(r => ({
      agentId: r.agent_id,
      role_name: r.role_name,
      category: r.category,
      status: r.status,
      uptimePercent: r.uptime_percent,
      tasksCompleted: r.tasks_completed,
      avgLatencyMs: r.avg_latency_ms,
      errorRatePercent: r.error_rate_percent,
      lastActive: r.last_active,
      currentTask: r.current_task || undefined,
      channel: r.channel,
    }));
  },

  get(agentId: number): AgentModuleTelemetry | null {
    const r = db.prepare('SELECT * FROM agent_telemetry WHERE agent_id = ?').get(agentId) as any;
    if (!r) return null;
    return {
      agentId: r.agent_id,
      role_name: r.role_name,
      category: r.category,
      status: r.status,
      uptimePercent: r.uptime_percent,
      tasksCompleted: r.tasks_completed,
      avgLatencyMs: r.avg_latency_ms,
      errorRatePercent: r.error_rate_percent,
      lastActive: r.last_active,
      currentTask: r.current_task || undefined,
      channel: r.channel,
    };
  },

  setStatus(agentId: number, status: AgentModuleTelemetry['status'], currentTask?: string): void {
    db.prepare(`
      UPDATE agent_telemetry
      SET status = ?, current_task = ?, last_active = ?, updated_at = ?
      WHERE agent_id = ?
    `).run(
      status,
      currentTask || null,
      new Date().toISOString(),
      Date.now(),
      agentId
    );
  },

  recordTaskCompletion(agentId: number, latencyMs: number, error: boolean = false): void {
    const cur = this.get(agentId);
    if (!cur) return;

    const newCompleted = cur.tasksCompleted + (error ? 0 : 1);
    const newLatency = Math.round((cur.avgLatencyMs * 0.8) + (latencyMs * 0.2));
    const newErrorRate = error
      ? Math.min(100, Number((cur.errorRatePercent * 0.95 + 5).toFixed(2)))
      : Math.max(0, Number((cur.errorRatePercent * 0.95).toFixed(2)));

    db.prepare(`
      UPDATE agent_telemetry
      SET status = 'idle',
          tasks_completed = ?,
          avg_latency_ms = ?,
          error_rate_percent = ?,
          current_task = NULL,
          last_active = ?,
          updated_at = ?
      WHERE agent_id = ?
    `).run(
      newCompleted,
      newLatency,
      newErrorRate,
      new Date().toISOString(),
      Date.now(),
      agentId
    );
  }
};

// ----------------------------------------------------
// Mission Reports Repository
// ----------------------------------------------------
export const ReportRepository = {
  create(report: ConsolidatedReport): ConsolidatedReport {
    db.prepare(`
      INSERT INTO mission_reports (
        report_id, mission_title, objective, timestamp, total_agents_involved,
        total_execution_time_ms, total_tokens_used, efficiency_score, executive_summary,
        deliverables_json, protocol_trace_json, audit_findings_json, recommendations_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      report.reportId,
      report.missionTitle,
      report.objective,
      report.timestamp,
      report.totalAgentsInvolved,
      report.totalExecutionTimeMs,
      report.totalTokensUsed,
      report.efficiencyScore,
      report.executiveSummary,
      JSON.stringify(report.agentDeliverables || []),
      JSON.stringify(report.protocolTrace || []),
      JSON.stringify(report.auditFindings || []),
      JSON.stringify(report.recommendations || []),
      Date.now()
    );
    return report;
  },

  getAll(limit: number = 20): ConsolidatedReport[] {
    const rows = db.prepare(`
      SELECT * FROM mission_reports ORDER BY created_at DESC LIMIT ?
    `).all(limit) as any[];

    return rows.map(r => ({
      reportId: r.report_id,
      missionTitle: r.mission_title,
      objective: r.objective,
      timestamp: r.timestamp,
      totalAgentsInvolved: r.total_agents_involved,
      totalExecutionTimeMs: r.total_execution_time_ms,
      totalTokensUsed: r.total_tokens_used,
      efficiencyScore: r.efficiency_score,
      executiveSummary: r.executive_summary,
      agentDeliverables: JSON.parse(r.deliverables_json || '[]'),
      protocolTrace: JSON.parse(r.protocol_trace_json || '[]'),
      auditFindings: JSON.parse(r.audit_findings_json || '[]'),
      recommendations: JSON.parse(r.recommendations_json || '[]'),
    }));
  }
};

// ----------------------------------------------------
// Security & Audit Logs Repository
// ----------------------------------------------------
export const SecurityAuditRepository = {
  log(ip: string, method: string, endpoint: string, statusCode: number, latencyMs: number): void {
    try {
      db.prepare(`
        INSERT INTO security_audit_logs (ip, method, endpoint, status_code, latency_ms, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(ip, method, endpoint, statusCode, latencyMs, Date.now());
    } catch {
      // Non-fatal
    }
  }
};
