-- Individuelle Schwimm-Trainingsplaene (eigene Plaene + Ausbilder-zugewiesene Plaene)

CREATE TABLE IF NOT EXISTS public.swim_training_plans_custom (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_by_name TEXT NOT NULL DEFAULT '',
  created_by_role TEXT NOT NULL DEFAULT 'azubi',
  assigned_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_user_name TEXT NOT NULL DEFAULT '',
  assigned_user_role TEXT NOT NULL DEFAULT 'azubi',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ausdauer',
  difficulty TEXT NOT NULL DEFAULT 'fokussiert',
  style_id TEXT NOT NULL DEFAULT 'kraul',
  target_distance INTEGER NOT NULL DEFAULT 1000,
  target_time INTEGER NOT NULL DEFAULT 30,
  units_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  xp_reward INTEGER NOT NULL DEFAULT 15,
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.swim_training_plans_custom
  ADD COLUMN IF NOT EXISTS created_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS created_by_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS created_by_role TEXT DEFAULT 'azubi',
  ADD COLUMN IF NOT EXISTS assigned_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS assigned_user_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS assigned_user_role TEXT DEFAULT 'azubi',
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'ausdauer',
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'fokussiert',
  ADD COLUMN IF NOT EXISTS style_id TEXT DEFAULT 'kraul',
  ADD COLUMN IF NOT EXISTS target_distance INTEGER DEFAULT 1000,
  ADD COLUMN IF NOT EXISTS target_time INTEGER DEFAULT 30,
  ADD COLUMN IF NOT EXISTS units_json JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 15,
  ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.swim_training_plans_custom
SET
  created_by_name = COALESCE(created_by_name, ''),
  created_by_role = COALESCE(created_by_role, 'azubi'),
  assigned_user_name = COALESCE(assigned_user_name, ''),
  assigned_user_role = COALESCE(assigned_user_role, 'azubi'),
  category = COALESCE(category, 'ausdauer'),
  difficulty = COALESCE(difficulty, 'fokussiert'),
  style_id = COALESCE(style_id, 'kraul'),
  target_distance = GREATEST(100, COALESCE(target_distance, 1000)),
  target_time = GREATEST(1, COALESCE(target_time, 30)),
  units_json = COALESCE(units_json, '[]'::jsonb),
  xp_reward = GREATEST(1, COALESCE(xp_reward, 15)),
  description = COALESCE(description, ''),
  is_active = COALESCE(is_active, TRUE),
  created_at = COALESCE(created_at, NOW())
WHERE
  created_by_name IS NULL
  OR created_by_role IS NULL
  OR assigned_user_name IS NULL
  OR assigned_user_role IS NULL
  OR category IS NULL
  OR difficulty IS NULL
  OR style_id IS NULL
  OR target_distance IS NULL
  OR target_time IS NULL
  OR units_json IS NULL
  OR xp_reward IS NULL
  OR description IS NULL
  OR is_active IS NULL
  OR created_at IS NULL;

UPDATE public.swim_training_plans_custom
SET units_json = jsonb_build_array(
  jsonb_build_object(
    'id', 'unit_1',
    'style_id', style_id,
    'target_distance', target_distance,
    'target_time', target_time
  )
)
WHERE units_json IS NULL
  OR jsonb_typeof(units_json) <> 'array';

UPDATE public.swim_training_plans_custom
SET units_json = jsonb_build_array(
  jsonb_build_object(
    'id', 'unit_1',
    'style_id', style_id,
    'target_distance', target_distance,
    'target_time', target_time
  )
)
WHERE jsonb_typeof(units_json) = 'array'
  AND jsonb_array_length(units_json) = 0;

ALTER TABLE public.swim_training_plans_custom
  ALTER COLUMN created_by_name SET NOT NULL,
  ALTER COLUMN created_by_name SET DEFAULT '',
  ALTER COLUMN created_by_role SET NOT NULL,
  ALTER COLUMN created_by_role SET DEFAULT 'azubi',
  ALTER COLUMN assigned_user_name SET NOT NULL,
  ALTER COLUMN assigned_user_name SET DEFAULT '',
  ALTER COLUMN assigned_user_role SET NOT NULL,
  ALTER COLUMN assigned_user_role SET DEFAULT 'azubi',
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN category SET DEFAULT 'ausdauer',
  ALTER COLUMN difficulty SET NOT NULL,
  ALTER COLUMN difficulty SET DEFAULT 'fokussiert',
  ALTER COLUMN style_id SET NOT NULL,
  ALTER COLUMN style_id SET DEFAULT 'kraul',
  ALTER COLUMN target_distance SET NOT NULL,
  ALTER COLUMN target_distance SET DEFAULT 1000,
  ALTER COLUMN target_time SET NOT NULL,
  ALTER COLUMN target_time SET DEFAULT 30,
  ALTER COLUMN units_json SET NOT NULL,
  ALTER COLUMN units_json SET DEFAULT '[]'::jsonb,
  ALTER COLUMN xp_reward SET NOT NULL,
  ALTER COLUMN xp_reward SET DEFAULT 15,
  ALTER COLUMN description SET DEFAULT '',
  ALTER COLUMN is_active SET NOT NULL,
  ALTER COLUMN is_active SET DEFAULT TRUE,
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_category_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_category_check
      CHECK (category IN ('ausdauer', 'sprint', 'technik', 'kombi'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_units_json_array_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_units_json_array_check
      CHECK (jsonb_typeof(units_json) = 'array');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_difficulty_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_difficulty_check
      CHECK (difficulty IN ('angenehm', 'fokussiert', 'anspruchsvoll'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_target_distance_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_target_distance_check
      CHECK (target_distance >= 100);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_target_time_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_target_time_check
      CHECK (target_time >= 1);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'swim_training_plans_custom_xp_reward_check'
      AND conrelid = 'public.swim_training_plans_custom'::regclass
  ) THEN
    ALTER TABLE public.swim_training_plans_custom
      ADD CONSTRAINT swim_training_plans_custom_xp_reward_check
      CHECK (xp_reward >= 1);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_swim_training_plans_custom_created_by
  ON public.swim_training_plans_custom(created_by_user_id);

CREATE INDEX IF NOT EXISTS idx_swim_training_plans_custom_assigned_user
  ON public.swim_training_plans_custom(assigned_user_id);

CREATE INDEX IF NOT EXISTS idx_swim_training_plans_custom_active
  ON public.swim_training_plans_custom(is_active);

ALTER TABLE public.swim_training_plans_custom ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Swim custom plans readable for authenticated" ON public.swim_training_plans_custom;
CREATE POLICY "Swim custom plans readable for authenticated"
  ON public.swim_training_plans_custom FOR SELECT
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Swim custom plans insert own creator" ON public.swim_training_plans_custom;
CREATE POLICY "Swim custom plans insert own creator"
  ON public.swim_training_plans_custom FOR INSERT
  WITH CHECK (auth.uid() = created_by_user_id);

DROP POLICY IF EXISTS "Swim custom plans update creator or trainer admin" ON public.swim_training_plans_custom;
CREATE POLICY "Swim custom plans update creator or trainer admin"
  ON public.swim_training_plans_custom FOR UPDATE
  USING (
    auth.uid() = created_by_user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'trainer', 'ausbilder')
    )
  )
  WITH CHECK (
    auth.uid() = created_by_user_id
    OR EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'trainer', 'ausbilder')
    )
  );
