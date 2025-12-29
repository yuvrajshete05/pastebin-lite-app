-- Create pastes table
CREATE TABLE IF NOT EXISTS pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ttl_seconds INTEGER,
  max_views INTEGER,
  views_count INTEGER DEFAULT 0
);

-- Create index on id for faster lookups
CREATE INDEX IF NOT EXISTS idx_pastes_id ON pastes(id);

-- Create index on created_at for potential cleanup queries
CREATE INDEX IF NOT EXISTS idx_pastes_created_at ON pastes(created_at);
