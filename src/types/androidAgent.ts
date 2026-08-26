export type PhoneCapabilityType =
  | 'apps'
  | 'notifications'
  | 'camera'
  | 'location'
  | 'files'
  | 'accessibility'
  | 'notes';

export interface KeepNoteItem {
  id: string;
  title: string;
  content: string;
  updated: string;
  color?: string;
  pinned?: boolean;
  checklist?: Array<{ id: string; text: string; done: boolean }>;
  tags?: string[];
  authorAgent?: {
    agentId: number;
    roleName: string;
    avatarIcon?: string;
  };
}

export type LLMProviderType = 'cloud' | 'local' | 'hybrid';

export type AndroidServiceType =
  | 'foreground_agent'
  | 'accessibility_bridge'
  | 'notification_listener'
  | 'background_workmanager';

export interface AndroidAppInfo {
  id: string;
  name: string;
  packageName: string;
  iconName: string;
  category: 'communication' | 'productivity' | 'navigation' | 'media' | 'system' | 'tools';
  color: string;
  badge?: number;
  uiState?: Record<string, any>;
}

export interface AndroidNotification {
  id: string;
  packageName: string;
  appName: string;
  title: string;
  body: string;
  timestamp: string;
  iconName: string;
  priority: 'HIGH' | 'DEFAULT' | 'LOW';
  actions?: Array<{ actionId: string; label: string }>;
  isRead?: boolean;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  address?: string;
  timestamp: string;
  provider: 'gps' | 'network' | 'fused';
}

export interface VirtualFileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size: number;
  lastModified: string;
  content?: string;
}

export interface AccessibilityNode {
  id: string;
  resourceId?: string;
  className: string;
  text?: string;
  contentDescription?: string;
  clickable: boolean;
  focusable: boolean;
  scrollable: boolean;
  bounds: { x: number; y: number; width: number; height: number };
  children?: AccessibilityNode[];
}

export interface DeviceMemory {
  shortTermHistory: Array<{
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    timestamp: string;
  }>;
  workingMemory: {
    activeAppPackage?: string;
    clipboardText?: string;
    batteryLevel: number;
    isCharging: boolean;
    networkStatus: 'WIFI' | '5G' | '4G' | 'OFFLINE';
    ringerMode: 'NORMAL' | 'VIBRATE' | 'SILENT';
    screenBrightness: number;
    volumeLevel: number;
    flashlightOn: boolean;
  };
  longTermMemory: Array<{
    id: string;
    key: string;
    value: string;
    category: 'user_preference' | 'contact_info' | 'frequent_place' | 'routine' | 'device_setting';
    confidence: number;
    lastUpdated: string;
  }>;
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: PhoneCapabilityType | 'system';
  description: string;
  kotlinSignature: string;
  parameters: Record<string, {
    type: string;
    description: string;
    required?: boolean;
    default?: any;
  }>;
}

export interface ReActStep {
  stepNumber: number;
  thought: string;
  toolCall?: {
    toolName: string;
    args: Record<string, any>;
  };
  observation?: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  durationMs?: number;
}

export interface AgentExecutionSession {
  sessionId: string;
  userPrompt: string;
  llmProvider: LLMProviderType;
  modelName: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  totalDurationMs?: number;
  steps: ReActStep[];
  finalAnswer?: string;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  executedDeviceActions: Array<{
    type: PhoneCapabilityType | 'system';
    summary: string;
    payload: any;
    timestamp: string;
  }>;
  error?: string;
}

export interface KotlinFileDescriptor {
  fileName: string;
  path: string;
  packageName: string;
  title: string;
  description: string;
  code: string;
  tags: string[];
}
