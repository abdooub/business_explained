document.addEventListener('DOMContentLoaded', function() {
  // Search configuration for different pages
  const searchConfig = {
    'index.html': {
      selector: '.card-ebook, .card[href^="product.html"], a[href^="product.html"], .card[data-name]',
      titleSelector: 'h3, [data-name]',
      linkSelector: 'a',
      descriptionSelector: 'p',
      baseUrl: 'product.html',
      getLink: (item) => {
        // If the item itself is a link, return its href
        if (item.tagName === 'A') return item.href;
        // If it has a data-href attribute
        if (item.hasAttribute('data-href')) return item.getAttribute('data-href');
        // If it has a data-id and data-name for product page
        if (item.hasAttribute('data-id') && item.hasAttribute('data-name')) {
          const id = item.getAttribute('data-id');
          const name = encodeURIComponent(item.getAttribute('data-name'));
          return `product.html?id=${id}&name=${name}`;
        }
        // Otherwise, try to find a link inside the item
        const link = item.querySelector('a');
        return link ? link.href : '#';
      },
      getSearchableText: (item) => {
        // Try to get text from data-name or h3/h4, then from the whole item
        const name = item.getAttribute('data-name') || '';
        const titleElement = item.querySelector('h3, h4');
        const title = name || (titleElement ? titleElement.textContent : '');
        const description = item.textContent || '';
        return `${title} ${title} ${description}`.toLowerCase(); // Double weight to title
      },
      getImage: (item) => {
        // Try to find an image in the item
        const img = item.querySelector('img');
        return img ? img.src : '';
      }
    },
    'products.html': {
      selector: '.product-card',
      titleSelector: 'h3',
      linkSelector: 'a',
      descriptionSelector: '.product-body',
      baseUrl: '',
      getLink: (item) => {
        // Créer un lien basé sur l'ID du produit
        const productId = item.getAttribute('data-id');
        const productName = item.getAttribute('data-name');
        if (productId && productName) {
          return `product.html?id=${productId}&name=${encodeURIComponent(productName)}`;
        }
        return '#';
      },
      // Ajouter un poids plus élevé pour les correspondances dans le titre
      getSearchableText: (item) => {
        const title = item.querySelector('h3')?.textContent || '';
        const description = item.querySelector('.product-body')?.textContent || '';
        return `${title} ${title} ${description}`; // Le titre est répété pour plus de poids
      }
    },
    'blog.html': {
      selector: '.blog-post',
      titleSelector: 'h3',
      linkSelector: 'a',
      descriptionSelector: '.post-excerpt',
      baseUrl: '',
      getLink: (item) => {
        const link = item.querySelector('a');
        return link ? link.href : '#';
      }
    },
    'default': {
      selector: 'a[href^="product.html"], .product-card',
      titleSelector: 'h3',
      linkSelector: 'a',
      descriptionSelector: 'p, .product-body',
      baseUrl: '',
      getLink: (item) => {
        // Essayer de trouver un lien existant
        const existingLink = item.querySelector('a');
        if (existingLink) return existingLink.href;
        
        // Sinon, essayer de créer un lien basé sur les données
        const productId = item.getAttribute('data-id');
        const productName = item.getAttribute('data-name');
        if (productId && productName) {
          return `product.html?id=${productId}&name=${encodeURIComponent(productName)}`;
        }
        
        return '#';
      }
    }
  };

  // Fonction pour obtenir la configuration de recherche en fonction de la page actuelle
  function getSearchConfig() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    return searchConfig[currentPage] || searchConfig['default'];
  }

  // Fonction de recherche améliorée
  function performSearch(query) {
    const config = getSearchConfig();
    const searchResults = [];
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    if (searchTerms.length === 0) return [];
    
    // Récupérer tous les éléments correspondants
    const items = document.querySelectorAll(config.selector);
    
    // Si aucun élément n'est trouvé avec le sélecteur principal, essayer avec le sélecteur par défaut
    const elementsToSearch = items.length > 0 ? items : document.querySelectorAll('a[href^="product.html"], .product-card, .card-ebook, .blog-post');
    
    // Rechercher dans les éléments de la page
    elementsToSearch.forEach(item => {
      try {
        // Utiliser la fonction getSearchableText personnalisée si elle existe, sinon utiliser la méthode par défaut
        const searchableText = config.getSearchableText 
          ? config.getSearchableText(item).toLowerCase()
          : (item.textContent || '').toLowerCase();
        
        // Vérifier si tous les termes de recherche sont présents
        const allTermsMatch = searchTerms.every(term => 
          searchableText.includes(term)
        );
        
        if (allTermsMatch) {
          // Calculer le score de correspondance
          let score = 0;
          const titleElement = item.querySelector(config.titleSelector);
          const title = titleElement ? titleElement.textContent.toLowerCase() : '';
          
          searchTerms.forEach(term => {
            // Score plus élevé pour les correspondances dans le titre
            if (title.includes(term)) score += 5;
            // Score pour les correspondances dans le texte complet
            if (searchableText.includes(term)) score += 1;
          });
          
          // Obtenir le lien en utilisant la fonction personnalisée si elle existe
          const link = config.getLink ? config.getLink(item) : 
            (item.href || (item.querySelector('a')?.href) || '#');
          
          // Obtenir le titre et la description
          const resultTitle = titleElement ? titleElement.textContent : item.getAttribute('data-name') || 'Sans titre';
          let description = '';
          
          // Essayer de trouver une description
          if (config.descriptionSelector) {
            const descElement = typeof config.descriptionSelector === 'function' 
              ? config.descriptionSelector(item)
              : item.querySelector(config.descriptionSelector);
            
            if (descElement) {
              description = descElement.textContent || '';
            }
          }
          
          // Si pas de description, utiliser le texte de l'élément (limité)
          if (!description && !titleElement) {
            description = item.textContent.substring(0, 200);
          }
          
          searchResults.push({
            title: resultTitle,
            description: description,
            link: link,
            score: score,
            element: item
          });
        }
      } catch (e) {
        console.error('Erreur lors de la recherche dans un élément:', e);
      }
    });
    
    // Trier par score (du plus élevé au plus bas)
    searchResults.sort((a, b) => b.score - a.score);
    
    // Limiter le nombre de résultats pour les performances
    return searchResults.slice(0, 20);
  }

  // Fonction pour afficher les résultats
  function displayResults(results, searchInput) {
    // Supprimer les résultats précédents s'ils existent
    const existingResults = document.querySelector('.search-results-dropdown');
    if (existingResults) {
      existingResults.remove();
    }
    
    if (results.length === 0) return;
    
    const searchContainer = searchInput.closest('.header-search');
    
    // Créer le conteneur des résultats
    const container = document.createElement('div');
    container.className = 'search-results-dropdown';
    container.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      margin-top: 8px;
      width: 100%;
      min-width: 300px;
    `;
    
    // Add header with results count
    const header = document.createElement('div');
    header.style.padding = '12px 16px';
    header.style.borderBottom = '1px solid #f3f4f6';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.fontSize = '0.875rem';
    header.style.color = '#6b7280';
    
    // Add view all results button
    const viewAllBtn = document.createElement('button');
    viewAllBtn.textContent = 'View all results';
    viewAllBtn.style.background = 'none';
    viewAllBtn.style.border = 'none';
    viewAllBtn.style.color = '#3b82f6';
    viewAllBtn.style.cursor = 'pointer';
    viewAllBtn.style.fontSize = '0.75rem';
    viewAllBtn.style.fontWeight = '500';
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `search.html?q=${encodeURIComponent(searchInput.value)}`;
    });
    
    const resultsCount = document.createElement('span');
    resultsCount.textContent = `${results.length} ${results.length === 1 ? 'result' : 'results'}`;
    
    header.appendChild(resultsCount);
    header.appendChild(viewAllBtn);
    container.appendChild(header);
    
    // Create results list container
    const resultsList = document.createElement('div');
    resultsList.style.padding = '4px 0';
    
      <div style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">
        ${results.length} ${results.length > 1 ? 'results' : 'result'}
      </div>
      <button style="background: none; border: none; color: #3b82f6; font-size: 0.75rem; cursor: pointer; font-weight: 500;">
        View all results
      </button>
    `;
    container.appendChild(header);
    
    results.forEach((result, index) => {
      const resultItem = document.createElement('a');
      resultItem.href = result.link;
      resultItem.style.display = 'flex';
      resultItem.style.alignItems = 'center';
      resultItem.style.padding = '8px 12px';
      resultItem.style.textDecoration = 'none';
      resultItem.style.color = '#1f2937';
      resultItem.style.transition = 'background-color 0.2s';
      resultItem.style.borderRadius = '8px';
      resultItem.style.margin = '0 8px';
      
      // Add image
      const imageContainer = document.createElement('div');
      imageContainer.style.width = '40px';
      imageContainer.style.height = '40px';
      imageContainer.style.borderRadius = '6px';
      imageContainer.style.overflow = 'hidden';
      imageContainer.style.flexShrink = '0';
      imageContainer.style.marginRight = '12px';
      imageContainer.style.backgroundColor = '#f3f4f6';
      imageContainer.style.display = 'flex';
      imageContainer.style.alignItems = 'center';
      imageContainer.style.justifyContent = 'center';
      
      // Try to get image from the result element or use a placeholder
      let imageUrl = '';
      if (result.element) {
        const imgElement = result.element.querySelector('img');
        if (imgElement) {
          imageUrl = imgElement.src || '';
        }
      }
      
      if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        imageContainer.appendChild(img);
      } else {
        // Fallback icon
        imageContainer.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        `;
      }
      
      // Contenu du résultat
      const content = document.createElement('div');
      content.style.flex = '1';
      
      // Title
      const title = document.createElement('div');
      title.style.fontWeight = '500';
      title.style.fontSize = '0.9375rem';
      title.style.color = '#111827';
      title.style.lineHeight = '1.4';
      title.textContent = result.title || 'Untitled';
      
      // Add the image and title to the result item
      resultItem.appendChild(imageContainer);
      resultItem.appendChild(content);
      content.appendChild(title);
      
      // Add hover effect
      resultItem.addEventListener('mouseover', () => {
        resultItem.style.backgroundColor = '#f9fafb';
      });
      
      resultItem.addEventListener('mouseout', () => {
        resultItem.style.backgroundColor = 'transparent';
      });
      
      // Add to results list
      resultsList.appendChild(resultItem);
      
      // Add divider between items (except after the last one)
      if (index < results.length - 1) {
        const divider = document.createElement('div');
        divider.style.height = '1px';
        divider.style.backgroundColor = '#f3f4f6';
        divider.style.margin = '0 12px';
        resultsList.appendChild(divider);
      }
    });
    
    container.appendChild(resultsList);
    searchInput.parentNode.appendChild(container);
    
    // Fermer les résultats en cliquant en dehors
    document.addEventListener('click', function closeResults(e) {
      if (!searchInput.contains(e.target) && !container.contains(e.target)) {
        container.remove();
        document.removeEventListener('click', closeResults);
      }
    });
  }

  // Initialisation de la barre de recherche
  function initSearch() {
    const searchInput = document.querySelector('.header-search input[type="search"]');
    
    if (!searchInput) return;
    
    // Style de la barre de recherche
    const searchContainer = searchInput.closest('.header-search');
    searchContainer.style.position = 'relative';
    searchContainer.style.width = '100%';
    searchContainer.style.maxWidth = '400px';
    
    // Style du champ de recherche
    searchInput.style.width = '100%';
    searchInput.style.padding = '0.5rem 1rem 0.5rem 2.5rem';
    searchInput.style.border = '1px solid #e2e8f0';
    searchInput.style.borderRadius = '9999px';
    searchInput.style.fontSize = '0.95rem';
    searchInput.style.transition = 'all 0.2s ease';
    searchInput.style.backgroundColor = '#f8fafc';
    searchInput.style.outline = 'none';
    searchInput.style.boxSizing = 'border-box';
    
    // Style au focus
    searchInput.addEventListener('focus', (e) => {
      searchInput.style.borderColor = '#93c5fd';
      searchInput.style.boxShadow = '0 0 0 3px rgba(147, 197, 253, 0.5)';
      searchInput.style.backgroundColor = '#fff';
      
      // If there's a search query, show results on focus
      if (searchInput.value.trim().length > 1) {
        const results = performSearch(searchInput.value.trim());
        displayResults(results, searchInput);
      }
    });
    
    searchInput.addEventListener('blur', () => {
      searchInput.style.borderColor = '#e2e8f0';
      searchInput.style.boxShadow = 'none';
      searchInput.style.backgroundColor = '#f8fafc';
    });
    
    // Ajouter l'icône de recherche à gauche
    if (!searchContainer.querySelector('.search-icon')) {
      const searchIcon = document.createElement('div');
      searchIcon.className = 'search-icon';
      searchIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #64748b;
          pointer-events: none;
        ">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      `;
      searchContainer.insertBefore(searchIcon.firstChild, searchInput);
    }
    
    // Gestion de la recherche
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      
      if (query.length < 2) {
        const existingResults = document.querySelector('.search-results-container');
        if (existingResults) existingResults.remove();
        return;
      }
      
      searchTimeout = setTimeout(() => {
        const results = performSearch(query);
        displayResults(results, searchInput);
      }, 300);
    });
    
    // Gestion des touches du clavier
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      } else if (e.key === 'Escape') {
        const existingResults = document.querySelector('.search-results-container');
        if (existingResults) existingResults.remove();
      }
    });
  }

  // Initialiser la recherche
  initSearch();
});
