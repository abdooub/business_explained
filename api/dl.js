const { LINK_MAP, DEFAULT_LINKS } = require('./order-links');

module.exports = async function handler(req, res) {
  try {
    const name = String(req.query?.name || '').trim();
    const idx = Math.max(0, parseInt(req.query?.i || '0', 10) || 0);
    if (!name) {
      res.status(400).json({ ok: false, message: 'Missing name' });
      return;
    }
    const links = LINK_MAP[name] || DEFAULT_LINKS;
    const target = links[idx] || links[0];
    if (!target) {
      res.status(404).json({ ok: false, message: 'No link found' });
      return;
    }
    res.redirect(302, target);
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Server error', error: e?.message || String(e) });
  }
}
