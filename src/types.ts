export type AgentCategory =
  | 'content'
  | 'video'
  | 'engineering'
  | 'conversational'
  | 'visual'
  | 'audio'
  | 'data'
  | 'marketing'
  | 'quality'
  | 'research'
  | 'productivity'
  | 'business'
  | 'education';

export interface ModelConfig {
  provider: 'ollama' | 'openai' | 'gemini';
  model: string;
  fallback_provider?: string;
  fallback_model?: string;
  temperature: number;
  max_tokens?: number;
}

export interface AgentDefinition {
  id: number;
  role_name: string;
  category: AgentCategory;
  system_prompt: string;
  tools_required: string[];
  model_config: ModelConfig;
  linked_workflows?: string[];
  description: string;
  capabilities: string[];
  example_input: string;
  output_schema_preview: string;
  iconName: string;
}

// ----------------------------------------------------
// Standardized Agent Communication Protocol Types
// ----------------------------------------------------

export type ProtocolMessageType =
  | 'TASK_DISPATCH'      // Commander to unit direct task
  | 'TASK_DELEGATE'      // Agent to peer specialist delegation
  | 'PAYLOAD_HANDOFF'    // Inter-agent context & artifact data transfer
  | 'STATUS_UPDATE'      // Node health, progress & load reporting
  | 'BROADCAST_SIGNAL'   // Protocol-wide emergency/sync broadcast
  | 'CONSENSUS_VOTE'     // Multi-agent review/verification signal
  | 'ERROR_ALERT'        // Fault, rate-limit, or schema violation
  | 'HEALTH_PING';       // Heartbeat/liveness probe

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AgentHealthStatus = 'idle' | 'executing' | 'standby' | 'degraded' | 'offline';

export interface ProtocolParty {
  id: number | 'COMMAND_CENTER' | 'BROADCAST';
  role_name?: string;
  category?: AgentCategory | 'SYSTEM';
  endpoint?: string;
}

export interface ProtocolPayload {
  taskTitle?: string;
  taskDescription?: string;
  inputData?: string | Record<string, unknown>;
  intermediateArtifact?: string | Record<string, unknown> | Array<unknown>;
  structuredSchema?: Record<string, unknown>;
  directives?: string[];
  status?: AgentHealthStatus;
  progressPercent?: number;
  errorDetail?: string;
  delegationReason?: string;
  consensusVote?: {
    approved: boolean;
    confidenceScore: number;
    notes: string;
  };
  metadata?: Record<string, unknown>;
}

export interface ProtocolTelemetry {
  latencyMs?: number;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  channel: 'internal_bus' | 'grpc_mesh' | 'websocket_stream' | 'n8n_webhook';
  signature: string; // Cryptographic-style verification token
}

export interface AgentProtocolEnvelope {
  messageId: string;
  correlationId: string;
  parentId?: string;
  timestamp: string;
  type: ProtocolMessageType;
  priority: PriorityLevel;
  sender: ProtocolParty;
  receiver: ProtocolParty;
  payload: ProtocolPayload;
  telemetry: ProtocolTelemetry;
}

// ----------------------------------------------------
// Task Delegation & Mission Builder Types
// ----------------------------------------------------

export interface TaskDelegationNode {
  nodeId: string;
  agentId: number;
  taskTitle: string;
  taskPrompt: string;
  expectedOutputKey: string;
  priority: PriorityLevel;
  status: 'pending' | 'active' | 'completed' | 'failed';
  dependsOn: string[]; // parent nodeIds
  output?: string;
  structuredJson?: Record<string, unknown> | Array<unknown> | null;
  durationMs?: number;
  error?: string;
}

export interface MissionPlan {
  missionId: string;
  title: string;
  objective: string;
  priority: PriorityLevel;
  nodes: TaskDelegationNode[];
  createdAt: string;
  status: 'draft' | 'running' | 'completed' | 'failed';
}

// ----------------------------------------------------
// Telemetry & Consolidated Report Types
// ----------------------------------------------------

export interface AgentModuleTelemetry {
  agentId: number;
  role_name: string;
  category: AgentCategory;
  status: AgentHealthStatus;
  uptimePercent: number;
  tasksCompleted: number;
  avgLatencyMs: number;
  errorRatePercent: number;
  lastActive: string;
  currentTask?: string;
  channel: string;
}

export interface AgentDeliverable {
  agentId: number;
  roleName: string;
  category: AgentCategory;
  taskTitle: string;
  summary: string;
  keyOutputs: Record<string, unknown> | string;
  latencyMs: number;
  status: 'success' | 'warning' | 'error';
}

export interface ConsolidatedReport {
  reportId: string;
  missionTitle: string;
  objective: string;
  timestamp: string;
  totalAgentsInvolved: number;
  totalExecutionTimeMs: number;
  totalTokensUsed: number;
  efficiencyScore: number; // 0 - 100
  executiveSummary: string;
  agentDeliverables: AgentDeliverable[];
  protocolTrace: AgentProtocolEnvelope[];
  auditFindings: string[];
  recommendations: string[];
}

// ----------------------------------------------------
// Execution Request / Response Types
// ----------------------------------------------------

export interface AgentExecutionRequest {
  agentId: number;
  input: string;
  temperature?: number;
  modelOverride?: string;
  contextData?: Record<string, unknown>;
  priority?: PriorityLevel;
  correlationId?: string;
}

export interface AgentExecutionResponse {
  agentId: number;
  agentName: string;
  timestamp: string;
  output: string;
  structuredJson?: Record<string, unknown> | Array<unknown> | null;
  executionTimeMs: number;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  toolsInvoked?: string[];
  status: 'success' | 'error';
  error?: string;
  protocolEnvelope?: AgentProtocolEnvelope;
}

export interface MultiAgentStage {
  stageNumber: number;
  agentId: number;
  stageName: string;
  inputTemplate: string;
  outputKey: string;
}

export interface MultiAgentPipeline {
  id: string;
  name: string;
  description: string;
  category: string;
  stages: MultiAgentStage[];
}

export interface PipelineExecutionLog {
  stageNumber: number;
  agentId: number;
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input: string;
  output?: string;
  structuredJson?: Record<string, unknown> | Array<unknown> | null;
  durationMs?: number;
  error?: string;
}
