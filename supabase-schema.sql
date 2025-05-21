-- Grant necessary permissions to the anon role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;

-- Grant necessary permissions to the authenticated role
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  phone TEXT UNIQUE,
  updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'received', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, contact_id)
);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of their contacts" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.contacts 
      WHERE (user_id = auth.uid() AND contact_id = profiles.id)
    )
  );

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" 
  ON public.messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages they send" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update status of messages they received" 
  ON public.messages 
  FOR UPDATE 
  USING (auth.uid() = receiver_id);

-- Contacts policies
CREATE POLICY "Users can view their own contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
  ON public.contacts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Allow inserting to profiles for anon users during signup
CREATE POLICY "Allow anon users to create profiles during signup" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update message status to 'received' when a new message is inserted
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- If the message is sent, update it to 'received' status
  IF NEW.status = 'sent' THEN
    NEW.status := 'received';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update message status when a new message is inserted
CREATE OR REPLACE TRIGGER on_message_created
  BEFORE INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Auto-connect users trigger
-- Creates a function that will automatically connect new users with all existing users
CREATE OR REPLACE FUNCTION public.connect_new_user_with_existing()
RETURNS TRIGGER AS $$
DECLARE
    existing_user RECORD;
BEGIN
    -- For each existing user (excluding the new user)
    FOR existing_user IN 
        SELECT id FROM public.profiles 
        WHERE id != NEW.id
    LOOP
        -- Create a contact record for the new user -> existing user
        INSERT INTO public.contacts (user_id, contact_id)
        VALUES (NEW.id, existing_user.id)
        ON CONFLICT DO NOTHING;
        
        -- Create a contact record for the existing user -> new user
        INSERT INTO public.contacts (user_id, contact_id)
        VALUES (existing_user.id, NEW.id)
        ON CONFLICT DO NOTHING;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs the function after a new profile is inserted
DROP TRIGGER IF EXISTS on_new_profile_connect_users ON public.profiles;
CREATE TRIGGER on_new_profile_connect_users
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.connect_new_user_with_existing();

-- Create an index to speed up profile lookups and prevent duplicates
CREATE INDEX IF NOT EXISTS idx_contacts_user_contact 
ON public.contacts (user_id, contact_id);

-- Add a unique constraint to prevent duplicate contacts
ALTER TABLE public.contacts 
DROP CONSTRAINT IF EXISTS unique_user_contact;
ALTER TABLE public.contacts 
ADD CONSTRAINT unique_user_contact UNIQUE (user_id, contact_id);

-- Connect all existing users with each other
DO $$
DECLARE
    user1 RECORD;
    user2 RECORD;
BEGIN
    -- For each user
    FOR user1 IN 
        SELECT id FROM public.profiles
    LOOP
        -- Connect with every other user
        FOR user2 IN 
            SELECT id FROM public.profiles 
            WHERE id != user1.id
        LOOP
            -- Create a contact record if it doesn't exist
            INSERT INTO public.contacts (user_id, contact_id)
            VALUES (user1.id, user2.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END; $$; 


-- This script fixes permission issues for the Periskope application
-- Run this in the Supabase SQL Editor

-- 1. Grant schema usage to both anonymous and authenticated users
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- 2. Grant table permissions (apply to existing tables)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- 3. Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 4. Set default privileges for future tables/objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;

-- 5. Grant specific permissions for auth schema 
GRANT SELECT ON TABLE auth.users TO anon;
GRANT SELECT ON TABLE auth.users TO authenticated;

-- 6. Create or replace RLS policy for anonymous profile creation
DROP POLICY IF EXISTS "Allow anon users to create profiles during signup" ON public.profiles;
CREATE POLICY "Allow anon users to create profiles during signup" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (true);

-- 7. Create policy for everyone to see profiles
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
CREATE POLICY "Anyone can view profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

-- 8. Make sure RLS is enabled but with proper policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Auto-connect users trigger
-- Creates a function that will automatically connect new users with all existing users
CREATE OR REPLACE FUNCTION public.connect_new_user_with_existing()
RETURNS TRIGGER AS $$
DECLARE
    existing_user RECORD;
BEGIN
    -- For each existing user (excluding the new user)
    FOR existing_user IN 
        SELECT id FROM public.profiles 
        WHERE id != NEW.id
    LOOP
        -- Create a contact record for the new user -> existing user
        INSERT INTO public.contacts (user_id, contact_id)
        VALUES (NEW.id, existing_user.id)
        ON CONFLICT DO NOTHING;
        
        -- Create a contact record for the existing user -> new user
        INSERT INTO public.contacts (user_id, contact_id)
        VALUES (existing_user.id, NEW.id)
        ON CONFLICT DO NOTHING;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs the function after a new profile is inserted
DROP TRIGGER IF EXISTS on_new_profile_connect_users ON public.profiles;
CREATE TRIGGER on_new_profile_connect_users
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.connect_new_user_with_existing();

-- Create an index to speed up profile lookups and prevent duplicates
CREATE INDEX IF NOT EXISTS idx_contacts_user_contact 
ON public.contacts (user_id, contact_id);

-- Add a unique constraint to prevent duplicate contacts
ALTER TABLE public.contacts 
DROP CONSTRAINT IF EXISTS unique_user_contact;
ALTER TABLE public.contacts 
ADD CONSTRAINT unique_user_contact UNIQUE (user_id, contact_id);

-- Connect all existing users with each other immediately
DO $$
DECLARE
    user1 RECORD;
    user2 RECORD;
BEGIN
    -- For each user
    FOR user1 IN 
        SELECT id FROM public.profiles
    LOOP
        -- Connect with every other user
        FOR user2 IN 
            SELECT id FROM public.profiles 
            WHERE id != user1.id
        LOOP
            -- Create a contact record if it doesn't exist
            INSERT INTO public.contacts (user_id, contact_id)
            VALUES (user1.id, user2.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
    END LOOP;
END; $$; 