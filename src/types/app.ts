export type Lang = 'fa' | 'en';
export type Theme = 'light' | 'dark';

export type NavSection =
  | 'overview'
  | 'exam-sprint'
  | 'courses'
  | 'ai-lab'
  | 'articles'
  | 'community'
  | 'campus'
  | 'mercury'
  | 'mausbot'
  | 'strata'
  | 'claudable'
  | 'study-deck'
  | 'study-rooms'
  | 'admin';

export type DifficultyLevel = 'introductory' | 'intermediate' | 'advanced';

export type FacultyGroupId =
  | 'all'
  | 'nuclear-energy'
  | 'engineering'
  | 'basic-sciences'
  | 'medical'
  | 'economics-mgmt'
  | 'law'
  | 'political-ir'
  | 'humanities-psych'
  | 'arts-arch'
  | 'agriculture-vet';

export interface FieldCategory {
  id: string;
  nameFa: string;
  nameEn: string;
  facultyFa: string;
  facultyEn: string;
  facultyGroup?: Exclude<FacultyGroupId, 'all'>;
}

export type UserRole = 'student' | 'professor' | 'admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  university: string;
  field: string;
  role: UserRole;
  avatarInitials: string;
  joinedAt: string;
  photoURL?: string | null;
}

export interface CourseItem {
  id: string;
  code: string;
  fieldId: string;
  titleFa: string;
  titleEn: string;
  credits: number;
  difficulty: DifficultyLevel;
  topicsFa: string[];
  topicsEn: string[];
  keyFormula: string;
  visible?: boolean;
  feynmanAnalogyFa?: string;
  feynmanAnalogyEn?: string;
  hardestExamQuestionFa?: string;
  hardestExamQuestionEn?: string;
  hardestExamFormulaLatex?: string;
  hardestExamSolutionSummaryFa?: string;
  hardestExamSolutionSummaryEn?: string;
}

export interface LeitnerCard {
  id: string;
  front: string;
  back: string;
  formulaLatex?: string;
  hint?: string;
  deck: string;
  box: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt: number;
  reviewCount: number;
}

export interface EngineeringArticle {
  id: string;
  titleFa: string;
  titleEn: string;
  fieldFa: string;
  fieldEn: string;
  authorFa: string;
  authorEn: string;
  readMinutes: number;
  date: string;
  image: string;
  excerptFa: string;
  excerptEn: string;
  contentFa: string[];
  contentEn: string[];
  keyFormula: string;
}

export interface ScientificArticle {
  id: string;
  titleFa: string;
  titleEn: string;
  categoryFa: string;
  categoryEn: string;
  difficulty: DifficultyLevel;
  authorFa: string;
  authorEn: string;
  readMinutes: number;
  date: string;
  image: string;
  excerptFa: string;
  excerptEn: string;
  markdownFa: string;
  markdownEn: string;
  codeSnippet?: {
    language: string;
    title: string;
    code: string;
  };
  takeawaysFa: string[];
  takeawaysEn: string[];
  status?: 'published' | 'draft';
}

export interface LectureNote {
  id: string;
  titleFa: string;
  titleEn: string;
  courseCode: string;
  fieldFa: string;
  fieldEn: string;
  author: string;
  university: string;
  pages: number;
  ratingSum: number;
  ratingCount: number;
  downloads: number;
  summaryFa: string;
  summaryEn: string;
  previewFormula: string;
  contentSnippet: string;
  createdAt: string;
  status?: 'published' | 'draft';
}

export type ReelVisualType = 'oscilloscope' | 'quantum' | 'neural' | 'graph' | 'thermo';

export interface ReelLesson {
  id: string;
  courseCode: string;
  storyTitleFa: string;
  storyTitleEn: string;
  titleFa: string;
  titleEn: string;
  categoryFa: string;
  categoryEn: string;
  fieldId: string;
  image: string;
  ringGradient: string;
  visualType: ReelVisualType;
  formulaLatex: string;
  feynmanBulletsFa: string[];
  feynmanBulletsEn: string[];
  narrationFa: string;
  narrationEn: string;
  likes: number;
  saves: number;
  shares: number;
}

