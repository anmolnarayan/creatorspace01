-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('student', 'mentor', 'admin');
CREATE TYPE goal_type AS ENUM ('placement', 'startup', 'learning');
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE project_status AS ENUM ('draft', 'in_progress', 'in_review', 'verified', 'published');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  college TEXT,
  year SMALLINT,
  skills TEXT[] DEFAULT '{}',
  goal goal_type,
  reliability_score NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Launch packs table
CREATE TABLE launch_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  difficulty difficulty_level NOT NULL,
  duration_weeks INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_launch_packs_slug ON launch_packs(slug);
CREATE INDEX idx_launch_packs_tags ON launch_packs USING GIN(tags);

-- Milestones table
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  launch_pack_id UUID NOT NULL REFERENCES launch_packs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  est_hours INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_milestones_launch_pack ON milestones(launch_pack_id);
CREATE INDEX idx_milestones_order ON milestones(launch_pack_id, order_index);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  launch_pack_id UUID REFERENCES launch_packs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  short_summary TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  repo_url TEXT,
  demo_url TEXT,
  status project_status NOT NULL DEFAULT 'draft',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  public_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_public_slug ON projects(public_slug);
CREATE INDEX idx_projects_launch_pack ON projects(launch_pack_id);

-- Project milestones table
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_project_milestones_milestone ON project_milestones(milestone_id);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meets_brief BOOLEAN DEFAULT FALSE,
  core_functional BOOLEAN DEFAULT FALSE,
  docs_ok BOOLEAN DEFAULT FALSE,
  demo_ok BOOLEAN DEFAULT FALSE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_project ON reviews(project_id);
CREATE INDEX idx_reviews_mentor ON reviews(mentor_id);

-- Portfolios table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  public_url TEXT,
  mentor_comment TEXT,
  verified_badge BOOLEAN DEFAULT FALSE,
  reliability_score_snapshot NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolios_project ON portfolios(project_id);
CREATE INDEX idx_portfolios_verified ON portfolios(verified_badge);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_from ON messages(from_user_id);
CREATE INDEX idx_messages_to ON messages(to_user_id);
CREATE INDEX idx_messages_project ON messages(project_id);

-- AI cache table
CREATE TABLE ai_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  prompt TEXT NOT NULL,
  response_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ttl BIGINT
);

CREATE INDEX idx_ai_cache_key ON ai_cache(key);
CREATE INDEX idx_ai_cache_created ON ai_cache(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_launch_packs_updated_at BEFORE UPDATE ON launch_packs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update reliability score
CREATE OR REPLACE FUNCTION update_reliability_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating IS NOT NULL THEN
    UPDATE users
    SET 
      reviews_count = reviews_count + 1,
      reliability_score = (
        (reliability_score * reviews_count + NEW.rating) / (reviews_count + 1)
      )
    WHERE id = NEW.mentor_id;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_reliability AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_reliability_score();

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Users: users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Launch packs: public read
CREATE POLICY "Launch packs are public" ON launch_packs
  FOR SELECT USING (true);

-- Milestones: public read
CREATE POLICY "Milestones are public" ON milestones
  FOR SELECT USING (true);

-- Projects: owners, mentors, and admins can read
CREATE POLICY "Project owners can read" ON projects
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Mentors can read projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
  );

CREATE POLICY "Public can read published projects" ON projects
  FOR SELECT USING (
    status = 'published' AND EXISTS (
      SELECT 1 FROM portfolios WHERE project_id = projects.id AND verified_badge = true
    )
  );

CREATE POLICY "Project owners can update" ON projects
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Project owners can insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Project milestones: same as projects
CREATE POLICY "Project milestone access" ON project_milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_milestones.project_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
  );

-- Reviews: mentors and admins can create, project owners can read
CREATE POLICY "Mentors can create reviews" ON reviews
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('mentor', 'admin'))
  );

CREATE POLICY "Review access" ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = reviews.project_id AND owner_id = auth.uid())
    OR mentor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Mentors can update reviews" ON reviews
  FOR UPDATE USING (
    mentor_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Portfolios: public read if verified
CREATE POLICY "Public portfolios" ON portfolios
  FOR SELECT USING (verified_badge = true);

CREATE POLICY "Portfolio admin access" ON portfolios
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Messages: users can read their own messages
CREATE POLICY "Message access" ON messages
  FOR ALL USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- AI cache: service role only (handled server-side)

