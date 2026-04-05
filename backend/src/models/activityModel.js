const pool = require('../config/db');

async function trackActivity({ userId, newsId, action, readTime }) {
  const result = await pool.query(
    `
      INSERT INTO user_activity (user_id, news_id, action, read_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [userId, newsId, action, readTime]
  );

  return result.rows[0];
}

module.exports = {
  trackActivity
};
