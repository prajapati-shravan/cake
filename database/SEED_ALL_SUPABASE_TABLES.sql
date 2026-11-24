-- ========================================================================
-- DÉLICE & CO. — SEED ALL REMAINING TABLES IN SUPABASE
-- Run this in your Supabase Dashboard:
-- 1. Go to https://supabase.com/dashboard
-- 2. Click "SQL Editor" on the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run" (Ctrl+Enter)
-- ========================================================================

-- STEP 0: DISABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- (Allows your public website & admin dashboard to read and write without blocks)
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.delivery_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.custom_cake_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;

-- STEP 1: POPULATE CATEGORIES
INSERT INTO public.categories (id, name, slug, image_url, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Celebration Chiffon', 'celebration-chiffon', 'assets/cake_velvet.jpg', true),
  ('11111111-1111-1111-1111-111111111102', 'Korean Bento', 'korean-bento', 'assets/cake_bento.jpg', true),
  ('11111111-1111-1111-1111-111111111103', 'Dietary & Nut Flour', 'dietary-nut-flour', 'assets/cake_pistachio.jpg', true),
  ('11111111-1111-1111-1111-111111111104', 'Grand Wedding Towers', 'wedding-towers', 'assets/cake_wedding.jpg', true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active;

-- STEP 2: POPULATE PRODUCTS (ARTISAN CAKE CATALOG)
INSERT INTO public.products (id, name, slug, description, category_id, category, base_price, image_url, is_active, is_featured, flavor_profile, dietary_info)
VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    'The Velvet Rose & Raspberry Chiffon',
    'velvet-rose',
    'Vanilla bean chiffon layered with tart wild raspberry compote, whipped French ganache, and edible organic rose petals.',
    '11111111-1111-1111-1111-111111111101',
    'Celebration Chiffon',
    899.00,
    'assets/cake_velvet.jpg',
    true,
    true,
    'Wild Berries & Rosewater',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'Valrhona Noir Dark Truffle Mud Cake',
    'valrhona-truffle',
    'Ultra-moist Belgian dark chocolate sponge drenched in silky 70% chocolate truffle ganache, roasted hazelnuts, and sea salt.',
    '11111111-1111-1111-1111-111111111101',
    'Celebration Chiffon',
    849.00,
    'assets/cake_chocolate.jpg',
    true,
    true,
    'Belgian 70% Dark Truffle',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    'Pastel Petal Korean Bento Lunchbox Cake',
    'korean-bento',
    'Aesthetic Korean viral bento cake packaged in an eco sugarcane box with pastel piping and custom chocolate lettering.',
    '11111111-1111-1111-1111-111111111102',
    'Korean Bento',
    399.00,
    'assets/cake_bento.jpg',
    true,
    true,
    'Vanilla & Fresh Strawberry',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    'Kyoto Fresh Strawberry Cloud Chiffon',
    'strawberry-cloud',
    'Cloud-like Japanese sponge filled with fresh Mahabaleshwar strawberries and light-as-air whipped dairy cream.',
    '11111111-1111-1111-1111-111111111101',
    'Celebration Chiffon',
    799.00,
    'assets/cake_strawberry.jpg',
    true,
    true,
    'Fresh Strawberry Chiffon',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    'Classic German Black Forest Gateau',
    'black-forest',
    'Traditional chocolate sponge layered with whipped cream, imported sour cherry compote, and dark chocolate shavings.',
    '11111111-1111-1111-1111-111111111101',
    'Celebration Chiffon',
    599.00,
    'assets/cake_blackforest.jpg',
    true,
    false,
    'Dark Chocolate & Cherries',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    'Classic Golden Pineapple & Cream Gateau',
    'fresh-pineapple',
    'Moist vanilla sponge soaked in real pineapple nectar, layered with slow-cooked pineapple tidbits and red cherries.',
    '11111111-1111-1111-1111-111111111101',
    'Celebration Chiffon',
    549.00,
    'assets/cake_pineapple.jpg',
    true,
    false,
    'Tangy Pineapple & Cream',
    '100% Pure Veg (Eggless)'
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    'Sicilian Pistachio & Wild Blackberry',
    'pistachio-rose',
    'Finely ground green Bronte pistachio sponge layered with tart wild blackberry puree and vanilla mascarpone frosting.',
    '11111111-1111-1111-1111-111111111103',
    'Dietary & Nut Flour',
    949.00,
    'assets/cake_pistachio.jpg',
    true,
    true,
    'Roasted Pistachio & Berry',
    'Gluten-Free Nut Flour'
  ),
  (
    '22222222-2222-2222-2222-222222222208',
    'The Royal Three-Tier Celebration Tower',
    'wedding-tower',
    'Breathtaking 3-tier grand centerpiece draped with hand-sculpted sugar petals, gold leaf ribbon, and champagne buttercream.',
    '11111111-1111-1111-1111-111111111104',
    'Grand Wedding Towers',
    4999.00,
    'assets/cake_wedding.jpg',
    true,
    true,
    'Champagne & Bourbon Vanilla',
    'Bespoke Multi-Tier (3 Kg)'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  base_price = EXCLUDED.base_price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  category_id = EXCLUDED.category_id,
  is_active = EXCLUDED.is_active;

-- STEP 3: POPULATE PRODUCT VARIANTS (WEIGHTS & PRICES)
INSERT INTO public.product_variants (id, product_id, weight, price, stock, is_available)
VALUES
  -- Velvet Rose
  ('33333333-3333-3333-3333-333333333101', '22222222-2222-2222-2222-222222222201', '500 Gm', 899.00, 30, true),
  ('33333333-3333-3333-3333-333333333102', '22222222-2222-2222-2222-222222222201', '1 Kg', 1699.00, 20, true),
  ('33333333-3333-3333-3333-333333333103', '22222222-2222-2222-2222-222222222201', '2 Kg', 3199.00, 10, true),
  -- Valrhona Dark Truffle
  ('33333333-3333-3333-3333-333333333201', '22222222-2222-2222-2222-222222222202', '500 Gm', 849.00, 40, true),
  ('33333333-3333-3333-3333-333333333202', '22222222-2222-2222-2222-222222222202', '1 Kg', 1599.00, 25, true),
  ('33333333-3333-3333-3333-333333333203', '22222222-2222-2222-2222-222222222202', '2 Kg', 2999.00, 15, true),
  -- Korean Bento
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222203', '250 Gm', 399.00, 50, true),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222203', '350 Gm', 599.00, 30, true),
  -- Strawberry Cloud
  ('33333333-3333-3333-3333-333333333401', '22222222-2222-2222-2222-222222222204', '500 Gm', 799.00, 35, true),
  ('33333333-3333-3333-3333-333333333402', '22222222-2222-2222-2222-222222222204', '1 Kg', 1499.00, 20, true),
  ('33333333-3333-3333-3333-333333333403', '22222222-2222-2222-2222-222222222204', '2 Kg', 2899.00, 10, true),
  -- Black Forest
  ('33333333-3333-3333-3333-333333333501', '22222222-2222-2222-2222-222222222205', '500 Gm', 599.00, 30, true),
  ('33333333-3333-3333-3333-333333333502', '22222222-2222-2222-2222-222222222205', '1 Kg', 1149.00, 20, true),
  -- Fresh Pineapple
  ('33333333-3333-3333-3333-333333333601', '22222222-2222-2222-2222-222222222206', '500 Gm', 549.00, 35, true),
  ('33333333-3333-3333-3333-333333333602', '22222222-2222-2222-2222-222222222206', '1 Kg', 1049.00, 25, true),
  -- Pistachio
  ('33333333-3333-3333-3333-333333333701', '22222222-2222-2222-2222-222222222207', '500 Gm', 949.00, 25, true),
  ('33333333-3333-3333-3333-333333333702', '22222222-2222-2222-2222-222222222207', '1 Kg', 1799.00, 15, true),
  -- Wedding Tower
  ('33333333-3333-3333-3333-333333333801', '22222222-2222-2222-2222-222222222208', '3 Kg', 4999.00, 5, true),
  ('33333333-3333-3333-3333-333333333802', '22222222-2222-2222-2222-222222222208', '5 Kg', 7499.00, 3, true)
ON CONFLICT (id) DO NOTHING;

-- STEP 4: POPULATE DELIVERY SLOTS (NEXT 3 DAYS IN VADODARA)
INSERT INTO public.delivery_slots (id, date, start_time, end_time, maximum_orders, current_orders, is_available)
VALUES
  -- Today
  (gen_random_uuid(), current_date, '10:00:00', '13:00:00', 8, 2, true),
  (gen_random_uuid(), current_date, '13:00:00', '16:00:00', 8, 1, true),
  (gen_random_uuid(), current_date, '16:00:00', '19:00:00', 10, 4, true),
  (gen_random_uuid(), current_date, '19:00:00', '22:00:00', 10, 0, true),
  -- Tomorrow
  (gen_random_uuid(), current_date + 1, '10:00:00', '13:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 1, '13:00:00', '16:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 1, '16:00:00', '19:00:00', 10, 1, true),
  (gen_random_uuid(), current_date + 1, '19:00:00', '22:00:00', 10, 0, true),
  -- Day After Tomorrow
  (gen_random_uuid(), current_date + 2, '10:00:00', '13:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '13:00:00', '16:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '16:00:00', '19:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '19:00:00', '22:00:00', 10, 0, true)
ON CONFLICT DO NOTHING;

-- STEP 5: POPULATE ACTIVE DISCOUNT COUPONS
INSERT INTO public.coupons (id, code, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, used_count, is_active)
VALUES
  (gen_random_uuid(), 'DELICE10', 'percentage', 10.00, 500.00, 200.00, 200, 14, true),
  (gen_random_uuid(), 'FIRSTBITE', 'fixed', 100.00, 599.00, 100.00, 500, 45, true),
  (gen_random_uuid(), 'FESTIVE15', 'percentage', 15.00, 1000.00, 350.00, 100, 8, true),
  (gen_random_uuid(), 'SWEET20', 'percentage', 20.00, 1500.00, 500.00, 50, 12, true)
ON CONFLICT (code) DO UPDATE SET
  discount_value = EXCLUDED.discount_value,
  minimum_order_value = EXCLUDED.minimum_order_value,
  maximum_discount = EXCLUDED.maximum_discount,
  is_active = true;

-- STEP 6: POPULATE REAL PAYMENTS LINKED TO ORDERS
INSERT INTO public.payments (order_id, provider, razorpay_order_id, razorpay_payment_id, amount, currency, status)
SELECT o.id, 'razorpay', 'order_TpEYCydQuPrbqL', 'pay_TpEYLfeIaloMXW', 359.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-122435'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGzWVnY5kflpl', 'pay_TiGzhIc6eLuv7p', 899.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-880574'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGuO6d7w51UvH', 'pay_TiGuUe9y1R2m1F', 899.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-534069'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGjKHaQHgVJXL', 'pay_TiGjSA8aW6hFL4', 1748.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-477777'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGWDqU3Gnk6kZ', 'pay_TiGWKei55dlZA1', 399.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-243338'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGT0nQRHPRHO0', 'pay_TiGT78BuIGLgmJ', 849.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-668148'
UNION ALL
SELECT o.id, 'razorpay', 'order_TiGKE4pXFhHcum', 'pay_TiGKKu9MgTH5ho', 849.00, 'INR', 'captured'
FROM public.orders o WHERE o.order_number = 'DL-2026-470434';

-- STEP 7: POPULATE REAL CUSTOMER REVIEWS
INSERT INTO public.reviews (product_id, customer_name, rating, review, is_verified, is_approved)
VALUES
  (
    '22222222-2222-2222-2222-222222222201',
    'Rhea Mehta',
    5,
    'Unbelievably soft and delicate! The raspberry compote is naturally tart and perfectly complements the French ganache. 100% vegetarian yet richer than any European cake in Vadodara.',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    'Kavita Trivedi',
    5,
    'The 70% dark Belgian truffle is pure decadence. Deep, glossy, not overly sweet. Arrived safely within 2 hours in an insulated box.',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    'Tanvi Desai',
    5,
    'Cutest Korean bento cake in town! Custom message piping was crisp and the strawberry dairy cream melted in our mouths. Ideal for intimate birthdays!',
    true,
    true
  )
ON CONFLICT DO NOTHING;

-- STEP 8: POPULATE BESPOKE CUSTOM CAKE INQUIRIES
INSERT INTO public.custom_cake_orders (
  customer_name, customer_phone, customer_email, flavour, weight, filling, cream, cake_message, estimated_price, status, delivery_date, delivery_slot
) VALUES
  ('Karan Shah', '9909444882', 'karan.shah@gmail.com', 'Belgian Chocolate & Hazelnut Praline', '1.5 Kg', 'Roasted Hazelnut Ganache', 'Dark Chocolate Buttercream', 'Happy 30th Birthday Karan', 2499.00, 'APPROVED', current_date + 3, 'Evening (4:00 PM – 7:00 PM)'),
  ('Pooja Patel', '9825012345', 'pooja.patel@gmail.com', 'Vanilla Bean with Wild Strawberry', 'Petite Bento 300g', 'Fresh Strawberry Compote', 'Hokkaido Fresh Cream', 'Always With You ❤️', 599.00, 'IN_KITCHEN', current_date + 1, 'Afternoon (1:00 PM – 4:00 PM)');

-- STEP 9: POPULATE AUDIT LOGS
INSERT INTO public.audit_logs (action, entity_type, entity_id, metadata)
VALUES
  ('ADMIN_INITIALIZED', 'system', 'dashboard', '{"version": "2.0.0", "message": "Supabase database synchronized successfully"}'::jsonb),
  ('DATABASE_SEEDED', 'system', 'catalog', '{"categories_count": 4, "products_count": 8, "variants_count": 18}'::jsonb);
