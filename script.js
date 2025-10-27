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
            showDownloadModalFromItems(d.items);
            // try to send receipt email silently
            fetch(apiBase + '/api/send-receipt?session_id=' + encodeURIComponent(sid), { method: 'POST' }).catch(() => {});
            cart = [];
            saveCart();
            renderCart();
          } else {
            showDownloadModalFromItems([]);
          }
        })
        .catch(() => showDownloadModalFromItems(null))
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
      title.textContent = `${it.name || 'Produit'} (x${it.qty || 1})`;
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
