/* server.js — Backend pour le site Business Explained */
const fs = require('fs');
const path = require('path');
const express = require('express');
const Stripe = require('stripe');
const paypalCreate = require('./api/paypal/create-order');
const paypalCapture = require('./api/paypal/capture-order');
const orderLinks = require('./api/order-links');
const sendReceipt = require('./api/send-receipt');
const dlHandler = require('./api/dl');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

// Configuration pour Vercel
const isVercel = process.env.VERCEL === '1';
const publicDir = isVercel ? path.join(__dirname, '.vercel/output/static') : __dirname;

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Configuration de base
app.disable('x-powered-by');

// Middleware de sécurité
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Servir les fichiers statiques
app.use(express.static(publicDir, {
  extensions: ['html', 'htm'],
  index: false,
  setHeaders: (res, path) => {
    // Cache les fichiers statiques pendant 1 an
    if (express.static.mime.lookup(path) === 'text/html') {
      res.setHeader('Cache-Control', 'public, max-age=0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  console.log('Accès à la page d\'accueil, envoi de index.html');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Redirections
app.get('/home', (req, res) => {
  console.log('Redirection de /home vers /products.html');
  res.redirect(302, '/products.html');
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  console.log(`Page non trouvée: ${req.originalUrl}`);
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur du serveur:', err);
  res.status(500).send('Une erreur est survenue sur le serveur');
});

// Support form endpoint — sends an email to business@business-explique.com
app.post('/api/support', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body || {};
  if (!firstName || !lastName || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: 'Missing required fields' });
  }
  const to = 'business@business-explique.com';
  const subj = `[Support] ${subject} — ${firstName} ${lastName}`;
  const text = `New support request\n\nFrom: ${firstName} ${lastName}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
  try {
    // Prefer Resend if configured
    let sent = false;
    try {
      const { Resend } = require('resend');
      const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
      if (RESEND_API_KEY) {
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: 'Business Explique <noreply@business-explique.com>',
          to,
          subject: subj,
          text
        });
        sent = true;
      }
    } catch (_) {}

    // Fallback to SendGrid if configured and not yet sent
    if (!sent) {
      try {
        const sgMail = require('@sendgrid/mail');
        const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
        if (SENDGRID_API_KEY) {
          sgMail.setApiKey(SENDGRID_API_KEY);
          await sgMail.send({
            to,
            from: 'noreply@business-explique.com',
            subject: subj,
            text
          });
          sent = true;
        }
      } catch (_) {}
    }

    // If neither provider configured, log and succeed to avoid blocking UX in dev
    if (!sent) {
      console.log('[Support email mock]\nTo:', to, '\nSubject:', subj, '\n---\n' + text);
    }
    return res.json({ ok: true, message: 'Thanks! Your message has been sent.' });
  } catch (e) {
    console.error('Support email error:', e);
    return res.status(500).json({ ok: false, message: 'Server error sending email' });
  }
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
// Coupons
app.post('/api/redeem-coupon', (req, res) => require('./api/redeem-coupon')(req, res));
// Name-based download redirector
app.get('/api/dl', (req, res) => dlHandler(req, res));

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

    // Build origin that works locally and on Vercel/Proxies
    const host = req.get('host');
    const fwd = req.get('x-forwarded-proto');
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

// Gestion des routes pour le SPA (Single Page Application)
app.get('*', (req, res) => {
  // Si c'est une requête API, on renvoie une 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint non trouvé' });
  }
  // Vérifier si le fichier existe
  const filePath = path.join(publicDir, req.path);
  if (fs.existsSync(filePath) && !fs.lstatSync(filePath).isDirectory()) {
    return res.sendFile(filePath);
  }
  // Sinon, on sert index.html pour le routage côté client
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Gestion des erreurs 404 (doit être après toutes les autres routes)
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint non trouvé' });
  }
  res.status(404).sendFile(path.join(publicDir, '404.html'));
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).send('Erreur interne du serveur');
});

// Démarrer le serveur uniquement si ce n'est pas Vercel
if (!isVercel) {
  const startServer = (port, maxTries = 5) => {
    if (maxTries <= 0) {
      console.error('Échec du démarrage du serveur après plusieurs tentatives');
      process.exit(1);
    }

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Le port ${port} est occupé, tentative sur le port ${port + 1}...`);
        startServer(port + 1, maxTries - 1);
      } else {
        console.error('Erreur du serveur:', err);
        process.exit(1);
      }
    });
  };

  startServer(PORT);
}

// Export pour Vercel
module.exports = app;
startServer(PORT);
