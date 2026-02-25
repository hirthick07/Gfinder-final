-- ============================================================================
-- GFINDER COMPLETE DATABASE SETUP
-- Combined migrations for easy execution
-- ============================================================================

-- ============================================================================
-- MIGRATION 1: Create Items Table
-- ============================================================================

-- Create items table
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  date DATE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Anyone can view all items (public browse)
CREATE POLICY "Anyone can view items"
  ON public.items FOR SELECT
  USING (true);

-- Users can insert their own items
CREATE POLICY "Users can insert own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own items
CREATE POLICY "Users can update own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own items
CREATE POLICY "Users can delete own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================================
-- MIGRATION 2: Add Storage for Item Images
-- ============================================================================

-- Add image_url column to items table
ALTER TABLE public.items ADD COLUMN image_url TEXT;

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public) VALUES ('item-images', 'item-images', true);

-- Storage policies
CREATE POLICY "Anyone can view item images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'item-images');

CREATE POLICY "Authenticated users can upload item images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'item-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own item images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own item images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1]);


-- ============================================================================
-- MIGRATION 3: Create User Profiles
-- ============================================================================

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.user_profiles FOR DELETE
  USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================================================
-- MIGRATION 4: Create Messages System
-- ============================================================================

-- Create messages table for user-to-user communication
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.items(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own messages"
  ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete their own sent messages"
  ON public.messages FOR DELETE
  USING (auth.uid() = sender_id);

-- Create index for faster queries
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_item ON public.messages(item_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);


-- ============================================================================
-- MIGRATION 5: Add Item Status and Features
-- ============================================================================

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


-- ============================================================================
-- MIGRATION 6: Create Notifications System
-- ============================================================================

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('message', 'match', 'item_update', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_item_id UUID REFERENCES public.items(id) ON DELETE CASCADE,
  related_message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_item_id UUID DEFAULT NULL,
  p_related_message_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, related_item_id, related_message_id)
  VALUES (p_user_id, p_type, p_title, p_message, p_related_item_id, p_related_message_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create notification when message is sent
CREATE OR REPLACE FUNCTION public.notify_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.create_notification(
    NEW.receiver_id,
    'message',
    'New Message',
    'You have received a new message about an item',
    NEW.item_id,
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_on_new_message();


-- ============================================================================
-- MIGRATION 7: Create Views and Stats
-- ============================================================================

-- Create view for item statistics
CREATE OR REPLACE VIEW public.item_stats AS
SELECT
  COUNT(*) FILTER (WHERE type = 'lost' AND status = 'active') as active_lost_items,
  COUNT(*) FILTER (WHERE type = 'found' AND status = 'active') as active_found_items,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_items,
  COUNT(DISTINCT user_id) as total_users,
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as items_this_week,
  COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as items_this_month
FROM public.items;

-- Create view for user statistics
CREATE OR REPLACE VIEW public.user_item_stats AS
SELECT
  user_id,
  COUNT(*) as total_items,
  COUNT(*) FILTER (WHERE type = 'lost') as lost_items,
  COUNT(*) FILTER (WHERE type = 'found') as found_items,
  COUNT(*) FILTER (WHERE status = 'active') as active_items,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_items,
  SUM(views_count) as total_views
FROM public.items
GROUP BY user_id;

-- Create view for recent items with user info
CREATE OR REPLACE VIEW public.items_with_user_info AS
SELECT
  i.*,
  up.full_name as user_full_name,
  up.avatar_url as user_avatar_url
FROM public.items i
LEFT JOIN public.user_profiles up ON i.user_id = up.id;

-- Grant access to views
GRANT SELECT ON public.item_stats TO authenticated;
GRANT SELECT ON public.user_item_stats TO authenticated;
GRANT SELECT ON public.items_with_user_info TO authenticated;

-- Function to get matching items (potential matches for lost/found)
CREATE OR REPLACE FUNCTION public.get_potential_matches(
  p_item_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  category TEXT,
  location TEXT,
  date DATE,
  type TEXT,
  similarity_score NUMERIC
) AS $$
DECLARE
  v_item RECORD;
BEGIN
  -- Get the item details
  SELECT * INTO v_item FROM public.items WHERE items.id = p_item_id;
  
  -- Return potential matches
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.description,
    i.category,
    i.location,
    i.date,
    i.type,
    (
      -- Calculate similarity score based on category, location, and date proximity
      (CASE WHEN i.category = v_item.category THEN 40 ELSE 0 END) +
      (CASE WHEN LOWER(i.location) = LOWER(v_item.location) THEN 30 ELSE 0 END) +
      (CASE WHEN ABS(EXTRACT(DAY FROM i.date - v_item.date)) <= 3 THEN 30 ELSE 0 END)
    )::NUMERIC as similarity_score
  FROM public.items i
  WHERE i.id != p_item_id
    AND i.type != v_item.type  -- Opposite type (lost vs found)
    AND i.status = 'active'
    AND (
      i.category = v_item.category
      OR LOWER(i.location) = LOWER(v_item.location)
      OR ABS(EXTRACT(DAY FROM i.date - v_item.date)) <= 7
    )
  ORDER BY similarity_score DESC, i.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- MIGRATION 8: Create Reports and Favorites
-- ============================================================================

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


-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- All tables, functions, views, and policies have been created successfully.
-- Your GFinder database is now ready to use!
-- ============================================================================
