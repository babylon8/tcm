// ==================== Constitution Types ====================

export interface Constitution {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  summary: string;
  characteristics: {
    overall: string;
    physical: string;
    psychological: string;
  };
  bodyFeatures: {
    bodyType: string;
    complexion: string;
    tongueBody: string;
    tongueCoating: string;
    pulse: string;
  };
  healthTendencies: {
    susceptibleDiseases: string[];
    diseaseCharacteristics: string;
    seasonalSensitivity: string[];
  };
  recommendations: {
    diet: {
      suitable: string[];
      avoid: string[];
      principles: string;
    };
    lifestyle: string[];
    exercise: string[];
    emotional: string;
  };
  scoring: {
    threshold: number;
    weight: number;
  };
}

export type ConstitutionId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

// ==================== Assessment Question Types ====================

export interface AssessmentQuestion {
  id: string;
  order: number;
  text: string;
  textEn: string;
  constitutionType: string;
  category: QuestionCategory;
  isReverseScored: boolean;
  note?: string;
  alsoMapsTo?: string[];
  isSharedWith?: string;
  genderSpecific?: 'male' | 'female';
  stage?: 'screening' | 'balanced' | 'qi_deficiency' | 'yang_deficiency' | 'yin_deficiency' | 'phlegm_dampness' | 'damp_heat' | 'blood_stasis' | 'qi_stagnation' | 'allergic';
  importance?: 'critical' | 'important' | 'optional';
  path?: string;
  phase?: 'screening' | 'confirmation';
  forConstitution?: string;
}

export type QuestionCategory =
  | 'physical'
  | 'complexion'
  | 'cold-heat'
  | 'sweat'
  | 'sleep'
  | 'digestion'
  | 'excretion'
  | 'emotion'
  | 'mental'
  | 'pain'
  | 'respiration'
  | 'skin'
  | 'susceptibility';

export interface AnswerOption {
  id: string;
  text: string;
  textEn: string;
  score: number;
}

// ==================== Symptom Types ====================

export interface Symptom {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  category: string;
  bodyRegion?: BodyRegion;
  description: string;
  descriptionEn?: string;
  tcmMeaning: {
    primary: string;
    primaryEn?: string;
    patterns: PatternAssociation[];
  };
  relatedOrgans: string[];
  relatedOrgansEn?: string[];
  relatedSymptoms: string[];
  followUpQuestions: string[];
  followUpQuestionsEn?: string[];
}

export type BodyRegion =
  | 'head'
  | 'face'
  | 'neck'
  | 'chest'
  | 'abdomen'
  | 'back'
  | 'upper-limbs'
  | 'lower-limbs'
  | 'whole-body'
  | 'skin';

export interface SymptomCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export interface BodyRegionInfo {
  id: string;
  name: string;
  nameEn: string;
}

export interface PatternAssociation {
  pattern: string;
  condition: string;
  confidence: number;
  constitution?: string[];
}

export interface SeverityLevel {
  value: number;
  label: string;
  labelEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface DurationOption {
  value: 'today' | 'week' | 'month' | 'half-year' | 'long-term';
  label: string;
  labelEn?: string;
}

// ==================== Result Types ====================

export interface ConstitutionScore {
  constitutionId: ConstitutionId;
  rawScore: number;
  convertedScore: number;
  determination: 'definite' | 'tendency' | 'none';
}

export interface ConstitutionResult {
  constitutionId: ConstitutionId;
  score: number;
  percentage: number;
  confidence: 'high' | 'medium' | 'low';
  isPrimary?: boolean;
}

export interface SelectedSymptom {
  symptomId: string;
  severity: number;
  duration: string;
  notes?: string;
}

export interface PatternResult {
  patternId: string;
  name: string;
  nameEn?: string;
  confidence: number;
  basedOn: string[];
}

export interface UserAssessment {
  id: string;
  createdAt: string;
  constitutionResult: {
    primary: ConstitutionResult;
    secondary?: ConstitutionResult[];
    scores: Record<string, number>;
  };
  symptomResult?: {
    selectedSymptoms: SelectedSymptom[];
    identifiedPatterns: PatternResult[];
  };
  recommendations: string[];
}

// ==================== Recommendation Types ====================

export interface Recommendation {
  id: string;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  appliesTo: {
    constitutionTypes?: string[];
    symptomIds?: string[];
    patternIds?: string[];
    seasons?: Season[];
  };
  sections: RecommendationSection[];
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  tagsEn?: string[];
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface RecommendationSection {
  type: 'diet' | 'lifestyle' | 'exercise' | 'emotional' | 'herbs' | 'acupressure';
  title: string;
  titleEn?: string;
  content: string | RecommendationItem[];
  contentEn?: string | RecommendationItem[];
}

export interface RecommendationItem {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  frequency?: string;
  frequencyEn?: string;
}

// ==================== Educational Content Types ====================

export interface EducationalContent {
  id: string;
  category: EducationCategory;
  order: number;
  title: string;
  titleEn?: string;
  summary: string;
  summaryEn?: string;
  content: string;
  relatedConstitutions?: string[];
  relatedSymptoms?: string[];
  tags: string[];
}

export type EducationCategory =
  | 'basics'
  | 'constitution'
  | 'organs'
  | 'diagnosis'
  | 'prevention'
  | 'seasonal';

// ==================== Data File Types ====================

export interface QuestionsData {
  version: string;
  source: string;
  answerOptions: AnswerOption[];
  questions: AssessmentQuestion[];
  metadata: {
    totalQuestions: number;
    uniqueQuestions?: number;
    sharedQuestions?: number;
    screeningQuestions?: number;
    adaptiveQuestions?: number;
    categories: QuestionCategory[];
    scoringFormula: string;
    estimatedTime?: string;
    reductionPercentage?: string;
  };
}

export interface SymptomsData {
  version: string;
  source?: string;
  categories: Array<{
    id: string;
    name: string;
    nameEn: string;
    icon: string;
  }>;
  bodyRegions: Array<{
    id: string;
    name: string;
    nameEn: string;
  }>;
  severityLevels: SeverityLevel[];
  durationOptions: DurationOption[];
  symptoms: Symptom[];
}

export interface ConstitutionsData {
  version: string;
  source: string;
  constitutions: Constitution[];
}

export interface RecommendationsData {
  version: string;
  recommendations: Recommendation[];
}

export interface EducationData {
  version: string;
  articles: EducationalContent[];
  metadata: {
    totalArticles: number;
    categories: EducationCategory[];
  };
}
