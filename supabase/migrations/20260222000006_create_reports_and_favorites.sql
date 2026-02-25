-- Create reports table for flagging inappropriate content
CREATE TABLE public.item_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'fraud', 'duplicate', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(item_id, reporter_id)  -- One report per user per item
);

-- Enable RLS
ALTER TABLE public.item_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own reports"
  ON public.item_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports"
  ON public.item_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Create indexes
CREATE INDEX idx_reports_item ON public.item_reports(item_id);
CREATE INDEX idx_reports_reporter ON public.item_reports(reporter_id);
CREATE INDEX idx_reports_status ON public.item_reports(status);

-- Create favorites/saved items table
CREATE TABLE public.saved_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)  -- One save per user per item
);

-- Enable RLS
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own saved items"
  ON public.saved_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save items"
  ON public.saved_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved items"
  ON public.saved_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_saved_items_user ON public.saved_items(user_id);
CREATE INDEX idx_saved_items_item ON public.saved_items(item_id);

-- Function to increment views count
CREATE OR REPLACE FUNCTION public.increment_item_views(p_item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET views_count = views_count + 1
  WHERE id = p_item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
