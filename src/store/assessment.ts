import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AssessmentState {
  answers: Record<string, number>;
  currentStep: number;
  isComplete: boolean;

  // Adaptive assessment state
  phase: 'screening' | 'confirmation';
  flaggedConstitutions: string[];
  currentQuestionIndex: number;
  screeningAnswers: Record<string, number>;

  // Actions
  setAnswer: (questionId: string, score: number) => void;
  setAnswers: (answers: Record<string, number>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  setPhase: (phase: 'screening' | 'confirmation') => void;
  setFlaggedConstitutions: (constitutions: string[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setScreeningAnswer: (constitutionId: string, score: number) => void;
  reset: () => void;
  resetAnswers: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set) => ({
      answers: {},
      currentStep: 0,
      isComplete: false,
      phase: 'screening',
      flaggedConstitutions: [],
      currentQuestionIndex: 0,
      screeningAnswers: {},

      setAnswer: (questionId, score) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: score },
        })),

      setAnswers: (answers) =>
        set({
          answers,
        }),

      nextStep: () =>
        set((state) => ({
          currentStep: state.currentStep + 1,
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      goToStep: (step) =>
        set({
          currentStep: step,
        }),

      setPhase: (phase) =>
        set({
          phase,
        }),

      setFlaggedConstitutions: (flaggedConstitutions) =>
        set({
          flaggedConstitutions,
        }),

      setCurrentQuestionIndex: (index: number) =>
        set({
          currentQuestionIndex: index,
        }),

      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1,
        })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),

      setScreeningAnswer: (constitutionId: string, score: number) =>
        set((state) => ({
          screeningAnswers: { ...state.screeningAnswers, [constitutionId]: score },
        })),

      reset: () =>
        set({
          answers: {},
          currentStep: 0,
          isComplete: false,
          phase: 'screening',
          flaggedConstitutions: [],
          currentQuestionIndex: 0,
          screeningAnswers: {},
        }),

      resetAnswers: () =>
        set({
          answers: {},
        }),
    }),
    {
      name: 'tcm-assessment-storage',
    }
  )
);
