-- Add status column to items table
ALTER TABLE public.items 
  ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN views_count INTEGER DEFAULT 0,
  ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Create indexes for better performance
CREATE INDEX idx_items_user_id ON public.items(user_id);
CREATE INDEX idx_items_type ON public.items(type);
CREATE INDEX idx_items_category ON public.items(category);
CREATE INDEX idx_items_status ON public.items(status);
CREATE INDEX idx_items_date ON public.items(date DESC);
CREATE INDEX idx_items_created_at ON public.items(created_at DESC);
CREATE INDEX idx_items_location ON public.items(location);

-- Full text search index for title and description
ALTER TABLE public.items ADD COLUMN search_vector tsvector;

CREATE OR REPLACE FUNCTION public.items_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER items_search_vector_update
  BEFORE INSERT OR UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.items_search_vector_update();

CREATE INDEX idx_items_search ON public.items USING GIN(search_vector);

-- Function to mark item as resolved
CREATE OR REPLACE FUNCTION public.mark_item_resolved(item_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.items
  SET status = 'resolved', resolved_at = now()
  WHERE id = item_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
