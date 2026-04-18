import { useEffect, useState } from 'react';
import { DAILY_WISDOM, DID_YOU_KNOW_FACTS } from '../data/content';

const GENERAL_KNOWLEDGE_STORAGE_KEY = 'general_knowledge_rotation_v1';

const getTodayStamp = (input = Date.now()) => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const getGeneralKnowledgePool = () => {
  const merged = [...DAILY_WISDOM, ...DID_YOU_KNOW_FACTS];
  const unique = [];
  const seen = new Set();
  merged.forEach((entry) => {
    const text = String(entry || '').trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    unique.push(text);
  });
  return unique;
};

const pickRandomGeneralKnowledge = (excludeText = '') => {
  const pool = getGeneralKnowledgePool();
  if (pool.length === 0) return '';
  const filtered = excludeText ? pool.filter((t) => t !== excludeText) : pool;
  const source = filtered.length > 0 ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
};

export function useDailyWisdom({ user, showToast }) {
  const [dailyWisdom, setDailyWisdom] = useState('');

  const applyGeneralKnowledge = (forceRotate = false) => {
    const todayStamp = getTodayStamp();
    let stored = null;

    try {
      stored = JSON.parse(localStorage.getItem(GENERAL_KNOWLEDGE_STORAGE_KEY) || 'null');
    } catch {
      stored = null;
    }

    const storedText = typeof stored?.text === 'string' ? stored.text.trim() : '';
    const storedDay = typeof stored?.day === 'string' ? stored.day : '';

    if (!forceRotate && storedDay === todayStamp && storedText) {
      setDailyWisdom(storedText);
      return storedText;
    }

    const nextText = pickRandomGeneralKnowledge(storedText) || storedText;
    if (!nextText) return '';

    setDailyWisdom(nextText);
    try {
      localStorage.setItem(GENERAL_KNOWLEDGE_STORAGE_KEY, JSON.stringify({
        day: todayStamp,
        text: nextText,
        updatedAt: new Date().toISOString(),
      }));
    } catch {
      // localStorage can fail in private mode; UI fallback still works
    }
    return nextText;
  };

  const rotateGeneralKnowledge = () => {
    const nextText = applyGeneralKnowledge(true);
    if (nextText) {
      showToast('Neue Allgemeinbildung geladen.', 'info', 1800);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    applyGeneralKnowledge(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return { dailyWisdom, rotateGeneralKnowledge };
}