export interface CuratedVideoLecture {
  id: string;
  titleFa: string;
  titleEn: string;
  source: string;
  instructor: string;
  duration: string;
  language: 'fa' | 'en';
  focusFa: string;
  focusEn: string;
}

export type Concept3DModelType =
  | 'electromagnetic'
  | 'mechanical_piston'
  | 'neural_network'
  | 'crystal_lattice'
  | 'nuclear_reactor'
  | 'geopolitical_globe';

export interface ProofStepItem {
  labelFa: string;
  labelEn: string;
  textFa: string;
  textEn: string;
  latex: string;
}

export interface FormulaCheatItem {
  nameFa: string;
  nameEn: string;
  latex: string;
  conditionFa: string;
  conditionEn: string;
}

export interface HardestExamStep {
  stepNumber: number;
  titleFa: string;
  titleEn: string;
  explanationFa: string;
  explanationEn: string;
  mathLatex?: string;
  trapWarningFa?: string;
  trapWarningEn?: string;
}

export interface HardestExamChallenge {
  sourceFa: string;
  sourceEn: string;
  difficultyBadgeFa: string;
  difficultyBadgeEn: string;
  problemStatementFa: string;
  problemStatementEn: string;
  problemFormulaLatex: string;
  steps: HardestExamStep[];
}

export interface ScientificResourceItem {
  id: string;
  type: 'book' | 'paper';
  titleFa: string;
  titleEn: string;
  authors: string;
  editionOrJournal: string;
  year: string;
  summaryFa: string;
  summaryEn: string;
  doi?: string;
  downloadUrl: string;
  platform: 'LibGen' | 'CORE' | 'DOAJ' | 'OA.mg' | 'arXiv' | 'Unpaywall' | 'OpenAccessButton' | 'PaperPanda';
  isLegalOpenAccess: boolean;
}

export interface CourseRichDetail {
  feynmanChild5Fa: string;
  feynmanChild5En: string;
  model3dType: Concept3DModelType;
  historicalOriginFa: string;
  historicalOriginEn: string;
  mathematicalProof: {
    theoremTitleFa: string;
    theoremTitleEn: string;
    steps: ProofStepItem[];
  };
  formulaCheatSheet: FormulaCheatItem[];
  hardestExam: HardestExamChallenge;
  syllabusFa: Array<{ chapter: string; summary: string }>;
  syllabusEn: Array<{ chapter: string; summary: string }>;
  prerequisiteCodes: string[];
  unlockedCodes: string[];
  industryApplicationsFa: string[];
  industryApplicationsEn: string[];
  marketDemandFa: string;
  marketDemandEn: string;
  industryTools: string[];
  curatedVideos: CuratedVideoLecture[];
  curatedResources: ScientificResourceItem[];
}

export type CampusCategory =
  | 'ai-future'
  | 'migration-stay'
  | 'university-industry'
  | 'engineering-ethics'
  | 'student-life';

export interface CampusReply {
  id: string;
  author: string;
  badgeFa: string;
  badgeEn: string;
  text: string;
  upvotes: number;
  createdAt: string;
}

export interface CampusComment {
  id: string;
  author: string;
  badgeFa: string;
  badgeEn: string;
  text: string;
  upvotes: number;
  createdAt: string;
  replies: CampusReply[];
}

export interface CampusThread {
  id: string;
  category: CampusCategory;
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
  author: string;
  badgeFa: string;
  badgeEn: string;
  upvotes: number;
  createdAt: string;
  trending?: boolean;
  comments: CampusComment[];
}

export interface CampusPollOption {
  id: string;
  labelFa: string;
  labelEn: string;
  votes: number;
}

export interface CampusPoll {
  id: string;
  questionFa: string;
  questionEn: string;
  category: CampusCategory;
  options: CampusPollOption[];
}

