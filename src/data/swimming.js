// ==================== SCHWIMMCHALLENGE SYSTEM ====================

export const SWIM_STYLES = [
  { id: 'kraul', name: 'Kraul/Freistil', icon: '🏊' },
  { id: 'brust', name: 'Brustschwimmen', icon: '🏊‍♂️' },
  { id: 'ruecken', name: 'Rückenschwimmen', icon: '🔙' },
  { id: 'schmetterling', name: 'Schmetterling', icon: '🦋' },
  { id: 'lagen', name: 'Lagenschwimmen', icon: '🔄' },
];

export const SWIM_CHALLENGES = [
  // Distanz-Challenges
  { id: 'kanal', name: 'Ärmelkanal', description: '34 km schwimmen - wie der echte Ärmelkanal!', type: 'distance', target: 34000, unit: 'm', icon: '🌊', points: 500, category: 'distanz' },
  { id: 'bodensee', name: 'Bodensee-Querung', description: '14 km Gesamtdistanz', type: 'distance', target: 14000, unit: 'm', icon: '🏔️', points: 250, category: 'distanz' },
  { id: '10k_club', name: '10km Club', description: '10 km Gesamtdistanz schwimmen', type: 'distance', target: 10000, unit: 'm', icon: '🎯', points: 150, category: 'distanz' },
  { id: 'marathon', name: 'Schwimm-Marathon', description: '42.195 m - die Marathon-Distanz im Wasser', type: 'distance', target: 42195, unit: 'm', icon: '🏅', points: 600, category: 'distanz' },

  // Sprint-Challenges (Zeitangaben in Minuten, passend zum Eingabefeld)
  { id: 'sprint_50', name: '50m Sprint', description: '50m in maximal 1 Minute', type: 'time', target: 1, distance: 50, unit: 'min', icon: '⚡', points: 100, category: 'sprint' },
  { id: 'sprint_100', name: '100m Blitz', description: '100m in maximal 2 Minuten', type: 'time', target: 2, distance: 100, unit: 'min', icon: '💨', points: 150, category: 'sprint' },
  { id: 'sprint_200', name: '200m Power', description: '200m in maximal 4 Minuten', type: 'time', target: 4, distance: 200, unit: 'min', icon: '🔥', points: 200, category: 'sprint' },

  // Ausdauer-Challenges
  { id: 'nonstop_1000', name: '1000m Non-Stop', description: '1000m am Stück ohne Pause', type: 'single_distance', target: 1000, unit: 'm', icon: '💪', points: 120, category: 'ausdauer' },
  { id: 'nonstop_2000', name: '2000m Ausdauer', description: '2000m am Stück durchschwimmen', type: 'single_distance', target: 2000, unit: 'm', icon: '🦾', points: 200, category: 'ausdauer' },
  { id: '30min', name: '30 Minuten Non-Stop', description: '30 Minuten durchgehend schwimmen', type: 'duration', target: 30, unit: 'min', icon: '⏱️', points: 100, category: 'ausdauer' },
  { id: '60min', name: 'Stunden-Schwimmer', description: '60 Minuten am Stück schwimmen', type: 'duration', target: 60, unit: 'min', icon: '🕐', points: 180, category: 'ausdauer' },

  // Regelmäßigkeits-Challenges
  { id: 'streak_7', name: '7-Tage-Streak', description: '7 Tage hintereinander schwimmen', type: 'streak', target: 7, unit: 'Tage', icon: '📆', points: 100, category: 'regelmaessigkeit' },
  { id: 'streak_30', name: 'Monats-Streak', description: '30 Tage hintereinander schwimmen', type: 'streak', target: 30, unit: 'Tage', icon: '📅', points: 400, category: 'regelmaessigkeit' },
  { id: 'sessions_12', name: 'Fleißiger Schwimmer', description: '12 Trainingseinheiten im Monat', type: 'sessions', target: 12, unit: 'Einheiten', icon: '🗓️', points: 150, category: 'regelmaessigkeit' },

  // Technik-Challenges
  { id: 'alle_stile', name: 'Allrounder', description: 'Alle 4 Schwimmstile mindestens einmal schwimmen', type: 'styles_single', target: 4, unit: 'Stile', icon: '🌟', points: 80, category: 'technik' },
  { id: 'lagen_400', name: 'Lagen-Meister', description: '400m Lagenschwimmen (100m pro Stil)', type: 'single_distance', target: 400, style: 'lagen', unit: 'm', icon: '🏆', points: 150, category: 'technik' },
];


