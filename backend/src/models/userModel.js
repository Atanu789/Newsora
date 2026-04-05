const pool = require('../config/db');

async function createUser({ name, email, password }) {
  const result = await pool.query(
    `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, preferences, created_at
    `,
    [name, email, password]
  );

  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function findUserById(id) {
  const result = await pool.query(
    'SELECT id, clerk_id, name, email, preferences, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function findUserByClerkId(clerkId) {
  const result = await pool.query(
    'SELECT id, clerk_id, name, email, preferences, created_at FROM users WHERE clerk_id = $1',
    [clerkId]
  );
  return result.rows[0] || null;
}

async function upsertClerkUser({ clerkId, email, name }) {
  const result = await pool.query(
    `
      INSERT INTO users (clerk_id, name, email)
      VALUES ($1, $2, $3)
      ON CONFLICT (clerk_id)
      DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email
      RETURNING id, clerk_id, name, email, preferences, created_at
    `,
    [clerkId, name, email]
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByClerkId,
  upsertClerkUser
};
