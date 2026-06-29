-- SQL Schema for Altus Studio Supabase Database
-- Copy and run these queries in your Supabase SQL Editor.

-- 1. Create Messages Table (Contact submissions, leads, and chatbot transcripts)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT,
    date DATE DEFAULT CURRENT_DATE,
    read BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow anonymous message inserts" ON messages;
DROP POLICY IF EXISTS "Allow message selects" ON messages;
DROP POLICY IF EXISTS "Allow message updates" ON messages;
DROP POLICY IF EXISTS "Allow message deletes" ON messages;

-- Policy to allow anonymous submissions (Insert)
CREATE POLICY "Allow anonymous message inserts" 
ON messages FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy to allow viewing messages in the admin panel (Select)
CREATE POLICY "Allow message selects" 
ON messages FOR SELECT 
TO anon 
USING (true);

-- Policy to update read/status state in the admin dashboard (Update)
CREATE POLICY "Allow message updates" 
ON messages FOR UPDATE 
TO anon 
USING (true);

-- Policy to allow deleting messages in the admin dashboard (Delete)
CREATE POLICY "Allow message deletes" 
ON messages FOR DELETE 
TO anon 
USING (true);


-- 2. Create Projects Table (Portfolio projects)
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    year TEXT,
    description TEXT,
    img TEXT,
    results TEXT,
    is_live BOOLEAN DEFAULT FALSE,
    gallery TEXT[] DEFAULT '{}',
    live_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow public projects read access" ON projects;
DROP POLICY IF EXISTS "Allow project modifications" ON projects;

-- Policy to allow everyone to view portfolio projects (Select)
CREATE POLICY "Allow public projects read access" 
ON projects FOR SELECT 
TO anon 
USING (true);

-- Policy to allow project management from admin panel (All)
CREATE POLICY "Allow project modifications" 
ON projects FOR ALL 
TO anon 
USING (true);


-- 3. Seed initial projects data (optional)
INSERT INTO projects (id, name, category, tags, year, description, img, results, is_live, gallery, live_url)
VALUES 
(
  'project-1', 
  'PRO Parking Valet', 
  'Website', 
  ARRAY['React', 'Tailwind CSS', 'Framer Motion', 'SEO'], 
  '2025', 
  'Premium υπηρεσίες valet parking στην Αθήνα με σύστημα κρατήσεων και concierge.', 
  'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=800', 
  'Live Project', 
  true, 
  ARRAY['https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=800'], 
  'https://proparkingvalet.gr'
)
ON CONFLICT (id) DO NOTHING;


-- 4. Create Settings Table (Global app configuration)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow public settings read access" ON settings;
DROP POLICY IF EXISTS "Allow settings modifications" ON settings;
DROP POLICY IF EXISTS "Allow settings select" ON settings;
DROP POLICY IF EXISTS "Allow settings insert" ON settings;
DROP POLICY IF EXISTS "Allow settings update" ON settings;

-- Policy to allow anyone to read settings (Select)
CREATE POLICY "Allow settings select" 
ON settings FOR SELECT 
TO anon 
USING (true);

-- Policy to allow inserts on settings (Insert)
CREATE POLICY "Allow settings insert" 
ON settings FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy to allow updates on settings (Update)
CREATE POLICY "Allow settings update" 
ON settings FOR UPDATE 
TO anon 
USING (true)
WITH CHECK (true);

-- Seed initial settings
INSERT INTO settings (key, value)
VALUES ('maintenance_mode', '{"enabled": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO settings (key, value)
VALUES ('contact_info', '{"phone": "6970015447", "email": "altusstudiogr@gmail.com"}'::jsonb)
ON CONFLICT (key) DO NOTHING;


-- 5. Create Page Views Table (Real visitor tracking)
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL DEFAULT '/',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    device TEXT DEFAULT 'Desktop',
    referrer TEXT DEFAULT 'Direct',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- In case table already exists, alter to add device and referrer columns if they don't exist
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS device TEXT DEFAULT 'Desktop';
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT 'Direct';

-- Enable RLS for page_views
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public page_views insert" ON page_views;
DROP POLICY IF EXISTS "Allow page_views select" ON page_views;

-- Anyone can record a page view (Insert)
CREATE POLICY "Allow public page_views insert"
ON page_views FOR INSERT
TO anon
WITH CHECK (true);

-- Admin can read all page views (Select)
CREATE POLICY "Allow page_views select"
ON page_views FOR SELECT
TO anon
USING (true);


-- 6. Create Quotes Table (Dynamic Quote History)
CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    client TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous quote inserts" ON quotes;
DROP POLICY IF EXISTS "Allow quote selects" ON quotes;
DROP POLICY IF EXISTS "Allow quote updates" ON quotes;
DROP POLICY IF EXISTS "Allow quote deletes" ON quotes;

-- Policy to allow anonymous submissions (Insert)
CREATE POLICY "Allow anonymous quote inserts" 
ON quotes FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy to allow viewing quotes in the admin panel (Select)
CREATE POLICY "Allow quote selects" 
ON quotes FOR SELECT 
TO anon 
USING (true);

-- Policy to update quote state in the admin dashboard (Update)
CREATE POLICY "Allow quote updates" 
ON quotes FOR UPDATE 
TO anon 
USING (true);

-- Policy to allow deleting quotes in the admin dashboard (Delete)
CREATE POLICY "Allow quote deletes" 
ON quotes FOR DELETE 
TO anon 
USING (true);

