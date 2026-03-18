'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { loadAdaptiveQuestions, loadConstitutions, loadRecommendations, loadBodyTypes, getMatchStrength, BodyTypesData } from '@/lib/data';
import {
  calculateAllConstitutionScores,
  assessConstitution,
  saveAssessment,
  generateAssessmentId,
} from '@/lib/assessment';
import { useAssessmentStore } from '@/store/assessment';
import { useAppStore } from '@/store/app';
import type { Constitution, ConstitutionResult, Recommendation } from '@/types';
import { getConstitutionColor } from '@/lib/utils';

// Visual match strength bar component
function MatchStrengthBar({ score, showLabel = true }: { score: number; showLabel?: boolean }) {
  const { label, level } = getMatchStrength(score);
  const filledBars = level === 'strong' ? 8 : level === 'moderate' ? 5 : level === 'slight' ? 3 : 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm ${
              i < filledBars
                ? level === 'strong'
                  ? 'bg-green-500'
                  : level === 'moderate'
                  ? 'bg-yellow-500'
                  : 'bg-orange-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {showLabel && (
        <span className={`text-sm font-medium ${
          level === 'strong' ? 'text-green-600' : level === 'moderate' ? 'text-yellow-600' : 'text-orange-500'
        }`}>
          {label}
        </span>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { addAssessment, setCurrentAssessment } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [primaryConstitution, setPrimaryConstitution] = useState<ConstitutionResult | null>(null);
  const [secondaryConstitutions, setSecondaryConstitutions] = useState<ConstitutionResult[]>([]);
  const [constitutionData, setConstitutionData] = useState<Constitution | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [bodyTypesData, setBodyTypesData] = useState<BodyTypesData | null>(null);
  const [showDetailedRecs, setShowDetailedRecs] = useState(false);

  useEffect(() => {
    async function loadResults() {
      try {
        const answers = useAssessmentStore.getState().answers;
        const answerCount = Object.keys(answers).length;
        
        if (answerCount === 0) {
          router.push('/assessment/streamlined');
          return;
        }

        const questionsData = await loadAdaptiveQuestions();
        const [constitutionsData, recommendationsData, bodyTypes] = await Promise.all([
          loadConstitutions(),
          loadRecommendations(),
          loadBodyTypes(),
        ]);

        const allScores = calculateAllConstitutionScores(questionsData.questions, answers);
        const { primary, secondary } = assessConstitution(allScores);

        if (!primary) {
          router.push('/assessment/streamlined');
          return;
        }

        setPrimaryConstitution(primary);
        setSecondaryConstitutions(secondary);
        setBodyTypesData(bodyTypes);

        const constitutionDetails = constitutionsData.constitutions.find(c => c.id === primary.constitutionId);
        setConstitutionData(constitutionDetails || null);

        const relevantRecommendations = recommendationsData.recommendations.filter(
          r => r.appliesTo.constitutionTypes?.includes(primary.constitutionId)
        );
        setRecommendations(relevantRecommendations);

        const assessment = {
          id: generateAssessmentId(),
          createdAt: new Date().toISOString(),
          constitutionResult: {
            primary,
            secondary,
            scores: allScores.reduce((acc, s) => {
              acc[s.constitutionId] = s.convertedScore;
              return acc;
            }, {} as Record<string, number>),
          },
          recommendations: relevantRecommendations.map(r => r.id),
        };
        addAssessment(assessment);
        setCurrentAssessment(assessment);
        saveAssessment(assessment);

        setLoading(false);
      } catch (error) {
        console.error('Failed to load results:', error);
        setLoading(false);
      }
    }

    loadResults();
  }, [router, addAssessment, setCurrentAssessment]);

  const handleRetake = () => {
    useAssessmentStore.getState().reset();
    router.push('/assessment/streamlined');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  if (!primaryConstitution || !bodyTypesData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Unable to generate results</p>
          <button onClick={handleRetake} className="text-primary hover:underline">
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const primaryBodyType = bodyTypesData.types[primaryConstitution.constitutionId];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>

        {/* Your Body Type - Primary Result */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Your Body Type</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{primaryBodyType?.icon || '🌿'}</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {primaryBodyType?.name || constitutionData?.nameEn}
                  </h1>
                  <p className="text-gray-500 italic">{primaryBodyType?.tagline}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleRetake}
              className="inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retake
            </button>
          </div>

          {/* Match Strength Bar */}
          <div className="mb-6">
            <MatchStrengthBar score={primaryConstitution.percentage} />
          </div>

          {/* Plain English Description */}
          <p className="text-gray-700 text-lg leading-relaxed">
            {primaryBodyType?.plainEnglish || constitutionData?.summary}
          </p>
        </div>

        {/* Secondary Traits */}
        {secondaryConstitutions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              You may also have traits of:
            </h2>
            <div className="space-y-4">
              {secondaryConstitutions.map((secondary) => {
                const secondaryType = bodyTypesData.types[secondary.constitutionId];
                return (
                  <div
                    key={secondary.constitutionId}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{secondaryType?.icon || '•'}</span>
                      <span className="font-medium text-gray-800">
                        {secondaryType?.name}
                      </span>
                    </div>
                    <MatchStrengthBar score={secondary.percentage} showLabel={true} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What You Can Do - Quick Tips */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> What You Can Do
          </h2>
          
          {primaryBodyType?.quickTips && (
            <ul className="space-y-3 mb-6">
              {primaryBodyType.quickTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Collapsible Detailed Recommendations */}
          {recommendations.length > 0 && (
            <div className="border-t pt-4">
              <button
                onClick={() => setShowDetailedRecs(!showDetailedRecs)}
                className="flex items-center gap-2 text-primary hover:text-primary-600 font-medium w-full"
              >
                {showDetailedRecs ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
                {showDetailedRecs ? 'Hide' : 'See'} detailed recommendations
              </button>
              
              {showDetailedRecs && (
                <div className="mt-4 space-y-6 animate-fadeIn">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="border-l-4 border-primary pl-4">
                      <h3 className="text-lg font-semibold mb-2">{rec.titleEn}</h3>
                      <p className="text-gray-600 mb-3">{rec.summaryEn}</p>
                      <div className="space-y-4">
                        {rec.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h4 className="font-medium text-primary mb-2">{section.titleEn}</h4>
                            {typeof section.contentEn === 'string' ? (
                              <p className="text-sm text-gray-600">{section.contentEn}</p>
                            ) : Array.isArray(section.content) ? (
                              <ul className="space-y-2">
                                {section.content.map((item, itemIndex) => (
                                  <li key={itemIndex} className="text-sm text-gray-700">
                                    <span className="font-medium">{item.nameEn || item.name}:</span>{' '}
                                    <span className="text-gray-600">
                                      {item.descriptionEn || item.description}
                                      {(item.frequencyEn || item.frequency) && (
                                        <span className="text-gray-500 italic"> ({item.frequencyEn || item.frequency})</span>
                                      )}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body Types Reference - Collapsible */}
        <details className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <h2 className="text-lg font-semibold text-gray-700">
              📋 Understanding All 9 Body Types
            </h2>
            <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-4 pt-4 border-t">
            <div className="grid gap-3">
              {Object.values(bodyTypesData.types).map((type) => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg border ${
                    type.id === primaryConstitution.constitutionId
                      ? 'border-primary bg-primary-50'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{type.icon}</span>
                    <span className="font-semibold">{type.name}</span>
                    {type.id === primaryConstitution.constitutionId && (
                      <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                        Your type
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{type.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        </details>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <span className="font-semibold">⚠️ Note:</span> These results are for educational purposes only and not a medical diagnosis. Consult a healthcare provider for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
