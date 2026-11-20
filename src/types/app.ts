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

