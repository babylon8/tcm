import { ConstitutionsData, EducationData, QuestionsData, RecommendationsData, SymptomsData } from '@/types';
import constitutionsData from '../../data/constitutions.en.json';
import questionsData from '../../data/questions.en.json';
import symptomsData from '../../data/symptoms.en.json';
import recommendationsData from '../../data/recommendations.en.json';
import educationData from '../../data/education.en.json';
import streamlinedQuestionsData from '../../data/questions.streamlined.json';
import adaptiveQuestionsData from '../../data/questions.adaptive.json';
import bodyTypesData from '../../data/body-types.en.json';

/**
 * Load constitutions data from JSON
 */
export async function loadConstitutions(): Promise<ConstitutionsData> {
  return constitutionsData as ConstitutionsData;
}

/**
 * Load questions data from JSON (full 70-question assessment)
 */
export async function loadQuestions(): Promise<QuestionsData> {
  return questionsData as QuestionsData;
}

/**
 * Load streamlined questions data from JSON (reduced from 70 to ~45 questions)
 */
export async function loadStreamlinedQuestions(): Promise<QuestionsData> {
  return streamlinedQuestionsData as QuestionsData;
}

/**
 * Load adaptive questions data from JSON (2-phase: 9 screening + up to 24 confirmation)
 */
export async function loadAdaptiveQuestions(): Promise<QuestionsData> {
  return adaptiveQuestionsData as QuestionsData;
}

/**
 * Body types data structure for plain English descriptions
 */
export interface BodyType {
  id: string;
  name: string;
  tagline: string;
  plainEnglish: string;
  quickTips: string[];
  icon: string;
}

export interface BodyTypesData {
  version: string;
  description: string;
  types: Record<string, BodyType>;
  matchStrength: {
    strong: { threshold: number; label: string; bars: string };
    moderate: { threshold: number; label: string; bars: string };
    slight: { threshold: number; label: string; bars: string };
    none: { threshold: number; label: string; bars: string };
  };
}

/**
 * Load body types data with plain English descriptions for lay-persons
 */
export async function loadBodyTypes(): Promise<BodyTypesData> {
  return bodyTypesData as BodyTypesData;
}

/**
 * Get match strength label and visual bar based on score
 */
export function getMatchStrength(score: number): { label: string; bars: string; level: string } {
  const ms = bodyTypesData.matchStrength;
  if (score >= ms.strong.threshold) {
    return { label: ms.strong.label, bars: ms.strong.bars, level: 'strong' };
  } else if (score >= ms.moderate.threshold) {
    return { label: ms.moderate.label, bars: ms.moderate.bars, level: 'moderate' };
  } else if (score >= ms.slight.threshold) {
    return { label: ms.slight.label, bars: ms.slight.bars, level: 'slight' };
  }
  return { label: ms.none.label, bars: ms.none.bars, level: 'none' };
}
/**
 * Load symptoms data from JSON
 */
export async function loadSymptoms(): Promise<SymptomsData> {
  return symptomsData as SymptomsData;
}

/**
 * Load recommendations data from JSON
 */
export async function loadRecommendations(): Promise<RecommendationsData> {
  return recommendationsData as RecommendationsData;
}

/**
 * Load education data from JSON
 */
export async function loadEducation(): Promise<EducationData> {
  return educationData as EducationData;
}

/**
 * Load all data at once (useful for initial page load)
 */
export async function loadAllData() {
  const [constitutions, questions, symptoms, recommendations, education] = await Promise.all([
    loadConstitutions(),
    loadQuestions(),
    loadSymptoms(),
    loadRecommendations(),
    loadEducation(),
  ]);

  return {
    constitutions,
    questions,
    symptoms,
    recommendations,
    education,
  };
}
