'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Activity, Info, RotateCcw } from 'lucide-react';
import { loadSymptoms } from '@/lib/data';
import type { Symptom, SeverityLevel, DurationOption, SymptomCategory, BodyRegionInfo } from '@/types';
import { cn } from '@/lib/utils';

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              i + 1 === currentStep
                ? 'bg-primary text-white'
                : i + 1 < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            )}
          >
            {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={cn(
                'w-12 h-1 mx-1',
                i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Body region icon mapping
const regionIcons: Record<string, { icon: string; label: string }> = {
  head: { icon: '🧠', label: 'Head' },
  face: { icon: '😊', label: 'Face' },
  neck: { icon: '🦒', label: 'Neck' },
  chest: { icon: '❤️', label: 'Chest' },
  abdomen: { icon: '🫃', label: 'Abdomen' },
  back: { icon: '🔙', label: 'Back' },
  'upper-limbs': { icon: '💪', label: 'Arms & Hands' },
  'lower-limbs': { icon: '🦵', label: 'Legs & Feet' },
  'whole-body': { icon: '🧍', label: 'Whole Body' },
  skin: { icon: '✋', label: 'Skin' },
};

// Plain English pattern descriptions
const patternDescriptions: Record<string, string> = {
  '风寒表证': 'Your body is fighting off cold - common when catching a chill',
  '阳虚证': 'Your body may lack warming energy - you tend to feel cold easily',
  '气虚证': 'Your energy levels may be low - you might tire easily',
  '外感风热': 'Your body is fighting off heat - common with throat infections',
  '阴虚发热': 'Your body may lack cooling fluids - causing internal heat',
  '少阳证': 'Imbalance between your body\'s defense and internal systems',
  '阴虚潮热': 'Deficiency of cooling fluids causing waves of heat',
  '气虚自汗': 'Low energy causing your body to lose fluids through sweat',
  '阳虚自汗': 'Lack of warming energy affecting your body\'s fluid control',
  '阴虚盗汗': 'Deficiency of cooling fluids causing night sweats',
  '肝郁化火': 'Emotional stress creating internal heat',
  '心肾不交': 'Imbalance between heart and kidney energy affecting sleep',
  '痰湿内阻': 'Accumulation of dampness and phlegm in your body',
  '湿热内蕴': 'Combination of dampness and heat in your system',
  '血瘀': 'Blood circulation may be sluggish',
  '气滞': 'Energy flow may be blocked or stagnant',
};

interface SelectedSymptomData {
  symptomId: string;
  severity: number;
  duration: string;
}

interface PatternResult {
  patternId: string;
  name: string;
  nameEn: string;
  confidence: number;
  basedOn: string[];
}

export default function SymptomCheckerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SymptomCheckerWizard />
    </Suspense>
  );
}

function SymptomCheckerWizard() {
  // Data state
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [bodyRegions, setBodyRegions] = useState<BodyRegionInfo[]>([]);
  const [severityLevels, setSeverityLevels] = useState<SeverityLevel[]>([]);
  const [durationOptions, setDurationOptions] = useState<DurationOption[]>([]);

  // Wizard state
  const [step, setStep] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, SelectedSymptomData>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<PatternResult[]>([]);

  // Load data on mount
  useEffect(() => {
    loadSymptoms()
      .then((data) => {
        setSymptoms(data.symptoms);
        setBodyRegions(data.bodyRegions);
        setSeverityLevels(data.severityLevels);
        setDurationOptions(data.durationOptions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load symptoms:', error);
        setLoading(false);
      });
  }, []);

  // Get symptoms for selected region
  const regionSymptoms = selectedRegion
    ? symptoms.filter((s) => s.bodyRegion === selectedRegion || selectedRegion === 'whole-body')
    : [];

  // Handle region selection
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setStep(2);
  };

  // Handle symptom toggle
  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) => {
      if (prev[symptomId]) {
        const newSelected = { ...prev };
        delete newSelected[symptomId];
        return newSelected;
      } else {
        return {
          ...prev,
          [symptomId]: {
            symptomId,
            severity: 3,
            duration: 'week',
          },
        };
      }
    });
  };

  // Handle severity change
  const handleSeverityChange = (symptomId: string, severity: number) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: { ...prev[symptomId], severity },
    }));
  };

  // Handle duration change
  const handleDurationChange = (symptomId: string, duration: string) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: { ...prev[symptomId], duration },
    }));
  };

  // Analyze symptoms and show results
  const handleAnalyze = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const patternMap = new Map<string, PatternResult>();
      
      for (const [symptomId, selected] of Object.entries(selectedSymptoms)) {
        const symptom = symptoms.find((s) => s.id === symptomId);
        if (!symptom) continue;
        
        symptom.tcmMeaning.patterns.forEach((pattern) => {
          const existing = patternMap.get(pattern.pattern);
          const confidence = pattern.confidence * selected.severity * 0.2;
          
          if (existing) {
            existing.confidence += confidence;
            if (!existing.basedOn.includes(symptomId)) {
              existing.basedOn.push(symptomId);
            }
          } else {
            patternMap.set(pattern.pattern, {
              patternId: pattern.pattern,
              name: pattern.pattern,
              nameEn: patternDescriptions[pattern.pattern] || 'A TCM pattern indicating imbalance',
              confidence,
              basedOn: [symptomId],
            });
          }
        });
      }
      
      const sortedResults = Array.from(patternMap.values())
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5); // Top 5 patterns
      
      setResults(sortedResults);
      setStep(3);
      setAnalyzing(false);
    }, 800);
  };

  // Reset wizard
  const handleReset = () => {
    setStep(1);
    setSelectedRegion(null);
    setSelectedSymptoms({});
    setResults([]);
  };

  // Get severity label
  const getSeverityLabel = (value: number): string => {
    const labels = ['Very Mild', 'Mild', 'Moderate', 'Significant', 'Severe'];
    return labels[value - 1] || 'Moderate';
  };

  // Get duration label
  const getDurationLabel = (value: string): string => {
    const labels: Record<string, string> = {
      today: 'Just today',
      week: 'Past week',
      month: 'Past month',
      'half-year': 'Past 6 months',
      'long-term': 'Long-term/Chronic',
    };
    return labels[value] || value;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading symptom checker...</p>
        </div>
      </div>
    );
  }

  const selectedCount = Object.keys(selectedSymptoms).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-16">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Link>
          {step > 1 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </button>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Symptom Checker
          </h1>
          <p className="text-gray-600">
            {step === 1 && 'Where are you experiencing discomfort?'}
            {step === 2 && 'What symptoms are you experiencing?'}
            {step === 3 && 'Your TCM Pattern Analysis'}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Step 1: Body Region Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
              Select the area where you feel discomfort
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {bodyRegions.map((region) => {
                const iconData = regionIcons[region.id] || { icon: '📍', label: region.nameEn };
                return (
                  <button
                    key={region.id}
                    onClick={() => handleRegionSelect(region.id)}
                    className="flex flex-col items-center p-4 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary-50 transition-all group"
                  >
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {iconData.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary text-center">
                      {iconData.label}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Select the body area where you're experiencing symptoms. You can check multiple areas by coming back to this step.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Symptom Selection */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Region indicator */}
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {regionIcons[selectedRegion || '']?.icon || '📍'}
                </span>
                <div>
                  <p className="text-sm text-gray-500">Selected area</p>
                  <p className="font-semibold text-gray-800">
                    {regionIcons[selectedRegion || '']?.label || selectedRegion}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                Change
              </button>
            </div>

            {/* Symptoms list */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Select your symptoms
              </h2>
              
              {regionSymptoms.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No symptoms found for this region.</p>
                  <button
                    onClick={() => setStep(1)}
                    className="mt-4 text-primary hover:underline"
                  >
                    Try a different area
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {regionSymptoms.map((symptom) => {
                    const isSelected = !!selectedSymptoms[symptom.id];
                    const selectedData = selectedSymptoms[symptom.id];
                    
                    return (
                      <div
                        key={symptom.id}
                        className={cn(
                          'border rounded-xl transition-all',
                          isSelected
                            ? 'border-primary bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        {/* Symptom header */}
                        <button
                          onClick={() => handleSymptomToggle(symptom.id)}
                          className="w-full p-4 flex items-center justify-between text-left"
                        >
                          <div className="flex-1">
                            <p className={cn(
                              'font-medium',
                              isSelected ? 'text-primary' : 'text-gray-800'
                            )}>
                              {symptom.nameEn}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {symptom.descriptionEn || symptom.description}
                            </p>
                          </div>
                          <div className={cn(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 flex-shrink-0',
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-gray-300'
                          )}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </button>
                        
                        {/* Expanded options when selected */}
                        {isSelected && selectedData && (
                          <div className="px-4 pb-4 space-y-4 border-t border-primary-100">
                            {/* Severity */}
                            <div className="pt-4">
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                How severe? <span className="text-primary font-semibold">{getSeverityLabel(selectedData.severity)}</span>
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="5"
                                value={selectedData.severity}
                                onChange={(e) => handleSeverityChange(symptom.id, parseInt(e.target.value))}
                                className="w-full accent-primary"
                              />
                              <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Mild</span>
                                <span>Severe</span>
                              </div>
                            </div>
                            
                            {/* Duration */}
                            <div>
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                How long have you had this?
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {durationOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => handleDurationChange(symptom.id, option.value)}
                                    className={cn(
                                      'px-3 py-1.5 rounded-full text-sm transition-colors',
                                      selectedData.duration === option.value
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    )}
                                  >
                                    {getDurationLabel(option.value)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={selectedCount === 0 || analyzing}
                className={cn(
                  'inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors',
                  selectedCount > 0
                    ? 'bg-primary text-white hover:bg-primary-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze {selectedCount > 0 && `(${selectedCount})`}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Results summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Analysis Complete</h2>
                  <p className="text-gray-600">Based on {selectedCount} symptom{selectedCount !== 1 ? 's' : ''} you reported</p>
                </div>
              </div>

              {results.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Possible TCM Patterns</h3>
                  {results.map((result, index) => (
                    <div
                      key={result.patternId}
                      className={cn(
                        'p-4 rounded-xl border-l-4',
                        index === 0
                          ? 'border-primary bg-primary-50'
                          : 'border-gray-300 bg-gray-50'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {index === 0 ? 'Most Likely' : `Pattern ${index + 1}`}
                          </span>
                          <h4 className="font-semibold text-gray-900">{result.name}</h4>
                        </div>
                        <span className={cn(
                          'px-2 py-1 rounded text-xs font-medium',
                          result.confidence > 0.6
                            ? 'bg-green-100 text-green-700'
                            : result.confidence > 0.3
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        )}>
                          {Math.round(result.confidence * 100)}% match
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{result.nameEn}</p>
                      <p className="text-xs text-gray-500">
                        Based on: {result.basedOn.map((id) => 
                          symptoms.find((s) => s.id === id)?.nameEn || id
                        ).join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No specific patterns identified.</p>
                  <p className="text-sm mt-2">Try selecting more symptoms for better analysis.</p>
                </div>
              )}
            </div>

            {/* What this means */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">What This Means</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    These patterns are based on Traditional Chinese Medicine principles. They represent 
                    possible imbalances in your body's energy (Qi), fluids, or organ systems.
                  </p>
                  <p className="text-blue-800 text-sm font-medium">
                    ⚠️ This is for educational purposes only and is not a medical diagnosis. 
                    Please consult a healthcare provider for medical advice.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReset}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Check More Symptoms
              </button>
              <Link
                href="/assessment/streamlined"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors"
              >
                Take Constitution Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