export const SWIM_TRAINING_PLANS = [
  // ==================== AUSDAUER (5) ====================
  {
    id: 'plan_ausdauer_01',
    name: 'Ausdauer Start',
    category: 'ausdauer',
    difficulty: 'angenehm',
    styleId: 'brust',
    targetDistance: 1000,
    targetTime: 35,
    xpReward: 12,
    description: 'Ruhiger Einstieg mit sauberem Tempo und gleichmaessiger Atmung.'
  },
  {
    id: 'plan_ausdauer_02',
    name: 'Grundlage Plus',
    category: 'ausdauer',
    difficulty: 'angenehm',
    styleId: 'kraul',
    targetDistance: 1400,
    targetTime: 42,
    xpReward: 14,
    description: 'Konstante Strecke im lockeren bis mittleren Intensitaetsbereich.'
  },
  {
    id: 'plan_ausdauer_03',
    name: 'Rhythmus 2k',
    category: 'ausdauer',
    difficulty: 'fokussiert',
    styleId: 'kraul',
    targetDistance: 2000,
    targetTime: 56,
    xpReward: 18,
    description: 'Stabiler Rhythmus ueber laengere Distanz mit Technikfokus.'
  },
  {
    id: 'plan_ausdauer_04',
    name: 'Langstrecke Basis',
    category: 'ausdauer',
    difficulty: 'fokussiert',
    styleId: 'brust',
    targetDistance: 2400,
    targetTime: 68,
    xpReward: 20,
    description: 'Laengeres Grundlagentraining fuer Becken-Routine und Ausdauer.'
  },
  {
    id: 'plan_ausdauer_05',
    name: 'Ausdauer Peak',
    category: 'ausdauer',
    difficulty: 'anspruchsvoll',
    styleId: 'kraul',
    targetDistance: 3000,
    targetTime: 80,
    xpReward: 26,
    description: 'Fordernde Einheit fuer starke Grundlagenausdauer.'
  },

  // ==================== SPRINT (5) ====================
  {
    id: 'plan_sprint_01',
    name: 'Sprint Technik Start',
    category: 'sprint',
    difficulty: 'angenehm',
    styleId: 'kraul',
    targetDistance: 500,
    targetTime: 13,
    xpReward: 12,
    description: 'Kurze schnelle Abschnitte mit Fokus auf Wasserlage und Zug.'
  },
  {
    id: 'plan_sprint_02',
    name: '50er Serie',
    category: 'sprint',
    difficulty: 'angenehm',
    styleId: 'kraul',
    targetDistance: 700,
    targetTime: 17,
    xpReward: 14,
    description: 'Wiederholte Sprints mit kontrollierter Erholung.'
  },
  {
    id: 'plan_sprint_03',
    name: 'Explosiv 900',
    category: 'sprint',
    difficulty: 'fokussiert',
    styleId: 'kraul',
    targetDistance: 900,
    targetTime: 20,
    xpReward: 18,
    description: 'Intensiver Mix fuer Starts, Wenden und Endbeschleunigung.'
  },
  {
    id: 'plan_sprint_04',
    name: 'Race Pace',
    category: 'sprint',
    difficulty: 'fokussiert',
    styleId: 'kraul',
    targetDistance: 1100,
    targetTime: 24,
    xpReward: 21,
    description: 'Hohe Geschwindigkeit mit kurzen Entlastungsphasen.'
  },
  {
    id: 'plan_sprint_05',
    name: 'Sprint Maximum',
    category: 'sprint',
    difficulty: 'anspruchsvoll',
    styleId: 'kraul',
    targetDistance: 1300,
    targetTime: 27,
    xpReward: 28,
    description: 'Sehr intensive Serien fuer Tempohaerte und Renndruck.'
  },

  // ==================== TECHNIK (5) ====================
  {
    id: 'plan_technik_01',
    name: 'Kraul Sauberkeit',
    category: 'technik',
    difficulty: 'angenehm',
    styleId: 'kraul',
    targetDistance: 900,
    targetTime: 30,
    xpReward: 13,
    description: 'Techniktempo mit Fokus auf Zugweg und Atmungsrhythmus.'
  },
  {
    id: 'plan_technik_02',
    name: 'Brust Linie',
    category: 'technik',
    difficulty: 'angenehm',
    styleId: 'brust',
    targetDistance: 900,
    targetTime: 32,
    xpReward: 13,
    description: 'Beinschlag und Gleitphase sauber koordinieren.'
  },
  {
    id: 'plan_technik_03',
    name: 'Ruecken Kontrolle',
    category: 'technik',
    difficulty: 'fokussiert',
    styleId: 'ruecken',
    targetDistance: 1000,
    targetTime: 33,
    xpReward: 18,
    description: 'Koerperspannung und Armzug fuer stabile Wasserlage.'
  },
  {
    id: 'plan_technik_04',
    name: 'Schmetterling Basis',
    category: 'technik',
    difficulty: 'fokussiert',
    styleId: 'schmetterling',
    targetDistance: 600,
    targetTime: 24,
    xpReward: 22,
    description: 'Delphinbewegung, Timing und gleichmaessige Wellenarbeit.'
  },
  {
    id: 'plan_technik_05',
    name: 'Technik Master',
    category: 'technik',
    difficulty: 'anspruchsvoll',
    styleId: 'lagen',
    targetDistance: 1400,
    targetTime: 42,
    xpReward: 28,
    description: 'Lagenfokus fuer Stilwechsel, Technikuebergaenge und Kontrolle.'
  },

  // ==================== KOMBI (5) ====================
  {
    id: 'plan_kombi_01',
    name: 'Kombi Einstieg',
    category: 'kombi',
    difficulty: 'angenehm',
    styleId: 'lagen',
    targetDistance: 1000,
    targetTime: 31,
    xpReward: 15,
    description: 'Ausdauer + Technik in einer runden Lageneinheit.'
  },
  {
    id: 'plan_kombi_02',
    name: 'Kombi Aufbau',
    category: 'kombi',
    difficulty: 'angenehm',
    styleId: 'lagen',
    targetDistance: 1400,
    targetTime: 40,
    xpReward: 17,
    description: 'Mehr Umfang mit sauberem Stilwechsel.'
  },
  {
    id: 'plan_kombi_03',
    name: 'Kombi Tempo',
    category: 'kombi',
    difficulty: 'fokussiert',
    styleId: 'lagen',
    targetDistance: 1800,
    targetTime: 49,
    xpReward: 21,
    description: 'Mittelstrecke mit Technikdruck und Tempowechsel.'
  },
  {
    id: 'plan_kombi_04',
    name: 'Kombi Wettkampf',
    category: 'kombi',
    difficulty: 'fokussiert',
    styleId: 'lagen',
    targetDistance: 2200,
    targetTime: 58,
    xpReward: 24,
    description: 'Hoher Umfang mit Wettkampfcharakter.'
  },
  {
    id: 'plan_kombi_05',
    name: 'Kombi Elite',
    category: 'kombi',
    difficulty: 'anspruchsvoll',
    styleId: 'lagen',
    targetDistance: 2600,
    targetTime: 68,
    xpReward: 32,
    description: 'Komplette Belastung fuer Ausdauer, Technik und Tempo.'
  }
];

