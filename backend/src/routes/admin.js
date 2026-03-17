const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const requiredEnvKeys = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const getEnv = () => {
  const values = {
    supabaseUrl: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  };

  const missing = requiredEnvKeys.filter((key) => !String(process.env[key] || '').trim());
  return { ...values, missing };
};

const normalizePlayerName = (value) => String(value || '').trim().toLowerCase();

const toSafeInt = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

const isFinishedGameStatus = (status) => {
  const normalized = normalizePlayerName(status);
  return normalized === 'finished' || normalized === 'completed' || normalized === 'done';
};

const mergeOpponentStatsByMax = (storedOpponentsInput, syncedOpponentsInput) => {
  const storedOpponents = (storedOpponentsInput && typeof storedOpponentsInput === 'object')
    ? storedOpponentsInput
    : {};
  const syncedOpponents = (syncedOpponentsInput && typeof syncedOpponentsInput === 'object')
    ? syncedOpponentsInput
    : {};
  const merged = { ...storedOpponents };

  Object.entries(syncedOpponents).forEach(([opponentName, syncedValues]) => {
    const storedValues = merged[opponentName] || {};
    merged[opponentName] = {
      wins: Math.max(toSafeInt(storedValues.wins), toSafeInt(syncedValues?.wins)),
      losses: Math.max(toSafeInt(storedValues.losses), toSafeInt(syncedValues?.losses)),
      draws: Math.max(toSafeInt(storedValues.draws), toSafeInt(syncedValues?.draws))
    };
  });

  return merged;
};

const fetchAllRows = async (queryFactory, pageSize = 1000) => {
  const rows = [];
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await queryFactory(from, to);
    if (error) throw error;

    const batch = Array.isArray(data) ? data : [];
    rows.push(...batch);
    if (batch.length < pageSize) break;
    from += pageSize;
  }

  return rows;
};

const ensureComputedStats = (statsByUserId, userId, userName) => {
  if (!statsByUserId[userId]) {
    statsByUserId[userId] = {
      userId,
      userName,
      wins: 0,
      losses: 0,
      draws: 0,
      opponents: {}
    };
  }
  return statsByUserId[userId];
};

