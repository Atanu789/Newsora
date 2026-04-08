CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(64) UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password VARCHAR(255),
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(64);
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  summary TEXT,
  category VARCHAR(64),
  tags JSONB DEFAULT '[]'::jsonb,
  source TEXT NOT NULL,
  source_url TEXT NOT NULL,
  external_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE news ADD COLUMN IF NOT EXISTS image_url TEXT;

CREATE TABLE IF NOT EXISTS user_activity (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  news_id BIGINT REFERENCES news(id) ON DELETE CASCADE,
  action VARCHAR(32) NOT NULL,
  read_time INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  status VARCHAR(32) DEFAULT 'pending',
  category VARCHAR(64),
  moderation_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_reputation (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_news_category_created_at ON news(category, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_news_id ON user_activity(news_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status_created_at ON submissions(status, created_at DESC);
