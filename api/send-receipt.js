const Stripe = require('stripe');
const { LINK_MAP, DEFAULT_LINKS } = require('./order-links');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method Not Allowed' });
      return;
    }
    const sessionId = req.query?.session_id || req.body?.session_id;
    if (!sessionId) {
      res.status(400).json({ ok: false, message: 'Missing session_id' });
      return;
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    if (!STRIPE_SECRET_KEY) {
      res.status(500).json({ ok: false, message: 'Stripe not configured' });
      return;
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
    const FROM_EMAIL = process.env.FROM_EMAIL || '';
    if (!RESEND_API_KEY || !FROM_EMAIL) {
      res.status(500).json({ ok: false, message: 'Email not configured' });
      return;
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      res.status(400).json({ ok: false, message: 'Payment not confirmed' });
      return;
    }

    const to = session.customer_details?.email || session.customer_email;
    if (!to) {
      res.status(400).json({ ok: false, message: 'Missing customer email' });
      return;
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });
    const items = (lineItems?.data || []).map((li) => {
      const name = li.description || li.price?.product || 'Product';
      const links = LINK_MAP[name] || DEFAULT_LINKS;
      return { name, qty: li.quantity || 1, links };
    });

    const html = `
      <div>
        <h2>Thank you for your purchase!</h2>
        <p>Below are your download links:</p>
        ${items
          .map(
            (it) => `
              <div style="margin:12px 0;">
                <strong>${it.name}</strong> (x${it.qty})
                <ul>
                  ${it.links.map((l) => `<li><a href="${l}">${l}</a></li>`).join('')}
                </ul>
              </div>`
          )
          .join('')}
        <p>If you have any issue, reply to this email.</p>
      </div>`;

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: 'Your Business Explained downloads',
        html
      })
    });

    if (!resp.ok) {
      const t = await resp.text().catch(() => '');
      res.status(500).json({ ok: false, message: 'Email send failed', details: t });
      return;
    }

    const data = await resp.json().catch(() => ({}));
    res.json({ ok: true, data });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Server error', error: e?.message || String(e) });
  }
}
