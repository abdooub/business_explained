/* server.js — Minimal Node.js + Express backend to serve the static site and mock APIs */
const path = require('path');
const express = require('express');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

// Basic security headers (very light)
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing for JSON (must come before API endpoints)
app.use(express.json());

// Set products.html as homepage
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});
app.get('/home', (req, res) => res.redirect(302, '/products.html'));

// Support form endpoint
app.post('/api/support', (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body || {};
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Missing required fields' });
  }
  return res.json({ ok: true, message: 'Your request has been received. Our team will get back to you ASAP.' });
});

// Mock checkout endpoint
app.post('/api/checkout', (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ ok: false, message: 'Panier vide' });
    const total = items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.qty || 0), 0);
    return res.json({ ok: true, message: `Commande confirmée ($${total.toFixed(2)})` });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
});

// Stripe Checkout endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ ok: false, message: 'Stripe non configuré' });
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ ok: false, message: 'Panier vide' });

    const line_items = items.map((it) => ({
      price_data: {
        currency: 'eur',
        product_data: { name: String(it.name || it.id || 'Product') },
        unit_amount: Math.round(Number(it.price || 0) * 100),
      },
      quantity: Number(it.qty || 1),
    }));

    const origin = `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${origin}/products.html?success=1`,
      cancel_url: `${origin}/products.html?canceled=1`,
      allow_promotion_codes: true,
    });

    return res.json({ ok: true, url: session.url });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Erreur Stripe' });
  }
});

// Serve static files from the project root
app.use(express.static(__dirname, {
  extensions: ['html'],
  index: 'index.html',
  maxAge: '1h'
}));

// Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Mock newsletter subscription endpoint
app.post('/api/subscribe', (req, res) => {
  try {
    const email = String(req.body?.email || '').trim();
    const ok = /.+@.+\..+/.test(email);
    if (!ok) {
      return res.status(400).json({ ok: false, message: 'Email invalide' });
    }
    // Here you could integrate with a real ESP provider (e.g., Brevo/Mailchimp)
    return res.json({ ok: true, message: 'Inscription réussie' });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
});

// Fallback to index.html for unknown routes (optional SPA-like behavior)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
