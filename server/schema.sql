-- Users (관리자/회원)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  age TEXT,
  job TEXT,
  role TEXT DEFAULT 'member',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Vouchers (바우처 코드)
CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  course_id INTEGER,
  status TEXT DEFAULT 'active',
  used_by INTEGER REFERENCES users(id),
  used_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Courses (교육 과정)
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price INTEGER DEFAULT 0,
  icon TEXT DEFAULT 'book',
  featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Curriculum Items (커리큘럼 항목)
CREATE TABLE IF NOT EXISTS curriculum_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER REFERENCES courses(id),
  phase TEXT,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT DEFAULT 'text',
  content_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Applications (수강 신청)
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  voucher_id INTEGER REFERENCES vouchers(id),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initial Admin User (password: a4k2026!)
INSERT OR IGNORE INTO users (email, password_hash, name, role) 
VALUES ('admin@a4k.ai', '$2b$10$YourHashedPasswordHere', '관리자', 'admin');

-- Initial Courses
INSERT OR IGNORE INTO courses (slug, title, subtitle, description, price, icon, featured) 
VALUES 
  ('gce-l1', 'GCE L1 부트캠프', 'Google Certified Educator Level 1', '구글 공인교육자 자격증 취득 과정. 1일 집중 부트캠프로 구글 에듀케이터 인증을 획득하세요.', 150000, 'award', 0),
  ('gce-l2', 'GCE L2 부트캠프', 'Google Certified Educator Level 2', '심화 디지털 교육 전문가 과정. Level 1 이후 더 깊은 전문성을 원하는 교육자를 위한 과정입니다.', 150000, 'book', 0),
  ('vibe-basic', '바이브코딩 기초', 'Vibe Coding for Non-Developers', '비개발자를 위한 AI 협업 과정. 코딩 없이 AI와 함께 아이디어를 현실로 만드세요.', 300000, 'code', 1);

-- Initial Vouchers
INSERT OR IGNORE INTO vouchers (code, course_id, status) 
VALUES 
  ('A4K2026', NULL, 'active'),
  ('PREMIUM2026', NULL, 'active'),
  ('AIPARTNERS', NULL, 'active');
