module.exports = async function handler(req, res) {
  const method = req.method || 'GET';
  if (method !== 'POST' && method !== 'GET') {
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

    const orderID = req.body?.orderID || req.query?.token || req.query?.orderID;
    if (!orderID) {
      res.status(400).json({ ok: false, message: 'Missing orderID' });
      return;
    }

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

    const capResp = await fetch(base + `/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await capResp.json();
    if (!capResp.ok) {
      res.status(500).json({ ok: false, message: 'Capture failed', details: data });
      return;
    }
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'PayPal error' });
  }
};
