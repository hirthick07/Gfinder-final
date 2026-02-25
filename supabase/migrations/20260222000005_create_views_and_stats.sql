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
