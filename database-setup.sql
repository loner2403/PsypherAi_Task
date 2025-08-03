-- Database setup for Tier-Based Event Showcase
-- Run this script in your Supabase SQL Editor

-- Create the tables we need

-- Create users table for syncing Clerk users
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'silver', 'gold', 'platinum')),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some sample events
-- Clear any existing events first
DELETE FROM events;

-- Free tier events
INSERT INTO events (title, description, tier, date, location, image_url) VALUES
(
  'Introduction to Web Development',
  'Learn the basics of HTML, CSS, and JavaScript in this beginner-friendly workshop. Perfect for those starting their coding journey.',
  'free',
  '2024-02-15 14:00:00+00',
  'Community Center, Main Hall',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop'
),
(
  'Career Networking Mixer',
  'Connect with professionals from various industries. Bring your business cards and elevator pitch for this casual networking event.',
  'free',
  '2024-02-20 18:30:00+00',
  'Downtown Business Hub',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop'
);

-- Silver tier events
INSERT INTO events (title, description, tier, date, location, image_url) VALUES
(
  'Advanced React Patterns',
  'Deep dive into advanced React concepts including hooks, context, and performance optimization. Intermediate to advanced level.',
  'silver',
  '2024-02-25 10:00:00+00',
  'Tech Innovation Center',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop'
),
(
  'Digital Marketing Masterclass',
  'Learn proven strategies for social media marketing, SEO, and content creation from industry experts.',
  'silver',
  '2024-03-01 13:00:00+00',
  'Marketing Academy, Room 201',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
);

-- Gold tier events
INSERT INTO events (title, description, tier, date, location, image_url) VALUES
(
  'AI & Machine Learning Summit',
  'Exclusive summit featuring keynotes from AI researchers and hands-on workshops with cutting-edge ML tools.',
  'gold',
  '2024-03-05 09:00:00+00',
  'Innovation District, Conference Center',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop'
),
(
  'Executive Leadership Retreat',
  'Private retreat for senior executives focusing on strategic planning, team building, and leadership development.',
  'gold',
  '2024-03-10 08:00:00+00',
  'Mountain View Resort',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'
);

-- Set up security
-- Enable Row Level Security on our tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies if we're re-running this

DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Events visible based on user tier" ON events;
DROP POLICY IF EXISTS "Public read access to events" ON events;

-- Create the security policies
-- Users table policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = clerk_id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT 
  WITH CHECK (auth.uid()::text = clerk_id);

CREATE POLICY "Service role can manage users" ON users
  FOR ALL USING (auth.role() = 'service_role');

-- Events table policies
-- Let everyone read events (we handle tier filtering in the app)
CREATE POLICY "Public read access to events" ON events
  FOR SELECT USING (true);

-- Set up permissions
GRANT SELECT ON users TO anon, authenticated;
GRANT INSERT, UPDATE ON users TO anon, authenticated;
GRANT SELECT ON events TO anon, authenticated;

-- Helper functions

-- Function to upgrade user tier (for tier upgrade simulation)
CREATE OR REPLACE FUNCTION upgrade_user_tier(user_clerk_id TEXT, new_tier TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Validate tier
  IF new_tier NOT IN ('free', 'silver', 'gold', 'platinum') THEN
    RETURN FALSE;
  END IF;
  
  -- Update user tier
  UPDATE users 
  SET tier = new_tier, updated_at = NOW()
  WHERE clerk_id = user_clerk_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some indexes to make queries faster
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_events_tier ON events(tier);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- Quick check to see if everything worked
SELECT 'Database setup complete!' as status;

-- Show how many events we have per tier
SELECT tier, COUNT(*) as event_count
FROM events 
GROUP BY tier 
ORDER BY 
  CASE tier 
    WHEN 'free' THEN 1 
    WHEN 'silver' THEN 2 
    WHEN 'gold' THEN 3 
    WHEN 'platinum' THEN 4 
  END;
