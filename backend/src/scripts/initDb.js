const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function init() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(schema);
  console.log('Database schema initialized.');
  await pool.end();
}

init().catch((error) => {
  console.error('Failed to initialize DB schema.', error);
  process.exit(1);
});
