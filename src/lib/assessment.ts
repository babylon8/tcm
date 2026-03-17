import { AssessmentQuestion, ConstitutionId, ConstitutionScore, ConstitutionResult, UserAssessment } from '@/types';

/**
 * Calculate constitution score from answers
 */
export function calculateConstitutionScore(
  constitutionId: ConstitutionId,
  questions: AssessmentQuestion[],
  answers: Record<string, number>
): ConstitutionScore {
  const relevantQuestions = questions.filter(q => q.constitutionType === constitutionId);
  
  if (relevantQuestions.length === 0) {
    return {
      constitutionId,
      rawScore: 0,
      convertedScore: 0,
      determination: 'none',
    };
  }

  const rawScore = relevantQuestions.reduce((sum, q) => {
    return sum + (answers[q.id] || 1);
  }, 0);

  const questionCount = relevantQuestions.length;
  const convertedScore = ((rawScore - questionCount) / (questionCount * 4)) * 100;

  let determination: 'definite' | 'tendency' | 'none';
  
  if (constitutionId === 'A') {
    determination = convertedScore >= 60 ? 'definite' : 'none';
  } else {
    if (convertedScore >= 40) {
      determination = 'definite';
    } else if (convertedScore >= 30) {
      determination = 'tendency';
    } else {
      determination = 'none';
    }
  }

  return {
    constitutionId,
    rawScore,
    convertedScore,
    determination,
  };
}

/**
 * Calculate all constitution scores
 */
export function calculateAllConstitutionScores(
  questions: AssessmentQuestion[],
  answers: Record<string, number>
): ConstitutionScore[] {
  const constitutionIds: ConstitutionId[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  
  return constitutionIds.map(id =>
    calculateConstitutionScore(id, questions, answers)
  );
}

/**
 * Determine primary and secondary constitutions
 */
export function assessConstitution(allScores: ConstitutionScore[]): {
  primary: ConstitutionResult | null;
  secondary: ConstitutionResult[];
  isBalanced: boolean;
} {
  const balancedScore = allScores.find(s => s.constitutionId === 'A');
  const otherScores = allScores.filter(s => s.constitutionId !== 'A');

  const isBalanced =
    balancedScore &&
    balancedScore.convertedScore >= 60 &&
    otherScores.every(s => s.convertedScore < 30);

  if (isBalanced) {
    return {
      primary: {
        constitutionId: 'A',
        score: balancedScore.convertedScore,
        percentage: balancedScore.convertedScore,
        confidence: 'high',
        isPrimary: true,
      },
      secondary: [],
      isBalanced: true,
    };
  }

  const sortedScores = otherScores
    .filter(s => s.determination !== 'none')
    .sort((a, b) => b.convertedScore - a.convertedScore);

  const getConfidence = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 50) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const primary = sortedScores[0]
    ? {
        constitutionId: sortedScores[0].constitutionId,
        score: sortedScores[0].convertedScore,
        percentage: sortedScores[0].convertedScore,
        confidence: getConfidence(sortedScores[0].convertedScore),
        isPrimary: true,
      }
    : null;

  const secondary = sortedScores.slice(1, 4).map(s => ({
    constitutionId: s.constitutionId,
    score: s.convertedScore,
    percentage: s.convertedScore,
    confidence: getConfidence(s.convertedScore),
  }));

  return {
    primary,
    secondary,
    isBalanced: false,
  };
}

/**
 * Generate unique assessment ID
 */
export function generateAssessmentId(): string {
  return `assessment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save assessment to localStorage
 */
export function saveAssessment(assessment: UserAssessment): void {
  if (typeof window === 'undefined') return;
  
  const key = `tcm-assessment-${assessment.id}`;
  localStorage.setItem(key, JSON.stringify(assessment));
  
  const historyKey = 'tcm-assessment-history';
  const history: string[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
  history.push(assessment.id);
  if (history.length > 50) {
    history.shift();
  }
  localStorage.setItem(historyKey, JSON.stringify(history));
}

/**
 * Load assessment from localStorage
 */
export function loadAssessment(id: string): UserAssessment | null {
  if (typeof window === 'undefined') return null;
  
  const key = `tcm-assessment-${id}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Get assessment history
 */
export function getAssessmentHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  const historyKey = 'tcm-assessment-history';
  return JSON.parse(localStorage.getItem(historyKey) || '[]');
}

/**
 * Delete assessment from localStorage
 */
export function deleteAssessment(id: string): void {
  if (typeof window === 'undefined') return;
  
  const key = `tcm-assessment-${id}`;
  localStorage.removeItem(key);
  
  const historyKey = 'tcm-assessment-history';
  const history: string[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
  const newHistory = history.filter(assId => assId !== id);
  localStorage.setItem(historyKey, JSON.stringify(newHistory));
}
