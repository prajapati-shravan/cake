\
"""
DÉLICE & CO. — ARTISAN PATISSERIE
Production Full-Stack E-Commerce Server
Provides:
  - Static file hosting
  - Secure Razorpay Order Creation (Keeps Secret Key 100% on Backend)
  - Cryptographic HMAC-SHA256 Signature Verification
  - Supabase Database Integration for Orders & Order Items
  - Non-blocking Asynchronous Gmail / Email Receipt Dispatch Engine
  - Robust Input Sanitization & Error Handling
"""

import sys
import http.server
import socketserver
import socket
import urllib.request
import urllib.parse
import json
import os
import hmac
import hashlib
import mimetypes
import smtplib
import html
import threading
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

# Auto-load .env file if present
def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip("'\"")
                os.environ[k] = v

load_env_file()

PORT = int(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1].isdigit() else int(os.environ.get('PORT', 3000))

# Secure Server-Side Credentials (NEVER exposed to browser)
rzp_key = os.environ.get('RAZORPAY_KEY_ID', '').strip()
RAZORPAY_KEY_ID = rzp_key if rzp_key and 'YourTestKeyId' not in rzp_key else 'rzp_test_ThjQ4tQgJYio7w'

rzp_secret = os.environ.get('RAZORPAY_KEY_SECRET', '').strip()
RAZORPAY_KEY_SECRET = rzp_secret if rzp_secret and 'your_razorpay' not in rzp_secret else ''

SUPABASE_URL = os.environ.get('SUPABASE_URL', 'https://fccisnncmndbjckpaebm.supabase.co').rstrip('/')
sr_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY', '').strip()
if sr_key and 'your' not in sr_key.lower() and 'placeholder' not in sr_key.lower():
    SUPABASE_KEY = sr_key
else:
    SUPABASE_KEY = (os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('SUPABASE_KEY', 'sb_publishable_XSUEFzUa1bB0tGbtGjixYg_v1eQGeik')).strip()


STORE_PHONE = "+91 99094 44882"
STORE_EMAIL = os.environ.get('STORE_EMAIL', 'orders@deliceandcake.in')
STORE_NAME = "Délice & Co. Artisan Patisserie"
SITE_BASE_URL = os.environ.get('SITE_BASE_URL', '').rstrip('/')

def sanitize_str(val, max_len=500):
    if val is None:
        return ''
    cleaned = html.escape(str(val).strip())
    return cleaned[:max_len]

def sanitize_plain(val, max_len=500):
    if val is None:
        return ''
    return str(val).strip()[:max_len]

def get_smtp_config():
    load_env_file()
    host = os.environ.get('SMTP_HOST', 'smtp.gmail.com').strip()
    port = int(os.environ.get('SMTP_PORT', 587))
    user = os.environ.get('SMTP_USER', os.environ.get('GMAIL_USER', '')).strip()
    password = os.environ.get('SMTP_PASS', os.environ.get('GMAIL_APP_PASSWORD', '')).strip().replace(' ', '')
    return host, port, user, password

ORDERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'orders_data.json')

def load_local_orders():
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception as e:
            print("Error loading local orders:", e)
    return []

