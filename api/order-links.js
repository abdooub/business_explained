const Stripe = require('stripe');

// Simple mapping from product names to downloadable PDF links
const DEFAULT_LINKS = [
  'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
];
const LINK_MAP = {
  'All Products Special': DEFAULT_LINKS,
  'Top-Tier Management Explained': DEFAULT_LINKS,
  'Organizational Management Explained': DEFAULT_LINKS,
  'Consulting Management Explained': DEFAULT_LINKS,
  'Business Development Explained': DEFAULT_LINKS,
  'Marketing Frameworks Explained': DEFAULT_LINKS,
  'Competitive Advantage Explained': DEFAULT_LINKS,
  'Sales Strategies Explained': DEFAULT_LINKS,
  'Strategic Management Explained': DEFAULT_LINKS,
  'Process Improvement Strategies Explained': DEFAULT_LINKS,
  'Project Management Explained': DEFAULT_LINKS,
  'Human Resources Explained': DEFAULT_LINKS
};

const handler = async function handler(req, res) {
  try {
    const sessionId = req.query?.session_id || req.query?.sessionid || req.query?.session;
    if (!sessionId) {
      res.status(400).json({ ok: false, message: 'Missing session_id' });
      return;
    }
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    if (!STRIPE_SECRET_KEY) {
      res.status(500).json({ ok: false, message: 'Stripe non configuré' });
      return;
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      res.status(400).json({ ok: false, message: 'Payment not confirmed' });
      return;
    }

    // Get purchased line items
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });

    let items = (lineItems?.data || []).map((li) => {
      const name = li.description || li.price?.product || 'Product';
      const links = LINK_MAP[name] || DEFAULT_LINKS;
      return { name, qty: li.quantity || 1, links };
    });

    // Fallback: if Stripe returned no line items, still return default links
    if (!items.length) {
      items = [{ name: 'Order', qty: 1, links: DEFAULT_LINKS }];
    }

    res.json({ ok: true, items });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Erreur', error: e?.message || String(e) });
  }
};

module.exports = Object.assign(handler, { LINK_MAP, DEFAULT_LINKS });
