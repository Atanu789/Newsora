const pool = require('../config/db');

async function create(payload) {
  const query = `
    INSERT INTO news (title, content, image_url, summary, category, tags, source, source_url, external_id)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    payload.title,
    payload.content,
    payload.imageUrl || null,
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

async function findPaginated({ category, pageSize, offset, priorityKeywords = [] }) {
  const values = [];
  const whereParts = [];

  if (category) {
    values.push(category);
    whereParts.push(`LOWER(category) = LOWER($${values.length})`);
  }

  const where = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

  let regionPriorityExpr = '0';
  if (priorityKeywords.length > 0) {
    const conditions = priorityKeywords.map((keyword) => {
      values.push(`%${keyword}%`);
      const placeholder = `$${values.length}`;
      return `(title ILIKE ${placeholder} OR COALESCE(content, '') ILIKE ${placeholder} OR source ILIKE ${placeholder})`;
    });
    regionPriorityExpr = `CASE WHEN ${conditions.join(' OR ')} THEN 1 ELSE 0 END`;
  }

  values.push(pageSize, offset);

  const query = `
    SELECT id, title, summary, category, tags, source, source_url, image_url, created_at,
           ${regionPriorityExpr} AS region_priority
    FROM news
    ${where}
    ORDER BY region_priority DESC, created_at DESC
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `;

  const totalValues = category ? [category] : [];
  const totalQuery = `SELECT COUNT(*)::int AS count FROM news ${where}`;

  const [rowsResult, totalResult] = await Promise.all([
    pool.query(query, values),
    pool.query(totalQuery, totalValues)
  ]);

  return {
    items: rowsResult.rows.map(({ region_priority, ...item }) => item),
    total: totalResult.rows[0].count
  };
}

async function findById(id) {
  const result = await pool.query(
    `
      SELECT id, title, content, summary, category, tags, source, source_url, image_url, created_at
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

async function findRecommendedByUser({ userId, pageSize, offset, priorityKeywords = [] }) {
  const values = [userId];

  let regionPriorityExpr = '0';
  if (priorityKeywords.length > 0) {
    const conditions = priorityKeywords.map((keyword) => {
      values.push(`%${keyword}%`);
      const placeholder = `$${values.length}`;
      return `(n.title ILIKE ${placeholder} OR COALESCE(n.content, '') ILIKE ${placeholder} OR n.source ILIKE ${placeholder})`;
    });
    regionPriorityExpr = `CASE WHEN ${conditions.join(' OR ')} THEN 1 ELSE 0 END`;
  }

  values.push(pageSize, offset);

  const query = `
    WITH user_category_score AS (
      SELECT
        n.category,
        SUM(
          CASE ua.action
            WHEN 'hide' THEN -4
            WHEN 'save' THEN 4
            WHEN 'share' THEN 4
            WHEN 'click' THEN 2
            ELSE 1
          END + LEAST(COALESCE(ua.read_time, 0) / 60.0, 3)
        ) AS score
      FROM user_activity ua
      INNER JOIN news n ON n.id = ua.news_id
      WHERE ua.user_id = $1
      GROUP BY n.category
    ),
    ranked_news AS (
      SELECT
        n.id,
        n.title,
        n.summary,
        n.category,
        n.tags,
        n.source,
        n.source_url,
        n.image_url,
        n.created_at,
        COALESCE(ucs.score, 0) AS affinity,
        ${regionPriorityExpr} AS region_priority
      FROM news n
      LEFT JOIN user_category_score ucs ON ucs.category = n.category
    )
    SELECT id, title, summary, category, tags, source, source_url, image_url, created_at
    FROM ranked_news
    ORDER BY region_priority DESC, affinity DESC, created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;

  const totalQuery = 'SELECT COUNT(*)::int AS count FROM news';

  const [rowsResult, totalResult] = await Promise.all([
    pool.query(query, values),
    pool.query(totalQuery)
  ]);

  return {
    items: rowsResult.rows,
    total: totalResult.rows[0].count
  };
}

module.exports = {
  create,
  findPaginated,
  findById,
  findByExternalId,
  findRecommendedByUser
};
