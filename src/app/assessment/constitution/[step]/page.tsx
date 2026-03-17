'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { loadQuestions } from '@/lib/data';
import type { AssessmentQuestion } from '@/types';
import { useAssessmentStore } from '@/store/assessment';
import { cn } from '@/lib/utils';

const QUESTIONS_PER_STEP = 5;

export default function QuestionPage() {
  const params = useParams();
  const router = useRouter();
  const stepParam = params.step as string;
  const currentStep = parseInt(stepParam, 10);
  
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const { answers: storedAnswers, setAnswer, setAnswers } = useAssessmentStore();

  useEffect(() => {
    setLoading(true);
    loadQuestions()
      .then((data) => {
        setQuestions(data.questions);
        setSelectedAnswers(storedAnswers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  const startIndex = currentStep * QUESTIONS_PER_STEP;
  const endIndex = startIndex + QUESTIONS_PER_STEP;
  const currentQuestions = questions.slice(startIndex, endIndex);
  const totalSteps = Math.ceil(questions.length / QUESTIONS_PER_STEP);
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleAnswerSelect = (score: number) => {
    if (!currentQuestion) return;
    
    const newAnswers = { ...selectedAnswers, [currentQuestion.id]: score };
    setSelectedAnswers(newAnswers);
    setAnswer(currentQuestion.id, score);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentStep < totalSteps - 1) {
      router.push(`/assessment/constitution/${currentStep + 1}`);
      setCurrentQuestionIndex(0);
    } else {
      router.push('/assessment/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentStep > 0) {
      router.push(`/assessment/constitution/${currentStep - 1}`);
      setCurrentQuestionIndex(QUESTIONS_PER_STEP - 1);
    }
  };

  const handleSelectStep = (step: number) => {
    router.push(`/assessment/constitution/${step}`);
    setCurrentQuestionIndex(0);
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

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Assessment not found</p>
          <Link
            href="/assessment/constitution"
            className="text-primary hover:underline"
          >
            Start over
          </Link>
        </div>
      </div>
    );
  }

  const currentAnswer = selectedAnswers[currentQuestion.id];
  const progress = ((currentStep * QUESTIONS_PER_STEP + currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/assessment/constitution"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentStep * QUESTIONS_PER_STEP + currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {Array.from({ length: totalSteps }).map((_, stepIndex) => {
            const isCompleted = stepIndex < currentStep || (stepIndex === currentStep && currentQuestionIndex > 0);
            const isCurrent = stepIndex === currentStep;
            
            return (
              <button
                key={stepIndex}
                onClick={() => handleSelectStep(stepIndex)}
                disabled={stepIndex > currentStep}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 transition-all duration-200",
                  isCurrent
                    ? "bg-primary text-white scale-110"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600",
                  stepIndex > currentStep ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" />
                ) : (
                  stepIndex + 1
                )}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 animate-fadeIn">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary text-xs font-medium rounded-full mb-4">
              {currentQuestion.category}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold mb-8">
            {currentQuestion.textEn}
          </h2>

          {/* Answer Options */}
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
                  <div className="flex-1">
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

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0 && currentQuestionIndex === 0}
            className={cn(
              "inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors",
              currentStep === 0 && currentQuestionIndex === 0
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
            {currentStep === totalSteps - 1 && currentQuestionIndex === currentQuestions.length - 1
              ? "View Results"
              : currentStep === totalSteps - 1 && currentQuestionIndex < currentQuestions.length - 1
              ? "Next Question"
              : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
