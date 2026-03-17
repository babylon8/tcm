'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Info, Activity, Check } from 'lucide-react';
import { loadSymptoms } from '@/lib/data';
import type { Symptom, SeverityLevel, DurationOption, PatternResult, SymptomCategory, BodyRegionInfo, SelectedSymptom } from '@/types';
import { cn } from '@/lib/utils';

export default function SymptomCheckerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading symptoms...</p>
        </div>
      </div>
    }>
      <SymptomCheckerContent />
    </Suspense>
  );
}

function SymptomCheckerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [categories, setCategories] = useState<SymptomCategory[]>([]);
  const [bodyRegions, setBodyRegions] = useState<BodyRegionInfo[]>([]);
  const [severityLevels, setSeverityLevels] = useState<SeverityLevel[]>([]);
  const [durationOptions, setDurationOptions] = useState<DurationOption[]>([]);
  
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, SelectedSymptom>>({});
  const [analyzing, setAnalyzing] = useState(false);
  const [patternResults, setPatternResults] = useState<PatternResult[]>([]);

  useEffect(() => {
    setLoading(true);
    loadSymptoms()
      .then((data) => {
        setSymptoms(data.symptoms);
        setCategories(data.categories);
        setBodyRegions(data.bodyRegions);
        setSeverityLevels(data.severityLevels);
        setDurationOptions(data.durationOptions);
        
        const regionParam = searchParams.get('region');
        const categoryParam = searchParams.get('category');
        
        if (regionParam) {
          setSelectedRegion(regionParam);
        } else if (categoryParam) {
          setSelectedCategory(categoryParam);
          setExpandedCategory(categoryParam);
        }
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load symptoms:', error);
        setLoading(false);
      });
  }, [searchParams]);

  const categorySymptoms = categories.reduce((acc, category) => {
    acc[category.id] = symptoms
      .filter(s => s.category === category.id)
      .filter(s => !selectedRegion || s.bodyRegion === selectedRegion);
    return acc;
  }, {} as Record<string, Symptom[]>);

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    setSelectedCategory(null);
    setExpandedCategory(null);
    router.push(`/assessment/symptoms?region=${regionId}`);
  };

  const handleCategoryToggle = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setSelectedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      setSelectedCategory(categoryId);
      setSelectedRegion(null);
      router.push(`/assessment/symptoms?category=${categoryId}`);
    }
  };

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

  const handleSeverityChange = (symptomId: string, severity: number) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: {
        ...prev[symptomId]!,
        severity,
      },
    }));
  };

  const handleDurationChange = (symptomId: string, duration: string) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: {
        ...prev[symptomId]!,
        duration,
      },
    }));
  };

  const handleClearAll = () => {
    setSelectedSymptoms({});
    setPatternResults([]);
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    
    setTimeout(() => {
      const results: PatternResult[] = [];
      
      for (const [symptomId, selected] of Object.entries(selectedSymptoms)) {
        const symptom = symptoms.find(s => s.id === symptomId);
        if (!symptom) continue;
        
        symptom.tcmMeaning.patterns.forEach((pattern) => {
          const existing = results.find(r => r.name === pattern.pattern);
          if (existing) {
            existing.confidence += pattern.confidence * selected.severity * 0.2;
            if (!existing.basedOn.includes(symptomId)) {
              existing.basedOn.push(symptomId);
            }
          } else {
            results.push({
              patternId: pattern.pattern,
              name: pattern.pattern,
              confidence: pattern.confidence * selected.severity * 0.2,
              basedOn: [symptomId],
            });
          }
        });
      }
      
      setPatternResults(results.sort((a, b) => b.confidence - a.confidence));
      setAnalyzing(false);
    }, 1000);
  };

  const getSeverityLabel = (value: number): string => {
    const level = severityLevels.find(l => l.value === value);
    return level?.labelEn || level?.label || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading symptoms...</p>
        </div>
      </div>
    );
  }

  const selectedSymptomCount = Object.keys(selectedSymptoms).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pb-16">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <Link
            href="/assessment/symptoms"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Select Symptoms
          </Link>
          
          <div className="flex items-center gap-2">
            {selectedSymptomCount > 0 && (
              <>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 mr-2" />
                      Analyze ({selectedSymptomCount})
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1">
            {/* Body Regions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Body Regions</h3>
              <div className="grid grid-cols-2 gap-2">
                {bodyRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionSelect(region.id)}
                    className={cn(
                      'p-3 rounded-lg text-center transition-colors',
                      selectedRegion === region.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    )}
                  >
                    <span className="text-2xl block mb-1">{getRegionIcon(region.id)}</span>
                    <span className="text-sm font-medium">{region.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => handleCategoryToggle(category.id)}
                      className="w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.nameEn}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform',
                          expandedCategory === category.id ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                    
                    {expandedCategory === category.id && categorySymptoms[category.id]?.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1">
                        {categorySymptoms[category.id].map((symptom) => (
                          <button
                            key={symptom.id}
                            onClick={() => handleSymptomToggle(symptom.id)}
                            className={cn(
                              'w-full text-left p-2 rounded text-sm transition-colors flex items-center justify-between',
                              selectedSymptoms[symptom.id]
                                ? 'bg-primary-100 text-primary'
                                : 'hover:bg-gray-50'
                            )}
                          >
                            <span className="truncate flex-1">{symptom.nameEn}</span>
                            {selectedSymptoms[symptom.id] && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pattern Results */}
            {patternResults.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 animate-fadeIn">
                <h3 className="font-bold text-xl mb-4">TCM Pattern Analysis</h3>
                <div className="space-y-4">
                  {patternResults.map((result) => (
                    <div key={result.patternId} className="border-l-4 border-primary pl-4 bg-primary-50/50 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">{result.name}</h4>
                        <span className="text-sm font-bold text-primary">
                          {(result.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Based on:</span>{' '}
                        {result.basedOn.map(id => symptoms.find(s => s.id === id)?.nameEn || id).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Symptoms */}
            {selectedSymptomCount > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="font-bold text-xl mb-4">
                  Selected Symptoms ({selectedSymptomCount})
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(selectedSymptoms).map(([symptomId, selected]) => {
                    const symptom = symptoms.find(s => s.id === symptomId);
                    if (!symptom) return null;
                    
                    return (
                      <div key={symptomId} className="border rounded-xl p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold">{symptom.nameEn}</h4>
                            <p className="text-sm text-gray-600 mt-1">{symptom.descriptionEn || symptom.description}</p>
                          </div>
                          <button
                            onClick={() => handleSymptomToggle(symptomId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                        
                        <div className="mb-3">
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Severity: {getSeverityLabel(selected.severity)}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={selected.severity}
                            onChange={(e) => handleSeverityChange(symptomId, parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Duration
                          </label>
                          <select
                            value={selected.duration}
                            onChange={(e) => handleDurationChange(symptomId, e.target.value)}
                            className="w-full p-2 border rounded-lg text-sm"
                          >
                            {durationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.labelEn || option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {patternResults.length === 0 && selectedSymptomCount === 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <Info className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No symptoms selected
                </h3>
                <p className="text-gray-500 mb-6">
                  Select body regions or categories from the left panel to start checking your symptoms.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* TCM Info Footer */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Understanding TCM Symptoms</h3>
              <p className="text-blue-800 text-sm">
                Traditional Chinese Medicine views symptoms as patterns of imbalance rather than isolated issues. 
                This checker helps you identify potential patterns based on your reported symptoms. 
                The patterns identified are not medical diagnoses but educational insights into TCM principles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRegionIcon(regionId: string): string {
  const icons: Record<string, string> = {
    head: '🧠',
    face: '😊',
    neck: '🦕',
    chest: '❤️',
    abdomen: '🥙',
    back: '↔️',
    'upper-limbs': '💪',
    'lower-limbs': '🦵',
    'whole-body': '🧍',
    skin: '👤',
  };
  return icons[regionId] || '📍';
}
