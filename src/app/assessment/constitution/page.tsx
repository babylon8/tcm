import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';

export default function ConstitutionLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Constitution Assessment</h1>
              <p className="text-gray-600 text-lg">
                Discover your TCM constitution type through our comprehensive assessment based on established Traditional Chinese Medicine standards.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">What to Expect</h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Approximately 60 questions to answer</li>
                    <li>• Each question has 5 response options</li>
                    <li>• Takes about 10-15 minutes to complete</li>
                    <li>• Based on 中华中医药学会 standards</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Before Starting</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Answer Honestly</p>
                      <p className="text-sm text-gray-600">
                        Provide honest answers that reflect your typical condition over the past 6 months, not temporary states.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Take Your Time</p>
                      <p className="text-sm text-gray-600">
                        There&apos;s no time limit. Read each question carefully before selecting your response.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Privacy Guaranteed</p>
                      <p className="text-sm text-gray-600">
                        Your responses are stored locally on your device and are not shared with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <p className="text-yellow-800 text-sm">
                <span className="font-semibold">⚠️ Important:</span> This assessment provides wellness information based on Traditional Chinese Medicine principles. It is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>

            <Link
              href="/assessment/streamlined/0"
              className="block w-full text-center py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Begin Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
