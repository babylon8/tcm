'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { loadAdaptiveQuestions } from '@/lib/data';
import type { AssessmentQuestion } from '@/types';
import { useAssessmentStore } from '@/store/assessment';
import { cn } from '@/lib/utils';

const SCREENING_THRESHOLD = 3;

interface AdaptiveQuestion extends AssessmentQuestion {
  phase: 'screening' | 'confirmation';
  forConstitution?: string;
}

export default function AdaptiveQuestionPage() {
  const router = useRouter();

  const [allQuestions, setAllQuestions] = useState<AdaptiveQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'screening' | 'confirmation'>('screening');

  const { answers, setAnswer } = useAssessmentStore();

  useEffect(() => {
    loadAdaptiveQuestions()
      .then((data) => {
        setAllQuestions(data.questions as AdaptiveQuestion[]);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  const screeningQuestions = useMemo(
    () => allQuestions.filter((q) => q.phase === 'screening'),
    [allQuestions]
  );

  const flaggedConstitutions = useMemo(() => {
    const flagged: string[] = [];
    for (const q of screeningQuestions) {
      const score = answers[q.id];
      if (score && score >= SCREENING_THRESHOLD && q.constitutionType) {
        flagged.push(q.constitutionType);
      }
    }
    return flagged;
  }, [screeningQuestions, answers]);

  const confirmationQuestions = useMemo(
    () =>
      allQuestions.filter(
        (q) => q.phase === 'confirmation' && q.forConstitution && flaggedConstitutions.includes(q.forConstitution)
      ),
    [allQuestions, flaggedConstitutions]
  );

  const activeQuestions = useMemo(() => {
    if (phase === 'screening') {
      return screeningQuestions;
    }
    return confirmationQuestions;
  }, [phase, screeningQuestions, confirmationQuestions]);

  const totalEstimated = screeningQuestions.length + confirmationQuestions.length;
  const currentQuestion = activeQuestions[currentIndex];
  const globalIndex =
    phase === 'screening'
      ? currentIndex
      : screeningQuestions.length + currentIndex;

  const handleAnswerSelect = (score: number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, score);
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (phase === 'screening') {
      if (flaggedConstitutions.length > 0) {
        setPhase('confirmation');
        setCurrentIndex(0);
      } else {
        router.push('/assessment/results');
      }
    } else {
      router.push('/assessment/results');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (phase === 'confirmation') {
      setPhase('screening');
      setCurrentIndex(screeningQuestions.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion || activeQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Assessment not found</p>
          <Link href="/assessment/streamlined" className="text-primary hover:underline">
            Start over
          </Link>
        </div>
      </div>
    );
  }

  const progress = Math.round(((globalIndex + 1) / Math.max(totalEstimated, 1)) * 100);
  const currentAnswer = answers[currentQuestion.id];
  const isFirstQuestion = phase === 'screening' && currentIndex === 0;
  const isLastQuestion = phase === 'confirmation' 
    ? currentIndex === confirmationQuestions.length - 1
    : (phase === 'screening' && flaggedConstitutions.length === 0 && currentIndex === screeningQuestions.length - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/assessment/streamlined" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {globalIndex + 1} of ~{totalEstimated}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {progress}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              phase === 'screening' 
                ? "bg-blue-100 text-blue-700" 
                : "bg-green-100 text-green-700"
            )}>
              {phase === 'screening' ? 'Screening Phase' : 'Confirmation Phase'}
            </span>
            {phase === 'confirmation' && (
              <span className="text-xs text-gray-500">
                Follow-up for: {currentQuestion.forConstitution}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary text-xs font-medium rounded-full mb-4">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            {currentQuestion.textEn}
          </h2>

          <div className="space-y-3">
            {[
              { score: 1, label: 'Never', desc: 'Not at all / Never' },
              { score: 2, label: 'Rarely', desc: 'A little bit / Occasionally' },
              { score: 3, label: 'Sometimes', desc: 'Sometimes / A few times' },
              { score: 4, label: 'Often', desc: 'Often / Most of the time' },
              { score: 5, label: 'Always', desc: 'Very / Every day' },
            ].map(({ score, label, desc }) => {
              const isSelected = currentAnswer === score;
              return (
                <button
                  key={score}
                  onClick={() => handleAnswerSelect(score)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                    isSelected
                      ? "border-primary bg-primary-50"
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  )}
                >
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-sm text-gray-600">{desc}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors",
              isFirstQuestion
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors",
              !currentAnswer
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-600 shadow-lg"
            )}
          >
            {isLastQuestion || (phase === 'confirmation' && currentIndex === confirmationQuestions.length - 1)
              ? "View Results"
              : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
