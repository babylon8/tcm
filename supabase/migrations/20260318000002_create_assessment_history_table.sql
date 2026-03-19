-- Create assessment_history table
CREATE TABLE public.assessment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('constitution', 'symptoms')),
  results JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.assessment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own assessment history"
  ON public.assessment_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON public.assessment_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
  ON public.assessment_history
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all assessments"
  ON public.assessment_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX assessment_history_user_id_idx ON public.assessment_history(user_id);
CREATE INDEX assessment_history_created_at_idx ON public.assessment_history(created_at DESC);
CREATE INDEX assessment_history_type_idx ON public.assessment_history(assessment_type);
