const Stripe = require('stripe');

// Simple mapping from product names to downloadable PDF links
const DEFAULT_LINKS = [
  'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
];
const LINK_MAP = {
  'Top-Tier Management Explained': [
    'https://drive.google.com/file/d/top-tier-management-explained/view?usp=sharing'
  ],
  'Strategic Management Explained': [
    'https://drive.google.com/file/d/strategic-management-explained/view?usp=sharing'
  ],
  'Sales Strategies Explained': [
    'https://drive.google.com/file/d/sales-strategies-explained/view?usp=sharing'
  ],
  'Competitive Advantage Explained': [
    'https://drive.google.com/file/d/competitive-advantage-explained/view?usp=sharing'
  ],
  'Marketing Frameworks Explained': [
    'https://drive.google.com/file/d/marketing-frameworks-explained/view?usp=sharing'
  ],
  'Business Development Explained': [
    'https://drive.google.com/file/d/business-development-explained/view?usp=sharing'
  ],
  'Consulting Management Explained': [
    'https://drive.google.com/file/d/consulting-management-explained/view?usp=sharing'
  ],
  'Organizational Management Explained': [
    'https://drive.google.com/file/d/organizational-management-explained/view?usp=sharing'
  ],
  'Human Resources Explained': [
    'https://drive.google.com/file/d/human-resources-explained/view?usp=sharing'
  ],
  'Project Management Explained': [
    'https://drive.google.com/file/d/project-management-explained/view?usp=sharing'
  ],
  'Process Improvement Strategies Explained': [
    'https://drive.google.com/file/d/process-improvement-strategies-explained/view?usp=sharing'
  ],
  'Entrepreneurship Explained': [
    'https://drive.google.com/file/d/entrepreneurship-explained/view?usp=sharing'
  ],
  'Market Research Explained': [
    'https://drive.google.com/file/d/market-research-explained/view?usp=sharing'
  ],
  'Leadership Strategies Explained': [
    'https://drive.google.com/file/d/leadership-strategies-explained/view?usp=sharing'
  ],
  'Negotiation Strategies Explained': [
    'https://drive.google.com/file/d/negotiation-strategies-explained/view?usp=sharing'
  ],
  'Productivity Strategies Explained': [
    'https://drive.google.com/file/d/productivity-strategies-explained/view?usp=sharing'
  ],
  'Financial Management Explained': [
    'https://drive.google.com/file/d/financial-management-explained/view?usp=sharing'
  ],
  'Risk Management Explained': [
    'https://drive.google.com/file/d/risk-management-explained/view?usp=sharing'
  ],
  'Soft Skills Explained': [
    'https://drive.google.com/file/d/soft-skills-explained/view?usp=sharing'
  ],
  'Change Management Strategies Explained': [
    'https://drive.google.com/file/d/change-management-strategies-explained/view?usp=sharing'
  ],
  'Employee Engagement Strategies Explained': [
    'https://drive.google.com/file/d/employee-engagement-strategies-explained/view?usp=sharing'
  ],
  '360-Degree Feedback Explained': [
    'https://drive.google.com/file/d/360-degree-feedback-explained/view?usp=sharing'
  ],
  'Talent Management & Onboarding Explained': [
    'https://drive.google.com/file/d/talent-management-onboarding-explained/view?usp=sharing'
  ],
  'Performance Management Strategies Explained': [
    'https://drive.google.com/file/d/performance-management-strategies-explained/view?usp=sharing'
  ],
  'Brand Development Explained': [
    'https://drive.google.com/file/d/brand-development-explained/view?usp=sharing'
  ],
  'Ecommerce Explained': [
    'https://drive.google.com/file/d/ecommerce-explained/view?usp=sharing'
  ],
  'Financial Crisis Explained': [
    'https://drive.google.com/file/d/financial-crisis-explained/view?usp=sharing'
  ],
  'Housing Crisis Explained': [
    'https://drive.google.com/file/d/housing-crisis-explained/view?usp=sharing'
  ],
  'Customer Relationship Explained': [
    'https://drive.google.com/file/d/customer-relationship-explained/view?usp=sharing'
  ],
  'Scrum Manual': [
    'https://drive.google.com/file/d/scrum-manual/view?usp=sharing'
  ],
  'Kanban Manual': [
    'https://drive.google.com/file/d/kanban-manual/view?usp=sharing'
  ],
  'Agile Manual': [
    'https://drive.google.com/file/d/agile-manual/view?usp=sharing'
  ],
  'Artificial Intelligence in Business Explained': [
    'https://drive.google.com/file/d/artificial-intelligence-in-business-explained/view?usp=sharing'
  ],
  'Cyber Security Explained': [
    'https://drive.google.com/file/d/cyber-security-explained/view?usp=sharing'
  ],
  'Machine Learning Explained': [
    'https://drive.google.com/file/d/machine-learning-explained/view?usp=sharing'
  ],
  'Virtual Reality Explained': [
    'https://drive.google.com/file/d/virtual-reality-explained/view?usp=sharing'
  ],
  // Bundle: include all links
  'Everything Explained Bundle': [
    'https://drive.google.com/file/d/top-tier-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/strategic-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/sales-strategies-explained/view?usp=sharing',
    'https://drive.google.com/file/d/competitive-advantage-explained/view?usp=sharing',
    'https://drive.google.com/file/d/marketing-frameworks-explained/view?usp=sharing',
    'https://drive.google.com/file/d/business-development-explained/view?usp=sharing',
    'https://drive.google.com/file/d/consulting-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/organizational-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/human-resources-explained/view?usp=sharing',
    'https://drive.google.com/file/d/project-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/process-improvement-strategies-explained/view?usp=sharing'
  ],
  'All Products Special': [
    'https://drive.google.com/file/d/top-tier-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/strategic-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/sales-strategies-explained/view?usp=sharing',
    'https://drive.google.com/file/d/competitive-advantage-explained/view?usp=sharing',
    'https://drive.google.com/file/d/marketing-frameworks-explained/view?usp=sharing',
    'https://drive.google.com/file/d/business-development-explained/view?usp=sharing',
    'https://drive.google.com/file/d/consulting-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/organizational-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/human-resources-explained/view?usp=sharing',
    'https://drive.google.com/file/d/project-management-explained/view?usp=sharing',
    'https://drive.google.com/file/d/process-improvement-strategies-explained/view?usp=sharing'
  ]
};

const handler = async function handler(req, res) {
  try {
    const sessionId = req.query?.session_id || req.query?.sessionid || req.query?.session;
    if (!sessionId) {
      res.status(400).json({ ok: false, message: 'Missing session_id' });
      return;
    }
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
    if (!STRIPE_SECRET_KEY) {
      res.status(500).json({ ok: false, message: 'Stripe non configuré' });
      return;
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      res.status(400).json({ ok: false, message: 'Payment not confirmed' });
      return;
    }

    // Get purchased line items
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100 });

    let items = (lineItems?.data || []).map((li) => {
      const name = li.description || li.price?.product || 'Product';
      const links = LINK_MAP[name] || DEFAULT_LINKS;
      return { name, qty: li.quantity || 1, links };
    });

    // Fallback: if Stripe returned no line items, still return default links
    if (!items.length) {
      items = [{ name: 'Order', qty: 1, links: DEFAULT_LINKS }];
    }

    res.json({ ok: true, items });
  } catch (e) {
    res.status(500).json({ ok: false, message: 'Erreur', error: e?.message || String(e) });
  }
};

module.exports = Object.assign(handler, { LINK_MAP, DEFAULT_LINKS });
