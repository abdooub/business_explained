const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    if (!STRIPE_SECRET_KEY) {
      res.status(500).json({ ok: false, message: 'Stripe non configuré' });
      return;
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) {
      res.status(400).json({ ok: false, message: 'Panier vide' });
      return;
    }

    const line_items = items.map((it) => {
      const qty = Number(it.qty || 1);
      const priceId = it.priceId || it.price; // allow passing Stripe Price ID in price or priceId
      if (typeof priceId === 'string' && priceId.startsWith('price_')) {
        return { price: priceId, quantity: qty };
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: { name: String(it.name || it.id || 'Product') },
          unit_amount: Math.round(Number(it.price || 0) * 100),
        },
        quantity: qty,
      };
    });

    const host = req.headers.host;
    const fwd = req.headers['x-forwarded-proto'];
    const isLocal = /^(localhost|127\.0\.0\.1)(:|$)/i.test(host || '');
    const proto = isLocal ? (req.protocol || 'http') : (fwd || 'https');
    const origin = `${proto}://${host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      allow_promotion_codes: true,
      success_url: req.body?.success_url || `${origin}/success.html?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.body?.cancel_url || `${origin}/products.html?canceled=1`,
    });

    res.json({ ok: true, url: session.url });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Erreur Stripe' });
  }
};
