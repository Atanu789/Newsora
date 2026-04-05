const pool = require('../config/db');

async function create(payload) {
  const query = `
    INSERT INTO news (title, content, summary, category, tags, source, source_url, external_id)
    VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.content,
    payload.summary,
    payload.category,
    JSON.stringify(payload.tags || []),
    payload.source,
    payload.sourceUrl,
    payload.externalId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function findPaginated({ category, pageSize, offset }) {
  const values = [];
  let where = '';

  if (category) {
    values.push(category);
    where = `WHERE category = $${values.length}`;
  }

  values.push(pageSize, offset);

  const query = `
    SELECT id, title, summary, category, tags, source, source_url, created_at
    FROM news
    ${where}
    ORDER BY created_at DESC
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const totalQuery = `SELECT COUNT(*)::int AS count FROM news ${where}`;

  const [rowsResult, totalResult] = await Promise.all([
    pool.query(query, values),
    pool.query(totalQuery, values.slice(0, category ? 1 : 0))
  ]);

  return {
    items: rowsResult.rows,
    total: totalResult.rows[0].count
  };
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT id, title, content, summary, category, tags, source, source_url, created_at
      FROM news
      WHERE id = $1
    `,
    [id]
  );

  return result.rows[0] || null;
}

async function findByExternalId(externalId) {
  if (!externalId) return null;
  const result = await pool.query('SELECT id FROM news WHERE external_id = $1', [externalId]);
  return result.rows[0] || null;
}

module.exports = {
  create,
  findPaginated,
  findById,
  findByExternalId
};
