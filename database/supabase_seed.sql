-- ========================================================================
-- DÉLICE & CO. — SEED DATA SCRIPT
-- Products, Variants, Categories, Delivery Slots, Test Coupons, Test Orders
-- ========================================================================

-- 1. Insert Categories
insert into public.categories (id, name, slug, image_url, is_active)
values
  ('11111111-1111-1111-1111-111111111101', 'Celebration Chiffon', 'celebration-chiffon', 'assets/cake_velvet.jpg', true),
  ('11111111-1111-1111-1111-111111111102', 'Korean Bento', 'korean-bento', 'assets/cake_bento.jpg', true),
  ('11111111-1111-1111-1111-111111111103', 'Dietary & Nut Flour', 'dietary-nut-flour', 'assets/cake_pistachio.jpg', true),
  ('11111111-1111-1111-1111-111111111104', 'Grand Wedding Towers', 'wedding-towers', 'assets/cake_wedding.jpg', true)
on conflict (slug) do update set
  name = excluded.name,
  image_url = excluded.image_url;

-- 2. Insert Products
insert into public.products (id, name, slug, description, category_id, category, base_price, image_url, is_active, is_featured, flavor_profile, dietary_info)
values
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
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  base_price = excluded.base_price,
  image_url = excluded.image_url,
  category = excluded.category;

-- 3. Insert Product Variants
insert into public.product_variants (id, product_id, weight, price, stock, is_available)
values
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
on conflict do nothing;

-- 4. Insert Test Delivery Slots (Next 7 days in Vadodara)
insert into public.delivery_slots (id, date, start_time, end_time, maximum_orders, current_orders, is_available)
values
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
  -- Day after tomorrow
  (gen_random_uuid(), current_date + 2, '10:00:00', '13:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '13:00:00', '16:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '16:00:00', '19:00:00', 10, 0, true),
  (gen_random_uuid(), current_date + 2, '19:00:00', '22:00:00', 10, 0, true)
on conflict do nothing;

-- 5. Insert Test Coupons
insert into public.coupons (id, code, discount_type, discount_value, minimum_order_value, maximum_discount, usage_limit, used_count, is_active)
values
  (gen_random_uuid(), 'DELICE10', 'percentage', 10.00, 500.00, 200.00, 200, 14, true),
  (gen_random_uuid(), 'FIRSTBITE', 'fixed', 100.00, 599.00, 100.00, 500, 45, true),
  (gen_random_uuid(), 'FESTIVE15', 'percentage', 15.00, 1000.00, 350.00, 100, 8, true),
  (gen_random_uuid(), 'SWEET20', 'percentage', 20.00, 1500.00, 500.00, 50, 12, true)
on conflict (code) do update set
  discount_value = excluded.discount_value,
  is_active = true;

-- 6. Insert Historical Test Orders
insert into public.orders (
  id,
  order_number,
  status,
  payment_status,
  payment_method,
  subtotal,
  delivery_fee,
  discount,
  total,
  delivery_address,
  delivery_date,
  delivery_slot_text,
  customer_name,
  customer_phone,
  created_at
) values
  (
    '44444444-4444-4444-4444-444444444401',
    'DL-2026-000101',
    'DELIVERED',
    'PAID',
    'RAZORPAY',
    5598.00,
    0.00,
    0.00,
    5598.00,
    '42, Maitri Society, Akota, Vadodara - 390020',
    current_date - 2,
    'Afternoon (1:00 PM – 4:00 PM)',
    'Yash Prajapati',
    '9909444882',
    now() - interval '2 days'
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    'DL-2026-000102',
    'CONFIRMED',
    'PAID',
    'RAZORPAY',
    899.00,
    0.00,
    89.90,
    809.10,
    'B-301 Nilamber Palms, Vasna-Bhayli Road, Vadodara',
    current_date,
    'Evening (4:00 PM – 7:00 PM)',
    'Ananya Shah',
    '9876543210',
    now() - interval '3 hours'
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    'DL-2026-000103',
    'BAKING',
    'PAID',
    'RAZORPAY',
    1248.00,
    0.00,
    100.00,
    1148.00,
    'Plot 12, Sun Pharma Road, Atladara, Vadodara',
    current_date,
    'Night (7:00 PM – 10:00 PM)',
    'Devendra Patel',
    '9825123456',
    now() - interval '1 hour'
  )
on conflict (order_number) do nothing;

-- 7. Insert Order Items for Test Orders
insert into public.order_items (order_id, product_id, variant_id, product_name_snapshot, variant_snapshot, quantity, unit_price, total_price, cake_message)
values
  (
    '44444444-4444-4444-4444-444444444401',
    '22222222-2222-2222-2222-222222222205',
    '33333333-3333-3333-3333-333333333501',
    'Classic German Black Forest Gateau',
    '500 Gm',
    1,
    599.00,
    599.00,
    'Happy 25th Anniversary'
  ),
  (
    '44444444-4444-4444-4444-444444444401',
    '22222222-2222-2222-2222-222222222208',
    '33333333-3333-3333-3333-333333333801',
    'The Royal Three-Tier Celebration Tower',
    '3 Kg',
    1,
    4999.00,
    4999.00,
    'Mr & Mrs Patel'
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    '22222222-2222-2222-2222-222222222201',
    '33333333-3333-3333-3333-333333333101',
    'The Velvet Rose & Raspberry Chiffon',
    '500 Gm',
    1,
    899.00,
    899.00,
    'Happy Birthday Princess'
  )
on conflict do nothing;

-- 8. Insert Verified Reviews for Delivered Products
insert into public.reviews (product_id, order_id, customer_name, rating, review, is_verified, is_approved)
values
  (
    '22222222-2222-2222-2222-222222222201',
    '44444444-4444-4444-4444-444444444402',
    'Rhea Mehta',
    5,
    'Unbelievably soft and delicate! The raspberry compote is naturally tart and perfectly complements the French ganache. 100% vegetarian yet richer than any European cake in Vadodara.',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    null,
    'Kavita Trivedi',
    5,
    'The 70% dark Belgian truffle is pure decadence. Deep, glossy, not overly sweet. Arrived safely within 2 hours in an insulated box.',
    true,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    null,
    'Tanvi Desai',
    5,
    'Cutest Korean bento cake in town! Custom message piping was crisp and the strawberry dairy cream melted in our mouths. Ideal for intimate birthdays!',
    true,
    true
  )
on conflict do nothing;
