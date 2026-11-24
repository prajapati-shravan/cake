/**
 * Netlify Serverless Function: send-email-receipt
 * Dispatches rich HTML Tax Invoice & Receipt via Resend HTTPS API.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

exports.handler = async (event) => {
  // 1. Handle Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'CORS OK' })
    };
  }

  // 2. Enforce POST Method
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed. Use POST.' })
    };
  }

  // 3. Parse JSON Body
  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: false, error: 'Malformed JSON payload.' })
    };
  }

  const order = body.order_data || body;
  const customer = order.customer || {};

  // 4. Extract and Validate Customer Data
  const custName = (customer.name || order.customer_name || 'Valued Customer').trim();
  const custEmail = (customer.email || order.customer_email || '').trim();
  const custPhone = (customer.phone || order.customer_phone || 'N/A').trim();
  const custAddress = (customer.address || order.delivery_address || 'Vadodara, Gujarat').trim();
  const orderNum = (order.order_number || `DL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`).trim();
  const deliveryDate = (order.delivery_date || order.deliveryDate || new Date().toISOString().split('T')[0]).trim();
  const deliverySlot = (order.delivery_slot_text || order.deliverySlotText || order.deliverySlot || '2-Hour Express Delivery').trim();
  const payMethod = (order.payment_method || order.paymentMethod || 'RAZORPAY').trim();
  const payStatus = (order.payment_status || 'PAID').trim();
  const paymentId = (order.payment_id || order.paymentId || order.razorpay_payment_id || '').trim();
  const specialNotes = (order.special_instructions || order.specialInstructions || '').trim();

  if (!custEmail || !custEmail.includes('@') || !custEmail.includes('.')) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Validation Error: A valid customer email address is required.'
      })
    };
  }

  // 5. Financials & Items
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.total || 0);
  const subtotal = Number(order.subtotal || total);
  const discount = Number(order.discount || 0);

  // 6. Config & Sender Configuration
  const siteBaseUrl = (process.env.SITE_BASE_URL || 'https://cakeandjoy.netlify.app').replace(/\/$/, '');
  const trackUrl = `${siteBaseUrl}/track.html?order=${encodeURIComponent(orderNum)}`;

  const storePhone = process.env.STORE_PHONE || '+91 99094 44882';
  const storeEmail = (process.env.STORE_EMAIL || 'orders@deliceandcake.in').trim();
  const storeName = process.env.STORE_NAME || 'Cake & Joy';

  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  if (!resendApiKey) {
    console.error('[EMAIL FUNCTION] Server Error: RESEND_API_KEY is not configured in Netlify environment variables.');
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Server Configuration Error: RESEND_API_KEY is not set in Netlify environment variables.'
      })
    };
  }

  // Sender address: Use custom verified sender if configured, or Resend default sandbox sender
  const resendFrom = (process.env.RESEND_FROM || `${storeName} <onboarding@resend.dev>`).trim();
  const subject = `Official Order Receipt & Confirmation #${orderNum} — ${storeName}`;

  // 7. Render Item Rows for HTML Receipt
  let itemRowsHtml = '';
  items.forEach((item, idx) => {
    const iName = escapeHtml(item.name || 'Artisan Creation');
    const iWeight = escapeHtml(item.weight || 'Standard');
    const iQty = Number(item.qty || 1);
    const iPrice = Number(item.price || 0);
    const iTotal = iPrice * iQty;
    const iMsg = escapeHtml(item.message || '');
    const msgBadge = iMsg 
      ? `<div style="font-size:12px; color:#854D0E; background:#FEF9C3; padding:2px 6px; border-radius:4px; margin-top:4px; display:inline-block;">Message: &ldquo;${iMsg}&rdquo;</div>` 
      : '';

    itemRowsHtml += `
      <tr style="border-bottom: 1px solid #E2E8F0;">
        <td style="padding: 12px 10px; color: #64748B; font-size: 13px;">${idx + 1}</td>
        <td style="padding: 12px 10px; color: #1E293B; font-size: 14px;">
          <strong>${iName}</strong>
          <div style="font-size: 12px; color: #64748B;">Weight / Variant: ${iWeight} &bull; 100% Veg &amp; Eggless</div>
          ${msgBadge}
        </td>
        <td style="padding: 12px 10px; text-align: center; color: #1E293B; font-size: 14px;">${iQty}</td>
        <td style="padding: 12px 10px; text-align: right; color: #1E293B; font-size: 14px;">₹${iPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
        <td style="padding: 12px 10px; text-align: right; color: #1B3358; font-weight: 700; font-size: 14px;">₹${iTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  });

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${escapeHtml(subject)}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px 12px; color: #1E293B;">
    <div style="max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #E2E8F0;">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1B3358 0%, #0F172A 100%); color: #FFFFFF; padding: 28px 24px; text-align: center;">
            <div style="color: #F59E0B; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;">100% Pure Veg &bull; Artisan Patisserie</div>
            <h1 style="font-family: Georgia, serif; font-size: 26px; margin: 0; color: #FFF8EE; letter-spacing: 0.5px;">${escapeHtml(storeName.toUpperCase())}</h1>
            <p style="color: #CBD5E1; font-size: 13px; margin: 6px 0 0;">Official Order &amp; Payment Confirmation Receipt</p>
        </div>

        <div style="padding: 24px;">
            <!-- Greeting & Status -->
            <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 12px; padding: 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 28px; line-height: 1;">🎉</div>
                <div>
                    <strong style="color: #166534; font-size: 15px; display: block;">Order Confirmed &amp; Scheduled!</strong>
                    <span style="color: #15803D; font-size: 13px;">Dear ${escapeHtml(custName)}, your gourmet creation has been scheduled in our kitchen in Akota, Vadodara.</span>
                </div>
            </div>

            <!-- Meta info grid -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13.5px;">
                <tr>
                    <td style="padding: 6px 0; color: #64748B; width: 40%;">Order Number:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #1E293B;"><span style="background: #EEF2F6; padding: 3px 8px; border-radius: 6px;">#${escapeHtml(orderNum)}</span></td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Scheduled Delivery:</td>
                    <td style="padding: 6px 0; font-weight: 600; color: #1E293B;">${escapeHtml(deliveryDate)} &bull; ${escapeHtml(deliverySlot)}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Delivery Destination:</td>
                    <td style="padding: 6px 0; color: #1E293B;">${escapeHtml(custAddress)} (Vadodara)</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Customer Contact:</td>
                    <td style="padding: 6px 0; color: #1E293B;">${escapeHtml(custPhone)} &bull; ${escapeHtml(custEmail)}</td>
                </tr>
                <tr>
                    <td style="padding: 6px 0; color: #64748B;">Payment Status:</td>
                    <td style="padding: 6px 0; color: #166534; font-weight: 700;">${escapeHtml(payStatus)} via ${escapeHtml(payMethod)} ✓</td>
                </tr>
                ${paymentId ? `<tr><td style="padding: 6px 0; color: #64748B;">Payment Ref:</td><td style="padding: 6px 0; font-family: monospace; font-size: 12px; color: #0F172A;">${escapeHtml(paymentId)}</td></tr>` : ''}
                ${specialNotes ? `<tr><td style="padding: 6px 0; color: #64748B;">Special Notes:</td><td style="padding: 6px 0; font-size: 13px; color: #334155;"><em>${escapeHtml(specialNotes)}</em></td></tr>` : ''}
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
                    ${itemRowsHtml}
                </tbody>
            </table>

            <!-- Financial Summary -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px; margin-bottom: 24px; font-size: 13.5px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #64748B;">
                    <span>Items Subtotal:</span>
                    <span>₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                ${discount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #166534;"><span>Coupon Discount:</span><span>-₹${discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #166534;">
                    <span>Vadodara Express Delivery:</span>
                    <span style="font-weight: 700;">FREE (₹0.00)</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 1.5px dashed #CBD5E1; font-size: 16px; font-weight: 800; color: #1B3358;">
                    <span>Total Amount:</span>
                    <span style="color: #C25E34;">₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <!-- Footer Notes -->
            <div style="font-size: 12px; color: #64748B; line-height: 1.6; border-top: 1px solid #E2E8F0; padding-top: 16px;">
                <p style="margin: 0 0 6px;"><strong>Dietary Guarantee:</strong> All items are 100% vegetarian, eggless, handcrafted with pure dairy butter and premium ingredients.</p>
                <p style="margin: 0 0 6px;">Need help with your order? Contact kitchen dispatch at <a href="tel:${escapeHtml(storePhone)}" style="color: #1B3358; font-weight: 700;">${escapeHtml(storePhone)}</a> or email <a href="mailto:${escapeHtml(storeEmail)}" style="color: #1B3358;">${escapeHtml(storeEmail)}</a>.</p>
                <p style="margin: 12px 0 0; text-align: center; color: #94A3B8; font-size: 11px;">&copy; ${new Date().getFullYear()} ${escapeHtml(storeName)}, Akota, Vadodara, Gujarat.</p>
            </div>
        </div>
    </div>
</body>
</html>`;

  const textFallback = `
${storeName}
========================================
OFFICIAL ORDER & PAYMENT RECEIPT
========================================
Order Number: #${orderNum}
Customer Name: ${custName}
Customer Email: ${custEmail}
Delivery Date: ${deliveryDate} (${deliverySlot})
Delivery Address: ${custAddress}

Total Amount: ₹${total.toFixed(2)}
Payment Method: ${payMethod} (Status: ${payStatus})
${paymentId ? `Payment Reference: ${paymentId}\n` : ''}
Customer Support: ${storePhone} | ${storeEmail}
========================================
`;

  // 8. Build Resend API Payload
  const resendPayload = {
    from: resendFrom,
    to: [custEmail],
    reply_to: storeEmail,
    subject: subject,
    html: htmlContent,
    text: textFallback
  };

  // Add store email copy if verified sender or different email
  if (storeEmail && storeEmail !== custEmail && !resendFrom.includes('onboarding@resend.dev')) {
    resendPayload.bcc = [storeEmail];
  }

  // 9. Dispatch to Resend API
  try {
    console.log(`[EMAIL FUNCTION] Dispatching receipt to ${custEmail} via Resend...`);
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(resendPayload)
    });

    const resData = await resendResponse.json();

    if (resendResponse.ok && resData && resData.id) {
      console.log(`[EMAIL FUNCTION] ✅ Resend Email dispatched successfully! Email ID: ${resData.id}`);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          email_id: resData.id,
          recipient: custEmail,
          tracking_url: trackUrl,
          message: 'Order confirmation receipt sent successfully via Resend.'
        })
      };
    }

    // Resend returned an error response (e.g. 401, 403, 422)
    console.error('[EMAIL FUNCTION] ❌ Resend API Error:', resData);
    const errorMsg = resData?.message || resData?.error || 'Resend failed to accept the email.';
    const errorCode = resData?.name || 'RESEND_API_ERROR';

    return {
      statusCode: resendResponse.status || 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: `Resend API Error: ${errorMsg}`,
        error_code: errorCode,
        tracking_url: trackUrl
      })
    };
  } catch (networkErr) {
    console.error('[EMAIL FUNCTION] ❌ Network Error contacting Resend API:', networkErr.message || networkErr);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error: Unable to contact Resend email service.',
        tracking_url: trackUrl
      })
    };
  }
};
