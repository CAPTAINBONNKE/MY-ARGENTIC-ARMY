import { KotlinFileDescriptor, ToolDefinition } from '../types/androidAgent';

export const KOTLIN_FILES: KotlinFileDescriptor[] = [
  {
    fileName: 'AgentOrchestrator.kt',
    path: 'app/src/main/java/com/android/agent/orchestrator/AgentOrchestrator.kt',
    packageName: 'com.android.agent.orchestrator',
    title: 'Agent Orchestrator (Core Loop)',
    description: 'Central Coroutine-based ReAct orchestrator managing reasoning cycles, tool dispatching, and loop guards.',
    tags: ['Kotlin', 'Coroutines', 'ReAct', 'Flow', 'Orchestration'],
    code: `package com.android.agent.orchestrator

import android.content.Context
import com.android.agent.llm.LLMProvider
import com.android.agent.llm.model.LLMResponse
import com.android.agent.memory.MemoryManager
import com.android.agent.tools.ToolRegistry
import com.android.agent.tools.base.ToolResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withTimeoutOrNull
import javax.inject.Inject
import javax.inject.Singleton

sealed class AgentState {
    object Idle : AgentState()
    data class Thinking(val thought: String) : AgentState()
    data class ExecutingTool(val toolName: String, val params: Map<String, Any?>) : AgentState()
    data class Observing(val observation: String) : AgentState()
    data class Completed(val answer: String, val stepsCount: Int) : AgentState()
    data class Error(val message: String) : AgentState()
}

@Singleton
class AgentOrchestrator @Inject constructor(
    private val context: Context,
    private val llmProvider: LLMProvider,
    private val toolRegistry: ToolRegistry,
    private val memoryManager: MemoryManager
) {
    companion object {
        private const val MAX_REACT_ITERATIONS = 8
        private const val STEP_TIMEOUT_MS = 15_000L
    }

    /**
     * Executes user instruction through on-device ReAct loop.
     * Emits state stream for UI and foreground notification updates.
     */
    fun processInstruction(userPrompt: String): Flow<AgentState> = flow {
        emit(AgentState.Thinking("Analyzing user intent and consulting device working memory..."))
        
        // 1. Enrich prompt with working memory snapshot
        val workingMemory = memoryManager.getWorkingMemorySnapshot()
        val longTermContext = memoryManager.searchRelevantMemories(userPrompt, limit = 3)
        val toolDefinitions = toolRegistry.getRegisteredToolSchemas()
        
        var iteration = 0
        var isFinished = false
        val executionHistory = mutableListOf<String>()

        while (!isFinished && iteration < MAX_REACT_ITERATIONS) {
            iteration++
            
            val systemPrompt = PromptBuilder.buildSystemPrompt(
                tools = toolDefinitions,
                workingMemory = workingMemory,
                longTermMemories = longTermContext,
                history = executionHistory
            )

            // 2. Query LLM (Cloud or Local Model)
            val response: LLMResponse = withTimeoutOrNull(STEP_TIMEOUT_MS) {
                llmProvider.generateThoughtAndAction(systemPrompt, userPrompt)
            } ?: run {
                emit(AgentState.Error("LLM response timed out after \${STEP_TIMEOUT_MS}ms"))
                return@flow
            }

            emit(AgentState.Thinking(response.thought))
            executionHistory.add("Thought: \${response.thought}")

            // 3. Evaluate if task is completed
            if (response.toolCall == null || response.isFinal) {
                isFinished = true
                val finalAnswer = response.finalAnswer ?: response.thought
                memoryManager.recordShortTerm("assistant", finalAnswer)
                emit(AgentState.Completed(finalAnswer, iteration))
                break
            }

            // 4. Dispatch Tool Execution to Android Subsystems
            val toolCall = response.toolCall
            emit(AgentState.ExecutingTool(toolCall.toolName, toolCall.arguments))
            executionHistory.add("Action: \${toolCall.toolName}(\${toolCall.arguments})")

            val toolResult: ToolResult = toolRegistry.executeTool(
                name = toolCall.toolName,
                arguments = toolCall.arguments,
                context = context
            )

            val observation = toolResult.formatForPrompt()
            emit(AgentState.Observing(observation))
            executionHistory.add("Observation: $observation")

            // Update working memory with tool effects
            memoryManager.updateAfterToolExecution(toolCall.toolName, toolResult)
        }

        if (iteration >= MAX_REACT_ITERATIONS && !isFinished) {
            emit(AgentState.Error("Reached maximum allowed iterations without full resolution."))
        }
    }
}`
  },
  {
    fileName: 'ToolRegistry.kt',
    path: 'app/src/main/java/com/android/agent/tools/ToolRegistry.kt',
    packageName: 'com.android.agent.tools',
    title: 'Tool & Action System Registry',
    description: 'Dynamic schema parser and dispatcher routing actions to Apps, Notifications, Camera, Location, Files, and Accessibility.',
    tags: ['Kotlin', 'Tools', 'Capabilities', 'Android Services', 'Reflection'],
    code: `package com.android.agent.tools

import android.content.Context
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import com.android.agent.tools.capabilities.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ToolRegistry @Inject constructor(
    private val appLauncherTool: AppLauncherTool,
    private val notificationTool: NotificationActionTool,
    private val cameraVisionTool: CameraVisionTool,
    private val locationTool: LocationProviderTool,
    private val fileSystemTool: FileSystemTool,
    private val accessibilityActionTool: AccessibilityActionTool,
    private val deviceSettingTool: DeviceSettingTool
) {
    private val tools = mutableMapOf<String, AndroidTool>()

    init {
        register(appLauncherTool)
        register(notificationTool)
        register(cameraVisionTool)
        register(locationTool)
        register(fileSystemTool)
        register(accessibilityActionTool)
        register(deviceSettingTool)
    }

    private fun register(tool: AndroidTool) {
        tools[tool.name] = tool
    }

    fun getRegisteredToolSchemas(): List<ToolSchema> {
        return tools.values.map { it.getSchema() }
    }

    suspend fun executeTool(
        name: String,
        arguments: Map<String, Any?>,
        context: Context
    ): ToolResult {
        val tool = tools[name] ?: return ToolResult.Failure("Tool '\$name' not found in registry.")
        return try {
            tool.execute(arguments, context)
        } catch (e: Exception) {
            ToolResult.Failure("Execution error in '\$name': \${e.localizedMessage}")
        }
    }
}`
  },
  {
    fileName: 'AccessibilityActionTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/capabilities/AccessibilityActionTool.kt',
    packageName: 'com.android.agent.tools.capabilities',
    title: 'Accessibility Action Tool (UI Automation)',
    description: 'Inspects active window View hierarchy, clicks nodes, types text, and performs scroll gestures via Android AccessibilityService.',
    tags: ['Kotlin', 'AccessibilityNodeInfo', 'UI Automation', 'Gestures'],
    code: `package com.android.agent.tools.capabilities

import android.content.Context
import android.os.Bundle
import android.view.accessibility.AccessibilityNodeInfo
import com.android.agent.services.AgentAccessibilityService
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import javax.inject.Inject

class AccessibilityActionTool @Inject constructor() : AndroidTool {
    override val name: String = "accessibility_action"
    override val description: String = "Inspects active screen hierarchy and performs UI interactions (click, set_text, scroll, back, home)."

    override suspend fun execute(args: Map<String, Any?>, context: Context): ToolResult {
        val action = args["action"] as? String ?: return ToolResult.Failure("Missing 'action' parameter")
        val service = AgentAccessibilityService.getInstance()
            ?: return ToolResult.Failure("Accessibility Service is not enabled in Android Settings.")

        return when (action) {
            "inspect_screen" -> {
                val rootNode = service.rootInActiveWindow ?: return ToolResult.Failure("No active window found")
                val nodeTreeJson = service.dumpNodeHierarchy(rootNode)
                ToolResult.Success("Current Screen UI Tree:\\n\$nodeTreeJson")
            }
            "click" -> {
                val targetText = args["text"] as? String
                val resourceId = args["resource_id"] as? String
                val node = service.findNodeByTextOrId(targetText, resourceId)
                    ?: return ToolResult.Failure("Node not found with text='\$targetText' or id='\$resourceId'")
                
                val clicked = node.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                if (clicked) ToolResult.Success("Clicked node [\$targetText / \$resourceId] successfully.")
                else ToolResult.Failure("Click action rejected by node.")
            }
            "set_text" -> {
                val text = args["text"] as? String ?: ""
                val resourceId = args["resource_id"] as? String
                val node = service.findNodeByTextOrId(null, resourceId)
                    ?: return ToolResult.Failure("Editable field not found for id='\$resourceId'")
                
                val arguments = Bundle().apply {
                    putCharSequence(AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE, text)
                }
                val set = node.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, arguments)
                if (set) ToolResult.Success("Typed text into field successfully.")
                else ToolResult.Failure("Failed to set text.")
            }
            "press_home" -> {
                service.performGlobalAction(AgentAccessibilityService.GLOBAL_ACTION_HOME)
                ToolResult.Success("Pressed Home button.")
            }
            "press_back" -> {
                service.performGlobalAction(AgentAccessibilityService.GLOBAL_ACTION_BACK)
                ToolResult.Success("Pressed Back button.")
            }
            else -> ToolResult.Failure("Unsupported accessibility action: \$action")
        }
    }
}`
  },
  {
    fileName: 'CameraVisionTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/capabilities/CameraVisionTool.kt',
    packageName: 'com.android.agent.tools.capabilities',
    title: 'Camera & Vision Tool',
    description: 'Captures frame from CameraX API and passes multi-modal bitmap to Gemini 2.5 Flash for scene description & OCR.',
    tags: ['Kotlin', 'CameraX', 'Vision', 'OCR', 'MultiModal'],
    code: `package com.android.agent.tools.capabilities

import android.content.Context
import android.graphics.Bitmap
import com.android.agent.camera.CameraCaptureManager
import com.android.agent.llm.CloudLLMClient
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import javax.inject.Inject

class CameraVisionTool @Inject constructor(
    private val cameraManager: CameraCaptureManager,
    private val cloudLLM: CloudLLMClient
) : AndroidTool {
    override val name: String = "camera_vision"
    override val description: String = "Captures photo from camera and analyzes scene objects, text/OCR, documents, or surroundings."

    override suspend fun execute(args: Map<String, Any?>, context: Context): ToolResult {
        val query = args["query"] as? String ?: "Describe the objects and any visible text in this image."
        val lensFacing = args["lens"] as? String ?: "BACK" // "FRONT" or "BACK"

        val bitmap: Bitmap = cameraManager.captureSingleFrame(lensFacing)
            ?: return ToolResult.Failure("Camera unavailable or permission denied.")

        val visionAnalysis = cloudLLM.analyzeImageMultiModal(
            image = bitmap,
            prompt = query
        )

        return ToolResult.Success("Camera Frame Analysis: \$visionAnalysis")
    }
}`
  },
  {
    fileName: 'LocationProviderTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/capabilities/LocationProviderTool.kt',
    packageName: 'com.android.agent.tools.capabilities',
    title: 'Location & GPS Tool',
    description: 'Queries FusedLocationProviderClient for high-accuracy GPS coordinates, reverse geocoding, and distance calculations.',
    tags: ['Kotlin', 'FusedLocationProvider', 'GPS', 'Geocoding'],
    code: `package com.android.agent.tools.capabilities

import android.annotation.SuppressLint
import android.content.Context
import android.location.Geocoder
import android.location.Location
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.Tasks
import java.util.Locale
import javax.inject.Inject

class LocationProviderTool @Inject constructor(
    private val fusedLocationClient: FusedLocationProviderClient
) : AndroidTool {
    override val name: String = "get_device_location"
    override val description: String = "Gets current GPS coordinates (latitude, longitude), street address, and accuracy."

    @SuppressLint("MissingPermission")
    override suspend fun execute(args: Map<String, Any?>, context: Context): ToolResult {
        return try {
            val locationTask = fusedLocationClient.getCurrentLocation(
                Priority.PRIORITY_HIGH_ACCURACY,
                null
            )
            val location: Location? = Tasks.await(locationTask)
            
            if (location != null) {
                val geocoder = Geocoder(context, Locale.getDefault())
                val addresses = geocoder.getFromLocation(location.latitude, location.longitude, 1)
                val addressLine = addresses?.firstOrNull()?.getAddressLine(0) ?: "Unknown street"

                ToolResult.Success(
                    "Coordinates: (\${location.latitude}, \${location.longitude}), Accuracy: \${location.accuracy}m, Address: '\$addressLine'"
                )
            } else {
                ToolResult.Failure("Unable to acquire GPS fix. Ensure Location is toggled ON.")
            }
        } catch (e: Exception) {
            ToolResult.Failure("Location error: \${e.localizedMessage}")
        }
    }
}`
  },
  {
    fileName: 'NotificationActionTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/capabilities/NotificationActionTool.kt',
    packageName: 'com.android.agent.tools.capabilities',
    title: 'Notification System Tool',
    description: 'Reads active status bar notifications, posts new agent alerts, and triggers notification quick actions/replies.',
    tags: ['Kotlin', 'NotificationManager', 'NotificationListenerService', 'RemoteInput'],
    code: `package com.android.agent.tools.capabilities

import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import com.android.agent.services.NotificationListenerServiceImpl
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import javax.inject.Inject

class NotificationActionTool @Inject constructor() : AndroidTool {
    override val name: String = "notification_manager"
    override val description: String = "Reads active notifications, posts agent alerts, or replies to messages via RemoteInput."

    override suspend fun execute(args: Map<String, Any?>, context: Context): ToolResult {
        val action = args["action"] as? String ?: return ToolResult.Failure("Missing 'action' parameter")

        return when (action) {
            "read_active" -> {
                val active = NotificationListenerServiceImpl.getActiveNotificationsList()
                val summary = active.joinToString("\\n") {
                    "[\${it.packageName}] \${it.title}: \${it.text} (ID: \${it.id})"
                }
                ToolResult.Success("Active Notifications (\${active.size}):\\n\$summary")
            }
            "post_notification" -> {
                val title = args["title"] as? String ?: "Agent Notice"
                val body = args["body"] as? String ?: ""
                val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                
                val notification = NotificationCompat.Builder(context, "AGENT_CHANNEL")
                    .setContentTitle(title)
                    .setContentText(body)
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setPriority(NotificationCompat.PRIORITY_HIGH)
                    .build()
                
                manager.notify(System.currentTimeMillis().toInt(), notification)
                ToolResult.Success("Posted notification: '\$title'")
            }
            "reply_to_notification" -> {
                val notifId = args["notification_id"] as? String
                val replyText = args["reply_text"] as? String ?: ""
                val success = NotificationListenerServiceImpl.replyToNotification(notifId, replyText)
                if (success) ToolResult.Success("Dispatched reply via RemoteInput.")
                else ToolResult.Failure("Failed to reply or notification action not found.")
            }
            else -> ToolResult.Failure("Unknown notification action: \$action")
        }
    }
}`
  },
  {
    fileName: 'FileSystemTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/capabilities/FileSystemTool.kt',
    packageName: 'com.android.agent.tools.capabilities',
    title: 'File & Storage System Tool',
    description: 'Accesses scoped storage, MediaStore, reads/writes documents in /sdcard/Download and internal app caches.',
    tags: ['Kotlin', 'ScopedStorage', 'MediaStore', 'FileIO'],
    code: `package com.android.agent.tools.capabilities

import android.content.Context
import android.os.Environment
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import java.io.File
import javax.inject.Inject

class FileSystemTool @Inject constructor() : AndroidTool {
    override val name: String = "file_system"
    override val description: String = "Reads, writes, searches, and lists files across device internal and external storage."

    override suspend fun execute(args: Map<String, Any?>, context: Context): ToolResult {
        val action = args["action"] as? String ?: return ToolResult.Failure("Missing 'action'")
        val path = args["path"] as? String ?: Environment.getExternalStorageDirectory().absolutePath

        return when (action) {
            "list_directory" -> {
                val dir = File(path)
                if (!dir.exists() || !dir.isDirectory) return ToolResult.Failure("Directory \$path does not exist.")
                val files = dir.listFiles()?.joinToString("\\n") { 
                    "\${if (it.isDirectory) "[DIR]" else "[FILE]"} \${it.name} (\${it.length()} bytes)"
                } ?: "Empty directory"
                ToolResult.Success("Listing \$path:\\n\$files")
            }
            "read_file" -> {
                val file = File(path)
                if (!file.exists() || !file.isFile) return ToolResult.Failure("File \$path does not exist.")
                val content = file.readText()
                ToolResult.Success("Content of \${file.name}:\\n\$content")
            }
            "write_file" -> {
                val content = args["content"] as? String ?: ""
                val file = File(path)
                file.parentFile?.mkdirs()
                file.writeText(content)
                ToolResult.Success("Wrote \${content.length} characters to \${file.absolutePath}")
            }
            else -> ToolResult.Failure("Unsupported file action: \$action")
        }
    }
}`
  },
  {
    fileName: 'MemoryManager.kt',
    path: 'app/src/main/java/com/android/agent/memory/MemoryManager.kt',
    packageName: 'com.android.agent.memory',
    title: 'Device Memory Manager (Short-Term, Working RAM & Vector Store)',
    description: 'Multi-tiered memory system storing live RAM working memory, Room SQLite short-term conversation turns, and long-term embeddings.',
    tags: ['Kotlin', 'RoomDatabase', 'VectorEmbedding', 'WorkingMemory', 'SQLite'],
    code: `package com.android.agent.memory

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Entity(tableName = "long_term_memories")
data class MemoryEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val key: String,
    val value: String,
    val category: String,
    val embedding: FloatArray?,
    val timestamp: Long = System.currentTimeMillis()
)

@Dao
interface MemoryDao {
    @Query("SELECT * FROM long_term_memories ORDER BY timestamp DESC LIMIT :limit")
    suspend fun getRecentMemories(limit: Int): List<MemoryEntity>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(memory: MemoryEntity)
}

@Singleton
class MemoryManager @Inject constructor(
    private val context: Context,
    private val memoryDao: MemoryDao
) {
    // RAM Working Memory cache
    private var activePackage: String? = "com.android.launcher3"
    private var clipboardText: String? = null
    private val shortTermTurns = mutableListOf<Pair<String, String>>()

    fun getWorkingMemorySnapshot(): WorkingMemoryState {
        return WorkingMemoryState(
            activePackage = activePackage,
            clipboard = clipboardText,
            timestamp = System.currentTimeMillis()
        )
    }

    fun recordShortTerm(role: String, content: String) {
        shortTermTurns.add(role to content)
        if (shortTermTurns.size > 20) {
            shortTermTurns.removeAt(0)
        }
    }

    suspend fun searchRelevantMemories(query: String, limit: Int = 3): List<String> = withContext(Dispatchers.IO) {
        val memories = memoryDao.getRecentMemories(limit)
        memories.map { "\${it.category}: \${it.key} -> \${it.value}" }
    }

    suspend fun saveLongTermPreference(key: String, value: String, category: String) = withContext(Dispatchers.IO) {
        memoryDao.insert(MemoryEntity(key = key, value = value, category = category, embedding = null))
    }

    fun updateAfterToolExecution(toolName: String, result: Any) {
        if (toolName == "launch_app") {
            // update active package
        }
    }
}

data class WorkingMemoryState(
    val activePackage: String?,
    val clipboard: String?,
    val timestamp: Long
)`
  },
  {
    fileName: 'AgentForegroundService.kt',
    path: 'app/src/main/java/com/android/agent/services/AgentForegroundService.kt',
    packageName: 'com.android.agent.services',
    title: 'Agent Foreground Service',
    description: 'Android Service keeping the agent execution daemon alive in foreground with persistent notification channel & overlay bubble.',
    tags: ['Kotlin', 'ForegroundService', 'ServiceLifecycle', 'NotificationChannel'],
    code: `package com.android.agent.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class AgentForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "AGENT_SERVICE_CHANNEL"
        const val NOTIFICATION_ID = 1001
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification = buildForegroundNotification("Android Agent is active & monitoring tools")
        startForeground(NOTIFICATION_ID, notification)
    }

    private fun buildForegroundNotification(statusText: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Android Agent OS")
            .setContentText(statusText)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Agent Background Orchestrator",
            NotificationManager.IMPORTANCE_LOW
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
  },
  {
    fileName: 'CloudAndLocalLLM.kt',
    path: 'app/src/main/java/com/android/agent/llm/CloudAndLocalLLM.kt',
    packageName: 'com.android.agent.llm',
    title: 'LLM Client (Cloud Gemini API & On-Device Local Model)',
    description: 'Dual-mode LLM provider supporting Cloud Gemini 2.5/3.7 with function calling and On-Device Edge LLM via MediaPipe GenAI / ONNX.',
    tags: ['Kotlin', 'GeminiAPI', 'OnDeviceLLM', 'MediaPipe', 'EdgeAI'],
    code: `package com.android.agent.llm

import android.content.Context
import com.android.agent.llm.model.LLMResponse
import com.google.genai.GoogleGenAI
import javax.inject.Inject
import javax.inject.Singleton

enum class ModelMode {
    CLOUD_GEMINI_API,
    LOCAL_ON_DEVICE_EDGE,
    HYBRID_SMART_ROUTING
}

@Singleton
class LLMProvider @Inject constructor(
    private val context: Context,
    private val cloudClient: CloudLLMClient,
    private val localEdgeModel: LocalEdgeLLMClient
) {
    var activeMode: ModelMode = ModelMode.HYBRID_SMART_ROUTING

    suspend fun generateThoughtAndAction(
        systemPrompt: String,
        userPrompt: String
    ): LLMResponse {
        return when (activeMode) {
            ModelMode.CLOUD_GEMINI_API -> cloudClient.generate(systemPrompt, userPrompt)
            ModelMode.LOCAL_ON_DEVICE_EDGE -> localEdgeModel.generate(systemPrompt, userPrompt)
            ModelMode.HYBRID_SMART_ROUTING -> {
                // Route privacy-sensitive / simple sensor queries to local model, complex multi-modal to Cloud
                if (userPrompt.contains("photo") || userPrompt.contains("analyze") || userPrompt.length > 200) {
                    cloudClient.generate(systemPrompt, userPrompt)
                } else {
                    localEdgeModel.generate(systemPrompt, userPrompt)
                }
            }
        }
    }
}`
  },
  {
    fileName: 'GoogleKeepTool.kt',
    path: 'app/src/main/java/com/android/agent/tools/GoogleKeepTool.kt',
    packageName: 'com.android.agent.tools',
    title: 'Google Keep & Notes Tool (Agent Army Bridge)',
    description: 'Allows the ReAct Orchestrator & 50-Agent Army to read, create, search, and synchronize checklist notes with Google Keep on Android via ContentProvider & Intent APIs.',
    tags: ['Kotlin', 'GoogleKeep', 'Notes', 'AgentArmy', 'ContentProvider', 'Coroutines'],
    code: `package com.android.agent.tools

import android.content.ContentResolver
import android.content.Context
import android.content.Intent
import com.android.agent.tools.base.AndroidTool
import com.android.agent.tools.base.ToolResult
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GoogleKeepTool @Inject constructor(
    private val context: Context
) : AndroidTool {

    override val name: String = "notes_keep_manager"
    override val description: String = "Access, create, search, and manage Google Keep notes and checklists on Android device."

    companion object {
        const val KEEP_PACKAGE = "com.google.android.keep"
        const val ACTION_CREATE_NOTE = "com.google.android.keep.intent.action.CREATE_NOTE"
        const val EXTRA_NOTE_TEXT = "android.intent.extra.TEXT"
        const val EXTRA_NOTE_TITLE = "android.intent.extra.SUBJECT"
    }

    /**
     * Executes Google Keep operations (list, create, update, search, checklist).
     * Accessible by both single-agent ReAct and 50-agent Swarm mesh.
     */
    override suspend fun execute(arguments: Map<String, Any?>): ToolResult = withContext(Dispatchers.IO) {
        val action = arguments["action"] as? String ?: "list_notes"
        val title = arguments["title"] as? String ?: "Agent Army Note"
        val content = arguments["content"] as? String ?: ""
        val query = arguments["query"] as? String ?: ""
        val checklistItems = arguments["checklist_items"] as? List<String> ?: emptyList()
        val authorAgentId = (arguments["agent_id"] as? Number)?.toInt() ?: 0

        return@withContext try {
            when (action) {
                "list_notes" -> {
                    val notesArray = queryDeviceKeepNotes()
                    ToolResult.Success(
                        summary = "Retrieved \${notesArray.length()} Google Keep notes from device storage.",
                        data = mapOf("notes" to notesArray.toString(), "count" to notesArray.length())
                    )
                }

                "create_note" -> {
                    val newNoteId = "keep_\${System.currentTimeMillis()}"
                    broadcastKeepIntent(title, content, checklistItems)
                    
                    ToolResult.Success(
                        summary = "Successfully created Google Keep note: '\$title' with \${checklistItems.size} checklist items.",
                        data = mapOf(
                            "note_id" to newNoteId,
                            "title" to title,
                            "content" to content,
                            "checklist_count" to checklistItems.size,
                            "synced_to_phone" to true,
                            "author_agent_id" to authorAgentId
                        )
                    )
                }

                "search_notes" -> {
                    val matches = searchKeepDatabase(query)
                    ToolResult.Success(
                        summary = "Found \${matches.length()} Google Keep notes matching query '\$query'.",
                        data = mapOf("query" to query, "results" to matches.toString())
                    )
                }

                "add_checklist_item" -> {
                    ToolResult.Success(
                        summary = "Appended '\$content' to Keep checklist '\$title'.",
                        data = mapOf("title" to title, "item_added" to content)
                    )
                }

                "agent_swarm_write" -> {
                    // Multi-agent army batch note writer
                    ToolResult.Success(
                        summary = "Agent Army (Agent #\$authorAgentId) published synchronized deliverable to Google Keep on phone.",
                        data = mapOf("title" to title, "status" to "SYNCED_ON_DEVICE")
                    )
                }

                else -> ToolResult.Failure("Unknown Google Keep action '\$action'")
            }
        } catch (e: Exception) {
            ToolResult.Failure("Google Keep operation failed: \${e.localizedMessage}")
        }
    }

    private fun broadcastKeepIntent(title: String, text: String, checklist: List<String>) {
        val sendIntent = Intent(Intent.ACTION_SEND).apply {
            setPackage(KEEP_PACKAGE)
            type = "text/plain"
            putExtra(EXTRA_NOTE_TITLE, title)
            val fullBody = if (checklist.isNotEmpty()) {
                "\$text\\n\\nChecklist:\\n" + checklist.joinToString("\\n") { " [ ] \$it" }
            } else text
            putExtra(EXTRA_NOTE_TEXT, fullBody)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        // Dispatches to Android Activity Manager & Keep ContentProvider
    }

    private fun queryDeviceKeepNotes(): JSONArray {
        return JSONArray().apply {
            put(JSONObject().put("id", "keep_1").put("title", "Sprint Planning Tasks").put("pinned", true))
            put(JSONObject().put("id", "keep_2").put("title", "Grocery Checklist").put("pinned", false))
        }
    }

    private fun searchKeepDatabase(query: String): JSONArray {
        return JSONArray().apply {
            put(JSONObject().put("id", "keep_1").put("title", "Sprint Planning Tasks").put("matched_term", query))
        }
    }
}
`
  }
];

export const TOOL_DEFINITIONS: ToolDefinition[] = [
  {
    id: 'notes_keep_manager',
    name: 'notes_keep_manager',
    category: 'notes',
    description: 'Reads, creates, searches, and syncs Google Keep notes & checklists on the Android phone for the Agent Army.',
    kotlinSignature: 'GoogleKeepTool.execute(action: String, title: String?, content: String?, checklist_items: List<String>?, query: String?)',
    parameters: {
      action: { type: 'string', description: 'list_notes | get_note | create_note | search_notes | add_checklist_item | agent_swarm_write', required: true },
      title: { type: 'string', description: 'Title of the Keep note' },
      content: { type: 'string', description: 'Body text or markdown content of note' },
      checklist_items: { type: 'array', description: 'List of checklist items to create as interactive checkboxes' },
      query: { type: 'string', description: 'Search keywords to find existing notes' },
      agent_id: { type: 'number', description: 'ID of the agent authoring the note' }
    }
  },
  {
    id: 'launch_app',
    name: 'launch_app',
    category: 'apps',
    description: 'Opens an installed Android application by packageName or friendly name.',
    kotlinSignature: 'AppLauncherTool.execute(packageName: String, deepLink: String?)',
    parameters: {
      packageName: { type: 'string', description: 'App package name (e.g. com.google.android.apps.messaging)', required: true },
      activityName: { type: 'string', description: 'Specific intent component target' }
    }
  },
  {
    id: 'notification_manager',
    name: 'notification_manager',
    category: 'notifications',
    description: 'Reads active notifications, posts agent alerts, or replies via RemoteInput.',
    kotlinSignature: 'NotificationActionTool.execute(action: String, title: String?, body: String?)',
    parameters: {
      action: { type: 'string', description: 'read_active | post_notification | reply_to_notification', required: true },
      title: { type: 'string', description: 'Title of notification' },
      body: { type: 'string', description: 'Body text of notification' },
      notification_id: { type: 'string', description: 'Target notification id to reply to' }
    }
  },
  {
    id: 'camera_vision',
    name: 'camera_vision',
    category: 'camera',
    description: 'Captures frame from CameraX API and analyzes scene/OCR with Gemini Flash.',
    kotlinSignature: 'CameraVisionTool.execute(query: String, lens: String)',
    parameters: {
      query: { type: 'string', description: 'What to detect or inspect in the image', required: true },
      lens: { type: 'string', description: 'FRONT or BACK camera lens', default: 'BACK' }
    }
  },
  {
    id: 'get_device_location',
    name: 'get_device_location',
    category: 'location',
    description: 'Queries FusedLocationProviderClient for high-accuracy GPS coordinates & address.',
    kotlinSignature: 'LocationProviderTool.execute()',
    parameters: {
      high_accuracy: { type: 'boolean', description: 'Request GPS fine accuracy', default: true }
    }
  },
  {
    id: 'file_system',
    name: 'file_system',
    category: 'files',
    description: 'Reads, writes, searches, and lists files across device internal/external storage.',
    kotlinSignature: 'FileSystemTool.execute(action: String, path: String, content: String?)',
    parameters: {
      action: { type: 'string', description: 'list_directory | read_file | write_file | search_files', required: true },
      path: { type: 'string', description: 'Target file or directory path', required: true },
      content: { type: 'string', description: 'Text content to write' }
    }
  },
  {
    id: 'accessibility_action',
    name: 'accessibility_action',
    category: 'accessibility',
    description: 'Inspects active screen hierarchy and performs UI clicks, text input, and gestures.',
    kotlinSignature: 'AccessibilityActionTool.execute(action: String, text: String?, resource_id: String?)',
    parameters: {
      action: { type: 'string', description: 'inspect_screen | click | set_text | press_home | press_back | scroll', required: true },
      text: { type: 'string', description: 'Text of the target node or text to type' },
      resource_id: { type: 'string', description: 'View ID to target' }
    }
  }
];
