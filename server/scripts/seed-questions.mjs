/**
 * Seed quiz questions from frontend data files into NestJS PostgreSQL.
 * Run via: docker exec -i azubi-app-server-1 node - < server/scripts/seed-questions.mjs
 *
 * Uses dynamic import workaround: reads the JS files, strips ESM syntax,
 * and evaluates them to extract the question data.
 */

import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Read and parse frontend question files ──────────────────────────
// We can't directly import ESM browser files, so we eval them.

function loadFrontendQuestions() {
  // Read expansion file first (it's imported by main file)
  const expansionSrc = readFileSync(
    new URL('../../src/data/quizQuestionsExpansion.js', import.meta.url),
    'utf-8'
  );

  // Read who-am-i file
  let whoAmISrc;
  try {
    whoAmISrc = readFileSync(
      new URL('../../src/data/whoAmIChallenges.js', import.meta.url),
      'utf-8'
    );
  } catch {
    whoAmISrc = 'export const WHO_AM_I_CATEGORY = {}; export const WHO_AM_I_CHALLENGES = [];';
  }

  // Read main questions file
  const mainSrc = readFileSync(
    new URL('../../src/data/quizQuestions.js', import.meta.url),
    'utf-8'
  );

  // Strip import/export and eval
  const cleanExpansion = expansionSrc
    .replace(/^export /gm, '')
    .replace(/^import .*/gm, '');

  const cleanWhoAmI = whoAmISrc
    .replace(/^export /gm, '')
    .replace(/^import .*/gm, '');

  const cleanMain = mainSrc
    .replace(/^export /gm, '')
    .replace(/^import .*/gm, '');

  // Build combined script
  const script = `
    ${cleanExpansion}
    ${cleanWhoAmI}
    ${cleanMain}
    return SAMPLE_QUESTIONS;
  `;

  const fn = new Function(script);
  return fn();
}

async function main() {
  const questions = loadFrontendQuestions();
  let total = 0;
  let skipped = 0;

  const rows = [];

  for (const [category, items] of Object.entries(questions)) {
    for (const item of items) {
      // Skip multi-select questions (backend only supports single-choice)
      if (item.multi || Array.isArray(item.correct)) {
        skipped++;
        continue;
      }

      rows.push({
        category,
        prompt: item.q,
        options: item.a,
        correctOptionIndex: item.correct,
        explanation: item.explanation || null,
        isActive: true
      });
      total++;
    }
  }

  // Check existing count
  const existingCount = await prisma.question.count();
  if (existingCount > 0) {
    console.log(`DB already has ${existingCount} questions. Deleting before re-seed...`);
    await prisma.question.deleteMany({});
  }

  // Batch insert
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    await prisma.question.createMany({ data: batch });
    console.log(`  Inserted ${Math.min(i + batchSize, rows.length)} / ${rows.length}`);
  }

  console.log(`\nDone! Inserted ${total} single-choice questions. Skipped ${skipped} multi-select.`);

  // Show category breakdown
  const cats = {};
  for (const r of rows) {
    cats[r.category] = (cats[r.category] || 0) + 1;
  }
  console.log('\nBy category:');
  for (const [cat, count] of Object.entries(cats)) {
    console.log(`  ${cat}: ${count}`);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