export const SWIM_LEVELS = [
  { level: 1, name: 'Bronze-Schwimmer', minPoints: 0, icon: '🥉', color: 'from-amber-600 to-amber-700' },
  { level: 2, name: 'Silber-Schwimmer', minPoints: 500, icon: '🥈', color: 'from-gray-400 to-gray-500' },
  { level: 3, name: 'Gold-Schwimmer', minPoints: 1500, icon: '🥇', color: 'from-yellow-400 to-yellow-500' },
  { level: 4, name: 'Platin-Schwimmer', minPoints: 3500, icon: '💎', color: 'from-cyan-400 to-blue-500' },
  { level: 5, name: 'Diamant-Schwimmer', minPoints: 7000, icon: '💠', color: 'from-purple-400 to-pink-500' },
  { level: 6, name: 'Legende', minPoints: 15000, icon: '👑', color: 'from-amber-400 to-red-500' },
];

export const SWIM_BADGES = [
  { id: 'swim_first_km', name: 'Erster Kilometer', description: '1 km Gesamtdistanz erreicht', icon: '🏊', category: 'swim', requirement: { type: 'total_distance', value: 1000 } },
  { id: 'swim_five_km', name: '5km Meilenstein', description: '5 km Gesamtdistanz erreicht', icon: '🌊', category: 'swim', requirement: { type: 'total_distance', value: 5000 } },
  { id: 'swim_ten_km', name: '10km Club', description: '10 km Gesamtdistanz erreicht', icon: '🎯', category: 'swim', requirement: { type: 'total_distance', value: 10000 } },
  { id: 'swim_marathon', name: 'Marathon-Schwimmer', description: '42.195 km Gesamtdistanz', icon: '🏅', category: 'swim', requirement: { type: 'total_distance', value: 42195 } },
  { id: 'swim_first_session', name: 'Erste Bahnen', description: 'Erste Trainingseinheit abgeschlossen', icon: '🎉', category: 'swim', requirement: { type: 'sessions', value: 1 } },
  { id: 'swim_10_sessions', name: 'Regelmäßig dabei', description: '10 Trainingseinheiten absolviert', icon: '📅', category: 'swim', requirement: { type: 'sessions', value: 10 } },
  { id: 'swim_25_sessions', name: 'Ausdauernd', description: '25 Trainingseinheiten absolviert', icon: '💪', category: 'swim', requirement: { type: 'sessions', value: 25 } },
  { id: 'swim_50_sessions', name: 'Schwimm-Veteran', description: '50 Trainingseinheiten absolviert', icon: '🦈', category: 'swim', requirement: { type: 'sessions', value: 50 } },
  { id: 'swim_1h_training', name: 'Stunden-Schwimmer', description: '1 Stunde Gesamttrainingszeit', icon: '⏱️', category: 'swim', requirement: { type: 'total_time', value: 60 } },
  { id: 'swim_10h_training', name: 'Zehn-Stunden-Held', description: '10 Stunden Gesamttrainingszeit', icon: '⌛', category: 'swim', requirement: { type: 'total_time', value: 600 } },
  { id: 'swim_challenge_first', name: 'Herausforderer', description: 'Erste Challenge abgeschlossen', icon: '🎯', category: 'swim', requirement: { type: 'challenges_completed', value: 1 } },
  { id: 'swim_challenge_5', name: 'Challenge-Jäger', description: '5 Challenges abgeschlossen', icon: '🏆', category: 'swim', requirement: { type: 'challenges_completed', value: 5 } },
  { id: 'swim_challenge_master', name: 'Challenge-Meister', description: '10 Challenges abgeschlossen', icon: '👑', category: 'swim', requirement: { type: 'challenges_completed', value: 10 } },
  { id: 'swim_team_battle', name: 'Team-Kämpfer', description: 'Am Team-Battle teilgenommen', icon: '⚔️', category: 'swim', requirement: { type: 'team_battle_participation', value: 1 } },
];

