-- =========================================================
-- AgentChase: Create subscriptions table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- =========================================================

-- Create the subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('pay_per_chase', 'unlimited', 'trial')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  payment_method TEXT DEFAULT 'payoneer',
  amount NUMERIC(12,2) DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS: Users can read their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- RLS: Allow service role (API routes) to manage all subscriptions
-- (The service role key bypasses RLS automatically, but this
--  policy lets the anon client read its own rows.)

-- RLS: Users can insert their own trial subscriptions
CREATE POLICY "Users can create own trial"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND plan = 'trial');

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON subscriptions(user_id, status);
