# DÉLICE & CO. — DATABASE DIRECTORY

This directory houses all authoritative PostgreSQL database schemas, seed datasets, RLS security configurations, and historical migration scripts for the Supabase cloud database (`https://fccisnncmndbjckpaebm.supabase.co`).

---

## Files Overview

| File | Purpose | Description |
| :--- | :--- | :--- |
| `supabase_schema.sql` | **Core Schema** | Complete DDL definitions for tables (`orders`, `order_items`, `products`, `product_variants`, `reviews`, `coupons`). |
| `supabase_seed.sql` | **Seed Data** | Initial catalog seed rows for artisan cakes, variants, and pricing. |
| `ENABLE_SUPABASE_ORDERS.sql` | **Orders Setup** | DDL script ensuring orders table permissions, check constraints, and columns match production. |
| `FIX_SUPABASE_SECURITY_RLS.sql`| **RLS Security Policies** | Hardened Row Level Security policies preventing unauthorized public modification while granting safe order insertions. |
| `SEED_ALL_SUPABASE_TABLES.sql` | **Master Seeder** | Comprehensive SQL script to seed all tables with artisan patisserie data. |

---

> [!IMPORTANT]
> Do not execute manual migrations against the production database without prior review and backup. Production database synchronization is handled via the configured Supabase client (`supabase.js`).
