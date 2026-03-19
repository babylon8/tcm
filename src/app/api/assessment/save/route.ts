import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assessment_type, results } = body;

    if (!assessment_type || !results) {
      return NextResponse.json(
        { error: 'Missing required fields: assessment_type, results' },
        { status: 400 }
      );
    }

    if (!['constitution', 'symptoms'].includes(assessment_type)) {
      return NextResponse.json(
        { error: 'Invalid assessment_type. Must be "constitution" or "symptoms"' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('assessment_history')
      .insert({
        user_id: user.id,
        assessment_type,
        results,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
