/**
 * Generates SQL INSERT statements for quiz questions.
 * Run: node server/scripts/generate-questions-sql.mjs > server/scripts/questions.sql
 * Then on VPS: docker exec -i azubi-app-postgres-1 psql -U azubi_app -d azubi_db < server/scripts/questions.sql
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', '..', 'src', 'data');

// Read and eval frontend files
function loadQuestions() {
  const expansionSrc = readFileSync(join(dataDir, 'quizQuestionsExpansion.js'), 'utf-8');

  let whoAmISrc;
  try {
    whoAmISrc = readFileSync(join(dataDir, 'whoAmIChallenges.js'), 'utf-8');
  } catch {
    whoAmISrc = 'const WHO_AM_I_CATEGORY = {}; const WHO_AM_I_CHALLENGES = [];';
  }

  const mainSrc = readFileSync(join(dataDir, 'quizQuestions.js'), 'utf-8');

  const clean = (src) => src.replace(/^export /gm, '').replace(/^import .*/gm, '');

  const script = `
    ${clean(expansionSrc)}
    ${clean(whoAmISrc)}
    ${clean(mainSrc)}
    return SAMPLE_QUESTIONS;
  `;

  return new Function(script)();
}

function escapeSql(str) {
  return str.replace(/'/g, "''");
}

function generateId() {
  // Simple cuid-like ID
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = 'c';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

const questions = loadQuestions();
let total = 0;
let skipped = 0;

console.log('-- Quiz Questions Seed');
console.log('-- Generated: ' + new Date().toISOString());
console.log('DELETE FROM "Question";');
console.log('');

for (const [category, items] of Object.entries(questions)) {
  if (!Array.isArray(items)) { skipped++; continue; }
  for (const item of items) {
    if (!item || !item.q || !item.a || item.multi || Array.isArray(item.correct)) {
      skipped++;
      continue;
    }

    const id = generateId();
    const prompt = escapeSql(item.q);
    const options = escapeSql(JSON.stringify(item.a));
    const correctIndex = item.correct;
    const explanation = item.explanation ? `'${escapeSql(item.explanation)}'` : 'NULL';

    console.log(
      `INSERT INTO "Question" (id, category, prompt, options, "correctOptionIndex", explanation, "isActive", "createdAt", "updatedAt") ` +
      `VALUES ('${id}', '${escapeSql(category)}', '${prompt}', '${options}'::jsonb, ${correctIndex}, ${explanation}, true, NOW(), NOW());`
    );
    total++;
  }
}

console.error(`Generated ${total} INSERT statements. Skipped ${skipped} multi-select questions.`);
