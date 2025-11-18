// script.js — interactions légères (menu mobile, newsletter mock)

(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  function ensureMobileMenu() {
    if (document.querySelector('.mobile-menu')) return document.querySelector('.mobile-menu');
    const wrap = document.createElement('div');
    wrap.className = 'mobile-menu';
    wrap.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="Menu">
        <div class="sheet-header">
          <strong>Menu</strong>
          <button class="close" type="button" aria-label="Close">✕ Close</button>
        </div>
        <div class="sheet-search">
          <input type="search" placeholder="Search for products" autocomplete="off" />
        </div>
        <div class="sheet-body">
          <ul class="menu-list">
            <li><a href="./index.html">Home</a></li>
            <li><a href="./products.html">Products</a></li>
            <li><a href="./about.html">About Us</a></li>
            <li><a href="./blog.html">Blog</a></li>
            <li><a href="./support.html">Support</a></li>
            <li><a href="./faq.html">FAQs</a></li>
          </ul>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);
    const close = () => { wrap.classList.remove('open'); document.body.style.overflow = ''; };
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
    wrap.querySelector('.close')?.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    return wrap;
  }

  function openMobileMenu() {
    const menu = ensureMobileMenu();
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        openMobileMenu();
        return;
      }
      if (nav) {
        const isOpen = nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
      } else {
        openMobileMenu();
      }
    });
  }

  // === Zero-coupon helpers ===
  function isZeroCouponActive() {
    try { return localStorage.getItem('couponZero') === '1'; } catch (_) { return false; }
  }
  function setZeroCouponActive(on) {
    try {
      if (on) localStorage.setItem('couponZero', '1');
      else localStorage.removeItem('couponZero');
    } catch (_) {}
  }
  function clearZeroCouponActive() {
    try {
      localStorage.removeItem('couponZero');
      localStorage.removeItem('couponZeroName');
    } catch (_) {}
  }

  function setZeroCouponItemName(name) {
    try { localStorage.setItem('couponZeroName', String(name || 'Votre produit')); } catch (_) {}
  }
  function getZeroCouponItemName() {
    try { return localStorage.getItem('couponZeroName') || 'Votre produit'; } catch (_) { return 'Votre produit'; }
  }

  function attachCouponForm() {
    try {
      const footer = document.querySelector('.cart-footer');
      if (!footer || document.getElementById('coupon-form')) return;
      const box = document.createElement('div');
      box.style.display = 'grid';
      box.style.gap = '8px';
      box.style.marginTop = '8px';
      const form = document.createElement('form');
      form.id = 'coupon-form';
      form.innerHTML = `
        <div style="display:flex; gap:8px; align-items:center;">
          <input id="coupon-code" placeholder="Code promo" autocomplete="off" style="flex:1;" />
          <button class="btn" type="submit">Appliquer</button>
        </div>
        <small id="coupon-msg" class="form-hint" aria-live="polite"></small>
      `;
      box.appendChild(form);
      footer.appendChild(box);

      const msg = () => document.getElementById('coupon-msg');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const codeEl = document.getElementById('coupon-code');
        const code = (codeEl?.value || '').trim();
        const email = getBuyerEmail();
        if (!code) { if (msg()) msg().textContent = 'Entrez un code promo.'; return; }
        if (!isValidEmail(email)) { if (msg()) msg().textContent = 'Saisissez un email valide avant d\'appliquer un code.'; buyerEmailInput?.focus(); return; }
        if (msg()) msg().textContent = 'Vérification du code…';
        try {
          const r = await fetch(apiBase + '/api/redeem-coupon', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, email })
          });
          const d = await r.json().catch(() => ({}));
          if (!r.ok || !d?.ok) {
            if (msg()) msg().textContent = d?.message || 'Code promo invalide.';
            return;
          }
          if (d.action === 'add_product_free' && d.product) {
            addFreeProduct(d.product); // will clear cart and set total to $0
            if (msg()) msg().textContent = d.message || 'Code appliqué ! Total = 0.';
            codeEl.value = '';
            return;
          }
          if (msg()) msg().textContent = 'Code appliqué.';
        } catch (err) {
          if (msg()) msg().textContent = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      });
    } catch (_) {}
  }

  function attachMoreInfoLinks() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const id = card.getAttribute('data-id') || '';
      const name = card.getAttribute('data-name') || 'Product';
      const price = card.getAttribute('data-price') || '0';
      const info = card.querySelector('.more-info');
      if (info && !info.getAttribute('href')) {
        const url = new URL(location.origin + '/product.html');
        url.searchParams.set('id', id);
        url.searchParams.set('name', name);
        url.searchParams.set('price', price);
        info.setAttribute('href', url.toString());
      }
    });
  }

  function attachCardNavigation() {
    // Make product cards clickable
    document.querySelectorAll('.product-card').forEach((card) => {
      if (card.getAttribute('data-click-bound') === '1') return;
      card.setAttribute('data-click-bound', '1');
      const id = card.getAttribute('data-id') || '';
      const name = card.getAttribute('data-name') || 'Product';
      const price = card.getAttribute('data-price') || '0';
      const go = () => {
        if (!id) return;
        const url = new URL(location.origin + '/product.html');
        url.searchParams.set('id', id);
        url.searchParams.set('name', name);
        url.searchParams.set('price', price);
        window.location.assign(url.toString());
      };
      card.addEventListener('click', (e) => {
        const t = e.target;
        if (t instanceof Element && (t.closest('.add-to-cart') || t.closest('button'))) return; // do not navigate when clicking buttons
        go();
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    });

    // Make top offer card clickable
    document.querySelectorAll('.offer-card').forEach((card) => {
      if (card.getAttribute('data-click-bound') === '1') return;
      card.setAttribute('data-click-bound', '1');
      const id = 'pack';
      const name = 'Everything Explained Bundle';
      const price = '139';
      const go = () => {
        const url = new URL(location.origin + '/product.html');
        url.searchParams.set('id', id);
        url.searchParams.set('name', name);
        url.searchParams.set('price', price);
        window.location.assign(url.toString());
      };
      card.addEventListener('click', (e) => {
        const t = e.target;
        if (t instanceof Element && (t.closest('.add-to-cart') || t.closest('button') || t.closest('a.btn'))) return; // keep CTA behavior
        go();
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'link');
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
    });
  }

  function shouldSendOnce(id) {
    try {
      if (!id) return false;
      const key = 'sent:' + id;
      if (localStorage.getItem(key) === '1') return false;
      localStorage.setItem(key, '1');
      return true;
    } catch (_) {
      return true;
    }
  }

  // API base: use same-origin by default; in local dev when serving static on 5173, target Express API on 3000
  const apiBase = (location.hostname === 'localhost' && location.port === '5173') ? 'http://localhost:3000' : '';
  const buyerEmailInput = document.getElementById('buyer-email');
  const isValidEmail = (s) => /\S+@\S+\.\S+/.test(String(s || '').trim());
  const getBuyerEmail = () => {
    try { return buyerEmailInput?.value?.trim() || localStorage.getItem('buyerEmail') || ''; } catch (_) { return buyerEmailInput?.value?.trim() || ''; }
  };
  if (buyerEmailInput) {
    try { const saved = localStorage.getItem('buyerEmail'); if (saved) buyerEmailInput.value = saved; } catch (_) {}
    buyerEmailInput.addEventListener('input', () => {
      try { localStorage.setItem('buyerEmail', buyerEmailInput.value.trim()); } catch (_) {}
      updateCheckoutButtons();
    });
    buyerEmailInput.addEventListener('blur', () => {
      setEmailValidityUI(isValidEmail(getBuyerEmail()));
    });
  }

  function toDirectLink(url) {
    try {
      if (!url) return url;
      // Format: https://drive.google.com/file/d/FILE_ID/view?... -> https://drive.google.com/uc?export=download&id=FILE_ID
      const m = String(url).match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//i);
      if (m && m[1]) return `https://drive.google.com/uc?export=download&id=${m[1]}`;
      // Format: https://drive.google.com/open?id=FILE_ID
      const u = new URL(url);
      if (u.hostname.includes('drive.google.com') && u.searchParams.get('id')) {
        return `https://drive.google.com/uc?export=download&id=${u.searchParams.get('id')}`;
      }
      return url;
    } catch (_) { return url; }
  }

  function sendDownloadsViaEmailJS(to, items, meta) {
    try {
      if (!to || !/\S+@\S+\.\S+/.test(to)) return;
      const cfg = (window.EMAILJS_CONFIG || {});
      if (!window.emailjs || !cfg.serviceId || !cfg.templateId || !cfg.publicKey) return;
      try { window.emailjs.init(cfg.publicKey); } catch (_) {}
      const allLinks = [];
      const summary = Array.isArray(items) ? items.map((it) => {
        (it.links || []).forEach((l) => allLinks.push(toDirectLink(l)));
        return `${it.name || 'Produit'}`;
      }).join(', ') : '';
      const linksHtml = Array.isArray(items)
        ? items.map((it) => {
            const name = it.name || 'Produit';
            const buttons = (it.links || [])
              .map((href, idx) => {
                const dl = toDirectLink(href);
                return `<a href="${dl}" target="_blank" rel="noopener" style="display:inline-block;margin:6px 8px 0 0;padding:10px 14px;background:#6c47ff;color:#ffffff;text-decoration:none;border-radius:8px;">Télécharger ${idx + 1}</a>`;
              })
              .join('');
            return `<div style="margin:10px 0 14px 0;padding:12px;border:1px solid #eee;border-radius:10px;background:#fafaff;">
                      <div style="font-weight:600;margin-bottom:6px;">${name}</div>
                      <div>${buttons}</div>
                    </div>`;
          })
        .join('')
        : '';
      const customerName = (meta && meta.customerName)
        || (to && String(to).split('@')[0])
        || 'Customer';
      const firstLink = allLinks[0] || '';
      const templateParams = {
        to_email: to,
        items_summary: summary,
        links_text: allLinks.join('\n'),
        links_html: linksHtml,
        order_ref: (meta && meta.orderRef) || '' ,
        store_name: 'Business Explique',
        // For the user's custom single-link template
        customer_name: customerName,
        download_link: firstLink
      };
      console.log('[EmailJS] Sending with params:', templateParams);
      window.emailjs
        .send(cfg.serviceId, cfg.templateId, templateParams)
        .then((res) => {
          console.log('[EmailJS] Sent OK:', res);
        })
        .catch((err) => {
          console.error('[EmailJS] Send failed:', err);
          try {
            if (!window.__emailjsWarned) {
              window.__emailjsWarned = true;
              alert('Email non envoyé par EmailJS. Vérifiez la configuration du template et la console pour les détails.');
            }
          } catch (_) {}
        });
    } catch (_) {}
  }

  function attachSearch() {
    const input = document.getElementById('q');
    if (!input) return;
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      grid.querySelectorAll('.product-card').forEach((card) => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  // Header search with dropdown results
  function attachHeaderSearch() {
    const input = document.getElementById('hdr-search');
    const panel = document.getElementById('hdr-search-results');
    if (!input || !panel) return;

    const cards = Array.from(document.querySelectorAll('.product-card'));
    let products = cards.map((card) => {
      const id = card.getAttribute('data-id') || '';
      const name = card.getAttribute('data-name') || (card.querySelector('h3')?.textContent?.trim()) || 'Product';
      const price = Number(card.getAttribute('data-price') || 0) || 0;
      const img = card.querySelector('img')?.getAttribute('src') || '';
      return { id, name, price, img };
    });

    // Fallback catalog if not on products page (no cards available)
    if (!products.length) {
      const underscored = (s) => String(s||'').trim().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
      const imgPng = (title) => `images/ebooks/${underscored(title)}.png`;
      const imgJpg = (title) => `images/ebooks/${underscored(title)}.jpg`;
      const base = [
        { id: 'o1',  name: 'Organizational Management Explained', price: 29 },
        { id: 'ent1',name: 'Entrepreneurship Explained', price: 29 },
        { id: 'm1',  name: 'Marketing Frameworks Explained', price: 29 },
        { id: 'mr1', name: 'Market Research Explained', price: 29 },
        { id: 'sm1', name: 'Strategic Management Explained', price: 29 },
        { id: 'pim1',name: 'Process Improvement Strategies Explained', price: 29 },
        { id: 'pm1', name: 'Project Management Explained', price: 29 },
        { id: 'hr1', name: 'Human Resources Explained', price: 19 },
        { id: 'ls1', name: 'Leadership Strategies Explained', price: 29 },
        { id: 'ns1', name: 'Negotiation Strategies Explained', price: 29 },
        { id: 'ps1', name: 'Productivity Strategies Explained', price: 29 },
        { id: 'fm1x',name: 'Financial Management Explained', price: 29 },
        { id: 'rk1', name: 'Risk Management Explained', price: 29 },
        { id: 'ss1', name: 'Soft Skills Explained', price: 29 },
        { id: 'cms1',name: 'Change Management Strategies Explained', price: 29 },
        { id: 'ees1',name: 'Employee Engagement Strategies Explained', price: 29 },
        { id: 'fdb1',name: '360-Degree Feedback Explained', price: 19 },
        { id: 'tmo1',name: 'Talent Management & Onboarding Explained', price: 29 },
        { id: 'pms1x',name: 'Performance Management Strategies Explained', price: 29 },
        { id: 'bd1x',name: 'Brand Development Explained', price: 29 },
        { id: 'ec1', name: 'Ecommerce Explained', price: 29 },
        { id: 'fc1', name: 'Financial Crisis Explained', price: 29 },
        { id: 'hc1x',name: 'Housing Crisis Explained', price: 29 },
        { id: 'cr1x',name: 'Customer Relationship Explained', price: 29 },
        { id: 'scr1',name: 'Scrum Manual', price: 19 },
        { id: 'kan1',name: 'Kanban Manual', price: 19 },
        { id: 'ag1', name: 'Agile Manual', price: 19 },
        { id: 'ai1', name: 'Artificial Intelligence in Business Explained', price: 29 },
        { id: 'cs1x',name: 'Cyber Security Explained', price: 29 },
        { id: 'ml1x',name: 'Machine Learning Explained', price: 29 },
        { id: 'vr1x',name: 'Virtual Reality Explained', price: 19 },
        { id: 'pack',name: 'Everything Explained Bundle', price: 139 }
      ];
      products = base.map((p) => {
        // Special image for the bundle
        if (p.id === 'pack' || /everything explained bundle/i.test(p.name)) {
          return { ...p, img: 'images/ebooks/all_pack0.png', imgFallback: 'images/ebooks/all_pack0.png' };
        }
        return { ...p, img: imgPng(p.name), imgFallback: imgJpg(p.name) };
      });
    }

    function productUrl(p) {
      const url = new URL(location.origin + '/product.html');
      url.searchParams.set('id', p.id || 'product');
      url.searchParams.set('name', p.name || 'Product');
      if (p.price) url.searchParams.set('price', String(p.price));
      return url.toString();
    }

    function render(list) {
      if (!list.length) {
        panel.innerHTML = '<div class="search-result" style="justify-content:center;color:#6b7280;">No results</div>';
        panel.hidden = false;
        return;
      }
      panel.innerHTML = list
        .slice(0, 20)
        .map((p) => {
          const fallback = p.imgFallback || '';
          const placeholder = 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=160&q=70&auto=format&fit=crop';
          // inline onerror tries JPG then placeholder
          const onerr = fallback
            ? `this.onerror=function(){this.onerror=null;this.src='${placeholder}';};this.src='${fallback}';`
            : `this.onerror=function(){this.onerror=null;this.src='${placeholder}';}`;
          return `
            <a class="search-result" href="${productUrl(p)}">
              <img class="search-thumb" src="${p.img}" alt="" onerror="${onerr}" />
              <div class="search-title">${p.name}</div>
            </a>
          `;
        })
        .join('');
      panel.hidden = false;
    }

    function filter(q) {
      const s = String(q || '').toLowerCase();
      if (!s) { panel.hidden = true; return; }
      const out = products.filter((p) => p.name.toLowerCase().includes(s));
      render(out);
    }

    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('focus', () => { if (input.value) filter(input.value); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { panel.hidden = true; input.blur(); }
    });

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('.header-search')) return; // inside
      panel.hidden = true;
    });
  }

  function attachSort() {
    const select = document.getElementById('sort');
    const grid = document.getElementById('productGrid');
    if (!select || !grid) return;

    // mark initial order
    Array.from(grid.querySelectorAll('.product-card')).forEach((el, idx) => {
      if (!el.getAttribute('data-idx')) el.setAttribute('data-idx', String(idx));
    });

    const priceOf = (el) => Number(el.getAttribute('data-price') || 0) || 0;

    const apply = () => {
      const items = Array.from(grid.querySelectorAll('.product-card'));
      const mode = select.value;
      const sorted = items.slice();
      if (mode === 'price-asc') {
        sorted.sort((a, b) => priceOf(a) - priceOf(b));
      } else if (mode === 'price-desc') {
        sorted.sort((a, b) => priceOf(b) - priceOf(a));
      } else if (mode === 'new') {
        sorted.sort((a, b) => Number(b.getAttribute('data-idx') || 0) - Number(a.getAttribute('data-idx') || 0));
      } else {
        sorted.sort((a, b) => Number(a.getAttribute('data-idx') || 0) - Number(b.getAttribute('data-idx') || 0));
      }
      sorted.forEach((el) => grid.appendChild(el));
    };

    select.addEventListener('change', apply);
    apply();
  }

  // Année dynamique dans le footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Soumission newsletter vers backend
  function attachNewsletterHandler(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const hint = form.querySelector('.form-hint');
      const email = (input?.value || '').trim();

      // Validation simple
      const ok = /.+@.+\..+/.test(email);
      if (!ok) {
        if (hint) hint.textContent = 'Veuillez entrer un email valide.';
        input?.focus();
        return;
      }

      // Requête vers l’API locale
      if (hint) hint.textContent = 'Inscription en cours…';
      fetch(apiBase + '/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || 'Erreur lors de l’inscription');
          if (hint) hint.textContent = data?.message || 'Merci ! Vous recevrez bientôt un email de confirmation.';
          if (input) input.value = '';
        })
        .catch((err) => {
          if (hint) hint.textContent = err?.message || 'Impossible de traiter votre inscription pour le moment.';
        });
    });
  }

  document.querySelectorAll('.newsletter-form').forEach(attachNewsletterHandler);

  // Support form -> POST /api/support and show message
  function attachSupportHandler(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const hint = document.getElementById('support-hint');
      const data = Object.fromEntries(new FormData(form).entries());
      const required = ['firstName', 'lastName', 'email', 'subject', 'message'];
      const missing = required.some((k) => !String(data[k] || '').trim());
      if (missing) { if (hint) hint.textContent = 'Please fill all required fields.'; return; }
      if (hint) hint.textContent = 'Sending…';
      fetch(apiBase + '/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.ok) {
            if (hint) hint.textContent = d.message || 'Message sent.';
            form.reset();
          } else {
            if (hint) hint.textContent = d?.message || 'Failed to send. Try again later.';
          }
        })
        .catch(() => { if (hint) hint.textContent = 'Server error. Try again later.'; });
    });
  }

  // Panier
  const drawer = document.querySelector('.cart-drawer');
  const openBtn = document.querySelector('[data-cart-open]');
  const closeBtn = document.querySelector('[data-cart-close]');
  const itemsEl = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.total-amount');
  const badgeEl = document.querySelector('.cart-badge');
  const checkoutBtn = document.querySelector('[data-checkout]');
  const emailHint = document.getElementById('buyer-email-hint');

  function setEmailValidityUI(valid) {
    try {
      if (buyerEmailInput) buyerEmailInput.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (emailHint) emailHint.style.display = valid ? 'none' : '';
    } catch (_) {}
  }

  function updateCheckoutButtons() {
    const email = getBuyerEmail();
    const valid = isValidEmail(email);
    const paypalBtn = document.querySelector('[data-checkout-paypal]');
    const zero = isZeroCouponActive();
    if (checkoutBtn) checkoutBtn.disabled = !valid || zero;
    if (paypalBtn) paypalBtn.disabled = !valid || zero;
    syncZeroFreeUI();
    setEmailValidityUI(valid);
  }

  function syncZeroFreeUI(){
    const zero = isZeroCouponActive();
    const footer = document.querySelector('.cart-footer');
    const paypalBtn = document.querySelector('[data-checkout-paypal]');
    let freeBtn = document.getElementById('free-download-btn');
    let freeHint = document.getElementById('free-download-hint');
    if (zero) {
      if (checkoutBtn) checkoutBtn.style.display = 'none';
      if (paypalBtn) paypalBtn.style.display = 'none';
      if (!freeBtn) {
        freeBtn = document.createElement('button');
        freeBtn.id = 'free-download-btn';
        freeBtn.className = 'btn btn-primary';
        freeBtn.textContent = 'Obtenir gratuitement';
        freeBtn.style.width = '100%';
        freeBtn.addEventListener('click', () => {
          const email = getBuyerEmail();
          if (!isValidEmail(email)) { setEmailValidityUI(false); buyerEmailInput?.focus(); return; }
          try { localStorage.setItem('cart', JSON.stringify([{ id: 'free', name: getZeroCouponItemName(), price: 0 }])); } catch (_) {}
          try { localStorage.setItem('stripePending', '0'); localStorage.setItem('paypalPending', '0'); } catch (_) {}
          try { window.location.assign('/success.html?free=1'); } catch (_) {}
        });
        if (footer) footer.appendChild(freeBtn);
      }
      if (!freeHint) {
        freeHint = document.createElement('small');
        freeHint.id = 'free-download-hint';
        freeHint.className = 'form-hint';
        freeHint.textContent = 'Cliquez sur “Obtenir gratuitement” pour accéder à vos liens de téléchargement. Un email vous sera envoyé.';
        if (footer && freeBtn) footer.appendChild(freeHint);
      }
    } else {
      if (checkoutBtn) checkoutBtn.style.display = '';
      if (paypalBtn) paypalBtn.style.display = '';
      if (freeBtn) freeBtn.remove();
      if (freeHint) freeHint.remove();
    }
  }

  let cart = [];

  function saveCart() {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (_) {}
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('cart');
      cart = raw ? JSON.parse(raw) : [];
    } catch (_) { cart = []; }
  }

  function cartCount() { return cart.length; }
  function cartTotal() { return cart.reduce((sum, it) => sum + it.price, 0); }

  function hasCartItem(id) {
    return cart.some((it) => it.id === id);
  }

  function renderCart() {
    if (!itemsEl) return;
    itemsEl.innerHTML = '';
    if (!isZeroCouponActive()) {
      cart.forEach((it, idx) => {
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div>
            <div class="name">${it.name}</div>
            <div class="sub">$${it.price.toFixed(2)}</div>
          </div>
          <div class="controls">
            <button data-rem="${idx}" aria-label="Supprimer" class="btn">Retirer</button>
          </div>`;
        itemsEl.appendChild(row);
      });
      if (totalEl) totalEl.textContent = `$${cartTotal().toFixed(2)}`;
    } else {
      // Show a single read-only row for the free product and force total to $0
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <div class="name">${getZeroCouponItemName()}</div>
          <div class="sub">$0.00</div>
        </div>
        <div class="controls">
          <button class="btn" data-zero-clear>Retirer</button>
        </div>`;
      itemsEl.appendChild(row);
      if (totalEl) totalEl.textContent = `$0.00`;
    }
    if (badgeEl) badgeEl.textContent = isZeroCouponActive() ? '1' : String(cartCount());
    syncZeroFreeUI();
  }

  function addToCart(product) {
    const found = cart.find((it) => it.id === product.id);
    if (found) { found.qty = 1; } else { cart.push({ ...product, qty: 1 }); }
    saveCart();
    renderCart();
  }

  function addFreeProduct(product) {
    // Changed behavior: do not show items; make total 0 and clear cart
    try { cart = []; } catch (_) { cart = []; }
    setZeroCouponActive(true);
    setZeroCouponItemName(product?.name || 'Votre produit');
    saveCart();
    renderCart();
    updateCheckoutButtons();
  }

  function attachProductButtons() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const btn = card.querySelector('.add-to-cart');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const p = {
          id: card.getAttribute('data-id'),
          name: card.getAttribute('data-name'),
          price: Number(card.getAttribute('data-price') || 0),
        };
        addToCart(p);
        if (drawer) drawer.classList.add('open');
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function attachAnyAddToCart() {
    document.querySelectorAll('.add-to-cart').forEach((btn) => {
      if (btn.getAttribute('data-bound')) return;
      btn.setAttribute('data-bound', '1');
      btn.addEventListener('click', () => {
        const el = btn;
        const card = el.closest('.product-card');
        const id = el.getAttribute('data-id') || card?.getAttribute('data-id') || '';
        const name = el.getAttribute('data-name') || card?.getAttribute('data-name') || el.textContent?.trim() || 'Product';
        const price = Number(el.getAttribute('data-price') || card?.getAttribute('data-price') || 0);
        if (!id) return;
        addToCart({ id, name, price });
        if (drawer) drawer.classList.add('open');
        if (drawer) drawer.setAttribute('aria-hidden', 'false');
      });
    });
  }

  function attachCartHandlers() {
    openBtn?.addEventListener('click', () => {
      drawer?.classList.add('open');
      drawer?.setAttribute('aria-hidden', 'false');
    });
    closeBtn?.addEventListener('click', () => {
      drawer?.classList.remove('open');
      drawer?.setAttribute('aria-hidden', 'true');
    });
    itemsEl?.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.hasAttribute('data-zero-clear')) {
        // Clear zero-coupon state and re-enable checkout
        clearZeroCouponActive();
        // Leave cart empty; user can add items again
        renderCart();
        updateCheckoutButtons();
        return;
      }
      const rem = t.getAttribute('data-rem');
      if (rem) { const i = Number(rem); cart.splice(i, 1); }
      saveCart();
      renderCart();
    });
    checkoutBtn?.addEventListener('click', () => {
      const email = getBuyerEmail();
      if (!isValidEmail(email)) {
        setEmailValidityUI(false);
        buyerEmailInput?.focus();
        return;
      }
      try { localStorage.setItem('stripePending', '1'); } catch (_) {}
      const origin = location.origin;
      fetch(apiBase + '/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          success_url: origin + '/success.html?success=1&session_id={CHECKOUT_SESSION_ID}',
          cancel_url: origin + '/products.html?canceled=1'
        })
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.url) {
            window.location.assign(d.url);
            return;
          }
          console.error('Stripe checkout error', d);
          alert((d?.message || 'Impossible d’initier le paiement.') + (d?.error ? `\n${d.error}` : ''));
        })
        .catch(() => alert('Erreur lors de la création de la session de paiement.'));
    });

    const paypalBtn = document.querySelector('[data-checkout-paypal]');
    paypalBtn?.addEventListener('click', () => {
      const email = getBuyerEmail();
      if (!isValidEmail(email)) {
        setEmailValidityUI(false);
        buyerEmailInput?.focus();
        return;
      }
      try { localStorage.setItem('paypalPending', '1'); } catch (_) {}
      fetch(apiBase + '/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      })
        .then((r) => r.json())
        .then((d) => {
          if (d?.url) {
            window.location.assign(d.url);
            return;
          }
          alert(d?.message || 'Impossible de démarrer le paiement PayPal');
        })
        .catch(() => alert('Erreur PayPal.'));
    });
  }

  // === Gumroad integration: replace "Add" / "Add to cart" with Gumroad "Buy" buttons ===

  const GUMROAD_BY_ID = {
    o1:   'https://businessexplique.gumroad.com/l/OrganizationalManagementExplained',
    ent1: 'https://businessexplique.gumroad.com/l/EntrepreneurshipExplained',
    m1:   'https://businessexplique.gumroad.com/l/MarketingFrameworksExplained',
    mr1:  'https://businessexplique.gumroad.com/l/MarketResearchExplained',
    sm1:  'https://businessexplique.gumroad.com/l/StrategicManagementExplained',
    pim1: 'https://businessexplique.gumroad.com/l/ProcessImprovementStrategiesExplained',
    pm1:  'https://businessexplique.gumroad.com/l/ProjectManagementExplained',
    hr1:  'https://businessexplique.gumroad.com/l/HumanResourcesExplained',
    ls1:  'https://businessexplique.gumroad.com/l/LeadershipStrategiesExplained',
    ns1:  'https://businessexplique.gumroad.com/l/NegotiationStrategiesExplained',
    ps1:  'https://businessexplique.gumroad.com/l/ProductivityStrategiesExplained',
    fm1x: 'https://businessexplique.gumroad.com/l/FinancialManagementExplained',
    rk1:  'https://businessexplique.gumroad.com/l/RiskManagementExplained',
    ss1:  'https://businessexplique.gumroad.com/l/SoftSkillsExplained',
    cms1: 'https://businessexplique.gumroad.com/l/ChangeManagementStrategiesExplained',
    ees1: 'https://businessexplique.gumroad.com/l/EmployeeEngagementStrategiesExplained',
    fdb1: 'https://businessexplique.gumroad.com/l/Feedback360DegreeExplained',
    tmo1: 'https://businessexplique.gumroad.com/l/TalentManagementOnboardingExplained',
    pms1x:'https://businessexplique.gumroad.com/l/PerformanceManagementStrategiesExplained',
    bd1x: 'https://businessexplique.gumroad.com/l/BrandDevelopmentExplained',
    ec1:  'https://businessexplique.gumroad.com/l/EcommerceExplained',
    fc1:  'https://businessexplique.gumroad.com/l/FinancialCrisisExplained',
    hc1x: 'https://businessexplique.gumroad.com/l/HousingCrisisExplained',
    cr1x: 'https://businessexplique.gumroad.com/l/CustomerRelationshipExplained',
    scr1: 'https://businessexplique.gumroad.com/l/ScrumManual',
    kan1: 'https://businessexplique.gumroad.com/l/KanbanManual',
    ag1:  'https://businessexplique.gumroad.com/l/AgileManual',
    ai1:  'https://businessexplique.gumroad.com/l/ArtificialIntelligenceInBusinessExplained',
    cs1x: 'https://businessexplique.gumroad.com/l/CyberSecurityExplained',
    ml1x: 'https://businessexplique.gumroad.com/l/MachineLearningExplained',
    vr1x: 'https://businessexplique.gumroad.com/l/VirtualRealityExplained',
    pack: 'https://businessexplique.gumroad.com/l/EverythingExplainedBundle'
  };

  const GUMROAD_BY_NAME = {
    'Organizational Management Explained': GUMROAD_BY_ID.o1,
    'Entrepreneurship Explained': GUMROAD_BY_ID.ent1,
    'Marketing Frameworks Explained': GUMROAD_BY_ID.m1,
    'Market Research Explained': GUMROAD_BY_ID.mr1,
    'Strategic Management Explained': GUMROAD_BY_ID.sm1,
    'Process Improvement Strategies Explained': GUMROAD_BY_ID.pim1,
    'Project Management Explained': GUMROAD_BY_ID.pm1,
    'Human Resources Explained': GUMROAD_BY_ID.hr1,
    'Leadership Strategies Explained': GUMROAD_BY_ID.ls1,
    'Negotiation Strategies Explained': GUMROAD_BY_ID.ns1,
    'Productivity Strategies Explained': GUMROAD_BY_ID.ps1,
    'Financial Management Explained': GUMROAD_BY_ID.fm1x,
    'Risk Management Explained': GUMROAD_BY_ID.rk1,
    'Soft Skills Explained': GUMROAD_BY_ID.ss1,
    'Change Management Strategies Explained': GUMROAD_BY_ID.cms1,
    'Employee Engagement Strategies Explained': GUMROAD_BY_ID.ees1,
    '360-Degree Feedback Explained': GUMROAD_BY_ID.fdb1,
    'Talent Management & Onboarding Explained': GUMROAD_BY_ID.tmo1,
    'Performance Management Strategies Explained': GUMROAD_BY_ID.pms1x,
    'Brand Development Explained': GUMROAD_BY_ID.bd1x,
    'Ecommerce Explained': GUMROAD_BY_ID.ec1,
    'Financial Crisis Explained': GUMROAD_BY_ID.fc1,
    'Housing Crisis Explained': GUMROAD_BY_ID.hc1x,
    'Customer Relationship Explained': GUMROAD_BY_ID.cr1x,
    'Scrum Manual': GUMROAD_BY_ID.scr1,
    'Kanban Manual': GUMROAD_BY_ID.kan1,
    'Agile Manual': GUMROAD_BY_ID.ag1,
    'Artificial Intelligence in Business Explained': GUMROAD_BY_ID.ai1,
    'Cyber Security Explained': GUMROAD_BY_ID.cs1x,
    'Machine Learning Explained': GUMROAD_BY_ID.ml1x,
    'Virtual Reality Explained': GUMROAD_BY_ID.vr1x,
    'Everything Explained Bundle': GUMROAD_BY_ID.pack
  };

  function getGumroadUrlForElement(el) {
    if (!el) return '';
    const card = el.closest('.product-card') || el.closest('.offer-card');
    const explicitHref = el.getAttribute('data-gumroad') || el.getAttribute('href');
    if (explicitHref && /gumroad\.com\//i.test(explicitHref)) return explicitHref;
    const id =
      el.getAttribute('data-id') ||
      (card && card.getAttribute('data-id')) ||
      '';
    const titleEl = document.getElementById('pd-title');
    const name =
      el.getAttribute('data-name') ||
      (card && card.getAttribute('data-name')) ||
      (titleEl && titleEl.textContent ? titleEl.textContent.trim() : '');
    if (id && GUMROAD_BY_ID[id]) return GUMROAD_BY_ID[id];
    if (name && GUMROAD_BY_NAME[name]) return GUMROAD_BY_NAME[name];
    return '';
  }

  function replaceAddToCartWithGumroad(root) {
    const scope = root || document;
    const candidates = Array.from(
      scope.querySelectorAll('.add-to-cart, a.btn, button.btn')
    );

    candidates.forEach((node) => {
      let btn = node;
      const text = (btn.textContent || '').toLowerCase();

      const card = btn.closest('.product-card') || btn.closest('.offer-card');
      const idAttr = btn.getAttribute('data-id') || (card && card.getAttribute('data-id')) || '';

      // Normal produits : seulement si le texte contient "add".
      // Bundle (id=pack) : on le convertit même si le texte ne contient pas "add".
      if (!/add/.test(text) && idAttr !== 'pack') return;

      const url = getGumroadUrlForElement(btn);
      if (!url) return;

      const id =
        idAttr ||
        '';
      const titleEl = document.getElementById('pd-title');
      const name =
        btn.getAttribute('data-name') ||
        (card && card.getAttribute('data-name')) ||
        (titleEl && titleEl.textContent ? titleEl.textContent.trim() : 'Product');

      // Turn into Gumroad overlay button
      btn.classList.remove('add-to-cart');
      btn.classList.add('gumroad-button');

      if (btn.tagName === 'BUTTON') {
        const link = document.createElement('a');
        link.className = btn.className;
        link.textContent = btn.textContent;
        Array.from(btn.attributes).forEach((attr) => {
          if (attr.name === 'class') return;
          link.setAttribute(attr.name, attr.value);
        });
        btn.replaceWith(link);
        btn = link;
      }

      btn.setAttribute('href', url);
      btn.removeAttribute('data-id');
      btn.removeAttribute('data-name');
      btn.removeAttribute('data-price');

      if (id === 'pack' || /everything explained bundle/i.test(name)) {
        btn.textContent = 'Buy Bundle';
      } else {
        btn.textContent = 'Buy';
      }

      console.log('[Gumroad] Button updated', {
        id: id || null,
        name,
        url
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    try { replaceAddToCartWithGumroad(); } catch (_) {}
    try {
      const mo = new MutationObserver(() => {
        replaceAddToCartWithGumroad();
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (_) {}
  });

  window.addEventListener('load', () => {
    try { replaceAddToCartWithGumroad(); } catch (_) {}
  });

  // Init
  loadCart();
  renderCart();
  attachProductButtons();
  attachAnyAddToCart();
  attachMoreInfoLinks();
  attachCardNavigation();
  attachCartHandlers();
  attachHeaderSearch();
  attachSearch();
  attachSort();
  attachCouponForm();
  updateCheckoutButtons();
  // Support form init
  attachSupportHandler(document.getElementById('support-form'));

  // Handle PayPal return (token in query)
  (function handlePaypalReturn() {
    try {
      const qp = new URLSearchParams(location.search);
      const token = qp.get('token');
      const payer = qp.get('PayerID');
      // Capture if PayPal returned with token (PayerID may be absent with Orders V2)
      if (!token) return;
      fetch(apiBase + '/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, payer })
      })
        .then((r) => r.json())
        .then((d) => {
          const defaultLinks = [
            'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
          ];
          if (d?.ok) {
            const items = (Array.isArray(cart) && cart.length)
              ? cart.map((it) => ({ name: it.name || 'Produit', links: defaultLinks }))
              : [{ name: 'Your purchase', links: defaultLinks }];
            showPrettyConfirmationModal(items);
            const email = getBuyerEmail();
            if (email && shouldSendOnce('paypal:'+String(token||'capture'))) sendDownloadsViaEmailJS(email, items, { orderRef: 'PAYPAL' });
            cart = [];
            saveCart();
            renderCart();
            try { window.location.assign('/success.html?paypal=1'); } catch (_) {}
          } else {
            // Fallback: still present the default download link to match Stripe UX
            const items = [{ name: 'Your purchase', links: defaultLinks }];
            showPrettyConfirmationModal(items);
            const email = getBuyerEmail();
            if (email && shouldSendOnce('paypal:fallback')) sendDownloadsViaEmailJS(email, items, { orderRef: 'PAYPAL', paymentMethod: 'PayPal' });
            try { window.location.assign('/success.html?paypal=1'); } catch (_) {}
          }
        })
        .catch(() => showPrettyConfirmationModal(null))
        .finally(() => {
          const url = new URL(location.href);
          url.searchParams.delete('pp');
          url.searchParams.delete('token');
          url.searchParams.delete('PayerID');
          url.searchParams.delete('ppc');
          history.replaceState({}, '', url);
          try { localStorage.removeItem('paypalPending'); } catch (_) {}
        });
    } catch (_) {}
  })();

  // Fallback: if coming back from PayPal without expected params, still show links and redirect
  (function handlePaypalReferrerFallback() {
    try {
      const pending = (localStorage.getItem('paypalPending') === '1');
      if (!pending && (!document.referrer || !/paypal\.com/i.test(document.referrer))) return;
      const qp = new URLSearchParams(location.search);
      if (qp.get('token') || qp.get('PayerID')) return; // normal handler will run
      const defaultLinks = [
        'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
      ];
      const items = (Array.isArray(cart) && cart.length)
        ? cart.map((it) => ({ name: it.name || 'Produit', links: defaultLinks }))
        : [{ name: 'Your purchase', links: defaultLinks }];
      showPrettyConfirmationModal(items);
      const email = getBuyerEmail();
      if (email && shouldSendOnce('paypal:referrer')) sendDownloadsViaEmailJS(email, items, { orderRef: 'PAYPAL' });
      try { window.location.assign('/success.html?paypal=1'); } catch (_) {}
      try { localStorage.removeItem('paypalPending'); } catch (_) {}
    } catch (_) {}
  })();

  // Stripe fallback: if we returned from Stripe without expected params (rare), still show default link
  (function handleStripeReferrerFallback() {
    try {
      const pending = (localStorage.getItem('stripePending') === '1');
      const qp = new URLSearchParams(location.search);
      const hasSid = !!qp.get('session_id');
      const hasSuccess = qp.get('success') === '1';
      if (hasSid || hasSuccess) return;
      if (!pending && (!document.referrer || !/stripe\.com/i.test(document.referrer))) return;
      const defaultLinks = [
        'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
      ];
      const items = (Array.isArray(cart) && cart.length)
        ? cart.map((it) => ({ name: it.name || 'Produit', links: defaultLinks }))
        : [{ name: 'Your purchase', links: defaultLinks }];
      showPrettyConfirmationModal(items);
      const email = getBuyerEmail();
      if (email && shouldSendOnce('stripe:referrer')) sendDownloadsViaEmailJS(email, items, { orderRef: 'STRIPE_FALLBACK' });
      try { localStorage.removeItem('stripePending'); } catch (_) {}
    } catch (_) {}
  })();

  // Handle Stripe success (success=1 & session_id in query)
  (function handleStripeSuccess() {
    try {
      const qp = new URLSearchParams(location.search);
      const success = qp.get('success');
      const sid = qp.get('session_id');
      // Proceed if we have a session_id, even if 'success' flag is missing
      if (!sid && success !== '1') return;
      // Fallback: if session_id is missing (old success_url), still show default download link
      if (!sid) {
        const defaultLinks = [
          'https://drive.google.com/file/d/1hHlcsfOf0w6QjxY2_CLp8kkfu0OBRWyT/view?usp=drive_link'
        ];
        showPrettyConfirmationModal([{ name: 'Your purchase', links: defaultLinks }]);
        const url = new URL(location.href);
        url.searchParams.delete('success');
        history.replaceState({}, '', url);
        return;
      }
      fetch(apiBase + '/api/order-links?session_id=' + encodeURIComponent(sid))
        .then((r) => r.json())
        .then((d) => {
          if (d?.ok && Array.isArray(d.items)) {
            showPrettyConfirmationModal(d.items);
            // try to send receipt email silently
            fetch(apiBase + '/api/send-receipt?session_id=' + encodeURIComponent(sid), { method: 'POST' }).catch(() => {});
            const email = getBuyerEmail();
            if (email && shouldSendOnce('stripe:'+String(sid||''))) sendDownloadsViaEmailJS(email, d.items, { orderRef: sid });
            cart = [];
            saveCart();
            renderCart();
          } else {
            showPrettyConfirmationModal([]);
          }
        })
        .catch(() => showPrettyConfirmationModal(null))
        .finally(() => {
          const url = new URL(location.href);
          url.searchParams.delete('success');
          url.searchParams.delete('session_id');
          history.replaceState({}, '', url);
        });
    } catch (_) {}
  })();

  function showDownloadModal(links) {
    try {
      const existing = document.getElementById('download-modal');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'download-modal';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.5)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '10000';

      const panel = document.createElement('div');
      panel.style.background = 'white';
      panel.style.borderRadius = '12px';
      panel.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      panel.style.maxWidth = '640px';
      panel.style.width = 'min(92vw, 640px)';
      panel.style.padding = '20px';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      const h = document.createElement('h2');
      h.textContent = 'Merci pour votre achat !';
      h.style.margin = '0';
      h.style.fontSize = '20px';
      const close = document.createElement('button');
      close.textContent = '✕';
      close.setAttribute('aria-label', 'Fermer');
      close.style.border = '0';
      close.style.background = 'transparent';
      close.style.fontSize = '18px';
      close.style.cursor = 'pointer';
      close.onclick = () => overlay.remove();
      header.appendChild(h);
      header.appendChild(close);

      const body = document.createElement('div');
      body.style.marginTop = '10px';
      const p = document.createElement('p');
      if (links === null) {
        p.textContent = 'Erreur lors de la récupération des liens. Veuillez vérifier votre email ou contacter le support.';
      } else if (!links?.length) {
        p.textContent = 'Paiement confirmé. Aucun lien trouvé pour cette commande.';
      } else {
        p.textContent = 'Vos liens de téléchargement :';
      }
      body.appendChild(p);

      if (Array.isArray(links) && links.length) {
        const list = document.createElement('div');
        list.style.display = 'grid';
        list.style.gap = '10px';
        links.forEach((href, idx) => {
          const a = document.createElement('a');
          a.href = href;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = 'Télécharger ' + (idx + 1);
          a.className = 'btn btn-primary';
          a.style.display = 'inline-block';
          a.style.textAlign = 'center';
          a.style.padding = '10px 14px';
          a.style.borderRadius = '8px';
          a.style.background = '#6c47ff';
          a.style.color = 'white';
          a.style.textDecoration = 'none';
          list.appendChild(a);
        });
        body.appendChild(list);
      }

      const footer = document.createElement('div');
      footer.style.display = 'flex';
      footer.style.justifyContent = 'flex-end';
      footer.style.marginTop = '16px';
      const ok = document.createElement('button');
      ok.textContent = 'OK';
      ok.className = 'btn';
      ok.style.padding = '10px 14px';
      ok.style.borderRadius = '8px';
      ok.style.border = '1px solid #ddd';
      ok.style.cursor = 'pointer';
      ok.onclick = () => overlay.remove();
      footer.appendChild(ok);

      panel.appendChild(header);
      panel.appendChild(body);
      panel.appendChild(footer);
      overlay.appendChild(panel);
      document.body.appendChild(overlay);
    } catch (_) {}
  }

  function showDownloadModalFromItems(items) {
    if (items === null) {
      return showDownloadModal(null);
    }
    if (!Array.isArray(items) || !items.length) {
      return showDownloadModal([]);
    }
    // Build grouped content with names and links
    const allLinks = [];
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gap = '14px';
    items.forEach((it) => {
      const card = document.createElement('div');
      card.className = 'card';
      const body = document.createElement('div');
      body.className = 'card-body';
      const title = document.createElement('h3');
      title.textContent = `${it.name || 'Produit'}`;
      title.style.margin = '0 0 8px';
      body.appendChild(title);
      const list = document.createElement('div');
      list.style.display = 'grid';
      list.style.gap = '8px';
      (it.links || []).forEach((href, idx) => {
        allLinks.push(href);
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Télécharger ' + (idx + 1);
        a.className = 'btn btn-primary';
        a.style.display = 'inline-block';
        a.style.textAlign = 'center';
        a.style.padding = '10px 14px';
        a.style.borderRadius = '8px';
        a.style.background = '#6c47ff';
        a.style.color = 'white';
        a.style.textDecoration = 'none';
        list.appendChild(a);
      });
      body.appendChild(list);
      card.appendChild(body);
      container.appendChild(card);
    });

    // Attach a copy-all button to the modal via a slight extension
    showDownloadModal(allLinks);
    const overlay = document.getElementById('download-modal');
    if (!overlay) return;
    const panel = overlay.firstChild;
    const bodyWrap = panel.children[1];
    // Clear default body and inject grouped content + copy button
    while (bodyWrap.firstChild) bodyWrap.removeChild(bodyWrap.firstChild);
    const intro = document.createElement('p');
    intro.textContent = 'Vos liens de téléchargement :';
    bodyWrap.appendChild(intro);
    bodyWrap.appendChild(container);

    if (allLinks.length) {
      const copy = document.createElement('button');
      copy.textContent = 'Copier tous les liens';
      copy.className = 'btn';
      copy.style.marginTop = '10px';
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(allLinks.join('\n'));
          copy.textContent = 'Copié !';
          setTimeout(() => (copy.textContent = 'Copier tous les liens'), 1500);
        } catch (_) {}
      };
      bodyWrap.appendChild(copy);
    }
  }

  // Support form submission
  const supportForm = document.getElementById('support-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const hint = document.getElementById('support-hint');
      const payload = {
        firstName: supportForm.firstName?.value?.trim(),
        lastName: supportForm.lastName?.value?.trim(),
        email: supportForm.email?.value?.trim(),
        subject: supportForm.subject?.value?.trim(),
        message: supportForm.message?.value?.trim(),
      };
      if (!payload.firstName || !payload.lastName || !payload.email || !payload.subject || !payload.message) {
        if (hint) hint.textContent = 'Please fill all required fields.';
        return;
      }
      if (hint) hint.textContent = 'Sending…';
      fetch(apiBase + '/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.message || 'Could not send your request');
          if (hint) hint.textContent = data?.message || 'Thanks! We will get back to you ASAP.';
          supportForm.reset();
        })
        .catch((err) => {
          if (hint) hint.textContent = err?.message || 'Please try again later.';
        });
    });
  }
})();
