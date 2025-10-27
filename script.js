// script.js — interactions légères (menu mobile, newsletter mock)

(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
  }

  // API base: use same-origin by default; in local dev when serving static on 5173, target Express API on 3000
  const apiBase = (location.hostname === 'localhost' && location.port === '5173') ? 'http://localhost:3000' : '';

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

  // Panier
  const drawer = document.querySelector('.cart-drawer');
  const openBtn = document.querySelector('[data-cart-open]');
  const closeBtn = document.querySelector('[data-cart-close]');
  const itemsEl = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.total-amount');
  const badgeEl = document.querySelector('.cart-badge');
  const checkoutBtn = document.querySelector('[data-checkout]');

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

  function cartCount() { return cart.reduce((n, it) => n + it.qty, 0); }
  function cartTotal() { return cart.reduce((sum, it) => sum + it.price * it.qty, 0); }

  function renderCart() {
    if (!itemsEl) return;
    itemsEl.innerHTML = '';
    cart.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div>
          <div class="name">${it.name}</div>
          <div class="sub">$${it.price.toFixed(2)}</div>
        </div>
        <div class="controls">
          <div class="qty">
            <button data-dec="${idx}" aria-label="Diminuer">-</button>
            <span>${it.qty}</span>
            <button data-inc="${idx}" aria-label="Augmenter">+</button>
          </div>
          <button data-rem="${idx}" aria-label="Supprimer" class="btn">Retirer</button>
        </div>`;
      itemsEl.appendChild(row);
    });
    if (totalEl) totalEl.textContent = `$${cartTotal().toFixed(2)}`;
    if (badgeEl) badgeEl.textContent = String(cartCount());
  }

  function addToCart(product) {
    const found = cart.find((it) => it.id === product.id);
    if (found) found.qty += 1; else cart.push({ ...product, qty: 1 });
    saveCart();
    renderCart();
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
      const dec = t.getAttribute('data-dec');
      const inc = t.getAttribute('data-inc');
      const rem = t.getAttribute('data-rem');
      if (dec) { const i = Number(dec); cart[i].qty = Math.max(1, cart[i].qty - 1); }
      if (inc) { const i = Number(inc); cart[i].qty += 1; }
      if (rem) { const i = Number(rem); cart.splice(i, 1); }
      saveCart();
      renderCart();
    });
    checkoutBtn?.addEventListener('click', () => {
      fetch(apiBase + '/api/create-checkout-session', {
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
          console.error('Stripe checkout error', d);
          alert((d?.message || 'Impossible d’initier le paiement.') + (d?.error ? `\n${d.error}` : ''));
        })
        .catch(() => alert('Erreur lors de la création de la session de paiement.'));
    });

    const paypalBtn = document.querySelector('[data-checkout-paypal]');
    paypalBtn?.addEventListener('click', () => {
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

  // Init
  loadCart();
  renderCart();
  attachProductButtons();
  attachAnyAddToCart();
  attachCartHandlers();
  attachSearch();

  // Handle PayPal return (token in query)
  (function handlePaypalReturn() {
    try {
      const qp = new URLSearchParams(location.search);
      const token = qp.get('token') || qp.get('orderID');
      const pp = qp.get('pp');
      if (!token && !pp) return;
      fetch(apiBase + '/api/paypal/capture-order?token=' + encodeURIComponent(token || ''), { method: 'POST' })
        .then((r) => r.json())
        .then((d) => {
          if (d?.ok) {
            alert('Paiement PayPal confirmé. Merci!');
            cart = [];
            saveCart();
            renderCart();
            const url = new URL(location.href);
            url.searchParams.delete('token');
            url.searchParams.delete('pp');
            url.searchParams.delete('ppc');
            history.replaceState({}, '', url);
          } else {
            alert(d?.message || 'Impossible de confirmer le paiement PayPal');
          }
        })
        .catch(() => alert('Erreur de confirmation PayPal'));
    } catch (_) {}
  })();

  // Handle Stripe success (success=1 & session_id in query)
  (function handleStripeSuccess() {
    try {
      const qp = new URLSearchParams(location.search);
      const success = qp.get('success');
      const sid = qp.get('session_id');
      if (success !== '1' || !sid) return;
      fetch(apiBase + '/api/order-links?session_id=' + encodeURIComponent(sid))
        .then((r) => r.json())
        .then((d) => {
          if (d?.ok && Array.isArray(d.items)) {
            const links = d.items.flatMap((it) => it.links || []);
            if (links.length) {
              alert('Merci pour votre achat!\nVos liens de téléchargement:\n\n' + links.join('\n'));
            } else {
              alert('Paiement confirmé. Aucun lien trouvé pour cette commande.');
            }
            cart = [];
            saveCart();
            renderCart();
          } else {
            alert(d?.message || 'Paiement confirmé, mais impossible de récupérer les liens.');
          }
        })
        .catch(() => alert('Erreur lors de la récupération des liens d\'achat.'))
        .finally(() => {
          const url = new URL(location.href);
          url.searchParams.delete('success');
          url.searchParams.delete('session_id');
          history.replaceState({}, '', url);
        });
    } catch (_) {}
  })();

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
