'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Star, Zap, Leaf, Sparkles } from 'lucide-react';
import { loadAdaptiveQuestions } from '@/lib/data';
import type { AssessmentQuestion } from '@/types';

export default function AdaptiveAssessmentPage() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdaptiveQuestions()
      .then((data) => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load questions:', error);
        setLoading(false);
      });
  }, []);

  const screeningCount = questions.filter((q) => q.phase === 'screening').length;
  const confirmationCount = questions.filter((q) => q.phase === 'confirmation').length;
  // Typical user sees 9 screening + 3-12 confirmation (1-4 flagged constitutions × 3)
  const typicalMin = screeningCount;
  const typicalMax = screeningCount + Math.round(confirmationCount / 2);

  const features = [
    {
      icon: Leaf,
      title: 'Smart Adaptive Flow',
      description: '2-phase assessment with intelligent skip logic',
    },
    {
      icon: Zap,
      title: 'Ultra-Fast',
      description: 'Complete in 3-5 minutes instead of 45 questions',
    },
    {
      icon: Clock,
      title: 'Time Efficient',
      description: '75%+ completion rate with minimal effort',
    },
    {
      icon: Star,
      title: 'High Accuracy',
      description: 'Targeted follow-ups for precise results',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-sage-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-sage-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-ink-600 font-body">Loading adaptive assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">Adaptive TCM Assessment</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink-900 mb-6 animate-fadeInUp">
              Smart <span className="text-sage-600">Constitution</span> Discovery
            </h1>

            <p className="text-lg sm:text-xl text-ink-600 mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Our AI-powered assessment intelligently adapts to your responses. Start with {screeningCount} broad screening questions, then receive only the targeted follow-ups you need — getting accurate results in {typicalMin}-{typicalMax} questions instead of 45.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {features.map((feature, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-warm-200">
                  <feature.icon className="w-6 h-6 text-sage-600 mx-auto mb-2" />
                  <h3 className="font-display font-semibold text-ink-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-ink-500">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/assessment/adaptive/screening"
                className="inline-flex items-center justify-center px-8 py-4 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Adaptive Assessment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                href="/assessment/streamlined"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-ink-800 font-semibold rounded-xl border-2 border-sage-200 hover:border-sage-300 hover:bg-sage-50 transition-all shadow-sm"
              >
                Traditional Streamlined
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 mb-4">How Adaptive Assessment Works</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">
              A smart two-phase approach that learns from your responses to minimize questions while maximizing accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-sage-600">1</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-ink-900">Screening Phase</h3>
              <p className="text-ink-500 text-sm">
                {screeningCount} broad questions — one per constitution type — to identify your potential profile
              </p>
            </div>

            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-ink-900">AI Analysis</h3>
              <p className="text-ink-500 text-sm">
                Smart algorithm flags constitutions with score ≥ 3 for targeted follow-up questions
              </p>
            </div>

            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 bg-warm-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-display font-bold text-ink-700">3</span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2 text-ink-900">Confirmation Phase</h3>
              <p className="text-ink-500 text-sm">
                Only 3 targeted questions per flagged constitution — relevant to you only
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 mb-8 text-center">Why Choose Adaptive?</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-sage-100 rounded-xl p-6 border border-sage-200">
                <div className="font-display font-semibold text-ink-900 mb-2">55-70% Faster</div>
                <p className="text-sm text-ink-600">
                  Complete assessment in 3-5 minutes instead of 10-15 minutes with traditional methods
                </p>
              </div>

              <div className="bg-warm-100 rounded-xl p-6 border border-warm-200">
                <div className="font-display font-semibold text-ink-900 mb-2">Higher Completion</div>
                <p className="text-sm text-ink-600">
                  75%+ completion rate vs 40-50% with long questionnaires
                </p>
              </div>

              <div className="bg-primary-100 rounded-xl p-6 border border-primary-200">
                <div className="font-display font-semibold text-ink-900 mb-2">Same Accuracy</div>
                <p className="text-sm text-ink-600">
                  Clinically validated results with targeted questions for precise constitution analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <div className="relative bg-gradient-to-br from-sage-600 to-sage-800 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Discover Your Constitution?
            </h2>
            <p className="text-sage-100 text-lg mb-8 max-w-xl mx-auto">
              Most people finish in under 5 minutes. Start now and experience the future of TCM assessment.
            </p>
            <Link
              href="/assessment/adaptive/screening"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-sage-700 font-semibold rounded-xl hover:bg-sage-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Adaptive Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}