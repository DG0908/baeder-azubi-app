-- ============================================================
-- FORUM: Posts & Replies
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'azubi',
  user_avatar TEXT,
  category TEXT NOT NULL CHECK (category IN ('wuensche', 'ausbilder', 'azubi', 'nuetzliches', 'updates')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  locked BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON public.forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user ON public.forum_posts(user_id);

ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Alle können lesen (Kategorie-Filter passiert in der App)
CREATE POLICY "forum_posts_select" ON public.forum_posts FOR SELECT USING (true);

-- Eingeloggte User können posten
CREATE POLICY "forum_posts_insert" ON public.forum_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Eigene Posts bearbeiten oder Admin/Owner
CREATE POLICY "forum_posts_update" ON public.forum_posts FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_owner()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Eigene Posts löschen oder Admin/Owner
CREATE POLICY "forum_posts_delete" ON public.forum_posts FOR DELETE
  USING (
    auth.uid() = user_id
    OR public.is_owner()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ============================================================
-- REPLIES
-- ============================================================

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'azubi',
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_replies_post ON public.forum_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_created ON public.forum_replies(created_at);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_replies_select" ON public.forum_replies FOR SELECT USING (true);

CREATE POLICY "forum_replies_insert" ON public.forum_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "forum_replies_update" ON public.forum_replies FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_owner()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "forum_replies_delete" ON public.forum_replies FOR DELETE
  USING (
    auth.uid() = user_id
    OR public.is_owner()
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ============================================================
-- Trigger: reply_count und last_reply_at automatisch updaten
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_forum_post_reply_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.forum_posts
    SET reply_count = reply_count + 1,
        last_reply_at = NEW.created_at
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.forum_posts
    SET reply_count = GREATEST(reply_count - 1, 0),
        last_reply_at = (
          SELECT MAX(created_at) FROM public.forum_replies WHERE post_id = OLD.post_id
        )
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_forum_reply_stats
  AFTER INSERT OR DELETE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_forum_post_reply_stats();
