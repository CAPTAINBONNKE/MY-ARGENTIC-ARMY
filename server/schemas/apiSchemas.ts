import { z } from 'zod';

export const NoteChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  done: z.boolean().default(false),
});

export const AuthorAgentSchema = z.object({
  agentId: z.number().int(),
  roleName: z.string(),
  avatarIcon: z.string().optional(),
});

export const NoteCreateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  content: z.string().default(''),
  updated: z.string().optional(),
  color: z.string().default('yellow'),
  pinned: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  checklist: z.array(NoteChecklistItemSchema).default([]),
  authorAgent: z.union([AuthorAgentSchema, z.number().int()]).optional(),
});

export const NoteUpdateSchema = NoteCreateSchema.partial();

export const ProtocolDispatchSchema = z.object({
  agentId: z.coerce.number().int().min(1, 'Agent ID must be positive'),
  input: z.string().min(1, 'Input instruction is required').max(20000, 'Input payload exceeds maximum limit'),
  taskTitle: z.string().optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  temperature: z.number().min(0).max(1).optional(),
  modelOverride: z.string().optional(),
  correlationId: z.string().optional(),
  contextData: z.record(z.string(), z.unknown()).optional(),
});

export const MissionNodeSchema = z.object({
  nodeId: z.string().optional(),
  agentId: z.coerce.number().int().positive(),
  taskTitle: z.string().min(1, 'Task title is required'),
  taskPrompt: z.string().optional(),
  expectedOutputKey: z.string().optional(),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
});

export const MissionExecuteSchema = z.object({
  title: z.string().min(1, 'Mission title is required'),
  objective: z.string().min(1, 'Mission objective is required'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  nodes: z.array(MissionNodeSchema).min(1, 'At least one node is required for mission execution'),
});

export const BroadcastSchema = z.object({
  message: z.string().min(1, 'Broadcast message cannot be empty'),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  directive: z.string().optional(),
});

export const SmartRouteSchema = z.object({
  taskPrompt: z.string().min(1, 'Task prompt is required for smart routing'),
});

export const GenerateReportSchema = z.object({
  title: z.string().min(1, 'Report title is required'),
  objective: z.string().min(1, 'Report objective is required'),
  logs: z.array(z.unknown()).default([]),
});

export const WorkflowChainSchema = z.object({
  pipelineId: z.string().min(1, 'Pipeline ID is required'),
  input: z.string().min(1, 'Input parameter is required'),
});

export const OptimizePromptSchema = z.object({
  rawPrompt: z.string().min(1, 'Raw prompt is required'),
  targetModel: z.string().default('gemini-3.7-flash'),
  includeFewShot: z.boolean().default(true),
});

export const AndroidExecuteSchema = z.object({
  userPrompt: z.string().min(1, 'userPrompt is required'),
  llmProvider: z.enum(['cloud', 'local', 'hybrid']).default('hybrid'),
  deviceState: z.record(z.string(), z.unknown()).optional(),
});

export const AndroidTechnicalTaskSchema = z.object({
  taskTitle: z.string().optional(),
  technicalRequirements: z.string().optional(),
  agentId: z.coerce.number().int().optional().default(1),
  codeSnippet: z.string().optional(),
  taskType: z.string().default('ARCHITECTURE_ANALYSIS'),
});

export const AndroidVisionSchema = z.object({
  prompt: z.string().optional(),
  lens: z.enum(['FRONT', 'BACK']).default('BACK'),
  imageBase64: z.string().optional(),
});

export const KeepArmySyncSchema = z.object({
  prompt: z.string().optional().default('Generate Q3 Mobile Agent Strategy and task checklist'),
  agentCount: z.number().int().min(1).max(50).default(50),
  targetTag: z.string().default('AgentArmy'),
});

export type NoteCreateInput = z.infer<typeof NoteCreateSchema>;
export type NoteUpdateInput = z.infer<typeof NoteUpdateSchema>;
export type ProtocolDispatchInput = z.infer<typeof ProtocolDispatchSchema>;
export type MissionExecuteInput = z.infer<typeof MissionExecuteSchema>;
export type BroadcastInput = z.infer<typeof BroadcastSchema>;
export type SmartRouteInput = z.infer<typeof SmartRouteSchema>;
export type GenerateReportInput = z.infer<typeof GenerateReportSchema>;
export type WorkflowChainInput = z.infer<typeof WorkflowChainSchema>;
export type OptimizePromptInput = z.infer<typeof OptimizePromptSchema>;
export type AndroidExecuteInput = z.infer<typeof AndroidExecuteSchema>;
export type AndroidTechnicalTaskInput = z.infer<typeof AndroidTechnicalTaskSchema>;
export type AndroidVisionInput = z.infer<typeof AndroidVisionSchema>;
export type KeepArmySyncInput = z.infer<typeof KeepArmySyncSchema>;
