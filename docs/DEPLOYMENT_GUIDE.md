# 🚀 DEPLOYMENT_GUIDE.md — Production & Staging Deployment Guide

**Project:** Cake & Joy  
**Brand Identity:** DÉLICE & CO. — Artisan Patisserie in Vadodara  
**Hosting Platforms:** Netlify (Frontend & Serverless Functions) + Supabase (PostgreSQL Database & Auth)  
**Payment Gateway:** Razorpay (Test Mode)  
**Local Development:** Python 3 (`server.py`)  

---

## 1. Architecture Overview

```
 [ Netlify CDN (Frontend) ] ──▶ [ Netlify Serverless Functions ]
          │                                  │
          ▼                                  ▼
 [ Browser / Client ] ─────────────▶ [ Supabase PostgreSQL (DB & Auth) ]
          │
          ▼
 [ Razorpay Gateway (Test Mode) ]
```

- **Frontend:** Static HTML5, Vanilla ES6+ JavaScript, CSS3 variables, WebP/JPG assets. Hosted on Netlify CDN.
- **Serverless Backend:** Node.js functions located in `netlify/functions/`:
  - `orders.js`: Handles `/api/create-razorpay-order`, `/api/verify-payment`, `/api/submit-order`, and `/api/orders`.
  - `send-email-receipt.js`: Handles `/api/send-email-receipt` via Resend API.
- **Database & Auth:** Supabase PostgreSQL with real-time REST API, Row Level Security, and JWT authentication.
- **Local Development Server:** `server.py` running standard Python `http.server` on port 3099 or 3000.

---

## 2. Netlify Production Deployment

### 2.1 Deployment via Git (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. In the Netlify Dashboard, click **Add new site** > **Import an existing project**.
3. Select your repository.
4. Configure Build Settings:
   - **Base directory:** Leave blank (root).
   - **Build command:** Leave blank (no compilation step needed for vanilla JS).
   - **Publish directory:** `.` (root directory).
   - **Functions directory:** `netlify/functions` (automatically detected from `netlify.toml`).
5. Click **Deploy Site**.

### 2.2 Deployment via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Deploy to draft/staging
netlify deploy

# Deploy to production
netlify deploy --prod --dir=. --functions=netlify/functions
```

### 2.3 Netlify Environment Variables Configuration
In the Netlify Dashboard, navigate to:
**Site configuration > Environment variables > Add a variable**

Add the following required variables:

| Variable Name | Description | Example / Recommended Value |
|---|---|---|
| `RAZORPAY_KEY_ID` | Razorpay Test Mode Key ID | `rzp_test_ThjQ4tQgJYio7w` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Mode Secret | Your secret from Razorpay Dashboard |
| `SUPABASE_URL` | Supabase Project URL | `https://fccisnncmndbjckpaebm.supabase.co` |
| `SUPABASE_KEY` | Supabase Anon or Service Role Key | Your Supabase project API key |
| `RESEND_API_KEY` | Resend API Key for Email Receipts | `re_...` (optional, for email delivery) |
| `STORE_EMAIL` | Official bakery receipt sender | `orders@deliceandcake.in` |
| `SITE_BASE_URL` | Base URL for tracking links | `https://cakeandjoy.netlify.app` |

---

## 3. Supabase PostgreSQL Database Setup

### 3.1 Initial Schema Migration
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Select your project (e.g. `fccisnncmndbjckpaebm`).
3. Navigate to **SQL Editor**.
4. Open the file `ENABLE_SUPABASE_ORDERS.sql` from the repository root.
5. Paste its contents into the SQL Editor and click **Run**.
   - This creates tables: `orders`, `order_items`, `cakes`, `custom_cake_orders`, `profiles`, `customers`, `coupons`, `payments`.

### 3.2 Security & Row Level Security (RLS) Migration
1. In the Supabase SQL Editor, open `FIX_SUPABASE_SECURITY_RLS.sql`.
2. Paste the script and click **Run**.
   - This re-enables Row Level Security on all tables.
   - It restricts customer data access so users only query their own orders.
   - It allows staff/admin accounts to manage all catalog cakes and orders.
   - It creates the secure `SECURITY DEFINER` function `get_order_tracking()` for guest tracking.

### 3.3 Supabase Authentication Settings
In the Supabase Dashboard:
1. Navigate to **Authentication > URL Configuration**.
2. Set **Site URL** to: `https://cakeandjoy.netlify.app` (or your custom domain).
3. Under **Redirect URLs**, add:
   - `https://cakeandjoy.netlify.app/index.html`
   - `https://cakeandjoy.netlify.app/login.html`
   - `http://localhost:3099/index.html` (for local development)
   - `http://localhost:3000/index.html`

