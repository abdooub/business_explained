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

    const line_items = items.map((it) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: String(it.name || it.id || 'Product') },
        unit_amount: Math.round(Number(it.price || 0) * 100),
      },
      quantity: Number(it.qty || 1),
    }));

    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/products.html?success=1`,
      cancel_url: `${origin}/products.html?canceled=1`,
      allow_promotion_codes: true,
    });

    res.json({ ok: true, url: session.url });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Erreur Stripe' });
  }
};
