-- Cloudflare D1 SQLite Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  photo_data TEXT,
  quiz_answers TEXT NOT NULL,
  language TEXT DEFAULT 'kr',
  age TEXT,
  expression TEXT,
  gender TEXT,
  group_name TEXT NOT NULL,
  position TEXT NOT NULL,
  sub_position TEXT,
  character TEXT NOT NULL,
  character_desc TEXT NOT NULL,
  style_tags TEXT NOT NULL,
  member_name TEXT,
  agency TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_analysis_session_id ON analysis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis_results(created_at);