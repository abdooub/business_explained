module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }
  try {
    const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
    const SECRET = process.env.PAYPAL_SECRET || '';
    const ENV = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
    const base = ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
    if (!CLIENT_ID || !SECRET) {
      res.status(500).json({ ok: false, message: 'PayPal not configured' });
      return;
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) {
      res.status(400).json({ ok: false, message: 'Empty cart' });
      return;
    }
    const total = items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0), 0);

    // OAuth token
    const tokenResp = await fetch(base + '/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
    if (!tokenResp.ok) {
      const txt = await tokenResp.text();
      res.status(500).json({ ok: false, message: 'PayPal auth failed', details: txt });
      return;
    }
    const { access_token } = await tokenResp.json();

    const host = req.headers.host || '';
    const forwardedProto = req.headers['x-forwarded-proto'];
    const isLocal = /^(localhost|127\.0\.0\.1)(:|$)/i.test(host);
    const proto = isLocal ? (req.protocol || 'http') : (forwardedProto || 'https');
    const origin = `${proto}://${host}`;

    const orderResp = await fetch(base + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: 'EUR', value: total.toFixed(2) },
            description: 'Business Explained - Digital products'
          }
        ],
        application_context: {
          return_url: `${origin}/success.html?paypal=1`,
          cancel_url: `${origin}/products.html?ppc=1`,
          brand_name: 'Business Explained',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW'
        }
      })
    });

    const orderData = await orderResp.json();
    if (!orderResp.ok) {
      res.status(500).json({ ok: false, message: 'Create order failed', details: orderData });
      return;
    }
    const approveLink = (orderData.links || []).find(l => l.rel === 'approve')?.href;
    res.json({ ok: true, id: orderData.id, url: approveLink });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'PayPal error' });
  }
};
