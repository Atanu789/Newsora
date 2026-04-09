const pool = require('../config/db');
const { classifyArticleCategory } = require('../services/aiService');

async function run() {
  const { rows } = await pool.query(
    `SELECT id, title, content, source, category FROM news ORDER BY created_at DESC`
  );

  let updated = 0;

  for (const row of rows) {
    const text = [row.title, row.content, row.source].filter(Boolean).join(' ');
    const nextCategory = classifyArticleCategory(text);
    const currentCategory = String(row.category || '').trim() || 'Social';

    if (nextCategory !== currentCategory) {
      await pool.query('UPDATE news SET category = $1 WHERE id = $2', [nextCategory, row.id]);
      updated += 1;
    }
  }

  const distribution = await pool.query(
    'SELECT category, COUNT(*)::int AS count FROM news GROUP BY category ORDER BY count DESC'
  );

  console.log(`Reclassification complete. Updated ${updated} rows.`);
  console.table(distribution.rows);
}

run()
  .catch((error) => {
    console.error('Failed to reclassify categories:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
