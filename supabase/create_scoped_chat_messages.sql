-- =====================================================
-- Scoped chat messages for organizations
-- Supports:
-- 1. Azubi room (same organization, azubis only)
-- 2. Staff room (same organization, azubis + trainer/ausbilder/admin)
-- 3. Direct chat between azubi and staff in same organization
-- =====================================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  user_avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS user_role TEXT,
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS chat_scope TEXT DEFAULT 'staff_room',
  ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'messages_chat_scope_check'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_chat_scope_check
      CHECK (chat_scope IN ('azubi_room', 'staff_room', 'direct_staff'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);
CREATE INDEX IF NOT EXISTS idx_messages_organization_scope_created
  ON public.messages (organization_id, chat_scope, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages (recipient_id);

-- Best-effort backfill for legacy chat messages.
WITH profile_match AS (
  SELECT
    m.id AS message_id,
    p.id AS profile_id,
    p.role,
    p.organization_id,
    p.avatar,
    ROW_NUMBER() OVER (
      PARTITION BY m.id
      ORDER BY p.created_at ASC NULLS LAST, p.id ASC
    ) AS rn
  FROM public.messages m
  JOIN public.profiles p
    ON LOWER(TRIM(p.name)) = LOWER(TRIM(m.user_name))
  WHERE m.sender_id IS NULL
)
UPDATE public.messages AS m
SET
  sender_id = profile_match.profile_id,
  user_role = COALESCE(m.user_role, profile_match.role),
  organization_id = COALESCE(m.organization_id, profile_match.organization_id),
  chat_scope = COALESCE(
    NULLIF(TRIM(m.chat_scope), ''),
    CASE
      WHEN profile_match.role = 'azubi' THEN 'azubi_room'
      ELSE 'staff_room'
    END
  ),
  user_avatar = COALESCE(m.user_avatar, profile_match.avatar)
FROM profile_match
WHERE m.id = profile_match.message_id
  AND profile_match.rn = 1;

CREATE OR REPLACE FUNCTION public.prepare_chat_message()
RETURNS TRIGGER AS $$
DECLARE
  sender_profile RECORD;
  recipient_profile RECORD;
BEGIN
  SELECT id, name, role, avatar, organization_id
  INTO sender_profile
  FROM public.profiles
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Sender profile not found for chat message';
  END IF;

  NEW.sender_id := sender_profile.id;
  NEW.user_name := sender_profile.name;
  NEW.user_role := sender_profile.role;
  NEW.user_avatar := sender_profile.avatar;
  NEW.organization_id := sender_profile.organization_id;
  NEW.chat_scope := COALESCE(NULLIF(TRIM(NEW.chat_scope), ''), 'staff_room');

  IF NEW.chat_scope <> 'direct_staff' THEN
    NEW.recipient_id := NULL;
    RETURN NEW;
  END IF;

  IF NEW.recipient_id IS NULL THEN
    RAISE EXCEPTION 'Direct chat messages require a recipient';
  END IF;

  SELECT id, role, organization_id
  INTO recipient_profile
  FROM public.profiles
  WHERE id = NEW.recipient_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recipient profile not found for chat message';
  END IF;

  IF recipient_profile.organization_id IS DISTINCT FROM sender_profile.organization_id THEN
    RAISE EXCEPTION 'Direct chat is only allowed inside the same organization';
  END IF;

  IF NOT (
    (sender_profile.role = 'azubi' AND recipient_profile.role IN ('trainer', 'ausbilder', 'admin'))
    OR
    (sender_profile.role IN ('trainer', 'ausbilder', 'admin') AND recipient_profile.role = 'azubi')
  ) THEN
    RAISE EXCEPTION 'Direct chat is only allowed between azubis and staff';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prepare_chat_message ON public.messages;
CREATE TRIGGER trg_prepare_chat_message
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.prepare_chat_message();

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages sind für alle sichtbar" ON public.messages;
DROP POLICY IF EXISTS "Jeder kann Messages erstellen" ON public.messages;
DROP POLICY IF EXISTS "Scoped messages select" ON public.messages;
DROP POLICY IF EXISTS "Scoped messages insert" ON public.messages;

CREATE POLICY "Scoped messages select"
  ON public.messages FOR SELECT
  USING (
    public.is_owner()
    OR (
      organization_id = public.get_my_org_id()
      AND (
        (chat_scope = 'azubi_room' AND public.get_user_role() = 'azubi')
        OR
        (chat_scope = 'staff_room' AND public.get_user_role() IN ('azubi', 'trainer', 'ausbilder', 'admin'))
        OR
        (chat_scope = 'direct_staff' AND (sender_id = auth.uid() OR recipient_id = auth.uid()))
      )
    )
  );

CREATE POLICY "Scoped messages insert"
  ON public.messages FOR INSERT
  WITH CHECK (
    public.is_owner()
    OR (
      sender_id = auth.uid()
      AND organization_id = public.get_my_org_id()
      AND (
        (chat_scope = 'azubi_room' AND recipient_id IS NULL AND public.get_user_role() = 'azubi')
        OR
        (chat_scope = 'staff_room' AND recipient_id IS NULL AND public.get_user_role() IN ('azubi', 'trainer', 'ausbilder', 'admin'))
        OR
        (
          chat_scope = 'direct_staff'
          AND recipient_id IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM public.profiles recipient
            WHERE recipient.id = recipient_id
              AND recipient.organization_id = public.get_my_org_id()
              AND (
                (public.get_user_role() = 'azubi' AND recipient.role IN ('trainer', 'ausbilder', 'admin'))
                OR
                (public.get_user_role() IN ('trainer', 'ausbilder', 'admin') AND recipient.role = 'azubi')
              )
          )
        )
      )
    )
  );
