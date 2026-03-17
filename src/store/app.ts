import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserAssessment } from '@/types';

interface AppState {
  assessments: UserAssessment[];
  currentAssessment: UserAssessment | null;
  
  // Actions
  setAssessments: (assessments: UserAssessment[]) => void;
  addAssessment: (assessment: UserAssessment) => void;
  setCurrentAssessment: (assessment: UserAssessment | null) => void;
  removeAssessment: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      assessments: [],
      currentAssessment: null,
      
      setAssessments: (assessments) =>
        set({
          assessments,
        }),
      
      addAssessment: (assessment) =>
        set((state) => ({
          assessments: [assessment, ...state.assessments],
        })),
      
      setCurrentAssessment: (assessment) =>
        set({
          currentAssessment: assessment,
        }),
      
      removeAssessment: (id) =>
        set((state) => ({
          assessments: state.assessments.filter(a => a.id !== id),
          currentAssessment: state.currentAssessment?.id === id ? null : state.currentAssessment,
        })),
    }),
    {
      name: 'tcm-app-storage',
    }
  )
);