// Alters-Handicap System (basierend auf sportwissenschaftlichen Daten)
export const getAgeHandicap = (birthDate) => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));

  if (age < 40) return 0;
  if (age < 50) return 0.05; // 5% Zeitbonus
  if (age < 60) return 0.10; // 10% Zeitbonus
  if (age < 70) return 0.15; // 15% Zeitbonus
  return 0.20; // 20% Zeitbonus
};

// Berechnet die gewertete Zeit mit Handicap
export const calculateHandicappedTime = (actualTime, birthDate) => {
  const handicap = getAgeHandicap(birthDate);
  return actualTime * (1 - handicap);
};

// Punkte-Berechnung für Schwimm-Sessions
export const calculateSwimPoints = (sessions, completedChallenges = []) => {
  // Nur bestätigte Sessions zählen
  const confirmedSessions = sessions.filter(s => s.confirmed);

  // Basis-Punkte: 1 Punkt pro 100m geschwommen
  const distancePoints = confirmedSessions.reduce((sum, s) => sum + Math.floor((s.distance || 0) / 100), 0);

  // Bonus-Punkte: 0.5 Punkte pro Minute Trainingszeit
  const timePoints = confirmedSessions.reduce((sum, s) => sum + Math.floor((s.time_minutes || 0) * 0.5), 0);

  // Challenge-Punkte
  const challengePoints = completedChallenges.reduce((sum, challengeId) => {
    const challenge = SWIM_CHALLENGES.find(c => c.id === challengeId);
    return sum + (challenge?.points || 0);
  }, 0);

  return {
    distancePoints,
    timePoints,
    challengePoints,
    total: distancePoints + timePoints + challengePoints
  };
};

