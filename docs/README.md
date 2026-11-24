# 🎂 Délice & Co. — Artisan Patisserie & E-Commerce Platform

> **A full-stack gourmet patisserie web application featuring real-time Supabase PostgreSQL cloud sync, Razorpay payment gateway integration, live order tracking, and a real-time admin master dashboard.**

---

## 📌 Executive Summary

**Délice & Co.** is a modern, high-performance web platform designed for an artisan bakery in Vadodara, Gujarat. It allows customers to browse handcrafted gourmet cakes, customize celebration cakes, select precision delivery slots, pay securely via Razorpay or Cash/UPI on Delivery, and track order fulfillment in real-time. 

Store managers have access to a real-time **Admin Master Dashboard** that synchronizes instantly across any device (desktop, tablet, mobile) via Supabase PostgreSQL cloud database replication.

---

## 🚀 Key Features

### 🛍️ 1. Customer Storefront (`index.html`, `menu.html`, `custom.html`)
- **Interactive Cake Catalog**: High-resolution showcase of signature celebration cakes, Korean bento cakes, and cheesecakes with eggless/vegan filters.
- **Custom Cake Builder (`custom.html`)**: Interactive cake designer with tier selection, flavor compotes, cream textures, and custom photo upload.
- **Precision Checkout**:
  - Delivery date selector & 2-Hour Express Delivery slot management.
  - Coupon redemption engine with real-time discount deduction.
  - Razorpay Test Gateway integration + Cash/UPI on Delivery (COD) support.
  - Direct email receipt dispatch.

### 📍 2. Live Order Tracking (`track.html`)
- **Real-Time Order Lookup**: Search by order number (e.g. `DL-2026-122435`) or customer phone number.
- **4-Stage Visual Status Pipeline**: `Order Placed` ➔ `In the Oven (Baking)` ➔ `Out for Delivery` ➔ `Delivered & Enjoyed`.
- **Integrated Customer Support**: One-tap WhatsApp chat and phone call buttons connected directly to the bakery kitchen.

### 📊 3. Master Admin Dashboard (`dashboard.html`)
- **Universal Multi-Device Synchronization**: Order records remain 100% synchronized across laptops, iPads, and smartphones via Supabase PostgreSQL.
- **Live WebSocket & 15s Polling**: When any customer places an order on their phone, the admin dashboard updates automatically without refreshing.
- **Complete Business Operations Suite**:
  - **Orders Table**: Real-time filter by status, change order status (`Confirmed`, `Preparing`, `Out for Delivery`, `Delivered`), and print kitchen invoices.
  - **Financial KPIs**: Gross Revenue, Total Orders Placed, Average Order Value, and Delivered percentage.
  - **Customer Directory**: Auto-generated customer database with total spend, order count, and contact details.
  - **Product Catalog Manager**: Toggle product availability, update pricing, and edit stock.
  - **Analytics Charts**: Visual revenue and orders trend analysis powered by Chart.js.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, Vanilla CSS3, JavaScript (ES6+) | Blazing-fast page load, responsive luxury design, zero heavyweight framework overhead |
| **Cloud Database** | **Supabase (PostgreSQL 15)** | Relational database (`orders`, `order_items`, `products`, `payments`, `reviews`) with Real-time Replication |
| **Payment Gateway** | **Razorpay Checkout SDK** | Seamless card, NetBanking, and UPI payment processing (Test Mode) |
| **Serverless API** | **Netlify Functions (Node.js)** | Edge serverless order synchronization and backend API routing (`/api/orders`) |
| **Local Backend** | **Python 3 (`http.server`)** | Lightweight local server (`server.py`) with automatic multi-threaded Supabase sync and email receipt engine |

---

## 📂 Project Structure

```text
├── index.html                   # Main storefront landing page & catalog
├── menu.html                    # Extended gourmet bakery menu
├── custom.html                  # Interactive custom cake designer
├── track.html                   # Live order tracking page
├── dashboard.html               # Master Admin Dashboard interface
├── dashboard.css                # Luxury dashboard design tokens & styles
├── dashboard.js                 # Dashboard controller, real-time sync, KPIs & charts
├── main.js                      # Storefront logic, cart management & checkout flow
├── style.css                    # Global typography, color schemes & UI components
├── supabase.js                  # Supabase database adapter & fallback sync engine
├── server.py                    # Python development server & API dispatcher
├── orders_data.json             # Universal offline baseline order records
├── netlify/
│   └── functions/
│       └── orders.js            # Netlify serverless order sync API
├── supabase_schema.sql          # Complete PostgreSQL schema definitions
├── SEED_ALL_SUPABASE_TABLES.sql # Initial database seed script (8 real orders + catalog)
├── netlify.toml                 # Netlify deployment & redirect configurations
└── README.md                    # Project documentation (this file)
```

---

## ⚡ Quick Start: How to Run Locally

### Option 1: Python Server (Recommended)
Make sure you have Python 3 installed, then open a terminal in the project directory and run:

```bash
python server.py
```

Open your browser and visit:
- **Storefront**: [http://localhost:3000/index.html](http://localhost:3000/index.html)
- **Admin Dashboard**: [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html)
- **Order Tracking**: [http://localhost:3000/track.html](http://localhost:3000/track.html)

---

## ☁️ Deployment Guide (Netlify)

This project is pre-configured for one-click deployment on [Netlify](https://www.netlify.com/):

1. Push this repository to **GitHub**.
2. Go to **Netlify** ➔ **Add new site** ➔ **Import an existing project** from GitHub.
3. Build settings:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` (root directory)
4. Set optional environment variables in Netlify site settings (Supabase credentials are automatically pre-configured in `netlify/functions/orders.js` as fallback defaults).
5. Click **Deploy**. The site and serverless functions will be live in 30 seconds!

---

## 🔄 Multi-Device Real-Time Sync Verification

To verify that orders stay synchronized across all devices:

1. Open the **Dashboard** in one browser tab: [http://localhost:3000/dashboard.html](http://localhost:3000/dashboard.html).
2. Open an **Incognito / Private tab** (or a separate phone on the same network) at [http://localhost:3000/index.html](http://localhost:3000/index.html).
3. Place an order on the storefront (e.g., using Cash on Delivery).
4. Switch back to your Dashboard tab:
   - **Result**: The order appears immediately at the top of the table, revenue KPIs update, and line items are logged in Supabase without needing a page refresh!

---

## 🔒 Security & Best Practices

- **Client-Safe Secrets**: Only public Publishable Anon keys (`sb_publishable_...`) and Razorpay Test Key IDs are exposed to the browser.
- **Sanitized Inputs**: All inputs (names, phones, addresses, instructions) are sanitized against XSS attacks.
- **Fault-Tolerant Resilience**: If the internet or cloud DB is momentarily unavailable, the application gracefully falls back to local storage and offline caches so no customer checkout ever fails.

---

## 📞 Store Contact Information

- **Bakery**: Délice & Co. Artisan Patisserie
- **Location**: Akota, Vadodara, Gujarat, India
- **Phone / Kitchen Dispatch**: `+91 99094 44882`
- **Email**: `orders@deliceandcake.in`