export interface AiPerspectiveSummary {
  proPoints: string[];
  conPoints: string[];
  ethicsLens: string;
  balancedTakeaway: string;
}

// ============================================================================
// Mercury Agent Architecture Types (Soul-Driven Autonomous Agent & Second Brain)
// Inspired by cosmicstack-labs/mercury-agent
// ============================================================================
export type MercuryBotId = 'archimedes' | 'turing' | 'euler' | 'hypatia';

export interface MercuryBot {
  id: MercuryBotId;
  nameFa: string;
  nameEn: string;
  roleFa: string;
  roleEn: string;
  avatarIcon: string;
  status: 'idle' | 'running' | 'scheduled';
  scheduleCron: string;
  deliverablesFolder: string;
  skills: string[];
  lastRunAt?: string;
  dailyBudgetTokens: number;
  usedTokensToday: number;
  personaSummary: string;
  recentDeliverables: Array<{
    id: string;
    titleFa: string;
    titleEn: string;
    fileName: string;
    createdAt: string;
    summary: string;
  }>;
}

export type MercuryFactCategory = 'preference' | 'academic_goal' | 'weakness' | 'strength' | 'project';

export interface MercuryFact {
  id: string;
  category: MercuryFactCategory;
  statementFa: string;
  statementEn: string;
  confidence: number;
  source: string;
  createdAt: string;
}

export interface MercurySoulConfig {
  soulMarkdown: string;
  personaMarkdown: string;
  tasteMarkdown: string;
  heartbeatMarkdown: string;
}

export interface MercuryPermissionConfig {
  askBeforeShell: boolean;
  askBeforeFileWrite: boolean;
  ssrfGuardEnabled: boolean;
  scopedFolders: string[];
  blockedShellCommands: string[];
  dailyTokenLimit: number;
  tokensConsumedToday: number;
  tokenSaverActive: boolean;
}

export interface MercuryMessage {
  id: string;
  sender: 'user' | 'agent' | 'bot' | 'system';
  botId?: MercuryBotId;
  text: string;
  timestamp: string;
  thoughtProcess?: string;
  toolCalls?: Array<{
    id: string;
    toolName: string;
    args: Record<string, any>;
    result?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
  }>;
  pendingApproval?: {
    id: string;
    action: string;
    details: string;
  };
}

// -------------------------------------------------------------
// OpenMausBot (Grok Bot Alternative - Multi-Bot Team & Sandbox VM)
// -------------------------------------------------------------
export type MausModelId =
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro'
  | 'claude-3-7-sonnet'
  | 'gpt-4o'
  | 'grok-3'
  | 'deepseek-r1'
  | 'ollama-local';

export interface MausVMFile {
  name: string;
  size: string;
  isDir?: boolean;
  modified: string;
}

export interface MausVMState {
  hostname: string;
  os: string;
  cpuPercent: number;
  ramPercent: number;
  diskPercent: number;
  runningProcess?: string;
  openPorts: number[];
  workspaceFiles: MausVMFile[];
  lastTerminalLines: string[];
  screenPreviewUrl?: string;
}

export interface MausBotProfile {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  model: MausModelId;
  status: 'idle' | 'running' | 'thinking' | 'waiting-approval';
  vm: MausVMState;
  color: string;
  systemPrompt: string;
  tags: string[];
  createdByUser?: boolean;
}

export interface MausApprovalCard {
  id: string;
  botId: string;
  botName: string;
  toolName: 'bash' | 'fs_write' | 'web_fetch' | 'port_bind';
  commandOrPath: string;
  previewDiff?: string;
  dangerLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'allowed' | 'denied';
  timestamp: string;
  details: string;
}

export interface MausRoom {
  id: string;
  title: string;
  description: string;
  icon: string;
  memberBotIds: string[];
  lastActive: string;
  isRoom: true;
}

