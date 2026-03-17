'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock } from 'lucide-react';
import { loadAdaptiveQuestions } from '@/lib/data';
import type { AssessmentQuestion } from '@/types';
import { useAssessmentStore } from '@/store/assessment';
import { cn } from '@/lib/utils';

export default function ScreeningPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { 
    answers, 
    setAnswer, 
    screeningAnswers, 
    setScreeningAnswer,
    setPhase,
    setFlaggedConstitutions,
    resetAnswers
  } = useAssessmentStore();

  // Reset answers when starting fresh screening (only on mount)
  useEffect(() => {
    resetAnswers();
    setPhase('screening');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadAdaptiveQuestions()
      .then((data) => {
        // Filter only screening questions
        const screeningQuestions = data.questions.filter((q) => q.phase === 'screening');
        setQuestions(screeningQuestions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleAnswerSelect = (score: number) => {
    if (!currentQuestion) return;
    setAnswer(currentQuestion.id, score);
    // Also track by constitution type for flagging
    if (currentQuestion.constitutionType) {
      setScreeningAnswer(currentQuestion.constitutionType, score);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Screening complete - determine flagged constitutions
      const flagged = Object.entries(screeningAnswers)
        .filter(([_, score]) => score >= 3)
        .map(([constitutionId]) => constitutionId);

      setFlaggedConstitutions(flagged);
      setPhase('confirmation');

      if (flagged.length > 0) {
        // Go to confirmation phase
        router.push('/assessment/adaptive/confirmation');
      } else {
        // No constitutions flagged - go directly to results
        router.push('/assessment/results');
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
          <p className="text-ink-600 font-body">Loading screening questions...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
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
        <Link href="/assessment/adaptive" className="inline-flex items-center text-ink-600 hover:text-ink-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Phase Indicator */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></span>
            Phase 1: Screening
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
              className="bg-sage-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-warm-200">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-sage-100 text-sage-700 text-xs font-medium rounded-full mb-4">
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
                      ? "border-sage-500 bg-sage-50"
                      : "border-warm-200 hover:border-sage-300 hover:bg-warm-50"
                  )}
                >
                  <div>
                    <div className="font-medium text-ink-900">{label}</div>
                    <div className="text-sm text-ink-500">{desc}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-sage-600 rounded-full flex items-center justify-center">
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
            disabled={currentIndex === 0}
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-xl font-medium transition-colors",
              currentIndex === 0
                ? "bg-warm-200 text-ink-400 cursor-not-allowed"
                : "bg-warm-200 text-ink-700 hover:bg-warm-300"
            )}
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
                : "bg-sage-600 text-white hover:bg-sage-700 shadow-lg"
            )}
          >
            {currentIndex === totalQuestions - 1 ? "Continue to Follow-ups" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-ink-500 mt-6">
          Answer based on how you&apos;ve felt over the past 6 months, not just today.
        </p>
      </div>
    </div>
  );
}