router.post('/repair-quiz-stats', async (req, res) => {
  const env = getEnv();
  if (env.missing.length > 0) {
    return res.status(500).json({
      error: 'Missing required environment variables.',
      missing: env.missing
    });
  }

  const authHeader = req.get('authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header.' });
  }

  try {
    const authClient = createClient(env.supabaseUrl, env.anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: authData, error: authError } = await authClient.auth.getUser();
    if (authError || !authData?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    const adminClient = createClient(env.supabaseUrl, env.serviceRoleKey);
    const { data: callerProfile, error: callerProfileError } = await adminClient
      .from('profiles')
      .select('id, role, approved')
      .eq('id', authData.user.id)
      .single();

    if (callerProfileError || !callerProfile) {
      console.error('Admin profile lookup failed:', callerProfileError);
      return res.status(403).json({ error: 'Admin profile not found.' });
    }

    const isAdmin = callerProfile.role === 'admin';
    if (!callerProfile.approved || !isAdmin) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    const [profiles, existingStatsRows, finishedGames] = await Promise.all([
      fetchAllRows((from, to) => adminClient
        .from('profiles')
        .select('id, name, role, approved')
        .order('id', { ascending: true })
        .range(from, to)),
      fetchAllRows((from, to) => adminClient
        .from('user_stats')
        .select('user_id, wins, losses, draws, opponents, category_stats')
        .order('user_id', { ascending: true })
        .range(from, to)),
      fetchAllRows((from, to) => adminClient
        .from('games')
        .select('id, player1, player2, player1_score, player2_score, status, winner')
        .in('status', ['finished', 'completed', 'done'])
        .order('created_at', { ascending: true })
        .range(from, to))
    ]);

    const profileByNormalizedName = new Map();
    const duplicateNames = new Set();
    profiles.forEach((profile) => {
      const normalizedName = normalizePlayerName(profile.name);
      if (!normalizedName) return;
      if (profileByNormalizedName.has(normalizedName)) {
        duplicateNames.add(normalizedName);
      } else {
        profileByNormalizedName.set(normalizedName, profile);
      }
    });
    duplicateNames.forEach((normalizedName) => profileByNormalizedName.delete(normalizedName));

    const existingStatsByUserId = new Map(existingStatsRows.map((row) => [row.user_id, row]));
    const computedStatsByUserId = {};
    let skippedGamesMissingProfiles = 0;

    finishedGames.forEach((game) => {
      if (!isFinishedGameStatus(game?.status)) return;

      const player1Profile = profileByNormalizedName.get(normalizePlayerName(game.player1));
      const player2Profile = profileByNormalizedName.get(normalizePlayerName(game.player2));
      if (!player1Profile || !player2Profile) {
        skippedGamesMissingProfiles += 1;
        return;
      }

      const player1Stats = ensureComputedStats(computedStatsByUserId, player1Profile.id, player1Profile.name);
      const player2Stats = ensureComputedStats(computedStatsByUserId, player2Profile.id, player2Profile.name);

      if (!player1Stats.opponents[game.player2]) {
        player1Stats.opponents[game.player2] = { wins: 0, losses: 0, draws: 0 };
      }
      if (!player2Stats.opponents[game.player1]) {
        player2Stats.opponents[game.player1] = { wins: 0, losses: 0, draws: 0 };
      }

      let winner = game.winner || null;
      if (!winner && game.player1_score > game.player2_score) winner = game.player1;
      else if (!winner && game.player2_score > game.player1_score) winner = game.player2;

      const normalizedWinner = normalizePlayerName(winner);
      if (normalizedWinner === normalizePlayerName(game.player1)) {
        player1Stats.wins += 1;
        player2Stats.losses += 1;
        player1Stats.opponents[game.player2].wins += 1;
        player2Stats.opponents[game.player1].losses += 1;
      } else if (normalizedWinner === normalizePlayerName(game.player2)) {
        player2Stats.wins += 1;
        player1Stats.losses += 1;
        player2Stats.opponents[game.player1].wins += 1;
        player1Stats.opponents[game.player2].losses += 1;
      } else {
        player1Stats.draws += 1;
        player2Stats.draws += 1;
        player1Stats.opponents[game.player2].draws += 1;
        player2Stats.opponents[game.player1].draws += 1;
      }
    });

    const updates = [];
    const updatedPreview = [];

    profiles.forEach((profile) => {
      const existingRow = existingStatsByUserId.get(profile.id) || null;
      const syncedStats = computedStatsByUserId[profile.id] || {
        wins: 0,
        losses: 0,
        draws: 0,
        opponents: {}
      };

      const existingWins = toSafeInt(existingRow?.wins);
      const existingLosses = toSafeInt(existingRow?.losses);
      const existingDraws = toSafeInt(existingRow?.draws);
      const nextWins = Math.max(existingWins, toSafeInt(syncedStats.wins));
      const nextLosses = Math.max(existingLosses, toSafeInt(syncedStats.losses));
      const nextDraws = Math.max(existingDraws, toSafeInt(syncedStats.draws));
      const nextOpponents = mergeOpponentStatsByMax(existingRow?.opponents, syncedStats.opponents);

      const totalsChanged =
        nextWins !== existingWins
        || nextLosses !== existingLosses
        || nextDraws !== existingDraws;
      const opponentsChanged = JSON.stringify(existingRow?.opponents || {}) !== JSON.stringify(nextOpponents);

      if (!existingRow && nextWins === 0 && nextLosses === 0 && nextDraws === 0 && Object.keys(nextOpponents).length === 0) {
        return;
      }

      if (existingRow && !totalsChanged && !opponentsChanged) {
        return;
      }

      updates.push({
        user_id: profile.id,
        wins: nextWins,
        losses: nextLosses,
        draws: nextDraws,
        opponents: nextOpponents,
        category_stats: (existingRow?.category_stats && typeof existingRow.category_stats === 'object')
          ? existingRow.category_stats
          : {}
      });

      if (updatedPreview.length < 10) {
        updatedPreview.push({
          name: profile.name,
          wins: nextWins,
          losses: nextLosses,
          draws: nextDraws
        });
      }
    });

    for (let index = 0; index < updates.length; index += 200) {
      const chunk = updates.slice(index, index + 200);
      const { error: upsertError } = await adminClient
        .from('user_stats')
        .upsert(chunk, { onConflict: 'user_id' });

      if (upsertError) {
        console.error('Quiz stats repair upsert failed:', upsertError);
        return res.status(500).json({ error: 'Failed updating user_stats.' });
      }
    }

    return res.json({
      ok: true,
      scannedProfiles: profiles.length,
      scannedFinishedGames: finishedGames.length,
      updatedUsers: updates.length,
      unchangedUsers: Math.max(0, profiles.length - updates.length),
      skippedGamesMissingProfiles,
      ambiguousNames: duplicateNames.size,
      updatedPreview
    });
  } catch (error) {
    console.error('Admin repair route error:', error);
    return res.status(500).json({ error: 'Quiz stats repair failed.' });
  }
});

module.exports = router;
