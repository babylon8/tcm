import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Tag, Share2, BookOpen } from 'lucide-react';
import { loadEducation, loadConstitutions, loadSymptoms } from '@/lib/data';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EducationArticlePage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadEducation();
  const article = data.articles.find((a: any) => a.id === id);

  if (!article) {
    notFound();
  }

  // Load related data
  const constitutionsData = await loadConstitutions();
  const symptomsData = await loadSymptoms();

  const relatedConstitutions = article.relatedConstitutions?.map((code: string) => 
    constitutionsData.constitutions.find((c: any) => c.code === code)
  ).filter(Boolean) || [];

  const relatedSymptoms = article.relatedSymptoms?.map((code: string) =>
    symptomsData.symptoms.find((s: any) => s.id === code)
  ).filter(Boolean) || [];

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

  // Convert markdown-like content to simple HTML
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | 'table' | null = null;
    let tableRows: string[][] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-4 space-y-2">
              {currentList.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ul>
          );
        } else if (listType === 'ol') {
          elements.push(
            <ol key={`ol-${elements.length}`} className="list-decimal pl-6 mb-4 space-y-2">
              {currentList.map((item, i) => (
                <li key={i} className="text-gray-700">{item}</li>
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-4">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-gray-700 border-b">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
      }
    };

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        flushList();
        flushTable();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        flushTable();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        flushTable();
        elements.push(
          <h3 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Table row
      else if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        if (cells.length > 0 && !line.includes('---')) {
          tableRows.push(cells);
        }
      }
      // List items
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        flushTable();
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        currentList.push(line.trim().replace(/^[-*] /, ''));
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line.trim())) {
        flushTable();
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(line.trim().replace(/^\d+\.\s/, ''));
      }
      // Empty line - flush pending elements
      else if (line.trim() === '') {
        flushList();
        flushTable();
      }
      // Regular paragraph
      else {
        flushList();
        flushTable();
        // Handle bold text
        const processedLine = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        if (processedLine.trim()) {
          elements.push(
            <p 
              key={index} 
              className="text-gray-700 mb-4 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          );
        }
      }
    });

    flushList();
    flushTable();

    return elements;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-primary-50/50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/education" 
              className="inline-flex items-center text-primary hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              categoryColors[article.category] || 'bg-gray-100 text-gray-800'
            }`}>
              {categoryLabels[article.category] || article.category}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <article className="max-w-3xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {article.titleEn}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {article.summaryEn}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {Math.ceil(article.content.length / 1000)} min read
              </span>
              <span className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                Article {article.order} of {data.articles.length}
              </span>
            </div>
          </header>

          {/* Article Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            {renderContent(article.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag: string) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          {/* Related Constitutions */}
          {relatedConstitutions.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4">Related Constitutions</h3>
              <div className="flex flex-wrap gap-2">
                {relatedConstitutions.map((consti: any) => (
                  <Link
                    key={consti.code}
                    href="/assessment/constitution"
                    className="px-4 py-2 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    {consti.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Symptoms */}
          {relatedSymptoms.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h3 className="text-lg font-bold mb-4">Related Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {relatedSymptoms.map((symptom: any) => (
                  <Link
                    key={symptom.id}
                    href="/assessment/symptoms"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {symptom.nameEn}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary to-primary-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-bold mb-2">Ready to Discover Your Constitution?</h3>
            <p className="text-white/90 mb-4">
              Take our assessment to understand your body type and receive personalized recommendations.
            </p>
            <Link
              href="/assessment/constitution"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Constitution Assessment
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