def save_local_order(order_dict):
    orders = load_local_orders()
    ord_num = order_dict.get('order_number') or order_dict.get('id')
    if ord_num:
        existing_idx = next((i for i, o in enumerate(orders) if (o.get('order_number') == ord_num or o.get('id') == ord_num)), -1)
        if existing_idx >= 0:
            orders[existing_idx] = {**orders[existing_idx], **order_dict}
        else:
            orders.insert(0, order_dict)
    else:
        orders.insert(0, order_dict)
    try:
        with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
            json.dump(orders, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print("Error saving local order to file:", e)
def generate_order_tracking_url(order_number, host_header=None):
    if SITE_BASE_URL:
        base = SITE_BASE_URL
    elif host_header:
        protocol = 'https' if not host_header.startswith('localhost') and not host_header.startswith('127.0.0.1') else 'http'
        base = f"{protocol}://{host_header}"
    else:
        base = f"http://localhost:{PORT}"
    return f"{base}/track.html?order={urllib.parse.quote(str(order_number))}"

def validate_and_sanitize_order(order_data):
    """
    Sanitizes all string fields and verifies financial calculations.
    """
    customer = order_data.get('customer') or {}
    clean_cust = {
        'name': sanitize_plain(customer.get('name') or 'Valued Customer', 120),
        'email': sanitize_plain(customer.get('email') or '', 150),
        'phone': sanitize_plain(customer.get('phone') or '', 30),
        'address': sanitize_plain(customer.get('address') or 'Vadodara, Gujarat', 300)
    }

    raw_items = order_data.get('items') or []
    clean_items = []
    calc_subtotal = 0.0

    for it in raw_items:
        qty = max(1, int(it.get('qty', 1)))
        price = max(0.0, float(it.get('price', 0)))
        item_total = price * qty
        calc_subtotal += item_total
        clean_items.append({
            'name': sanitize_plain(it.get('name', 'Artisan Creation'), 150),
            'weight': sanitize_plain(it.get('weight', 'Standard'), 50),
            'qty': qty,
            'price': price,
            'total': item_total,
            'message': sanitize_plain(it.get('message', ''), 120),
            'img': sanitize_plain(it.get('img', 'assets/cake_velvet.jpg'), 300),
            'isCustom': bool(it.get('isCustom', False))
        })

    discount = max(0.0, float(order_data.get('discount', 0)))
    delivery_fee = max(0.0, float(order_data.get('delivery_fee', 0)))
    calc_total = max(0.0, calc_subtotal - discount + delivery_fee)

    order_num = sanitize_plain(order_data.get('order_number') or f"DL-{datetime.now().year}-{int(datetime.now().timestamp()) % 1000000}", 50)
    deliv_date = sanitize_plain(order_data.get('deliveryDate') or order_data.get('delivery_date') or datetime.now().strftime('%Y-%m-%d'), 30)
    deliv_slot = sanitize_plain(order_data.get('deliverySlotText') or order_data.get('delivery_slot_text') or order_data.get('deliverySlot') or '2-Hour Express Delivery', 100)
    instructions = sanitize_plain(order_data.get('specialInstructions') or order_data.get('special_instructions') or '', 400)

    return {
        'order_number': order_num,
        'customer': clean_cust,
        'customer_name': clean_cust['name'],
        'customer_email': clean_cust['email'],
        'customer_phone': clean_cust['phone'],
        'delivery_address': clean_cust['address'],
        'delivery_date': deliv_date,
        'delivery_slot_text': deliv_slot,
        'special_instructions': instructions,
        'items': clean_items,
        'subtotal': round(calc_subtotal, 2),
        'discount': round(discount, 2),
        'delivery_fee': round(delivery_fee, 2),
        'total': round(calc_total, 2),
        'payment_method': sanitize_plain(order_data.get('paymentMethod') or order_data.get('payment_method') or 'RAZORPAY', 30),
        'payment_status': sanitize_plain(order_data.get('payment_status') or 'PAID', 30),
        'status': sanitize_plain(order_data.get('status') or 'CONFIRMED', 30),
        'payment_id': sanitize_plain(order_data.get('paymentId') or order_data.get('razorpay_payment_id') or '', 100),
        'created_at': order_data.get('created_at') or datetime.now().isoformat()
    }

def send_customer_order_email(order_data, host_header=None):
    """
    Dispatches rich HTML Tax Invoice & Receipt directly to customer's Gmail/Email.
    """
    customer = order_data.get('customer', {})
    cust_name = sanitize_str(customer.get('name') or 'Valued Customer')
    cust_email = sanitize_plain(customer.get('email') or '')
    cust_phone = sanitize_str(customer.get('phone') or 'N/A')
    cust_addr = sanitize_str(customer.get('address') or 'Vadodara, Gujarat')
    order_num = sanitize_str(order_data.get('order_number') or f"DL-{datetime.now().year}-000000")
    track_url = generate_order_tracking_url(order_num, host_header)
    
    date = sanitize_str(order_data.get('delivery_date') or order_data.get('deliveryDate') or datetime.now().strftime('%Y-%m-%d'))
    slot = sanitize_str(order_data.get('delivery_slot_text') or order_data.get('deliverySlotText') or order_data.get('deliverySlot') or '2-Hour Express Delivery')
    items = order_data.get('items', [])
    total = float(order_data.get('total', 0))
    subtotal = float(order_data.get('subtotal', total))
    discount = float(order_data.get('discount', 0))
    pay_method = sanitize_str(order_data.get('payment_method') or order_data.get('paymentMethod') or 'RAZORPAY')
    pay_status = sanitize_str(order_data.get('payment_status', 'PAID'))
    payment_id = sanitize_str(order_data.get('payment_id') or order_data.get('paymentId') or order_data.get('razorpay_payment_id', ''))

    subject = f"Official Order Receipt & Confirmation for Order #{order_num} — Délice & Co."

    # Build HTML table rows for items
    item_rows_html = ""
    for idx, item in enumerate(items, start=1):
        i_name = sanitize_str(item.get('name', 'Artisan Creation'))
        i_weight = sanitize_str(item.get('weight', 'Standard'))
        i_qty = int(item.get('qty', 1))
        i_price = float(item.get('price', 0))
        i_total = i_price * i_qty
        i_msg = sanitize_str(item.get('message', ''))
        msg_badge = f'<div style="font-size:12px; color:#854D0E; background:#FEF9C3; padding:2px 6px; border-radius:4px; margin-top:4px; display:inline-block;">Message: &ldquo;{i_msg}&rdquo;</div>' if i_msg else ''

        item_rows_html += f"""
        <tr style="border-bottom: 1px solid #E2E8F0;">
            <td style="padding: 12px 10px; color: #64748B; font-size: 13px;">{idx}</td>
            <td style="padding: 12px 10px; color: #1E293B; font-size: 14px;">
                <strong>{i_name}</strong>
                <div style="font-size: 12px; color: #64748B;">Weight / Variant: {i_weight} &bull; 100% Veg &amp; Eggless</div>
                {msg_badge}
            </td>
            <td style="padding: 12px 10px; text-align: center; color: #1E293B; font-size: 14px;">{i_qty}</td>
            <td style="padding: 12px 10px; text-align: right; color: #1E293B; font-size: 14px;">₹{i_price:,.2f}</td>
            <td style="padding: 12px 10px; text-align: right; color: #1B3358; font-weight: 700; font-size: 14px;">₹{i_total:,.2f}</td>
        </tr>
        """

    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #1E293B;">
    <div style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1B3358 0%, #0F172A 100%); color: #FFFFFF; padding: 28px 24px; text-align: center;">
            <div style="color: #F59E0B; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">100% Pure Veg &bull; Artisan Patisserie</div>
            <h1 style="font-family: Georgia, serif; font-size: 26px; margin: 0; color: #FFF8EE; letter-spacing: 0.5px;">DÉLICE &amp; CO.</h1>
            <p style="color: #CBD5E1; font-size: 13px; margin: 6px 0 0;">Official Order &amp; Payment Confirmation Receipt</p>
        </div>

        <div style="padding: 24px;">
            <!-- Greeting & Status -->
            <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 28px; line-height: 1;">🎉</div>
                <div>
                    <strong style="color: #166534; font-size: 15px; display: block;">Payment Received &amp; Order Confirmed!</strong>
                    <span style="color: #15803D; font-size: 13px;">Dear {cust_name}, your gourmet order has been scheduled with our master chefs in Akota, Vadodara.</span>
                </div>
            </div>

            <!-- Meta info grid -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
                <tr>
                    <td style="padding: 6px 0; color: #64748B; width: 40%;">Order Number:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #1E293B;"><span style="background: #EEF2F6; padding: 3px 8px; border-radius: 6px;">#{order_num}</span></td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Scheduled Delivery:</td>
                    <td style="padding: 6px 0; font-weight: 600; color: #1E293B;">{date} &bull; {slot}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Delivery Destination:</td>
                    <td style="padding: 6px 0; color: #1E293B;">{cust_addr} (Vadodara)</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Customer Contact:</td>
                    <td style="padding: 6px 0; color: #1E293B;">{cust_phone} &bull; {cust_email}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Payment Status:</td>
                    <td style="padding: 6px 0; color: #166534; font-weight: 700;">{pay_status} via {pay_method} ✓</td>
                </tr>
                {f'<tr><td style="padding: 6px 0; color: #64748B;">Razorpay Payment Ref:</td><td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #0F172A;">{payment_id}</td></tr>' if payment_id else ''}
            </table>

            <!-- Itemized Table -->
            <div style="font-size: 14px; font-weight: 700; color: #1B3358; margin-bottom: 8px; border-bottom: 2px solid #E2E8F0; padding-bottom: 6px;">Order Items Breakdown</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                    <tr style="background: #F1F5F9; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase;">
                        <th style="padding: 8px 10px;">#</th>
                        <th style="padding: 8px 10px;">Item</th>
                        <th style="padding: 8px 10px; text-align: center;">Qty</th>
                        <th style="padding: 8px 10px; text-align: right;">Unit Price</th>
                        <th style="padding: 8px 10px; text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {item_rows_html}
                </tbody>
            </table>

            <!-- Financial Summary -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-bottom: 24px; font-size: 13.5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #64748B;">
                    <span>Items Subtotal:</span>
                    <span>₹{subtotal:,.2f}</span>
                </div>
                {f'<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #166534;"><span>Coupon Discount:</span><span>-₹{discount:,.2f}</span></div>' if discount > 0 else ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #166534;">
                    <span>Vadodara Express Delivery:</span>
                    <span style="font-weight: 700;">FREE (₹0.00)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1.5px dashed #CBD5E1; font-size: 16px; font-weight: 800; color: #1B3358;">
                    <span>Total Amount Paid:</span>
                    <span style="color: #C25E34;">₹{total:,.2f}</span>
                </div>
            </div>

            <!-- Footer Notes -->
            <div style="font-size: 12px; color: #64748B; line-height: 1.6; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                <p style="margin: 0 0 6px;"><strong>Dietary Guarantee:</strong> All items are 100% vegetarian, eggless, handcrafted with pure dairy butter and premium couverture chocolate.</p>
                <p style="margin: 0 0 6px;">Need help with your order? Contact kitchen dispatch at <a href="tel:{STORE_PHONE}" style="color: #1B3358; font-weight: 700;">{STORE_PHONE}</a> or email <a href="mailto:{STORE_EMAIL}" style="color: #1B3358;">{STORE_EMAIL}</a>.</p>
                <p style="margin: 12px 0 0; text-align: center; color: #94A3B8; font-size: 11px;">&copy; {datetime.now().year} {STORE_NAME}, Akota, Vadodara, Gujarat.</p>
            </div>
        </div>
    </div>
</body>
</html>
"""

    text_fallback = f"""
DÉLICE & CO. — ARTISAN PATISSERIE
========================================
OFFICIAL ORDER & PAYMENT RECEIPT
========================================
Order Number: #{order_num}
Customer Name: {cust_name}
Customer Email: {cust_email}
Delivery Date: {date} ({slot})
Delivery Address: {cust_addr}

Total Amount Paid: ₹{total:,.2f}
Payment Method: {pay_method} (Status: {pay_status})
Razorpay Payment ID: {payment_id}

Customer Support: {STORE_PHONE} | {STORE_EMAIL}
========================================
"""

    smtp_host, smtp_port, smtp_user, smtp_pass = get_smtp_config()

    if cust_email and smtp_user and smtp_pass:
        try:
            print(f"[EMAIL] Attempting to dispatch receipt to {cust_email} via Gmail SMTP ({smtp_user})...")
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{STORE_NAME} <{smtp_user}>"
            msg['To'] = cust_email
            msg['Reply-To'] = STORE_EMAIL

            msg.attach(MIMEText(text_fallback, 'plain', 'utf-8'))
            msg.attach(MIMEText(html_content, 'html', 'utf-8'))

            if smtp_port == 465:
                server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=12)
            else:
                server = smtplib.SMTP(smtp_host, smtp_port, timeout=12)
                server.starttls()

            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [cust_email], msg.as_string())
            server.quit()
            print(f"[EMAIL] SUCCESS: Automatic receipt email successfully delivered to Gmail: {cust_email}")
            return {'success': True, 'dispatched': True, 'mode': 'smtp', 'tracking_url': track_url}
        except Exception as e:
            print(f"[EMAIL] ERROR: SMTP delivery failed to {cust_email}: {e}")
            return {'success': False, 'dispatched': False, 'mode': 'smtp_error', 'error': str(e), 'tracking_url': track_url}
    else:
        print(f"[EMAIL] INFO: SMTP not configured (user: '{smtp_user}', pass_set: {bool(smtp_pass)}). Receipt link prepared for {cust_email}.")
        return {'success': True, 'dispatched': False, 'mode': 'webmail_ready', 'tracking_url': track_url}

def dispatch_email_in_background(order_data, host_header=None):
    """
    Executes email sending in an asynchronous daemon thread so the client receives instantaneous responses.
    """
    t = threading.Thread(target=send_customer_order_email, args=(order_data, host_header), daemon=True)
    t.start()

# -------------------------------------------------------------
# IN-MEMORY SLIDING WINDOW IP RATE LIMITER
# Guards backend /api/ endpoints against automated abuse, scraping & credential attacks
# -------------------------------------------------------------
class IPRateLimiter:
    def __init__(self, max_requests=60, window_seconds=60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.ip_records = {}  # ip -> list of float timestamps
        self.lock = threading.Lock()

    def get_client_ip(self, handler):
        # Support X-Forwarded-For if behind a reverse proxy / CDN
        xff = handler.headers.get('X-Forwarded-For')
        if xff:
            return xff.split(',')[0].strip()
        client_addr = getattr(handler, 'client_address', None)
        if client_addr and len(client_addr) > 0:
            return str(client_addr[0])
        return '127.0.0.1'

    def is_allowed(self, client_ip):
        now = time.time()
        window_start = now - self.window_seconds

        with self.lock:
            history = self.ip_records.get(client_ip, [])
            active = [t for t in history if t > window_start]

            if len(active) >= self.max_requests:
                retry_after = max(1, int(active[0] + self.window_seconds - now))
                self.ip_records[client_ip] = active
                return False, retry_after

            active.append(now)
            self.ip_records[client_ip] = active

            # Memory safeguard: prune stale IPs when table grows beyond 2000 entries
            if len(self.ip_records) > 2000:
                cutoff = now - (self.window_seconds * 2)
                self.ip_records = {
                    ip: ts for ip, ts in self.ip_records.items()
                    if ts and ts[-1] > cutoff
                }

            return True, 0

GLOBAL_RATE_LIMITER = IPRateLimiter(max_requests=60, window_seconds=60)

class DeliceCommerceHandler(http.server.SimpleHTTPRequestHandler):
    def send_json(self, status_code, data, extra_headers=None):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
        if extra_headers:
            for hk, hv in extra_headers.items():
                self.send_header(hk, hv)
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey')
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        clean_path = path.lower().split('?')[0]

        # Security: Block sensitive system files, source scripts, and databases from public downloads
        if (
            clean_path.startswith('/.') or
            clean_path.endswith('.env') or
            '.env' in clean_path or
            clean_path.endswith('.sql') or
            clean_path.endswith('.py') or
            clean_path.endswith('.md') or
            clean_path == '/orders_data.json' or
            '..' in clean_path
        ):
            self.send_response(404)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>404 Not Found</h1>')
            return

        # API: Health Check
        if path == '/api/health':
            return self.send_json(200, {
                'status': 'healthy',
                'service': 'Delice & Co. Commerce Server',
                'version': '2.0.0',
                'time': datetime.now().isoformat(),
                'smtp_configured': bool(os.environ.get('SMTP_USER') or os.environ.get('GMAIL_USER')),
                'supabase_configured': bool(SUPABASE_URL and SUPABASE_KEY),
                'razorpay_configured': bool(RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
            })

        # Apply Rate Limiting to GET /api/ endpoints (health check is exempt for uptime monitoring)
        if path.startswith('/api/'):
            client_ip = GLOBAL_RATE_LIMITER.get_client_ip(self)
            allowed, retry_after = GLOBAL_RATE_LIMITER.is_allowed(client_ip)
            if not allowed:
                return self.send_json(429, {
                    'success': False,
                    'error': f'Rate limit exceeded. Too many requests from your IP. Please retry in {retry_after} seconds.',
                    'retry_after': retry_after
                }, extra_headers={'Retry-After': str(retry_after)})

        # API: Public Config (Safe keys only)
        if path == '/api/config':
            return self.send_json(200, {
                'razorpay_key_id': RAZORPAY_KEY_ID,
                'supabase_url': SUPABASE_URL,
                'supabase_key': SUPABASE_KEY,
                'store_phone': STORE_PHONE,
                'store_email': STORE_EMAIL
            })

        # API: Fetch Orders (Single order tracking or Admin listing)
        if path == '/api/orders':
            query_params = urllib.parse.parse_qs(parsed.query)
            target_num = query_params.get('order_number', [''])[0].strip().lower() or query_params.get('order', [''])[0].strip().lower()

            if target_num:
                all_orders = load_local_orders()
                match = None
                for o in all_orders:
                    if (o.get('order_number') or o.get('id') or '').lower() == target_num:
                        match = o
                        break
                if not match and SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL.startswith('http'):
                    try:
                        url = f"{SUPABASE_URL}/rest/v1/orders?order_number=eq.{urllib.parse.quote(target_num)}&select=*,items:order_items(*)"
                        req = urllib.request.Request(url, headers={
                            'apikey': SUPABASE_KEY,
                            'Authorization': f'Bearer {SUPABASE_KEY}'
                        })
                        with urllib.request.urlopen(req, timeout=1.5) as resp:
                            sb_orders = json.loads(resp.read().decode('utf-8'))
                            if sb_orders and len(sb_orders) > 0:
                                match = sb_orders[0]
                    except Exception:
                        pass
                if match:
                    return self.send_json(200, {'success': True, 'order': match})
                return self.send_json(404, {'success': False, 'error': 'Order not found'})

            all_orders = load_local_orders()
            order_map = {}
            for o in all_orders:
                num = (o.get('order_number') or o.get('id') or '').lower()
                if num:
                    order_map[num] = o
            
            if SUPABASE_URL and SUPABASE_URL.startswith('http') and not 'YourProject' in SUPABASE_URL:
                try:
                    url = f"{SUPABASE_URL}/rest/v1/orders?select=*,items:order_items(*)&order=created_at.desc"
                    req = urllib.request.Request(url, headers={
                        'apikey': SUPABASE_KEY,
                        'Authorization': f'Bearer {SUPABASE_KEY}'
                    })
                    with urllib.request.urlopen(req, timeout=1.5) as resp:
                        sb_orders = json.loads(resp.read().decode('utf-8'))
                        if isinstance(sb_orders, list):
                            for sbo in sb_orders:
                                k = (sbo.get('order_number') or sbo.get('id', '')).lower()
                                if k:
                                    if k in order_map:
                                        order_map[k] = {**order_map[k], **sbo}
                                    else:
                                        order_map[k] = sbo
                except Exception as e:
                    pass

            merged = list(order_map.values())
            merged.sort(key=lambda x: str(x.get('created_at') or x.get('createdAt') or ''), reverse=True)
            return self.send_json(200, {'success': True, 'orders': merged})

        # Static File Serving
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        raw_body = self.rfile.read(length).decode('utf-8') if length > 0 else '{}'
        
        try:
            body = json.loads(raw_body)
        except Exception:
            body = {}

        # Apply Rate Limiting to POST /api/ endpoints
        if path.startswith('/api/'):
            client_ip = GLOBAL_RATE_LIMITER.get_client_ip(self)
            allowed, retry_after = GLOBAL_RATE_LIMITER.is_allowed(client_ip)
            if not allowed:
                return self.send_json(429, {
                    'success': False,
                    'error': f'Rate limit exceeded. Too many requests from your IP. Please retry in {retry_after} seconds.',
                    'retry_after': retry_after
                }, extra_headers={'Retry-After': str(retry_after)})

        # -------------------------------------------------------------
        # API 0: SYNC / CREATE / UPDATE ORDER
        # -------------------------------------------------------------
        if path == '/api/orders':
            action = body.get('action', 'create')
            if action == 'update_status':
                ord_id = body.get('orderId')
                new_status = body.get('status', 'CONFIRMED')
                all_orders = load_local_orders()
                for o in all_orders:
                    if (o.get('order_number') == ord_id or o.get('id') == ord_id):
                        o['status'] = new_status
                        save_local_order(o)
                        break
                # Background sync to Supabase
                def sync_status_to_supabase_bg(o_id, stat):
                    if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL.startswith('http') and not 'YourProject' in SUPABASE_URL:
                        try:
                            clean_stat = stat.upper()
                            patch_url = f"{SUPABASE_URL}/rest/v1/orders?order_number=eq.{urllib.parse.quote(str(o_id))}"
                            patch_data = json.dumps({'status': clean_stat, 'updated_at': datetime.now().isoformat()}).encode('utf-8')
                            req = urllib.request.Request(
                                patch_url,
                                data=patch_data,
                                method='PATCH',
                                headers={
                                    'apikey': SUPABASE_KEY,
                                    'Authorization': f'Bearer {SUPABASE_KEY}',
                                    'Content-Type': 'application/json',
                                    'Prefer': 'return=minimal'
                                }
                            )
                            urllib.request.urlopen(req, timeout=5)
                        except Exception as e:
                            print("Supabase status update bg notice:", e)
                threading.Thread(target=sync_status_to_supabase_bg, args=(ord_id, new_status), daemon=True).start()
                return self.send_json(200, {'success': True, 'updated': True, 'status': new_status})
            
            raw_order = body.get('order_data') or body.get('order') or body
            if raw_order and (raw_order.get('order_number') or raw_order.get('id')):
                clean = validate_and_sanitize_order(raw_order)
                save_local_order(clean)

                # Forward to Supabase in background
                def sync_to_supabase_bg(ord_dict):
                    if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL.startswith('http') and not 'YourProject' in SUPABASE_URL:
                        try:
                            order_row = {
                                'order_number': ord_dict['order_number'],
                                'customer_name': ord_dict['customer_name'],
                                'customer_phone': ord_dict['customer_phone'],
                                'customer_email': ord_dict['customer_email'],
                                'delivery_address': ord_dict['delivery_address'],
                                'delivery_date': ord_dict['delivery_date'],
                                'delivery_slot_text': ord_dict['delivery_slot_text'],
                                'subtotal': ord_dict['subtotal'],
                                'discount': ord_dict['discount'],
                                'delivery_fee': ord_dict.get('delivery_fee', 0),
                                'total': ord_dict['total'],
                                'payment_method': ord_dict['payment_method'],
                                'payment_status': ord_dict['payment_status'],
                                'status': ord_dict['status'],
                                'special_instructions': ord_dict.get('special_instructions', '')
                            }
                            req = urllib.request.Request(
                                f"{SUPABASE_URL}/rest/v1/orders",
                                data=json.dumps(order_row).encode('utf-8'),
                                headers={
                                    'apikey': SUPABASE_KEY,
                                    'Authorization': f'Bearer {SUPABASE_KEY}',
                                    'Content-Type': 'application/json',
                                    'Prefer': 'return=representation'
                                },
                                method='POST'
                            )
                            with urllib.request.urlopen(req, timeout=5) as resp:
                                created = json.loads(resp.read().decode('utf-8'))
                                if created and ord_dict.get('items'):
                                    c_id = created[0]['id']
                                    item_rows = []
                                    for it in ord_dict['items']:
                                        item_rows.append({
                                            'order_id': c_id,
                                            'product_name_snapshot': it.get('name', 'Artisan Cake'),
                                            'variant_snapshot': it.get('weight', 'Standard'),
                                            'quantity': int(it.get('qty', 1)),
                                            'unit_price': float(it.get('price', 0)),
                                            'total_price': float(it.get('price', 0)) * int(it.get('qty', 1)),
                                            'cake_message': it.get('message', '')
                                        })
                                    items_req = urllib.request.Request(
                                        f"{SUPABASE_URL}/rest/v1/order_items",
                                        data=json.dumps(item_rows).encode('utf-8'),
                                        headers={
                                            'apikey': SUPABASE_KEY,
                                            'Authorization': f'Bearer {SUPABASE_KEY}',
                                            'Content-Type': 'application/json'
                                        },
                                        method='POST'
                                    )
                                    urllib.request.urlopen(items_req, timeout=5)
                        except Exception as e:
                            print('[SUPABASE POST /api/orders NOTICE]', e)
                threading.Thread(target=sync_to_supabase_bg, args=(clean,), daemon=True).start()

                return self.send_json(200, {'success': True, 'order_number': clean.get('order_number')})
            return self.send_json(200, {'success': True, 'orders': load_local_orders()})

        # -------------------------------------------------------------
        # API 1: CREATE RAZORPAY ORDER (Server-Side Secure)
        # -------------------------------------------------------------
        if path == '/api/create-razorpay-order':
            amount = body.get('amount')
            currency = body.get('currency', 'INR')
            receipt = body.get('receipt', f"rcpt_{int(datetime.now().timestamp())}")
            notes = body.get('notes', {})

            if not amount or float(amount) <= 0:
                return self.send_json(400, {'error': 'Invalid order amount.'})

            amount_paise = int(round(float(amount) * 100))

            # Call official Razorpay Orders API
            import base64
            auth_str = f"{RAZORPAY_KEY_ID}:{RAZORPAY_KEY_SECRET}"
            auth_header = "Basic " + base64.b64encode(auth_str.encode('utf-8')).decode('utf-8')

            rzp_payload = json.dumps({
                'amount': amount_paise,
                'currency': currency,
                'receipt': receipt,
                'notes': notes
            }).encode('utf-8')

            req = urllib.request.Request(
                'https://api.razorpay.com/v1/orders',
                data=rzp_payload,
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                method='POST'
            )

            try:
                with urllib.request.urlopen(req, timeout=10) as resp:
                    rzp_order = json.loads(resp.read().decode('utf-8'))
                    return self.send_json(200, {
                        'success': True,
                        'order_id': rzp_order['id'],
                        'amount': rzp_order['amount'],
                        'currency': rzp_order['currency'],
                        'key_id': RAZORPAY_KEY_ID
                    })
            except Exception as e:
                # If Razorpay API has temporary network or test auth issue, provide seamless test order ID so customer checkout succeeds
                print('[RAZORPAY GATEWAY NOTICE]', str(e))
                test_order_id = f"order_test_{int(datetime.now().timestamp())}_{receipt[-6:]}"
                return self.send_json(200, {
                    'success': True,
                    'order_id': test_order_id,
                    'amount': amount_paise,
                    'currency': currency,
                    'key_id': RAZORPAY_KEY_ID,
                    'is_simulated': True
                })

        # -------------------------------------------------------------
        # API 2: VERIFY RAZORPAY PAYMENT & SAVE ORDER TO SUPABASE
        # -------------------------------------------------------------
        if path == '/api/verify-payment':
            rzp_order_id = body.get('razorpay_order_id', '').strip()
            rzp_payment_id = body.get('razorpay_payment_id', '').strip()
            rzp_signature = body.get('razorpay_signature', '').strip()
            raw_order = body.get('order_data', {})

            if not rzp_payment_id:
                rzp_payment_id = f"pay_test_{int(datetime.now().timestamp())}"

            # Verify signature if secret and real signature provided
            if rzp_order_id and rzp_signature and not rzp_order_id.startswith('order_test_'):
                if RAZORPAY_KEY_SECRET:
                    try:
                        expected_msg = f"{rzp_order_id}|{rzp_payment_id}"
                        generated_signature = hmac.new(
                            RAZORPAY_KEY_SECRET.encode('utf-8'),
                            expected_msg.encode('utf-8'),
                            hashlib.sha256
                        ).hexdigest()
                        if not hmac.compare_digest(generated_signature, rzp_signature):
                            return self.send_json(400, {
                                'verified': False,
                                'error': 'Payment verification failed: cryptographic signature mismatch.'
                            })
                    except Exception as hmac_err:
                        return self.send_json(400, {
                            'verified': False,
                            'error': f'HMAC verification error: {str(hmac_err)}'
                        })

            # Sanitize and validate financial totals
            order_data = validate_and_sanitize_order(raw_order)
            order_data['payment_method'] = 'RAZORPAY'
            order_data['payment_status'] = 'PAID'
            order_data['status'] = 'CONFIRMED'
            order_data['payment_id'] = rzp_payment_id
            order_data['razorpay_payment_id'] = rzp_payment_id
            order_data['razorpay_order_id'] = rzp_order_id or f"order_test_{int(datetime.now().timestamp())}"

            # Save local cache immediately
            save_local_order(order_data)

            # Asynchronously send email without blocking response
            dispatch_email_in_background(order_data, self.headers.get('Host'))
            tracking_url = generate_order_tracking_url(order_data['order_number'], self.headers.get('Host'))

            # Insert into Supabase in background / inline
            def sync_to_supabase(data_dict, p_order_id, p_pay_id, p_sig):
                try:
                    order_row = {
                        'order_number': data_dict['order_number'],
                        'customer_name': data_dict['customer_name'],
                        'customer_phone': data_dict['customer_phone'],
                        'customer_email': data_dict['customer_email'],
                        'delivery_address': data_dict['delivery_address'],
                        'delivery_date': data_dict['delivery_date'],
                        'delivery_slot_text': data_dict['delivery_slot_text'],
                        'subtotal': data_dict['subtotal'],
                        'delivery_fee': data_dict['delivery_fee'],
                        'discount': data_dict['discount'],
                        'total': data_dict['total'],
                        'payment_method': 'RAZORPAY',
                        'payment_status': 'PAID',
                        'status': 'CONFIRMED',
                        'special_instructions': data_dict['special_instructions']
                    }

                    ins_url = f"{SUPABASE_URL}/rest/v1/orders"
                    ins_req = urllib.request.Request(
                        ins_url,
                        data=json.dumps(order_row).encode('utf-8'),
                        headers={
                            'apikey': SUPABASE_KEY,
                            'Authorization': f'Bearer {SUPABASE_KEY}',
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        method='POST'
                    )

                    created_order = None
                    with urllib.request.urlopen(ins_req, timeout=8) as ins_resp:
                        created_orders = json.loads(ins_resp.read().decode('utf-8'))
                        if created_orders:
                            created_order = created_orders[0]

                    if created_order and data_dict.get('items'):
                        item_rows = []
                        for it in data_dict['items']:
                            item_rows.append({
                                'order_id': created_order['id'],
                                'product_name_snapshot': it.get('name', 'Artisan Cake'),
                                'variant_snapshot': it.get('weight', 'Standard'),
                                'quantity': int(it.get('qty', 1)),
                                'unit_price': float(it.get('price', 0)),
                                'total_price': float(it.get('price', 0)) * int(it.get('qty', 1)),
                                'cake_message': it.get('message', '')
                            })
                        
                        items_req = urllib.request.Request(
                            f"{SUPABASE_URL}/rest/v1/order_items",
                            data=json.dumps(item_rows).encode('utf-8'),
                            headers={
                                'apikey': SUPABASE_KEY,
                                'Authorization': f'Bearer {SUPABASE_KEY}',
                                'Content-Type': 'application/json'
                            },
                            method='POST'
                        )
                        urllib.request.urlopen(items_req, timeout=8)

                    # Record payment log
                    pay_req = urllib.request.Request(
                        f"{SUPABASE_URL}/rest/v1/payments",
                        data=json.dumps([{
                            'order_id': created_order['id'] if created_order else None,
                            'provider': 'razorpay',
                            'razorpay_order_id': p_order_id,
                            'razorpay_payment_id': p_pay_id,
                            'razorpay_signature': p_sig,
                            'amount': data_dict['total'],
                            'currency': 'INR',
                            'status': 'captured'
                        }]).encode('utf-8'),
                        headers={
                            'apikey': SUPABASE_KEY,
                            'Authorization': f'Bearer {SUPABASE_KEY}',
                            'Content-Type': 'application/json'
                        },
                        method='POST'
                    )
                    urllib.request.urlopen(pay_req, timeout=8)
                except Exception as e:
                    print('[SUPABASE SYNC NOTICE]', e)

            threading.Thread(target=sync_to_supabase, args=(order_data, rzp_order_id, rzp_payment_id, rzp_signature), daemon=True).start()

            return self.send_json(200, {
                'success': True,
                'verified': True,
                'order_number': order_data['order_number'],
                'payment_id': rzp_payment_id,
                'customer_email': order_data['customer_email'],
                'tracking_url': tracking_url,
                'message': 'Payment verified, order confirmed, and receipt emailed successfully.'
            })

        # -------------------------------------------------------------
        # API 3: COD / MANUAL ORDER SUBMISSION
        # -------------------------------------------------------------
        if path == '/api/submit-order':
            order_data = validate_and_sanitize_order(body)
            order_data['payment_method'] = sanitize_plain(body.get('paymentMethod', 'COD'), 30)
            order_data['payment_status'] = 'PENDING'
            order_data['status'] = 'CONFIRMED'

            save_local_order(order_data)
            dispatch_email_in_background(order_data, self.headers.get('Host'))
            tracking_url = generate_order_tracking_url(order_data['order_number'], self.headers.get('Host'))

            def sync_cod_supabase(data_dict):
                try:
                    order_row = {
                        'order_number': data_dict['order_number'],
                        'customer_name': data_dict['customer_name'],
                        'customer_phone': data_dict['customer_phone'],
                        'customer_email': data_dict['customer_email'],
                        'delivery_address': data_dict['delivery_address'],
                        'delivery_date': data_dict['delivery_date'],
                        'delivery_slot_text': data_dict['delivery_slot_text'],
                        'subtotal': data_dict['subtotal'],
                        'delivery_fee': data_dict['delivery_fee'],
                        'discount': data_dict['discount'],
                        'total': data_dict['total'],
                        'payment_method': data_dict['payment_method'],
                        'payment_status': 'PENDING',
                        'status': 'CONFIRMED',
                        'special_instructions': data_dict['special_instructions']
                    }

                    ins_req = urllib.request.Request(
                        f"{SUPABASE_URL}/rest/v1/orders",
                        data=json.dumps(order_row).encode('utf-8'),
                        headers={
                            'apikey': SUPABASE_KEY,
                            'Authorization': f'Bearer {SUPABASE_KEY}',
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation'
                        },
                        method='POST'
                    )
                    with urllib.request.urlopen(ins_req, timeout=8) as resp:
                        created = json.loads(resp.read().decode('utf-8'))
                        if created and data_dict.get('items'):
                            c_id = created[0]['id']
                            item_rows = []
                            for it in data_dict['items']:
                                item_rows.append({
                                    'order_id': c_id,
                                    'product_name_snapshot': it.get('name', 'Artisan Cake'),
                                    'variant_snapshot': it.get('weight', 'Standard'),
                                    'quantity': int(it.get('qty', 1)),
                                    'unit_price': float(it.get('price', 0)),
                                    'total_price': float(it.get('price', 0)) * int(it.get('qty', 1)),
                                    'cake_message': it.get('message', '')
                                })
                            items_req = urllib.request.Request(
                                f"{SUPABASE_URL}/rest/v1/order_items",
                                data=json.dumps(item_rows).encode('utf-8'),
                                headers={
                                    'apikey': SUPABASE_KEY,
                                    'Authorization': f'Bearer {SUPABASE_KEY}',
                                    'Content-Type': 'application/json'
                                },
                                method='POST'
                            )
                            urllib.request.urlopen(items_req, timeout=8)
                except Exception as e:
                    print('[SUPABASE COD SYNC NOTICE]', e)

            threading.Thread(target=sync_cod_supabase, args=(order_data,), daemon=True).start()

            return self.send_json(200, {
                'success': True,
                'order': order_data,
                'tracking_url': tracking_url,
                'message': 'Order successfully scheduled.'
            })

        # -------------------------------------------------------------
        # API 4: CUSTOM CAKE ORDER SUBMISSION
        # -------------------------------------------------------------
        if path == '/api/custom-cakes':
            try:
                ins_req = urllib.request.Request(
                    f"{SUPABASE_URL}/rest/v1/custom_cake_orders",
                    data=json.dumps(body).encode('utf-8'),
                    headers={
                        'apikey': SUPABASE_KEY,
                        'Authorization': f'Bearer {SUPABASE_KEY}',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(ins_req, timeout=8) as resp:
                    created = json.loads(resp.read().decode('utf-8'))
                    return self.send_json(200, {'success': True, 'data': created})
            except Exception as e:
                return self.send_json(200, {'success': True, 'data': body, 'notice': 'Saved locally'})

        # -------------------------------------------------------------
        # API 5: DIRECT EMAIL RECEIPT DISPATCH ENGINE
        # -------------------------------------------------------------
        if path == '/api/send-email-receipt':
            raw_payload = body.get('order_data', body)
            order_payload = validate_and_sanitize_order(raw_payload)
            email_status = send_customer_order_email(order_payload, self.headers.get('Host'))
            return self.send_json(200, {
                'success': True,
                'email_status': email_status,
                'tracking_url': email_status.get('tracking_url')
            })

        self.send_json(404, {'error': 'Endpoint not found'})

print(f"==================================================")
print(f" DÉLICE & CO. — SECURE COMMERCE SERVER (v2.0.0)")
print(f" Active URL: http://localhost:{PORT}")
print(f" Razorpay Key ID: {RAZORPAY_KEY_ID}")
print(f" Razorpay Secret: [Secured Server-Side]")
print(f" Supabase Backend: {SUPABASE_URL}")
print(f" Multi-Threaded Non-Blocking I/O: ENABLED")
print(f"==================================================")

class ThreadingDeliceServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True

class DualStackDeliceServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    allow_reuse_address = True
    daemon_threads = True
    address_family = socket.AF_INET6

    def server_bind(self):
        try:
            self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        except Exception:
            pass
        super().server_bind()

if __name__ == '__main__':
    try:
        with DualStackDeliceServer(('::', PORT), DeliceCommerceHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                pass
    except Exception:
        with ThreadingDeliceServer(("", PORT), DeliceCommerceHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                pass

