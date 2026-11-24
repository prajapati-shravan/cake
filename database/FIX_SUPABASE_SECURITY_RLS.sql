-- =====================================================================
-- DÉLICE & CO. — ARTISAN PATISSERIE
-- PRODUCTION SECURITY REMEDIATION MIGRATION: RE-ENABLE RLS & POLICIES
-- Target Database: Supabase PostgreSQL (fccisnncmndbjckpaebm)
-- =====================================================================

-- 1. RE-ENABLE ROW LEVEL SECURITY (RLS) ON ALL CORE COMMERCE TABLES
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons ENABLE ROW LEVEL SECURITY;

-- 2. REVOKE OVERLY PERMISSIVE DIRECT ACCESS FROM 'anon' & 'public'
REVOKE DELETE, TRUNCATE ON public.orders FROM anon, authenticated;
REVOKE DELETE, TRUNCATE ON public.order_items FROM anon, authenticated;
REVOKE DELETE, TRUNCATE ON public.payments FROM anon, authenticated;

-- Grant minimal necessary operation permissions
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT, INSERT ON public.payments TO anon, authenticated;
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- 3. DROP EXISTING INSECURE / PERMISSIVE POLICIES
DROP POLICY IF EXISTS "allow_all_orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Anon can do all" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;

DROP POLICY IF EXISTS "allow_all_order_items" ON public.order_items;
DROP POLICY IF EXISTS "allow_all_payments" ON public.payments;

-- 4. CREATE LEAST-PRIVILEGE RLS POLICIES FOR 'orders'
-- A. Any customer (guest or authenticated) can create/insert an order
CREATE POLICY "customers_can_insert_orders"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- B. Authenticated customers can ONLY view their own orders
CREATE POLICY "customers_can_view_own_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  customer_email = auth.jwt()->>'email'
);

-- C. Staff and Admins can view and update all orders
CREATE POLICY "admins_can_manage_orders"
ON public.orders
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
  )
);

-- 5. POLICIES FOR 'order_items'
CREATE POLICY "anyone_can_insert_order_items"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "users_can_view_own_order_items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid()
        OR orders.customer_email = auth.jwt()->>'email'
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
      )
  )
);

-- 6. POLICIES FOR 'payments'
CREATE POLICY "anyone_can_insert_payments"
ON public.payments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "authorized_view_payments"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = payments.order_id
      AND (
        orders.user_id = auth.uid()
        OR orders.customer_email = auth.jwt()->>'email'
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'staff')
        )
      )
  )
);

-- 7. SECURE PUBLIC ORDER TRACKING FUNCTION (SECURITY DEFINER)
-- Allows guest/customer order status lookup without exposing all orders
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_number text, p_phone_last4 text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order json;
BEGIN
  SELECT json_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'payment_status', o.payment_status,
    'delivery_date', o.delivery_date,
    'delivery_slot_text', o.delivery_slot_text,
    'total', o.total,
    'created_at', o.created_at,
    'customer_name', o.customer_name,
    'items', (
      SELECT json_agg(json_build_object(
        'product_name', oi.product_name_snapshot,
        'variant', oi.variant_snapshot,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price,
        'cake_message', oi.cake_message
      ))
      FROM public.order_items oi
      WHERE oi.order_id = o.id
    )
  ) INTO v_order
  FROM public.orders o
  WHERE UPPER(o.order_number) = UPPER(TRIM(p_order_number))
    AND (
      p_phone_last4 IS NULL
      OR p_phone_last4 = ''
      OR RIGHT(REGEXP_REPLACE(o.customer_phone, '[^0-9]', '', 'g'), 4) = p_phone_last4
    );

  RETURN v_order;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_order_tracking(text, text) TO anon, authenticated;
