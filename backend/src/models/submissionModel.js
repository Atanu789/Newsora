const pool = require('../config/db');

async function createSubmission({ userId, content, mediaUrl, category, moderationNotes, status = 'pending' }) {
  const result = await pool.query(
    `
      INSERT INTO submissions (user_id, content, media_url, category, moderation_notes, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
    [userId, content, mediaUrl, category, moderationNotes, status]
  );

  return result.rows[0];
}

async function findAllPending() {
  const result = await pool.query(
    `
      SELECT * FROM submissions
      WHERE status = 'pending'
      ORDER BY created_at DESC
    `
  );

  return result.rows;
}

async function updateStatus({ id, status }) {
  const result = await pool.query(
    `
      UPDATE submissions
      SET status = $1
      WHERE id = $2
      RETURNING *
    `,
    [status, id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createSubmission,
  findAllPending,
  updateStatus
};
