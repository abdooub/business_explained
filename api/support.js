module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method Not Allowed' });
    return;
  }
  try {
    const { firstName, lastName, email, subject, message } = req.body || {};
    if (!firstName || !lastName || !email || !subject || !message) {
      res.status(400).json({ ok: false, message: 'Missing required fields' });
      return;
    }
    res.json({ ok: true, message: 'Your request has been received. Our team will get back to you ASAP.' });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Server error' });
  }
};
