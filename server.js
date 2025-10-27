/* server.js — Minimal Node.js + Express backend to serve the static site and mock APIs */
const path = require('path');
const express = require('express');
const Stripe = require('stripe');
const paypalCreate = require('./api/paypal/create-order');
const paypalCapture = require('./api/paypal/capture-order');
const orderLinks = require('./api/order-links');
const sendReceipt = require('./api/send-receipt');

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

// PayPal endpoints (reuse serverless handlers for local dev)
app.post('/api/paypal/create-order', (req, res) => paypalCreate(req, res));
app.post('/api/paypal/capture-order', (req, res) => paypalCapture(req, res));
app.get('/api/order-links', (req, res) => orderLinks(req, res));
app.post('/api/send-receipt', (req, res) => sendReceipt(req, res));

// Stripe Checkout endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) return res.status(500).json({ ok: false, message: 'Stripe non configuré' });
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ ok: false, message: 'Panier vide' });

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

    const origin = `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      allow_promotion_codes: true,
      success_url: req.body?.success_url || `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: req.body?.cancel_url || `${origin}/products.html?canceled=1`,
    });

    return res.json({ ok: true, url: session.url });
  } catch (e) {
    console.error('Stripe error:', e);
    const err = {
      message: 'Erreur Stripe',
      error: e?.message || 'Unknown error',
      type: e?.type,
      code: e?.code,
      raw: e?.raw?.message,
    };
    return res.status(500).json({ ok: false, ...err });
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
