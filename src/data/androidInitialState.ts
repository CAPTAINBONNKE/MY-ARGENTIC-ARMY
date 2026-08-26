import {
  AndroidAppInfo,
  AndroidNotification,
  DeviceLocation,
  VirtualFileItem,
  DeviceMemory,
  KeepNoteItem,
} from '../types/androidAgent';

export const INITIAL_KEEP_NOTES: KeepNoteItem[] = [
  {
    id: 'keep_1',
    title: 'Sprint Planning: Android Agent OS',
    content: '1. Test Kotlin ReAct Orchestrator loop\n2. Verify Accessibility node touch bridge\n3. Benchmark Local Edge vs Cloud Gemini latency\n4. Connect Agent Army to Google Keep notes',
    updated: 'Today, 10:20 AM',
    color: 'yellow',
    pinned: true,
    tags: ['Work', 'Android', 'AgentArmy'],
    checklist: [
      { id: 'c1', text: 'Build Kotlin Coroutine ReAct daemon', done: true },
      { id: 'c2', text: 'Implement GoogleKeepTool ContentProvider API', done: true },
      { id: 'c3', text: 'Grant 50-Agent Army read/write note permissions', done: true },
      { id: 'c4', text: 'Deploy on-device fast cache sync', done: false }
    ],
    authorAgent: {
      agentId: 3,
      roleName: 'AI Automation Specialist',
      avatarIcon: 'Cpu'
    }
  },
  {
    id: 'keep_2',
    title: 'Weekly Grocery & Hardware Checklist',
    content: '• USB-C OTG Debug Cable\n• Oat milk & Espresso beans\n• Screen cleaning microfiber wipes\n• Anker 65W Fast Charger',
    updated: 'Yesterday, 4:15 PM',
    color: 'emerald',
    pinned: false,
    tags: ['Personal', 'Checklist'],
    checklist: [
      { id: 'g1', text: 'USB-C OTG Debug Cable', done: true },
      { id: 'g2', text: 'Oat milk & Espresso beans', done: false },
      { id: 'g3', text: 'Screen cleaning wipes', done: false }
    ]
  },
  {
    id: 'keep_3',
    title: 'Agent Army: Trend Intelligence Brief',
    content: 'Discovered high-impact topics for tech publication:\n- On-Device Small Language Models (Qwen 2.5 14B on mobile)\n- AccessibilityService zero-touch UI navigation patterns\n- Secure Multi-Agent Protocol Envelope V2.1 specifications',
    updated: 'Today, 8:45 AM',
    color: 'blue',
    pinned: true,
    tags: ['AgentArmy', 'AI Research'],
    authorAgent: {
      agentId: 1,
      roleName: 'AI Content Curator',
      avatarIcon: 'Compass'
    }
  }
];