---

## 4. Razorpay Test Mode Configuration

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Ensure the top-left toggle is set to **Test Mode** (Never activate Live Mode for this project).
3. Navigate to **Settings > API Keys**.
4. Generate a Test Key Pair.
5. Copy the Key ID (`rzp_test_...`) and Secret.
6. Verify that `main.js` and `supabase.js` use the test key:
   - Key ID: `rzp_test_ThjQ4tQgJYio7w`
7. Put `RAZORPAY_KEY_SECRET` in your Netlify Environment Variables and your local `.env` file.
8. **CRITICAL SECURITY RULE:** Never commit `RAZORPAY_KEY_SECRET` into client-side code, HTML, or public GitHub repositories.

---

## 5. Local Development Server Setup

### 5.1 Prerequisites
- Python 3.9+ installed (`python --version`).
- Node.js 18+ (optional, for running test suites).

### 5.2 Starting the Server
```powershell
# Open terminal in project root:
cd c:\Users\praja\OneDrive\Desktop\cakeandjoy

# Run Python server on port 3099:
python server.py 3099
```
Output:
```
==================================================
  DÉLICE & CO. — ARTISAN PATISSERIE SERVER
  Local URL: http://localhost:3099/index.html
  Admin Hub: http://localhost:3099/dashboard.html
==================================================
```

### 5.3 Verifying Local Endpoints
Open a second terminal window and test:
```powershell
# Verify Server Health:
curl http://localhost:3099/api/health

# Verify Sensitive Files are Blocked (Must return 404):
curl http://localhost:3099/orders_data.json
curl http://localhost:3099/.env
curl http://localhost:3099/server.py
```

---

## 6. Pre-Flight Verification & Quality Checklist

Before completing deployment, execute the automated regression test suites:

```powershell
# 1. Device Auth Gate Test (16 tests):
node scripts/test_device_auth_gate.js

# 2. 10 End-to-End User Journeys Test (47 tests):
node scripts/test_user_journeys.js

# 3. Complete Security, Syntax & Backend Test (45 tests):
node scripts/run_all_tests.js
```

All 108 tests must report `[PASS]` with 0 failures.

### 6.1 Manual Testing Checklist (On Mobile & Desktop)
- [ ] **First Visit on Mobile:** Opening `https://cakeandjoy.netlify.app` redirects to `login.html`.
- [ ] **Guest Browse:** Clicking *"Continue as Guest & Browse Menu"* routes to `index.html?guest=1`.
- [ ] **Add to Basket:** Clicking "+ Basket" on any cake adds the item and opens checkout immediately.
- [ ] **Guest Checkout:** Enter test customer name, phone, address, select evening slot, and choose Razorpay.
- [ ] **Payment Simulation:** Razorpay Test Mode opens; test card `4012 0000 0000 0002` or success UPI succeeds.
- [ ] **In-Modal Confirmation:** Order confirmation renders order number, line items, live tracking button, and print button.
- [ ] **Live Order Tracking:** Clicking "Track Order" opens `track.html?order=...` and displays kitchen progress stages.
- [ ] **Admin Operations:** Go to `dashboard.html`, authenticate with `admin@deliceandcake.in` / `Admin@123456`, edit a cake price, and verify that the updated price saves to Supabase and displays on the menu.
- [ ] **Mobile Responsiveness:** Inspect at 320px, 360px, 375px, 390px, 430px; verify no horizontal scroll and clean single-column checkout fields.

---

## 7. Maintenance & Troubleshooting

### Issue: "Razorpay Payment Failed or Gateway Blocked"
- **Solution:** Verify `RAZORPAY_KEY_ID` in `main.js` starts with `rzp_test_`. Check that popup blockers are not blocking the Razorpay iframe.

### Issue: "Admin Dashboard Reverts Status Changes"
- **Solution:** Status changes now persist via `delice_order_status_overrides` in localStorage and synchronize via background `PATCH` requests to Supabase REST API `/rest/v1/orders`. Ensure `SUPABASE_URL` and `SUPABASE_KEY` are valid.

### Issue: "PWA Service Worker Caching Stale Assets"
- **Solution:** Increment the cache version in `sw.js` (e.g. `delice-v1.2`) to trigger immediate browser cache eviction.
