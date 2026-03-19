'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Calendar, Activity, LogOut, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface AssessmentRecord {
  id: string;
  assessment_type: string;
  results: any;
  created_at: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadAssessmentHistory();
    }
  }, [user, authLoading, router]);

  const loadAssessmentHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('assessment_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load assessment history:', error);
    } else {
      setAssessments(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    setDeleting(id);
    const { error } = await supabase
      .from('assessment_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete assessment:', error);
      alert('Failed to delete assessment');
    } else {
      setAssessments(assessments.filter((a) => a.id !== id));
    }
    setDeleting(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.user_metadata?.full_name || 'User'}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Assessments</span>
              </div>
              <p className="text-3xl font-bold text-blue-600">{assessments.length}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Member Since</span>
              </div>
              <p className="text-lg font-semibold text-green-600">
                {new Date(user.created_at || '').toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Last Activity</span>
              </div>
              <p className="text-lg font-semibold text-purple-600">
                {assessments.length > 0 
                  ? new Date(assessments[0].created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  : 'No activity'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Assessment History</h2>
            <Link
              href="/assessment/streamlined/1"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              New Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No assessments yet</h3>
              <p className="text-gray-500 mb-6">Start your first assessment to track your health journey</p>
              <Link
                href="/assessment/streamlined/1"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Take Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assessment.assessment_type === 'constitution'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {assessment.assessment_type === 'constitution' ? 'Constitution' : 'Symptoms'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(assessment.created_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {assessment.assessment_type === 'constitution' && assessment.results.topConstitutions && (
                          <p>
                            <strong>Top Result:</strong>{' '}
                            {assessment.results.topConstitutions[0]?.type || 'N/A'}
                          </p>
                        )}
                        {assessment.assessment_type === 'symptoms' && assessment.results.patterns && (
                          <p>
                            <strong>Patterns Detected:</strong>{' '}
                            {assessment.results.patterns.length} pattern(s)
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(assessment.id)}
                      disabled={deleting === assessment.id}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting === assessment.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
