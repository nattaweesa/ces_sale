-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('SALE', 'MANAGER', 'ADMIN')) DEFAULT 'SALE',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  client_name TEXT NOT NULL,
  client_contact TEXT,
  status TEXT NOT NULL CHECK (status IN ('NEW', 'PROGRESS', 'DONE', 'CANCELLED')) DEFAULT 'NEW',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project sales (many-to-many)
CREATE TABLE project_sales (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sale_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, sale_id)
);

-- Project details
CREATE TABLE project_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  requirement TEXT,
  budget DECIMAL(15,2),
  timeline TEXT,
  notes TEXT,
  custom_fields JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  value DECIMAL(15,2) NOT NULL DEFAULT 0,
  probability INTEGER NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  stage TEXT NOT NULL CHECK (stage IN ('LEAD', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST')) DEFAULT 'LEAD',
  expected_close_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Follow-ups table
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID REFERENCES users(id) ON DELETE CASCADE,
  period TEXT NOT NULL CHECK (period IN ('WEEKLY', 'MONTHLY')),
  new_projects_count INTEGER DEFAULT 0,
  won_deals_value DECIMAL(15,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users: users can read all, update own
CREATE POLICY "Users can read all" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own" ON users FOR UPDATE USING (auth.uid() = id);

-- Projects: Sale sees own projects, Manager sees all
CREATE POLICY "Users can read their own projects" ON projects FOR SELECT USING (
  created_by = auth.uid() 
  OR EXISTS (SELECT 1 FROM project_sales WHERE project_id = projects.id AND sale_id = auth.uid())
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN'))
);
CREATE POLICY "Users can insert own projects" ON projects FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update projects" ON projects FOR UPDATE USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN'))
);
CREATE POLICY "Users can delete projects" ON projects FOR DELETE USING (
  created_by = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN'))
);

-- Project sales
CREATE POLICY "Read project sales" ON project_sales FOR SELECT USING (true);
CREATE POLICY "Insert project sales" ON project_sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Delete project sales" ON project_sales FOR DELETE USING (true);

-- Project details
CREATE POLICY "Read project details" ON project_details FOR SELECT USING (true);
CREATE POLICY "Insert project details" ON project_details FOR INSERT WITH CHECK (true);
CREATE POLICY "Update project details" ON project_details FOR UPDATE USING (true);

-- Deals
CREATE POLICY "Read deals" ON deals FOR SELECT USING (true);
CREATE POLICY "Insert deals" ON deals FOR INSERT WITH CHECK (true);
CREATE POLICY "Update deals" ON deals FOR UPDATE USING (true);
CREATE POLICY "Delete deals" ON deals FOR DELETE USING (true);

-- Follow-ups
CREATE POLICY "Read follow ups" ON follow_ups FOR SELECT USING (true);
CREATE POLICY "Insert follow ups" ON follow_ups FOR INSERT WITH CHECK (true);

-- Reports: Sale sees own, Manager sees all
CREATE POLICY "Read reports" ON reports FOR SELECT USING (
  sale_id = auth.uid()
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN'))
);
CREATE POLICY "Insert reports" ON reports FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_deals_project_id ON deals(project_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_follow_ups_project_id ON follow_ups(project_id);
CREATE INDEX idx_reports_sale_id ON reports(sale_id);

-- Insert demo users (password: password123)
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@ces.co.th', '$2a$10$demo', 'ผู้ดูแลระบบ', 'ADMIN'),
  ('manager@ces.co.th', '$2a$10$demo', 'สมศักดิ์ ผู้จัดการ', 'MANAGER'),
  ('sale@ces.co.th', '$2a$10$demo', 'สมชาย ใจดี', 'SALE'),
  ('sale2@ces.co.th', '$2a$10$demo', 'วิชัย มาก', 'SALE');
