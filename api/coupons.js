// api/coupons.js
// Modular coupon engine with simple in-memory usage tracking.
// Note: For production, persist usage (e.g., Redis, database) instead of memory.

const COUPONS = {
  // Example coupon: gives a specific product for free.
  // You can add more coupons or types in this object.
  '100100free': {
    type: 'free_product',
    product: { id: 't1', name: 'Tech Tools Pack', price: 0 },
    perEmail: 1, // max redemptions per email
    perIP: 2, // max redemptions per IP
    // expiresAt: '2026-12-31T23:59:59Z' // optional
  }
};

// In-memory usage store: { couponCode: { email: count, ip: count } }
const usageStore = {
  email: new Map(), // key: `${code}|${email}` => count
  ip: new Map() // key: `${code}|${ip}` => count
};

function isExpired(c) {
  if (!c.expiresAt) return false;
  try { return new Date(c.expiresAt).getTime() < Date.now(); } catch (_) { return true; }
}

function inc(map, key) {
  const v = (map.get(key) || 0) + 1;
  map.set(key, v);
  return v;
}

function get(map, key) {
  return map.get(key) || 0;
}

function validateInput(code, email) {
  if (!code || typeof code !== 'string') return { ok: false, message: 'Missing coupon code.' };
  if (!email || !/\S+@\S+\.\S+/.test(String(email))) return { ok: false, message: 'Valid email required to redeem coupon.' };
  return { ok: true };
}

function canRedeem(coupon, email, ip) {
  // Check limits
  const emailKey = `${coupon.__code}|${email.toLowerCase()}`;
  const ipKey = `${coupon.__code}|${ip}`;
  const emailUsed = get(usageStore.email, emailKey);
  const ipUsed = get(usageStore.ip, ipKey);
  if (coupon.perEmail != null && emailUsed >= coupon.perEmail) {
    return { ok: false, code: 'limit_email', message: 'This coupon was already used for this email.' };
  }
  if (coupon.perIP != null && ipUsed >= coupon.perIP) {
    return { ok: false, code: 'limit_ip', message: 'This coupon was already used from this network.' };
  }
  return { ok: true };
}

function markRedeemed(coupon, email, ip) {
  const emailKey = `${coupon.__code}|${email.toLowerCase()}`;
  const ipKey = `${coupon.__code}|${ip}`;
  inc(usageStore.email, emailKey);
  inc(usageStore.ip, ipKey);
}

async function validateCoupon({ code, email, ip }) {
  const vin = validateInput(code, email);
  if (!vin.ok) return vin;
  const c = COUPONS[String(code).trim()] || null;
  if (!c) return { ok: false, message: 'Invalid coupon code.' };
  if (isExpired(c)) return { ok: false, message: 'This coupon has expired.' };

  // Attach code for usage keying
  c.__code = String(code).trim();

  const limits = canRedeem(c, email, ip || '');
  if (!limits.ok) return limits;

  if (c.type === 'free_product') {
    // Mark redeemed now; in production, do this after atomic persistence
    markRedeemed(c, email, ip || '');
    return {
      ok: true,
      action: 'add_product_free',
      product: { id: c.product.id, name: c.product.name, price: 0 },
      message: 'Coupon applied! Product added for free.'
    };
  }

  return { ok: false, message: 'Unsupported coupon type.' };
}

module.exports = {
  validateCoupon,
  // Export config for future admin tools
  COUPONS
};
