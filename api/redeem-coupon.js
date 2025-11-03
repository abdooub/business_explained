// api/redeem-coupon.js
// Server-side endpoint to validate a coupon code and return the action to apply.
// Notes:
// - Uses in-memory usage tracking (see coupons.js). For production, replace with persistent storage.
// - Validates email and coupon server-side and enforces per-email and per-IP limits.

const { validateCoupon } = require('./coupons');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ ok: false, message: 'Method Not Allowed' });
      return;
    }

    const { code, email } = req.body || {};

    // Determine client IP in a proxy-friendly way
    const fwd = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim()
      || req.ip
      || req.connection?.remoteAddress
      || req.socket?.remoteAddress
      || '';

    const result = await validateCoupon({ code, email, ip });
    if (!result.ok) {
      res.status(400).json({ ok: false, code: result.code || 'invalid', message: result.message || 'Invalid coupon.' });
      return;
    }

    // result could be: { ok, action: 'add_product_free', product, message }
    res.json({ ok: true, action: result.action, product: result.product, message: result.message || 'Coupon applied.' });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Server error', error: e?.message || String(e) });
  }
};
