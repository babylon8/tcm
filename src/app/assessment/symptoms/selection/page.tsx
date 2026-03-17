'use client';

import Link from 'next/link';
import { ArrowLeft, Target, Activity, Info } from 'lucide-react';

export default function SymptomSelectionLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Symptom Checker</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select symptoms from different body regions to understand them from a Traditional Chinese Medicine perspective.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Start Checking Your Symptoms</h2>
            <p className="text-gray-600 mb-6">
              Select a body region or browse by category to identify your symptoms and understand their TCM significance.
            </p>
            <Link
              href="/assessment/symptoms/page"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-lg"
            >
              <Activity className="w-5 h-5 mr-2" />
              Open Symptom Checker
            </Link>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How it Works</h3>
                <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                  <li>Select a body region or symptom category</li>
                  <li>Choose the symptoms you&apos;re experiencing</li>
                  <li>Set the severity and duration</li>
                  <li>View TCM interpretation and related patterns</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
