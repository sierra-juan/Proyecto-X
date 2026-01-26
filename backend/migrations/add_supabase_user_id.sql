-- Add supabase_user_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(255) UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);