export const INITIAL_APPS: AndroidAppInfo[] = [
  {
    id: 'messages',
    name: 'Messages',
    packageName: 'com.google.android.apps.messaging',
    iconName: 'MessageSquare',
    category: 'communication',
    color: 'from-blue-500 to-indigo-600',
    badge: 2,
    uiState: {
      threads: [
        {
          id: 't1',
          contact: 'Alex Chen',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          lastMessage: 'Are we still meeting at the cafe around 3 PM?',
          time: '12:32 PM',
          unread: true,
          messages: [
            { sender: 'them', text: 'Hey, did you get the project deck?', time: '12:28 PM' },
            { sender: 'me', text: 'Yes, reviewing the agent architecture now.', time: '12:30 PM' },
            { sender: 'them', text: 'Are we still meeting at the cafe around 3 PM?', time: '12:32 PM' },
          ]
        },
        {
          id: 't2',
          contact: 'Sarah Miller (Dr.)',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
          lastMessage: 'Lab report results have been uploaded to your health portal.',
          time: '11:15 AM',
          unread: true,
          messages: [
            { sender: 'them', text: 'Lab report results have been uploaded to your health portal.', time: '11:15 AM' }
          ]
        },
        {
          id: 't3',
          contact: 'Dev Team Lead',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          lastMessage: 'Kotlin multiplatform build passed CI/CD pipeline! 🚀',
          time: 'Yesterday',
          unread: false,
          messages: [
            { sender: 'them', text: 'Kotlin multiplatform build passed CI/CD pipeline! 🚀', time: 'Yesterday' }
          ]
        }
      ]
    }
  },
  {
    id: 'maps',
    name: 'Maps & GPS',
    packageName: 'com.google.android.apps.maps',
    iconName: 'MapPin',
    category: 'navigation',
    color: 'from-emerald-500 to-teal-600',
    uiState: {
      searchQuery: 'Coffee shops nearby',
      selectedPlace: {
        name: 'Artisan Roast & Bakery',
        rating: 4.8,
        reviewsCount: 342,
        address: '452 Market St, Financial District',
        distance: '0.3 miles (4 min walk)',
        openNow: true,
        category: 'Specialty Coffee'
      },
      nearbyPlaces: [
        { name: 'Artisan Roast & Bakery', dist: '0.3 mi', rating: 4.8, time: '4m' },
        { name: 'Blue Bottle Coffee', dist: '0.5 mi', rating: 4.6, time: '7m' },
        { name: 'Equator Coffees', dist: '0.7 mi', rating: 4.7, time: '10m' },
        { name: 'Philz Coffee', dist: '0.9 mi', rating: 4.9, time: '12m' }
      ]
    }
  },
  {
    id: 'camera',
    name: 'Camera & Vision',
    packageName: 'com.android.camera2',
    iconName: 'Camera',
    category: 'media',
    color: 'from-purple-500 to-pink-600',
    uiState: {
      mode: 'PHOTO',
      lens: 'BACK',
      lastPhoto: null,
      recognizedObjects: ['Laptop', 'Coffee Mug', 'Printed Document', 'Notebook'],
      ocrText: 'ANDROID AGENT OS - REAC-T KOTLIN CORE\nModel: Gemini 2.5 Flash / On-Device Edge'
    }
  },
  {
    id: 'files',
    name: 'Files & Storage',
    packageName: 'com.google.android.documentsui',
    iconName: 'Folder',
    category: 'tools',
    color: 'from-amber-500 to-orange-600',
    uiState: {
      currentPath: '/storage/emulated/0/Download',
      activeTab: 'downloads'
    }
  },
  {
    id: 'notes',
    name: 'Notes & Keep',
    packageName: 'com.google.android.keep',
    iconName: 'FileText',
    category: 'productivity',
    color: 'from-yellow-400 to-amber-500',
    uiState: {
      notes: [
        {
          id: 'n1',
          title: 'Sprint Planning Tasks',
          content: '1. Test Kotlin ReAct Orchestrator\n2. Verify Accessibility click bridge\n3. Benchmark Local vs Cloud latency',
          updated: 'Today, 10:20 AM',
          color: 'bg-amber-950/40 border-amber-800/40'
        },
        {
          id: 'n2',
          title: 'Grocery Checklist',
          content: '• Oat milk\n• Espresso beans\n• Fresh avocados\n• Greek yogurt',
          updated: 'Yesterday',
          color: 'bg-emerald-950/40 border-emerald-800/40'
        }
      ]
    }
  },
  {
    id: 'settings',
    name: 'Settings',
    packageName: 'com.android.settings',
    iconName: 'Settings',
    category: 'system',
    color: 'from-slate-600 to-slate-800',
    uiState: {
      wifi: true,
      bluetooth: true,
      location: true,
      darkMode: true,
      batteryLevel: 88,
      accessibilityGranted: true,
      notificationAccessGranted: true,
      foregroundServiceActive: true
    }
  }
];

export const INITIAL_NOTIFICATIONS: AndroidNotification[] = [
  {
    id: 'notif_1',
    packageName: 'com.google.android.apps.messaging',
    appName: 'Messages',
    title: 'Alex Chen',
    body: 'Are we still meeting at the cafe around 3 PM?',
    timestamp: '2m ago',
    iconName: 'MessageSquare',
    priority: 'HIGH',
    actions: [
      { actionId: 'reply_yes', label: 'Reply "Yes, see you there!"' },
      { actionId: 'mark_read', label: 'Mark as read' }
    ]
  },
  {
    id: 'notif_2',
    packageName: 'com.google.android.calendar',
    appName: 'Calendar',
    title: 'Quarterly Architecture Sync in 30m',
    body: 'Conference Room B & Google Meet video link ready',
    timestamp: '14m ago',
    iconName: 'Calendar',
    priority: 'DEFAULT',
    actions: [
      { actionId: 'join_call', label: 'Join Meet' }
    ]
  },
  {
    id: 'notif_3',
    packageName: 'com.android.agent',
    appName: 'Android Agent OS',
    title: 'Agent Active in Foreground',
    body: 'Autonomous tools ready: Apps, Location, Files, Accessibility',
    timestamp: 'Just now',
    iconName: 'Cpu',
    priority: 'LOW'
  }
];