// Berechnet den Challenge-Fortschritt basierend auf Sessions
export const calculateChallengeProgress = (challenge, sessions, userId) => {
  const confirmedSessions = sessions.filter(s => s.confirmed && s.user_id === userId);

  switch (challenge.type) {
    case 'distance': {
      // Gesamtdistanz über alle Sessions
      const totalDistance = confirmedSessions.reduce((sum, s) => sum + (s.distance || 0), 0);
      return { current: totalDistance, target: challenge.target, percent: Math.min(100, (totalDistance / challenge.target) * 100) };
    }
    case 'single_distance': {
      // Einzelne Session mit Mindestdistanz
      const qualifying = confirmedSessions.filter(s =>
        (s.distance || 0) >= challenge.target &&
        (!challenge.style || s.style === challenge.style)
      );
      return { current: qualifying.length > 0 ? challenge.target : 0, target: challenge.target, percent: qualifying.length > 0 ? 100 : 0 };
    }
    case 'duration': {
      // Einzelne Session mit Mindestdauer
      const qualifying = confirmedSessions.filter(s => (s.time_minutes || 0) >= challenge.target);
      return { current: qualifying.length > 0 ? challenge.target : 0, target: challenge.target, percent: qualifying.length > 0 ? 100 : 0 };
    }
    case 'time': {
      // Schnellste Session fuer definierte Distanz (je kleiner die Zeit, desto besser)
      const matching = confirmedSessions.filter(s =>
        (s.distance || 0) >= (challenge.distance || 0) &&
        (!challenge.style || s.style === challenge.style)
      );
      if (matching.length === 0) {
        return { current: 0, target: challenge.target, percent: 0 };
      }

      const bestMinutes = matching.reduce((best, s) => {
        const value = Number(s.time_minutes || 0);
        if (!Number.isFinite(value) || value <= 0) return best;
        if (best === null || value < best) return value;
        return best;
      }, null);

      if (bestMinutes === null) {
        return { current: 0, target: challenge.target, percent: 0 };
      }

      const percent = bestMinutes <= challenge.target
        ? 100
        : Math.min(100, (challenge.target / bestMinutes) * 100);

      return { current: bestMinutes, target: challenge.target, percent };
    }
    case 'sessions': {
      // Anzahl Sessions im aktuellen Monat
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthSessions = confirmedSessions.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      return { current: monthSessions.length, target: challenge.target, percent: Math.min(100, (monthSessions.length / challenge.target) * 100) };
    }
    case 'streak': {
      // Berechne längste Streak
      const dates = [...new Set(confirmedSessions.map(s => s.date))].sort();
      let maxStreak = 0, currentStreak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
      maxStreak = Math.max(maxStreak, currentStreak, dates.length > 0 ? 1 : 0);
      return { current: maxStreak, target: challenge.target, percent: Math.min(100, (maxStreak / challenge.target) * 100) };
    }
    case 'styles_single': {
      // Anzahl unterschiedlicher geschwommener Hauptstile
      const trackedStyles = ['kraul', 'brust', 'ruecken', 'schmetterling'];
      const usedStyles = new Set(
        confirmedSessions
          .map(s => s.style)
          .filter(style => trackedStyles.includes(style))
      );
      const current = usedStyles.size;
      return { current, target: challenge.target, percent: Math.min(100, (current / challenge.target) * 100) };
    }
    default:
      return { current: 0, target: challenge.target, percent: 0 };
  }
};

