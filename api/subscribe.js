module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }
  try {
    const email = String(req.body?.email || '').trim();
    const ok = /.+@.+\..+/.test(email);
    if (!ok) {
      res.status(400).json({ ok: false, message: 'Email invalide' });
      return;
    }
    res.json({ ok: true, message: 'Inscription réussie' });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Erreur serveur' });
  }
};
