-- ========================================================================
-- DÉLICE & CO. — ENABLE ALL WEBSITE ORDERS & AUTH IN SUPABASE
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard/project/fccisnncmndbjckpaebm
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run" (Ctrl+Enter)
-- ========================================================================
--
-- FIX FOR "EMAIL RATE LIMIT EXCEEDED" (429 ERROR):
-- 1. In Supabase Dashboard, go to: Authentication -> Providers -> Email
-- 2. Toggle "Confirm email" to OFF (Disabled)
-- 3. Click "Save" at the bottom
-- (This allows instant customer signups without hitting Supabase's 3 emails/hour shared limit!)
--
-- OPTIONAL: Use your custom Gmail SMTP for unlimited emails:
-- Go to: Project Settings -> Authentication -> SMTP Settings -> Enable Custom SMTP
-- Host: smtp.gmail.com | Port: 587 | User: your_store_email@gmail.com | Pass: your_16_char_app_password
-- ========================================================================

-- METHOD 1 (RECOMMENDED & INSTANT FIX FOR PUBLIC STORE)
-- This instantly allows the website and admin dashboard to insert & read orders freely without permission errors:

ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_cake_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

-- Grant permissions to public anon and authenticated users
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
