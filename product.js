(function(){
  function slugify(s){ return String(s||'').toLowerCase().trim().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
  function underscored(s){ return String(s||'').trim().replace(/[^A-Za-z0-9]+/g,'_').replace(/^_+|_+$/g,''); }

  var imgMap = {
    t1: 'images/ebooks/t1.png',
    o1: 'images/ebooks/Organizational_Management_Explained.png',
    c1: 'images/ebooks/c1.png',
    b1: 'images/ebooks/b1.png',
    m1: 'images/ebooks/m1.png',
    ca1:'images/ebooks/ca1.png',
    s1: 'images/ebooks/s1.png',
    sm1:'images/ebooks/sm1.png',
    pim1:'images/ebooks/pim1.png',
    pm1: 'images/ebooks/pm1.png',
    hr1: 'images/ebooks/hr1.png',
    pack:'images/ebooks/all_pack.png'
  };

  function candidateImages(name, code){
    var base = 'images/ebooks/';
    var dash = slugify(name);
    var under = underscored(name);
    var out = [
      base + under + '.png',
      base + under + '.jpg',
      base + dash + '.png',
      base + dash + '.jpg',
      base + under + '.PNG',
      base + under + '.JPG',
      base + dash + '.PNG',
      base + dash + '.JPG',
      base + under + '.jpeg',
      base + dash + '.jpeg'
    ];
    if (code) {
      out.push(base + code + '.png', base + code + '.jpg', base + code + '.PNG', base + code + '.JPG', base + code + '.jpeg');
    }
    return out;
  }

  function setSrcWithFallback(img, candidates, fallback){
    var list = Array.isArray(candidates) ? candidates.slice() : [];
    function tryNext(){
      if (!list.length){ img.onerror = null; img.src = fallback; return; }
      var next = list.shift();
      img.onerror = tryNext; img.src = next;
    }
    try { console.debug('[image-candidates]', candidates); } catch(_) {}
    tryNext();
  }

  var catalog = {
    'Organizational Management Explained': {
      price: 29, pages: 359,
      desc: 'How to run and improve any organization, explained strategy by strategy across 359 pages of usable knowledge.',
      features: [
        'Explore Modern Management Strategies',
        'Strategic Planning, PM & HR Management, Operations and Quality Management',
        'Value Stream Mapping, SMART Goals, SWOT Analysis and more'
      ],
      keywords: ['organizational management','strategy','operations','hr','swot','smart goals','value stream mapping','ebook']
    },
    'Marketing Frameworks Explained': {
      price: 29, pages: 256,
      desc: 'What really works in marketing, explained framework by framework across 256 pages of usable knowledge.',
      features: [
        '28+ Marketing Frameworks',
        '50+ Examples, Real-world Insights',
        'From Fundamentals to Advanced Strategies'
      ],
      keywords: ['marketing','frameworks','examples','strategy','ebook']
    },
    'Strategic Management Explained': {
      price: 29,
      desc: 'Navigate the strategic journey using field-tested tools and examples from top companies.',
      features: [
        'Navigate the Strategic Journey',
        'Use PESTLE, Porters, SWOT, VRIO and more',
        'Examples From Top Companies'
      ],
      keywords: ['strategy','pestle','porter','swot','vrio','ebook']
    },
    'Process Improvement Strategies Explained': {
      price: 29, pages: 77,
      desc: '9 methodologies and 10 tools to improve processes, from Lean and Six Sigma to Kaizen and beyond.',
      features: [
        '9 Methodologies & 10 Tools for Process Improvement',
        'Lean, Six Sigma, Kaizen and more',
        'From Fundamentals to Advanced Strategies'
      ],
      keywords: ['process improvement','lean','six sigma','kaizen','tools','ebook']
    },
    'Human Resources Explained': {
      price: 19, pages: 76,
      desc: 'Essential HR concepts with best practices from recruitment to retention, with real-world guidance.',
      features: [
        'Essential HR Concepts With Best Practices',
        'From Recruitment to Retention',
        'Real-world Guidance & Examples'
      ],
      keywords: ['human resources','recruitment','retention','hr','best practices','ebook']
    },
    'Leadership Strategies Explained': {
      price: 29, pages: 114,
      desc: 'Lead with confidence using 14+ proven strategies, examples, and a personalized development plan.',
      features: [
        '14+ Leadership Strategies',
        'Create a Personalized Development Plan',
        'Learn With Real-life Leadership Examples'
      ],
      keywords: ['leadership','development plan','examples','ebook']
    },
    'Negotiation Strategies Explained': {
      price: 29, pages: 64,
      desc: 'Master 15+ negotiation strategies to navigate complex talks and communicate with impact.',
      features: [
        '15+ Negotiation Strategies',
        'Navigate Complex Talks Confidently',
        'Master Communication for Success'
      ],
      keywords: ['negotiation','communication','strategy','ebook']
    },
    'Productivity Strategies Explained': {
      price: 29, pages: 79,
      desc: '14 productivity strategies distilled into actionable methods to save hours every week.',
      features: [
        '14 Productivity Strategies',
        'Save Hours Weekly With These Methods',
        'Hours of research simplified'
      ],
      keywords: ['productivity','time management','methods','ebook']
    },
    'Financial Management Explained': {
      price: 29, pages: 74,
      desc: '13 financial management strategies with the latest trends explained clearly and concisely.',
      features: [
        '13 Financial Management Strategies',
        'Stay Ahead With Latest Trends',
        'Hours of Research Simplified'
      ],
      keywords: ['finance','financial management','trends','ebook']
    },
    'Soft Skills Explained': {
      price: 29, pages: 76,
      desc: 'Build soft skills like active listening and emotional intelligence with practical techniques and methods.',
      features: [
        'Active Listening and Emotional Intelligence',
        'Techniques for Personal and Professional Growth',
        'Pomodoro, Eat the Frog, 2-Minute Rule and more'
      ],
      keywords: ['soft skills','emotional intelligence','productivity','ebook']
    },
    'Risk Management Explained': {
      price: 29, pages: 85,
      desc: 'Assess and mitigate risks using 9 methods including SWOT, Monte Carlo, and EMV.',
      features: [
        '9 Risk Analysis Methods',
        'SWOT, Monte Carlo, EMV and more',
        'Easy 1-click PDF Download'
      ],
      keywords: ['risk','monte carlo','emv','swot','ebook']
    },
    'Change Management Strategies Explained': {
      price: 29, pages: 97,
      desc: '10 strategies with a practical blueprint covering internal and external factors for successful change.',
      features: [
        '10 Change Management Strategies',
        'Change Management Blueprint, Internal & External factors',
        'Hours of Research Simplified'
      ],
      keywords: ['change management','blueprint','strategy','ebook']
    },
    '360-Degree Feedback Explained': {
      price: 19, pages: 45,
      desc: 'Complete 360-degree feedback guide covering design, ethics, and implementation in practice.',
      features: [
        'Complete 360-Degree Feedback Guide',
        'Design, ethics, and implementation',
        'HR principles in practice'
      ],
      keywords: ['360 feedback','hr','implementation','ebook']
    },
    'Talent Management & Onboarding Explained': {
      price: 29, pages: 38,
      desc: 'Plan, perform, and develop talent with effective onboarding from preboarding to assimilation.',
      features: [
        'Talent Management: Planning, Performance, Development',
        'Effective Onboarding: From Preboarding to Assimilation',
        'HR Principles in Practice'
      ],
      keywords: ['talent management','onboarding','hr','ebook']
    },
    'Performance Management Strategies Explained': {
      price: 29, pages: 68,
      desc: '17 strategies to improve performance, engagement, and productivity with real-world cases.',
      features: [
        '17 Performance Management Strategies',
        'Enhance Engagement and Productivity',
        'Real-world Case Studies Included'
      ],
      keywords: ['performance management','engagement','case studies','ebook']
    },
    'Brand Development Explained': {
      price: 29, pages: 58,
      desc: 'Master the five elements of a strong brand and design a complete strategy you can measure.',
      features: [
        'Master the 5 elements of a strong brand',
        'Design a comprehensive brand strategy',
        'Monitor your brands performance'
      ],
      keywords: ['brand','strategy','measurement','ebook']
    },
    'Ecommerce Explained': {
      price: 29, pages: 70,
      desc: 'Understand e-commerce models, distribution, and success factors with practical growth tactics.',
      features: [
        'E-commerce Business Models, Distribution, Success Factors',
        'Cross-selling, Upselling, and SMART Goals',
        'Hours of Research Simplified'
      ],
      keywords: ['ecommerce','business models','upselling','smart goals','ebook']
    },
    'Financial Crisis Explained': {
      price: 29, pages: 94,
      desc: 'All key factors of financial crises explained with timely guidance for todays environment.',
      features: [
        'All Factors of Financial Crises',
        'Must-have Guide for the Current Times',
        'Hours of Research Simplified'
      ],
      keywords: ['financial crisis','economics','guide','ebook']
    },
    'Housing Crisis Explained': {
      price: 29, pages: 70,
      desc: 'Overview of the housing crisis with causes, impacts, and actionable solutions.',
      features: [
        'Overview of the Housing Crisis',
        'Causes, Impacts, Solutions',
        'Key Contributing Factors'
      ],
      keywords: ['housing','policy','real estate','ebook']
    },
    'Customer Relationship Explained': {
      price: 29, pages: 79,
      desc: '21 customer relationship strategies distilled for business enthusiasts to apply immediately.',
      features: [
        '21 Customer Relationship Strategies',
        'Must-have Guide for Business Enthusiasts',
        'Hours of Research Simplified'
      ],
      keywords: ['customer relationship','crm','strategy','ebook']
    },
    'Scrum Manual': {
      price: 19, pages: 40,
      desc: 'Master Scrum fundamentals for agile projects from sprint planning to daily scrums.',
      features: [
        'Master the Art of Scrum and Agile Projects',
        'Sprint Planning, Daily Scrums and more',
        'Hours of Research Simplified'
      ],
      keywords: ['scrum','agile','sprint planning','ebook']
    },
    'Kanban Manual': {
      price: 19, pages: 42,
      desc: 'Learn the Kanban workflow, cards, and rules with practical real-world examples.',
      features: [
        'Master the Art of Kanban',
        'Kanban Workflow, Kanban Cards, & Kanban Rules',
        'Filled With Real-world Examples'
      ],
      keywords: ['kanban','workflow','examples','ebook']
    },
    'Agile Manual': {
      price: 19, pages: 44,
      desc: 'Discover cutting-edge agile strategies for teams, roadmaps, planning, and scaling.',
      features: [
        'Discover Cutting Edge Strategies in Agile',
        'Agile Teams, Advanced Roadmaps, Planning, Scaling and more',
        'Hours of Research Simplified'
      ],
      keywords: ['agile','roadmaps','planning','scaling','ebook']
    },
    'Artificial Intelligence in Business Explained': {
      price: 29, pages: 75,
      desc: 'A comprehensive AI introduction covering ML, DL, NLP, computer vision, and real applications.',
      features: [
        'Comprehensive AI Introduction',
        'Machine and Deep Learning, NLP, Computer Vision',
        'AIs Potential Everyday Applications'
      ],
      keywords: ['ai','machine learning','deep learning','nlp','computer vision','ebook']
    },
    'Cyber Security Explained': {
      price: 29, pages: 69,
      desc: 'In-depth basics of cybersecurity including encryption, best practices, and insurance.',
      features: [
        'In-depth Cybersecurity Basics',
        'Encryption, Best Practices, Insurance',
        'Protect Against Online Threats'
      ],
      keywords: ['cybersecurity','encryption','best practices','ebook']
    },
    'Machine Learning Explained': {
      price: 29, pages: 83,
      desc: 'ML fundamentals: key concepts, algorithms, data processing, and industry applications.',
      features: [
        'ML Fundamentals in-depth',
        'Key Concepts, Algorithms, Data Processing',
        'Applications Across Industries'
      ],
      keywords: ['machine learning','algorithms','data processing','ebook']
    },
    'Virtual Reality Explained': {
      price: 19, pages: 62,
      desc: 'VR and AR fundamentals with applications in gaming, education, and more.',
      features: [
        'VR and AR Basics in-depth',
        'Applications in Gaming, Education and more',
        'Hours of Research Simplified'
      ],
      keywords: ['virtual reality','augmented reality','applications','ebook']
    }
  };

  var metaDefaults = { sub: 'Digital download  Instant access' };

  function setMeta(name, content){
    if (!content) return;
    var m = document.querySelector('meta[name="'+name+'"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', name); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function setMetaProp(prop, content){
    if (!content) return;
    var m = document.querySelector('meta[property="'+prop+'"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('property', prop); document.head.appendChild(m); }
    m.setAttribute('content', content);
  }
  function setOrCreate(selector, attrs){
    var el = document.querySelector(selector);
    if (!el) { el = document.createElement('link'); document.head.appendChild(el); }
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs,k)) el.setAttribute(k, attrs[k]);
    return el;
  }

  function updateOgImage(src){
    if (!src) return;
    setMetaProp('og:image', src);
    setMeta('twitter:image', src);
  }

  function initProduct(resolved){
    var code = resolved.code;
    var name = resolved.name || 'Product';
    var price = resolved.price;
    var isBundle = (name === 'Everything Explained Bundle' || code === 'pack');

    var titleEl = document.getElementById('pd-title');
    var priceEl = document.getElementById('pd-price');
    var imgEl = document.getElementById('pd-image');
    var buyEl = document.getElementById('pd-buy');
    var subEl = document.getElementById('pd-sub');
    var descEl = document.getElementById('pd-desc');
    var pagesEl = document.getElementById('pd-pages');

    if (titleEl) titleEl.textContent = name;

    var fallbackSrc = imgMap[code] || imgEl.src;
    setSrcWithFallback(imgEl, candidateImages(name, code), fallbackSrc);
    imgEl.alt = name;

    var prod = catalog[name] || null;
    var computedPrice = prod && typeof prod.price === 'number' ? prod.price : price;
    var finalPrice = computedPrice || price || 29;

    if (priceEl) priceEl.textContent = finalPrice + '';
    if (buyEl) {
      buyEl.setAttribute('data-id', code);
      buyEl.setAttribute('data-name', name);
      buyEl.setAttribute('data-price', String(finalPrice));
      buyEl.textContent = 'Add to cart for ' + finalPrice + '';
    }

    if (name === 'Soft Skills Explained') {
      try {
        buyEl.classList.remove('add-to-cart');
        buyEl.classList.add('gumroad-button');
        buyEl.setAttribute('href', 'https://businessexplique.gumroad.com/l/SoftSkillsExplained');
        buyEl.removeAttribute('data-id');
        buyEl.removeAttribute('data-name');
        buyEl.removeAttribute('data-price');
        buyEl.textContent = 'Buy Now  ' + finalPrice + '';
      } catch(_) {}
    }

    if (!isBundle) {
      if (pagesEl) {
        var pagesWrap = pagesEl.parentElement && pagesEl.parentElement.parentElement;
        if (pagesWrap) pagesWrap.style.display = '';
        pagesEl.textContent = (prod && prod.pages) ? prod.pages : 70;
      }
      if (prod && Array.isArray(prod.features)) {
        var featList = document.querySelector('.pd-feature-list');
        if (featList) featList.innerHTML = prod.features.map(function(t){ return '<li>'+t+'</li>'; }).join('');
      }
      if (descEl && prod && prod.desc) {
        descEl.textContent = prod.desc;
      }
      if (subEl) subEl.textContent = (prod && prod.sub) || metaDefaults.sub;
      if (priceEl) priceEl.textContent = finalPrice + '';
      if (buyEl && !buyEl.classList.contains('gumroad-button')) {
        buyEl.setAttribute('data-price', String(finalPrice));
        buyEl.textContent = 'Add to cart for ' + finalPrice + '';
      }
    }

    var url = location.href;
    var title = name + '  Business Explique';
    var desc = (prod && prod.desc) ? (prod.desc + ' Instant access.') : ((prod && prod.features ? prod.features.join('. ') : 'Premium digital product eBook by Business Explique.') + ' Instant access.');
    document.title = title;
    setMeta('description', desc);
    setMeta('keywords', [name].concat(prod && prod.keywords ? prod.keywords : ['digital product','ebook','business explained','business','explained','pdf ebook']).join(', '));
    setMetaProp('og:title', name);
    setMetaProp('og:description', desc);
    setMetaProp('og:type', 'product');
    setMetaProp('og:url', url);
    setMeta('twitter:title', name);
    setMeta('twitter:description', desc);
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: url });

    updateOgImage(imgEl.src);
    imgEl.addEventListener('load', function(){ updateOgImage(imgEl.currentSrc || imgEl.src); }, { once: true });
    imgEl.addEventListener('error', function(){ updateOgImage(imgEl.src); }, { once: true });

    if (isBundle) {
      if (subEl) subEl.textContent = 'Digital bundle  Instant access  One-time payment';
      if (descEl) descEl.innerHTML = '<p>The Everything Explained Bundle is a comprehensive collection of business eBooks covering marketing, leadership, finance, technology and more. See the list of all items included below.</p>';
      try {
        if (pagesEl && pagesEl.parentElement) {
          pagesEl.parentElement.innerHTML = '<strong id="pd-pages">32</strong> Books';
        }
      } catch(_) {}
      var bundleEl = document.getElementById('bundle-section');
      var listEl = document.getElementById('bundle-items');
      var bundleBuy = document.getElementById('bundle-buy');
      var bundleBuyBottom = document.getElementById('bundle-buy-bottom');
      function localThumbs(title){ return candidateImages(title); }
      var items = [
        'Organizational Management Explained',
        'Entrepreneurship Explained',
        'Marketing Frameworks Explained',
        'Market Research Explained',
        'Strategic Management Explained',
        'Process Improvement Strategies Explained',
        'Project Management Explained',
        'Human Resources Explained',
        'Leadership Strategies Explained',
        'Negotiation Strategies Explained',
        'Productivity Strategies Explained',
        'Financial Management Explained',
        'Risk Management Explained',
        'Soft Skills Explained',
        'Change Management Strategies Explained',
        'Employee Engagement Strategies Explained',
        '360-Degree Feedback Explained',
        'Talent Management & Onboarding Explained',
        'Performance Management Strategies Explained',
        'Brand Development Explained',
        'Ecommerce Explained',
        'Financial Crisis Explained',
        'Housing Crisis Explained',
        'Customer Relationship Explained',
        'Scrum Manual',
        'Kanban Manual',
        'Agile Manual',
        'Artificial Intelligence in Business Explained',
        'Cyber Security Explained',
        'Machine Learning Explained',
        'Virtual Reality Explained'
      ];
      if (bundleEl && listEl) {
        bundleEl.style.display = 'block';
        listEl.innerHTML = items.map(function(t){
          return '\n          <div class="bundle-item" role="listitem">\n            <img class="thumb" alt="" data-title="'+t.replace(/&/g,'&amp;')+'" />\n            <div class="title">'+t+'</div>\n            <div class="price">29</div>\n          </div>\n        ';
        }).join('');
        listEl.querySelectorAll('img.thumb').forEach(function(im){
          var t = im.getAttribute('data-title') || '';
          setSrcWithFallback(im, localThumbs(t), 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=160&q=70&auto=format&fit=crop');
        });
        var noteEl = document.getElementById('bundle-note');
        if (noteEl) noteEl.style.display = 'block';
        var fillBtn = function(btn){ if (!btn) return; btn.setAttribute('data-id', code); btn.setAttribute('data-name', name); btn.setAttribute('data-price', String(finalPrice)); btn.textContent = 'Add to cart  '+finalPrice+''; };
        fillBtn(bundleBuy);
        fillBtn(bundleBuyBottom);
      }
    }

    var ld = {
      '@context':'https://schema.org',
      '@type':'Product',
      'name': name,
      'image': [ document.getElementById('pd-image').src ],
      'description': desc,
      'brand': { '@type':'Organization', 'name':'Business Explique' },
      'url': url,
      'offers': {
        '@type':'Offer',
        'priceCurrency':'EUR',
        'price': String(finalPrice),
        'availability':'https://schema.org/InStock',
        'url': url
      }
    };
    var scriptLd = document.createElement('script');
    scriptLd.type = 'application/ld+json';
    scriptLd.textContent = JSON.stringify(ld);
    document.head.appendChild(scriptLd);
  }

  function resolveFromProducts(list){
    var params = new URLSearchParams(location.search);
    var raw = params.get('id') || '';
    var byId = Object.create(null);
    var byCode = Object.create(null);
    (list || []).forEach(function(p){
      if (!p) return;
      if (typeof p.id !== 'undefined') byId[String(p.id)] = p;
      if (p.code) byCode[String(p.code)] = p;
    });

    var resolved = null;
    if (raw) {
      if (byId[raw]) resolved = byId[raw];
      else if (byCode[raw]) resolved = byCode[raw];
    }

    if (!resolved && params.get('name')) {
      resolved = {
        id: 0,
        code: raw || 'custom',
        name: params.get('name'),
        price: Number(params.get('price') || 0) || 29
      };
    }

    if (!resolved) {
      resolved = byCode['pack'] || list[0] || { id: 0, code: 'product', name: 'Product', price: 29 };
    }

    return {
      id: resolved.id,
      code: resolved.code || raw || 'product',
      name: resolved.name,
      price: resolved.price
    };
  }

  function bootstrap(){
    fetch('products.json', { cache: 'no-cache' })
      .then(function(r){ return r.json(); })
      .then(function(list){
        var resolved = resolveFromProducts(list);
        initProduct(resolved);
      })
      .catch(function(){
        var fallback = resolveFromProducts([]);
        initProduct(fallback);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