// Ermittelt das aktuelle Schwimm-Level basierend auf Punkten
export const getSwimLevel = (points) => {
  for (let i = SWIM_LEVELS.length - 1; i >= 0; i--) {
    if (points >= SWIM_LEVELS[i].minPoints) {
      return {
        ...SWIM_LEVELS[i],
        nextLevel: SWIM_LEVELS[i + 1] || null,
        pointsToNext: SWIM_LEVELS[i + 1] ? SWIM_LEVELS[i + 1].minPoints - points : 0
      };
    }
  }
  return { ...SWIM_LEVELS[0], nextLevel: SWIM_LEVELS[1], pointsToNext: SWIM_LEVELS[1].minPoints };
};

// Berechnet Team-Battle Statistiken (Azubis vs Trainer/Ausbilder)
// Optional können zusätzliche XP pro User eingebunden werden.
export const calculateTeamBattleStats = (sessions, xpByUserId = {}, users = []) => {
  const confirmedSessions = sessions.filter(s => s.confirmed);

  const createTeamBucket = () => ({
    points: 0,
    swimPoints: 0,
    xpPoints: 0,
    distance: 0,
    time: 0,
    members: {}
  });

  const teams = {
    azubis: createTeamBucket(),
    trainer: createTeamBucket()
  };

  const userDirectory = {};
  users.forEach(user => {
    if (!user?.id) return;
    userDirectory[user.id] = {
      name: user.name || 'Unbekannt',
      role: user.role || 'trainer'
    };
  });

  const ensureMember = (team, userId, userName = 'Unbekannt') => {
    if (!team.members[userId]) {
      team.members[userId] = {
        user_id: userId,
        user_name: userName,
        distance: 0,
        time: 0,
        sessions: 0,
        swimPoints: 0,
        xp: 0,
        points: 0
      };
    }
    return team.members[userId];
  };

  confirmedSessions.forEach(session => {
    const userId = session.user_id;
    const role = session.user_role || userDirectory[userId]?.role || 'trainer';
    const isAzubi = role === 'azubi';
    const team = isAzubi ? teams.azubis : teams.trainer;
    const member = ensureMember(
      team,
      userId,
      session.user_name || userDirectory[userId]?.name || 'Unbekannt'
    );

    const distance = session.distance || 0;
    const time = session.time_minutes || 0;

    // Swim-Punkte: 1 pro 100m + 0.5 pro Minute
    const sessionPoints = Math.floor(distance / 100) + Math.floor(time * 0.5);

    member.distance += distance;
    member.time += time;
    member.sessions += 1;
    member.swimPoints += sessionPoints;
    member.points += sessionPoints;

    team.distance += distance;
    team.time += time;
    team.swimPoints += sessionPoints;
  });

  // Ergänze optionale XP-Punkte pro User (z.B. Lernen/Quiz/Prüfung)
  Object.entries(xpByUserId || {}).forEach(([userId, rawXp]) => {
    const xp = Math.max(0, Number(rawXp) || 0);
    if (xp <= 0) return;

    const roleFromUsers = userDirectory[userId]?.role || null;
    const role = roleFromUsers
      || (teams.azubis.members[userId] ? 'azubi' : teams.trainer.members[userId] ? 'trainer' : null);

    if (!role) return;

    const team = role === 'azubi' ? teams.azubis : teams.trainer;
    const member = ensureMember(
      team,
      userId,
      userDirectory[userId]?.name || team.members[userId]?.user_name || 'Unbekannt'
    );

    member.xp = xp;
    member.points = member.swimPoints + member.xp;
    team.xpPoints += xp;
  });

  teams.azubis.points = teams.azubis.swimPoints + teams.azubis.xpPoints;
  teams.trainer.points = teams.trainer.swimPoints + teams.trainer.xpPoints;

  // Konvertiere members zu Arrays und sortiere nach Gesamtpunkten
  teams.azubis.memberList = Object.values(teams.azubis.members).sort((a, b) => b.points - a.points);
  teams.trainer.memberList = Object.values(teams.trainer.members).sort((a, b) => b.points - a.points);

  // Berechne Prozentsätze
  const totalPoints = teams.azubis.points + teams.trainer.points;
  teams.azubis.percent = totalPoints > 0 ? (teams.azubis.points / totalPoints) * 100 : 50;
  teams.trainer.percent = totalPoints > 0 ? (teams.trainer.points / totalPoints) * 100 : 50;

  return teams;
};
