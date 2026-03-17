import Link from 'next/link';
import { Activity, BookOpen, Target, Leaf } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-sage-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary-200/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <Leaf className="w-4 h-4" />
              <span>Traditional Chinese Medicine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink-900 mb-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Discover Your <span className="text-sage-600">TCM Constitution</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-ink-600 mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Understand your body through Traditional Chinese Medicine principles and receive personalized health recommendations tailored to your unique constitution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <Link
                href="/assessment/streamlined"
                className="inline-flex items-center justify-center px-8 py-4 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Activity className="w-5 h-5 mr-2" />
                Start Constitution Assessment
              </Link>
              
              <Link
                href="/assessment/symptoms"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-ink-800 font-semibold rounded-xl border-2 border-sage-200 hover:border-sage-300 hover:bg-sage-50 transition-all shadow-sm hover:shadow-md"
              >
                <Target className="w-5 h-5 mr-2" />
                Check Symptoms
              </Link>
              
              <Link
                href="/education"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-ink-800 font-semibold rounded-xl border-2 border-warm-200 hover:border-warm-300 hover:bg-warm-50 transition-all shadow-sm hover:shadow-md"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn TCM
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-warm-200 hover:border-sage-200 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="w-14 h-14 bg-sage-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sage-200 transition-colors">
              <Activity className="w-7 h-7 text-sage-600" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-ink-900">Constitution Assessment</h3>
            <p className="text-ink-500 leading-relaxed">
              Identify your TCM constitution type among the 9 recognized types through a comprehensive questionnaire based on established TCM standards.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-warm-200 hover:border-sage-200 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-200 transition-colors">
              <Target className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-ink-900">Symptom Checker</h3>
            <p className="text-ink-500 leading-relaxed">
              Check your symptoms from a TCM perspective using our interactive body map and receive insights into potential imbalances.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-warm-200 hover:border-sage-200 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <div className="w-14 h-14 bg-warm-200 rounded-xl flex items-center justify-center mb-5 group-hover:bg-warm-300 transition-colors">
              <BookOpen className="w-7 h-7 text-ink-600" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-3 text-ink-900">TCM Education Library</h3>
            <p className="text-ink-500 leading-relaxed">
              Learn the fundamentals of Traditional Chinese Medicine, including constitutions, diagnosis, prevention, and the five organs.
            </p>
          </div>
        </div>
      </section>

      {/* Nine Constitutions Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 mb-4 animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
            The Nine TCM Constitutions
          </h2>
          <p className="text-ink-500 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
            Traditional Chinese Medicine recognizes nine distinct constitution types. Understanding your constitution is the key to achieving balance and maintaining optimal health.
          </p>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3 max-w-4xl mx-auto">
          {[
            { letter: 'A', name: 'Balanced', color: 'bg-sage-100 text-sage-700 border-sage-200' },
            { letter: 'B', name: 'Qi Deficiency', color: 'bg-green-100 text-green-700 border-green-200' },
            { letter: 'C', name: 'Yang Deficiency', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            { letter: 'D', name: 'Yin Deficiency', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            { letter: 'E', name: 'Phlegm-Damp', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
            { letter: 'F', name: 'Damp-Heat', color: 'bg-red-100 text-red-700 border-red-200' },
            { letter: 'G', name: 'Blood Stasis', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            { letter: 'H', name: 'Qi Stagnation', color: 'bg-pink-100 text-pink-700 border-pink-200' },
            { letter: 'I', name: 'Allergic', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
          ].map((type, idx) => (
            <div 
              key={type.letter}
              className={`${type.color} border rounded-xl p-3 text-center cursor-pointer hover:scale-105 transition-transform animate-fadeInUp`}
              style={{ animationDelay: `${0.9 + idx * 0.05}s` }}
            >
              <div className="font-display font-bold text-lg mb-1">{type.letter}</div>
              <div className="text-xs font-medium truncate">{type.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 pb-24">
        <div className="relative bg-gradient-to-br from-sage-600 to-sage-800 rounded-3xl p-12 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
          
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-sage-100 text-lg mb-8 max-w-xl mx-auto">
              Take the first step towards understanding your body and improving your health with Traditional Chinese Medicine wisdom.
            </p>
            <Link
              href="/assessment/streamlined"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-sage-700 font-semibold rounded-xl hover:bg-sage-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Begin Assessment Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
