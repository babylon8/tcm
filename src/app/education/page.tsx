import Link from 'next/link';
import { BookOpen, ArrowRight, Clock, Tag } from 'lucide-react';
import { loadEducation } from '@/lib/data';

export default async function EducationPage() {
  const data = await loadEducation();
  const { articles, metadata } = data;

  const categoryLabels: Record<string, string> = {
    basics: 'TCM Basics',
    diagnosis: 'Diagnosis',
    prevention: 'Prevention',
    seasonal: 'Seasonal Care',
    organs: 'Organs'
  };

  const categoryColors: Record<string, string> = {
    basics: 'bg-emerald-100 text-emerald-800',
    diagnosis: 'bg-blue-100 text-blue-800',
    prevention: 'bg-purple-100 text-purple-800',
    seasonal: 'bg-orange-100 text-orange-800',
    organs: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary hover:text-primary-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TCM Educational Library
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the wisdom of Traditional Chinese Medicine. Learn about constitutions, 
            diagnosis methods, prevention, and the five organs.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {metadata.categories.map((category: string) => (
            <span
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                categoryColors[category] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {categoryLabels[category] || category}
            </span>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {articles.map((article: any) => (
            <Link
              key={article.id}
              href={`/education/${article.id}`}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  categoryColors[article.category] || 'bg-gray-100 text-gray-800'
                }`}>
                  {categoryLabels[article.category] || article.category}
                </span>
                <span className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {Math.ceil(article.content.length / 1000)} min read
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                {article.titleEn}
              </h2>
              
              <p className="text-gray-600 mb-4">
                {article.summaryEn}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