export interface MausMessage {
  id: string;
  targetType: 'bot' | 'room';
  targetId: string;
  sender: 'user' | 'bot' | 'system';
  botId?: string;
  botName?: string;
  botAvatar?: string;
  content: string;
  timestamp: string;
  approvalId?: string;
  approvalCard?: MausApprovalCard;
  terminalOutput?: string[];
  modelUsed?: MausModelId;
}

// -------------------------------------------------------------
// Strata Engine (Local Frontier AI Inference on Consumer Hardware)
// Inspired by niko1221/strata
// -------------------------------------------------------------
export type StrataModelFamily =
  | 'qwen-3.8-flash'
  | 'qwen-3.6-35b'
  | 'deepseek-v4-moe'
  | 'llama-3-moe';

export type StrataQuantPack =
  | 'ISTA-DASLab-Q2_0'
  | 'ISTA-DASLab-IQ3_S'
  | 'Unsloth-UD-Q4_K_XL'
  | 'Unsloth-Q8_0'
  | 'Gyro-S';

export interface StrataHardwareProfile {
  gpuName: string;
  vramTotalGb: number;
  vramUsedGb: number;
  ramTotalGb: number;
  ramUsedGb: number;
  cpuName: string;
  storageSpeedMbS: number;
  hasCudaOrHip: boolean;
  tierScore: 'entry' | 'enthusiast' | 'workstation' | 'frontier';
}

export interface StrataModelSpec {
  id: string;
  name: string;
  family: StrataModelFamily;
  parameters: string;
  activeParameters: string;
  recommendedPack: StrataQuantPack;
  vramRequiredGb: number;
  ramRequiredGb: number;
  tokensPerSecEstimate: number;
  contextWindow: number;
  descriptionFa: string;
  descriptionEn: string;
  supportedBackends: string[];
}

export interface StrataServingConfig {
  activeModelId: string;
  port: number;
  host: string;
  contextSize: '32k' | '64k' | '128k';
  visionMode: 'off' | 'on' | 'gpu';
  parallelRequests: number;
  status: 'offline' | 'running' | 'allocating' | 'streaming';
  currentTokensPerSec: number;
  totalTokensServed: number;
  vramAllocatedGb: number;
  ramAllocatedGb: number;
  nvmeStreamBandwidthGbS: number;
}

// ============================================================================
// CLAUDABLE — Open-Source AI Web App Builder & CLI Coding Agents Studio
// ============================================================================

export type ClaudableAgentEngine =
  | 'claude-code'
  | 'codex-cli'
  | 'cursor-cli'
  | 'gemini-cli'
  | 'qwen-code';

export interface ClaudableEngineSpec {
  id: ClaudableAgentEngine;
  name: string;
  provider: string;
  model: string;
  contextWindow: string;
  descriptionFa: string;
  descriptionEn: string;
  badge: string;
  cliCommand: string;
  isPopular?: boolean;
}

export interface ClaudableProjectFile {
  name: string;
  path: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'json';
  content: string;
  isMain?: boolean;
}

export interface ClaudableStepItem {
  id: string;
  titleFa: string;
  titleEn: string;
  tool: 'cli_command' | 'create_file' | 'edit_file' | 'npm_install' | 'run_dev' | 'db_migrate';
  command?: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface ClaudableProject {
  id: string;
  titleFa: string;
  titleEn: string;
  prompt: string;
  engine: ClaudableAgentEngine;
  framework: 'nextjs' | 'vite-react';
  status: 'idle' | 'thinking' | 'building' | 'ready' | 'error';
  files: ClaudableProjectFile[];
  steps: ClaudableStepItem[];
  thinkingLog: string[];
  previewUrl: string;
  githubUrl?: string;
  vercelUrl?: string;
  supabaseConnected: boolean;
  createdAt: string;
}

export interface ClaudableTemplatePreset {
  id: string;
  titleFa: string;
  titleEn: string;
  category: 'engineering' | 'ai' | 'simulation' | 'iot' | 'academic';
  promptFa: string;
  promptEn: string;
  iconName: string;
  tags: string[];
}