export const INITIAL_FILES: VirtualFileItem[] = [
  {
    id: 'f1',
    name: 'Quarterly_Strategy_2026.pdf',
    path: '/storage/emulated/0/Download/Quarterly_Strategy_2026.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    size: 2450000,
    lastModified: '2026-08-25 09:30',
    content: 'CONFIDENTIAL: Q3 Autonomous Android Agent Milestones\n1. On-device local SLM inference sub-50ms\n2. Real-time vision multi-modal stream with CameraX\n3. Zero-touch Accessibility UI navigation with Kotlin Coroutines\n4. Cloud Gemini 2.5 Flash hybrid fallbacks.'
  },
  {
    id: 'f2',
    name: 'meeting_notes.txt',
    path: '/storage/emulated/0/Documents/meeting_notes.txt',
    type: 'file',
    mimeType: 'text/plain',
    size: 1420,
    lastModified: '2026-08-25 11:45',
    content: 'Meeting with Dev Lead: Finalized Kotlin Action/Tool System architecture. All 6 phone capabilities (Apps, Notifications, Camera, Location, Files, Accessibility) are exposed as decoupled coroutine tools.'
  },
  {
    id: 'f3',
    name: 'IMG_20260825_Office.jpg',
    path: '/storage/emulated/0/DCIM/Camera/IMG_20260825_Office.jpg',
    type: 'file',
    mimeType: 'image/jpeg',
    size: 3890000,
    lastModified: '2026-08-25 12:10',
    content: '[JPEG Image: Desk workspace with dual monitors, coffee cup, Android test device, and notebook with diagram]'
  },
  {
    id: 'f4',
    name: 'contacts_export.csv',
    path: '/storage/emulated/0/Download/contacts_export.csv',
    type: 'file',
    mimeType: 'text/csv',
    size: 4200,
    lastModified: '2026-08-24 18:00',
    content: 'Name,Phone,Email,Role\nAlex Chen,+1-415-555-0199,alex@techcorp.io,Product Lead\nSarah Miller,+1-415-555-0142,dr.miller@healthhub.org,Physician\nDev Lead,+1-415-555-0188,lead@androidagent.org,Principal Architect'
  }
];

export const INITIAL_LOCATION: DeviceLocation = {
  latitude: 37.7879,
  longitude: -122.4075,
  accuracy: 4.2,
  altitude: 18.5,
  speed: 0.0,
  address: '450 Market St, San Francisco, CA 94105, USA',
  timestamp: new Date().toISOString(),
  provider: 'gps'
};

export const INITIAL_MEMORY: DeviceMemory = {
  shortTermHistory: [
    {
      role: 'system',
      content: 'Android Agent OS initialized with Kotlin Orchestrator and 6 Phone Capabilities.',
      timestamp: '12:00 PM'
    },
    {
      role: 'user',
      content: 'Ready to assist on this Android device.',
      timestamp: '12:01 PM'
    }
  ],
  workingMemory: {
    activeAppPackage: 'com.google.android.apps.messaging',
    clipboardText: 'https://github.com/android/agent-orchestrator',
    batteryLevel: 88,
    isCharging: false,
    networkStatus: '5G',
    ringerMode: 'NORMAL',
    screenBrightness: 80,
    volumeLevel: 70,
    flashlightOn: false
  },
  longTermMemory: [
    {
      id: 'mem_1',
      key: 'favorite_cafe',
      value: 'Artisan Roast on Market St (prefers Oat Milk Cappuccino)',
      category: 'user_preference',
      confidence: 0.98,
      lastUpdated: '2026-08-20'
    },
    {
      id: 'mem_2',
      key: 'primary_meeting_contact',
      value: 'Alex Chen (Product Lead)',
      category: 'contact_info',
      confidence: 0.95,
      lastUpdated: '2026-08-22'
    },
    {
      id: 'mem_3',
      key: 'home_city',
      value: 'San Francisco, CA',
      category: 'frequent_place',
      confidence: 0.99,
      lastUpdated: '2026-08-24'
    }
  ]
};
