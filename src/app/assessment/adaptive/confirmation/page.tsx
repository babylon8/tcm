'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles } from 'lucide-react';
import { loadAdaptiveQuestions, loadBodyTypes, BodyTypesData } from '@/lib/data';
import type { AssessmentQuestion } from '@/types';
import { useAssessmentStore } from '@/store/assessment';
import { cn } from '@/lib/utils';

export default function ConfirmationPage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<AssessmentQuestion[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyTypesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { 
    answers, 
    setAnswer, 
    flaggedConstitutions,
    phase
  } = useAssessmentStore();

  // Redirect if not in confirmation phase or no flagged constitutions
  useEffect(() => {
    if (!loading && (phase !== 'confirmation' || flaggedConstitutions.length === 0)) {
      router.push('/assessment/adaptive');
    }
  }, [loading, phase, flaggedConstitutions, router]);

  useEffect(() => {
    Promise.all([loadAdaptiveQuestions(), loadBodyTypes()])
      .then(([questionsData, bodyTypesData]) => {
        // Filter only confirmation questions
        const confirmationQuestions = questionsData.questions.filter(
          (q) => q.phase === 'confirmation'
        );
        setAllQuestions(confirmationQuestions);
        setBodyTypes(bodyTypesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  // Filter questions for only flagged constitutions
  const questions = useMemo(() => {
    return allQuestions.filter((q) => 
      q.forConstitution && flaggedConstitutions.includes(q.forConstitution)
    );
  }, [allQuestions, flaggedConstitutions]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Group questions by constitution for progress display
  const questionsByConstitution = useMemo(() => {
    const grouped: Record<string, number> = {};
    questions.forEach((q) => {
      if (q.forConstitution) {
        grouped[q.forConstitution] = (grouped[q.forConstitution] || 0) + 1;
      }
    });
    return grouped;
  }, [questions]);

  const currentConstitution = currentQuestion?.forConstitution;
  const currentConstitutionName = currentConstitution && bodyTypes 
    ? bodyTypes.types[currentConstitution]?.name 
    : currentConstitution;

  const handleAnswerSelect = (score: number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, score);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Confirmation complete - go to results
      router.push('/assessment/results');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Go back to screening
      router.push('/assessment/adaptive/screening');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-sage-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sage-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-ink-600 font-body">Loading follow-up questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-600 mb-4">No follow-up questions needed</p>
          <Link href="/assessment/results" className="text-sage-600 hover:underline">
            View Results
          </Link>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-600 mb-4">Assessment not found</p>
          <Link href="/assessment/adaptive" className="text-sage-600 hover:underline">
            Start over
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/assessment/adaptive/screening" className="inline-flex items-center text-ink-600 hover:text-ink-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Screening
        </Link>

        {/* Phase Indicator */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Phase 2: Follow-up
          </div>
          {currentConstitutionName && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warm-200 text-ink-700 rounded-full text-sm">
              Exploring: <span className="font-semibold">{currentConstitutionName}</span>
            </div>
          )}
        </div>

        {/* Flagged Constitutions Summary */}
        <div className="mb-4 p-3 bg-sage-50 rounded-xl border border-sage-200">
          <p className="text-sm text-ink-600 mb-2">
            Based on your screening, we&apos;re asking follow-up questions for:
          </p>
          <div className="flex flex-wrap gap-2">
            {flaggedConstitutions.map((id) => {
              const name = bodyTypes?.types[id]?.name || id;
              const icon = bodyTypes?.types[id]?.icon || '•';
              const isActive = id === currentConstitution;
              return (
                <span
                  key={id}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm",
                    isActive
                      ? "bg-sage-600 text-white font-medium"
                      : "bg-white text-ink-600 border border-warm-200"
                  )}
                >
                  <span>{icon}</span>
                  {name}
                </span>
              );
            })}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-ink-600">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <Clock className="w-4 h-4" />
              <span>~{Math.ceil((totalQuestions - currentIndex) * 0.3)} min left</span>
            </div>
          </div>
          <div className="w-full bg-warm-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-warm-200">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-4">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-display font-bold text-ink-900 mb-8">
            {currentQuestion.textEn}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {[
              { score: 1, label: 'Never', desc: 'Not at all' },
              { score: 2, label: 'Rarely', desc: 'A little bit / Occasionally' },
              { score: 3, label: 'Sometimes', desc: 'A few times' },
              { score: 4, label: 'Often', desc: 'Most of the time' },
              { score: 5, label: 'Always', desc: 'Every day' },
            ].map(({ score, label, desc }) => {
              const isSelected = currentAnswer === score;
              return (
                <button
                  key={score}
                  onClick={() => handleAnswerSelect(score)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between",
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-warm-200 hover:border-primary-300 hover:bg-warm-50"
                  )}
                >
                  <div>
                    <div className="font-medium text-ink-900">{label}</div>
                    <div className="text-sm text-ink-500">{desc}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-colors bg-warm-200 text-ink-700 hover:bg-warm-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-xl font-medium transition-colors",
              !currentAnswer
                ? "bg-warm-300 text-ink-400 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700 shadow-lg"
            )}
          >
            {currentIndex === totalQuestions - 1 ? "View Results" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-ink-500 mt-6">
          These targeted questions help us confirm and refine your results.
        </p>
      </div>
    </div>
  );
}
