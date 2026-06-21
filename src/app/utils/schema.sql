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
