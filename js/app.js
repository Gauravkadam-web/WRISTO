/**
 * WRISTO — Single-Page Application Engine
 * Handles State, Navigation, AI Finder, 3D Tilt, Filters, Cart, Checkout, and Profile.
 */

// ==========================================================================
// Application State
// ==========================================================================
const AppState = {
  currentView: 'home',
  selectedProductId: 'WRT-001',
  selectedCollectionId: 'quiet-luxury',
  selectedBrandName: 'AUREN',
  cart: JSON.parse(localStorage.getItem('wristo_cart') || '[]'),
  wishlist: JSON.parse(localStorage.getItem('wristo_wishlist') || '["WRT-001", "WRT-005", "WRT-031"]'),
  comparison: JSON.parse(localStorage.getItem('wristo_comparison') || '["WRT-001", "WRT-005"]'),
  filters: {
    brands: [],
    movements: [],
    styles: [],
    maxPrice: 25000,
    gender: 'All',
    sortBy: 'popularity'
  },
  aiQuery: "I want a minimal automatic watch for office and weekend use under ₹20,000",
  lastOrder: null
};

// Save helpers
function saveCart() {
  localStorage.setItem('wristo_cart', JSON.stringify(AppState.cart));
  updateHeaderBadges();
}

function saveWishlist() {
  localStorage.setItem('wristo_wishlist', JSON.stringify(AppState.wishlist));
  updateHeaderBadges();
}

function saveComparison() {
  localStorage.setItem('wristo_comparison', JSON.stringify(AppState.comparison));
  updateComparisonBadge();
}

// ==========================================================================
// Router & View Switching
// ==========================================================================
function navigateTo(view, param = null) {
  AppState.currentView = view;
  document.body.setAttribute('data-current-view', view);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update nav active states
  document.querySelectorAll('.nav-link, .mob-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });

  const mainContent = document.getElementById('main-content-view');
  if (!mainContent) return;

  switch (view) {
    case 'home':
      renderHome(mainContent);
      break;
    case 'discovery':
      renderDiscovery(mainContent);
      break;
    case 'ai-finder':
      renderAIFinder(mainContent);
      break;
    case 'pdp':
      if (param) AppState.selectedProductId = param;
      renderPDP(mainContent, AppState.selectedProductId);
      break;
    case 'collections':
      if (param) AppState.selectedCollectionId = param;
      renderCollections(mainContent, AppState.selectedCollectionId);
      break;
    case 'brands':
      if (param) AppState.selectedBrandName = param;
      renderBrands(mainContent, AppState.selectedBrandName);
      break;
    case 'wishlist':
      renderWishlist(mainContent);
      break;
    case 'comparison':
      renderComparison(mainContent);
      break;
    case 'cart':
      renderCartView(mainContent);
      break;
    case 'checkout':
      renderCheckout(mainContent);
      break;
    case 'order-success':
      renderOrderSuccess(mainContent);
      break;
    case 'profile':
      renderProfile(mainContent);
      break;
    default:
      renderHome(mainContent);
  }

  init3DTilt();
}

// ==========================================================================
// View: HOME
// ==========================================================================
function renderHome(container) {
  const featuredWatches = PRODUCTS.slice(0, 8);
  const automaticWatches = PRODUCTS.filter(p => p.movement === 'Automatic').slice(0, 4);

  container.innerHTML = `
    <!-- Luxury Editorial Hero Section (Pixel-Matched to Reference) -->
    <section class="hero-section" id="hero-section">
      <div class="hero-backdrop-overlay"></div>
      <div class="container hero-container">
        <div class="hero-grid">
          <!-- Left Editorial Content Column -->
          <div class="hero-content">
            <div class="hero-eyebrow">PREMIUM WATCH STORE</div>
            <h1 class="hero-title">
              <span class="hero-title-line">Your Time.</span>
              <span class="hero-title-line">Your Style.</span>
            </h1>
            <p class="hero-subtitle">
              Discover a curated collection of premium watches<br class="hero-br-desktop"> from the world's most trusted brands.
            </p>
            <div class="hero-actions">
              <button class="btn btn-hero-primary" onclick="navigateTo('discovery')">
                Explore Collection <span class="btn-arrow">&rarr;</span>
              </button>
              <button class="btn btn-hero-secondary" onclick="openHeroVideoModal()">
                <span class="hero-play-icon">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="6 3 20 12 6 21 6 3"></polygon>
                  </svg>
                </span>
                Watch Video
              </button>
            </div>
            <!-- Subtle dots indicator below buttons matching reference -->
            <div class="hero-dots-indicator" aria-hidden="true">
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>

          <!-- Right Focal Watch Area with Subtle Editorial Indicator -->
          <div class="hero-visual">
            <div class="hero-editorial-pager" aria-hidden="true">
              <span class="pager-num active">01</span>
              <span class="pager-dash"></span>
              <span class="pager-num">03</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Integrated Luxury Trust Strip (No Cards, Minimal Separators) -->
      <div class="hero-trust-strip">
        <div class="container">
          <div class="hero-trust-inner">
            <div class="hero-trust-item">
              <div class="hero-trust-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <div class="hero-trust-text">
                <span class="trust-title">100% Authentic</span>
                <span class="trust-subtitle">Brand Warranty</span>
              </div>
            </div>

            <div class="hero-trust-divider"></div>

            <div class="hero-trust-item">
              <div class="hero-trust-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div class="hero-trust-text">
                <span class="trust-title">Free Shipping</span>
                <span class="trust-subtitle">Across India</span>
              </div>
            </div>

            <div class="hero-trust-divider"></div>

            <div class="hero-trust-item">
              <div class="hero-trust-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <polyline points="3 3 3 8 8 8"/>
                  <polyline points="12 7 12 12 15 15"/>
                </svg>
              </div>
              <div class="hero-trust-text">
                <span class="trust-title">Easy Returns</span>
                <span class="trust-subtitle">Within 7 Days</span>
              </div>
            </div>

            <div class="hero-trust-divider"></div>

            <div class="hero-trust-item">
              <div class="hero-trust-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                  <circle cx="7" cy="15" r="1" fill="currentColor"/>
                </svg>
              </div>
              <div class="hero-trust-text">
                <span class="trust-title">Secure Payments</span>
                <span class="trust-subtitle">100% Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI Watch Concierge Teaser Section -->
    <section class="section section-dark" style="padding-top: var(--space-16); padding-bottom: var(--space-16);">
      <div class="container">
        <div class="ai-concierge-card">
          <div class="ai-concierge-header">
            <div class="ai-branding-badge">
              <div class="ai-avatar-symbol">W</div>
              <div>
                <h3 style="font-family: var(--font-heading); font-size: 20px; font-weight: 600;">AI Watch Concierge</h3>
                <p style="font-size: 13px; color: #A0A0A0;">Tell our engine what you love, where you wear it, or your price limit.</p>
              </div>
            </div>
            <span class="pill-badge gold">INTELLIGENT RECOMMENDATIONS</span>
          </div>

          <div class="ai-prompt-box">
            <textarea id="home-ai-input" class="ai-input-field" rows="2" placeholder="e.g. I want a minimal automatic watch with a blue or green dial under ₹18,000 for office wear...">${AppState.aiQuery}</textarea>
            <div class="ai-prompt-footer">
              <div class="ai-suggestions-list">
                <span class="ai-suggestion-chip" onclick="quickFillPrompt('Minimal automatic under ₹20,000')">Minimal Automatic &lt; ₹20k</span>
                <span class="ai-suggestion-chip" onclick="quickFillPrompt('Rose gold dress watch for evening party')">Rose Gold Evening</span>
                <span class="ai-suggestion-chip" onclick="quickFillPrompt('Waterproof sport chronograph for weekends')">100m Sport Chrono</span>
                <span class="ai-suggestion-chip" onclick="quickFillPrompt('Smartwatch with AMOLED and long battery')">AMOLED Smart</span>
              </div>
              <button class="btn btn-champagne btn-sm" onclick="runAIConciergeFromHome()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Find Matches
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Watches (from the 40-Watch Catalog) -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-label">Curated Selection</div>
            <h2 class="section-title">Trending Timepieces</h2>
            <p class="section-subtitle">Hand-picked designs from our catalog exemplifying modern restraint and impeccable horology.</p>
          </div>
          <a href="javascript:void(0)" class="view-all-link" onclick="navigateTo('discovery')">
            View All 40 Watches &rarr;
          </a>
        </div>

        <div class="product-grid">
          ${featuredWatches.map(product => renderProductCardHTML(product)).join('')}
        </div>
      </div>
    </section>

    <!-- Editorial Campaign Banner: Modern Looks. Timeless Feel. (Original Position & Structure) -->
    <section class="section" style="padding-top: 0; padding-bottom: var(--space-16);">
      <div class="container">
        <div class="banner-editorial-card">
          <div class="banner-editorial-content">
            <div class="banner-eyebrow">NEW ARRIVALS</div>
            <h2 class="banner-title">
              <span class="banner-title-line">Modern Looks.</span>
              <span class="banner-title-line">Timeless Feel.</span>
            </h2>
            <p class="banner-desc">
              Discover the latest watches from top brands, designed for every mood.
            </p>
            <div class="banner-actions">
              <button class="btn btn-banner-primary" onclick="navigateTo('discovery')">
                Explore Now <span class="btn-arrow">&rarr;</span>
              </button>
            </div>
            <!-- Subtle Carousel Indicator at Bottom Left -->
            <div class="banner-carousel-indicator" aria-hidden="true">
              <span class="carousel-num active">01</span>
              <span class="carousel-divider"></span>
              <span class="carousel-num">02</span>
              <span class="carousel-divider"></span>
              <span class="carousel-num">03</span>
            </div>
          </div>
          <!-- Right Visual Column with Photographic Watch & Badge -->
          <div class="banner-editorial-visual">
            <div class="banner-editorial-visual-overlay"></div>
            <span class="banner-editorial-badge">
              STYLE IN EVERY DETAIL
            </span>
          </div>
        </div>
      </div>
    </section>


    <!-- Curated Editorial Collections -->
    <section class="section" style="background-color: var(--color-brand-paper);">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-label">Editorial Stories</div>
            <h2 class="section-title">Curated Collections</h2>
            <p class="section-subtitle">Themed watch narratives tailored around lifestyle, mechanical soul, and design philosophy.</p>
          </div>
          <a href="javascript:void(0)" class="view-all-link" onclick="navigateTo('collections')">
            Explore All Collections &rarr;
          </a>
        </div>

        <div class="collections-grid">
          ${COLLECTIONS.slice(0, 3).map(col => {
            const heroWatch = PRODUCTS.find(p => p.id === col.heroWatchId) || PRODUCTS[0];
            return `
              <div class="collection-card" onclick="navigateTo('collections', '${col.id}')">
                <div class="collection-card-bg" style="background-image: url('${heroWatch.image}');"></div>
                <div class="collection-overlay">
                  <div class="collection-tag">${col.bannerTag}</div>
                  <h3 class="collection-title">${col.title}</h3>
                  <p class="collection-desc">${col.description}</p>
                  <span class="btn btn-outline-white btn-sm" style="align-self: flex-start;">
                    Explore ${col.itemIds.length} Watches &rarr;
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>

    <!-- Mechanical Souls Showcase (Automatic Watches) -->
    <section class="section section-dark">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-label" style="color: var(--color-accent-champagne);">HOROLOGICAL PURITY</div>
            <h2 class="section-title">Mechanical & Skeleton Souls</h2>
            <p class="section-subtitle" style="color: #999999;">Real automatic calibers with 21,600+ vibrations per hour, sapphire exhibition windows, and zero battery required.</p>
          </div>
          <a href="javascript:void(0)" class="view-all-link" style="color: var(--color-accent-champagne);" onclick="navigateTo('discovery')">
            See All Automatics &rarr;
          </a>
        </div>

        <div class="product-grid">
          ${automaticWatches.map(product => renderProductCardHTML(product)).join('')}
        </div>
      </div>
    </section>

    <!-- Curated Brands Showcase -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div>
            <div class="section-label">Independent & Global Partners</div>
            <h2 class="section-title">Popular Watch Houses</h2>
            <p class="section-subtitle">Authentic, warranty-backed timepieces directly from certified manufacturers.</p>
          </div>
          <a href="javascript:void(0)" class="view-all-link" onclick="navigateTo('brands')">
            Browse All Brands &rarr;
          </a>
        </div>

        <div class="brands-grid">
          ${BRANDS.map(brand => {
            const featuredWatch = PRODUCTS.find(p => p.id === brand.featuredWatchId) || PRODUCTS[0];
            return `
              <div class="brand-card-item" onclick="navigateTo('brands', '${brand.name}')">
                <div class="brand-logo-title">${brand.name}</div>
                <div class="brand-origin">${brand.country}</div>
                <img src="${featuredWatch.image}" alt="${brand.name}" class="brand-watch-thumb">
                <div class="brand-price-range">${brand.priceRange}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

// Quick fill helper for AI prompt chips
window.quickFillPrompt = function(text) {
  const input = document.getElementById('home-ai-input') || document.getElementById('ai-full-input');
  if (input) {
    input.value = text;
    AppState.aiQuery = text;
  }
};

window.runAIConciergeFromHome = function() {
  const input = document.getElementById('home-ai-input');
  if (input) AppState.aiQuery = input.value;
  navigateTo('ai-finder');
};

// ==========================================================================
// View: WATCH DISCOVERY (40-Watch Catalog, Filters & Sorting)
// ==========================================================================
function renderDiscovery(container) {
  // Apply filters
  let filtered = [...PRODUCTS];

  if (AppState.filters.brands.length > 0) {
    filtered = filtered.filter(p => AppState.filters.brands.includes(p.brand));
  }
  if (AppState.filters.movements.length > 0) {
    filtered = filtered.filter(p => AppState.filters.movements.includes(p.movement));
  }
  if (AppState.filters.styles.length > 0) {
    filtered = filtered.filter(p => AppState.filters.styles.includes(p.style));
  }
  if (AppState.filters.gender && AppState.filters.gender !== 'All') {
    filtered = filtered.filter(p => p.gender === AppState.filters.gender || p.gender === 'Unisex');
  }
  filtered = filtered.filter(p => p.price <= AppState.filters.maxPrice);

  // Apply sorting
  if (AppState.filters.sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (AppState.filters.sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (AppState.filters.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (AppState.filters.sortBy === 'newest') {
    filtered.sort((a, b) => b.num - a.num);
  }

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div style="margin-bottom: var(--space-8);">
        <div class="section-label">Complete Catalog</div>
        <h1 class="section-title">Explore All Timepieces</h1>
        <p class="section-subtitle">Discover our full collection of 40 luxury, classic, automatic, and connected timepieces.</p>
      </div>

      <div class="discovery-layout">
        <!-- Left Filter Rail -->
        <aside class="filter-sidebar">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase;">Filters</h3>
            <button onclick="resetFilters()" style="font-size: 11px; color: var(--color-accent-gold); font-weight: 600;">Reset All</button>
          </div>

          <!-- Price Slider -->
          <div class="filter-group">
            <div class="filter-title">
              <span>Max Price</span>
              <span id="price-val-display" style="color: var(--color-accent-gold);">₹${AppState.filters.maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input type="range" min="3999" max="25000" step="500" value="${AppState.filters.maxPrice}" 
              style="width: 100%; accent-color: var(--color-brand-black); cursor: pointer;"
              oninput="updatePriceFilter(this.value)">
            <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">
              <span>₹3,999</span>
              <span>₹25,000+</span>
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="filter-group">
            <div class="filter-title">Brand</div>
            <div class="filter-options-list">
              ${['AUREN', 'VELA', 'ORBITA', 'VANTA', 'NORDEN', 'PULSE'].map(b => `
                <label class="filter-checkbox-label">
                  <span>${b}</span>
                  <input type="checkbox" value="${b}" ${AppState.filters.brands.includes(b) ? 'checked' : ''} onchange="toggleBrandFilter('${b}')">
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Movement Filter -->
          <div class="filter-group">
            <div class="filter-title">Movement</div>
            <div class="filter-options-list">
              ${['Quartz', 'Automatic', 'Smart Digital'].map(m => `
                <label class="filter-checkbox-label">
                  <span>${m}</span>
                  <input type="checkbox" value="${m}" ${AppState.filters.movements.includes(m) ? 'checked' : ''} onchange="toggleMovementFilter('${m}')">
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Style Filter -->
          <div class="filter-group">
            <div class="filter-title">Style</div>
            <div class="filter-options-list">
              ${['Minimal', 'Classic', 'Chronograph', 'Dress', 'Sport', 'Smart'].map(s => `
                <label class="filter-checkbox-label">
                  <span>${s}</span>
                  <input type="checkbox" value="${s}" ${AppState.filters.styles.includes(s) ? 'checked' : ''} onchange="toggleStyleFilter('${s}')">
                </label>
              `).join('')}
            </div>
          </div>

          <!-- Gender Filter -->
          <div class="filter-group">
            <div class="filter-title">Gender</div>
            <div class="filter-options-list">
              ${['All', 'Men', 'Women', 'Unisex'].map(g => `
                <label class="filter-checkbox-label">
                  <span>${g}</span>
                  <input type="radio" name="gender" value="${g}" ${AppState.filters.gender === g ? 'checked' : ''} onchange="setGenderFilter('${g}')">
                </label>
              `).join('')}
            </div>
          </div>
        </aside>

        <!-- Right Products Grid -->
        <main>
          <div class="discovery-top-bar">
            <div class="discovery-count-text">
              Showing <strong>${filtered.length}</strong> of 40 Timepieces
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 13px; color: var(--color-text-secondary);">Sort By:</span>
              <select class="discovery-sort-select" onchange="setSortBy(this.value)">
                <option value="popularity" ${AppState.filters.sortBy === 'popularity' ? 'selected' : ''}>Popularity</option>
                <option value="price-low" ${AppState.filters.sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
                <option value="price-high" ${AppState.filters.sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
                <option value="rating" ${AppState.filters.sortBy === 'rating' ? 'selected' : ''}>Customer Rating</option>
                <option value="newest" ${AppState.filters.sortBy === 'newest' ? 'selected' : ''}>New Arrivals</option>
              </select>
            </div>
          </div>

          ${filtered.length === 0 ? `
            <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--space-12); text-align: center;">
              <h3 style="font-size: 18px; margin-bottom: 8px;">No matching timepieces found</h3>
              <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 16px;">Try adjusting your price range or clearing some filters.</p>
              <button class="btn btn-primary" onclick="resetFilters()">Reset All Filters</button>
            </div>
          ` : `
            <div class="product-grid">
              ${filtered.map(product => renderProductCardHTML(product)).join('')}
            </div>
          `}
        </main>
      </div>
    </div>
  `;
}

// Filter Action Handlers
window.updatePriceFilter = function(val) {
  AppState.filters.maxPrice = parseInt(val, 10);
  const display = document.getElementById('price-val-display');
  if (display) display.textContent = `₹${AppState.filters.maxPrice.toLocaleString('en-IN')}`;
  navigateTo('discovery');
};

window.toggleBrandFilter = function(brand) {
  const idx = AppState.filters.brands.indexOf(brand);
  if (idx > -1) AppState.filters.brands.splice(idx, 1);
  else AppState.filters.brands.push(brand);
  navigateTo('discovery');
};

window.toggleMovementFilter = function(mov) {
  const idx = AppState.filters.movements.indexOf(mov);
  if (idx > -1) AppState.filters.movements.splice(idx, 1);
  else AppState.filters.movements.push(mov);
  navigateTo('discovery');
};

window.toggleStyleFilter = function(sty) {
  const idx = AppState.filters.styles.indexOf(sty);
  if (idx > -1) AppState.filters.styles.splice(idx, 1);
  else AppState.filters.styles.push(sty);
  navigateTo('discovery');
};

window.setGenderFilter = function(g) {
  AppState.filters.gender = g;
  navigateTo('discovery');
};

window.setSortBy = function(val) {
  AppState.filters.sortBy = val;
  navigateTo('discovery');
};

window.resetFilters = function() {
  AppState.filters = {
    brands: [],
    movements: [],
    styles: [],
    maxPrice: 25000,
    gender: 'All',
    sortBy: 'popularity'
  };
  navigateTo('discovery');
};

// ==========================================================================
// View: AI WATCH FINDER (Concierge Experience)
// ==========================================================================
function renderAIFinder(container) {
  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div class="section-header-center">
        <div class="pill-badge gold" style="margin-bottom: 12px;">AI-POWERED HOROLOGY ENGINE</div>
        <h1 class="section-title">WRISTO AI Watch Concierge</h1>
        <p class="section-subtitle">
          Describe your dream watch in your own words. Our proprietary style matching algorithm converts your natural language requirements into precision horological parameters.
        </p>
      </div>

      <div class="ai-concierge-card">
        <div class="ai-concierge-header">
          <div class="ai-branding-badge">
            <div class="ai-avatar-symbol">W</div>
            <div>
              <h3 style="font-family: var(--font-heading); font-size: 20px; font-weight: 600;">Style Concierge Engine v2.4</h3>
              <p style="font-size: 13px; color: #A0A0A0;">Grounded across all 40 catalog watches with real-time specification matching</p>
            </div>
          </div>
          <span class="pill-badge green" style="background: rgba(63, 138, 98, 0.2); color: #4ADE80; border: 1px solid rgba(63, 138, 98, 0.4);">
            MODEL ONLINE & READY
          </span>
        </div>

        <div class="ai-prompt-box">
          <label style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: var(--color-accent-champagne); display: block; margin-bottom: 8px;">
            ENTER YOUR NATURAL LANGUAGE PREFERENCES:
          </label>
          <textarea id="ai-full-input" class="ai-input-field" rows="3" placeholder="e.g. I need an automatic watch with a green or blue dial under ₹20,000 that looks sharp for client presentations and relaxed on Sunday mornings.">${AppState.aiQuery}</textarea>
          <div class="ai-prompt-footer">
            <div class="ai-suggestions-list">
              <span style="font-size: 11px; color: #888888;">Try asking:</span>
              <span class="ai-suggestion-chip" onclick="quickFillAndSearch('I want a minimal automatic watch under ₹20,000 for office')">Minimal Automatic &lt; ₹20k</span>
              <span class="ai-suggestion-chip" onclick="quickFillAndSearch('Stealth all-black watch with mesh strap for cocktail evenings')">Stealth All-Black Mesh</span>
              <span class="ai-suggestion-chip" onclick="quickFillAndSearch('Women rose gold watch with mother of pearl dial for wedding')">Rose Gold Pearl Wedding</span>
              <span class="ai-suggestion-chip" onclick="quickFillAndSearch('Durable 100m water resistant chronograph for adventure travel')">100m Adventure Chrono</span>
            </div>
            <button class="btn btn-champagne" onclick="processAIQuery()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Synthesize Matches
            </button>
          </div>
        </div>

        <!-- Processing State Indicator -->
        <div id="ai-processing-box" class="ai-processing-state">
          <div class="ai-scanner-line"></div>
          <p style="font-size: 14px; font-weight: 600; color: var(--color-accent-champagne); margin-bottom: 4px;">Analyzing Style Signals...</p>
          <p style="font-size: 12px; color: #888888;">Parsing movement tolerance, wrist proportions, and color temperature.</p>
        </div>

        <!-- AI Output Results Container -->
        <div id="ai-results-container">
          ${generateAIResultsHTML(AppState.aiQuery)}
        </div>
      </div>
    </div>
  `;
}

window.quickFillAndSearch = function(text) {
  AppState.aiQuery = text;
  const input = document.getElementById('ai-full-input');
  if (input) input.value = text;
  processAIQuery();
};

window.processAIQuery = function() {
  const input = document.getElementById('ai-full-input');
  if (input) AppState.aiQuery = input.value.trim();

  const processingBox = document.getElementById('ai-processing-box');
  const resultsContainer = document.getElementById('ai-results-container');

  if (processingBox) processingBox.classList.add('active');
  if (resultsContainer) resultsContainer.style.opacity = '0.3';

  setTimeout(() => {
    if (processingBox) processingBox.classList.remove('active');
    if (resultsContainer) {
      resultsContainer.style.opacity = '1';
      resultsContainer.innerHTML = generateAIResultsHTML(AppState.aiQuery);
      init3DTilt();
    }
  }, 650);
};

// Natural language parser to calculate relevant match score and explanation
function generateAIResultsHTML(query) {
  const q = query.toLowerCase();

  // Extract preference signals
  const signals = [];
  if (q.includes('auto') || q.includes('mechanical')) signals.push({ label: 'Movement', val: 'Automatic' });
  if (q.includes('quartz')) signals.push({ label: 'Movement', val: 'Quartz' });
  if (q.includes('smart')) signals.push({ label: 'Movement', val: 'Smart Digital' });
  if (q.includes('minimal')) signals.push({ label: 'Aesthetic', val: 'Minimalism' });
  if (q.includes('dress') || q.includes('formal') || q.includes('wedding')) signals.push({ label: 'Occasion', val: 'Formal / Dress' });
  if (q.includes('green')) signals.push({ label: 'Dial Tone', val: 'Emerald / Green' });
  if (q.includes('blue')) signals.push({ label: 'Dial Tone', val: 'Cobalt / Blue' });
  if (q.includes('black') || q.includes('stealth')) signals.push({ label: 'Finish', val: 'Obsidian Black' });
  if (q.includes('rose') || q.includes('gold')) signals.push({ label: 'Metal Tone', val: 'Rose Gold / Champagne' });
  if (q.includes('water') || q.includes('chrono') || q.includes('sport') || q.includes('adventure')) signals.push({ label: 'Capability', val: '100m Water Resistance' });

  if (signals.length === 0) {
    signals.push({ label: 'Versatility', val: 'Daily Rotation' });
    signals.push({ label: 'Tier', val: 'Quiet Luxury' });
  }

  // Score products based on query keywords
  const scored = PRODUCTS.map(p => {
    let score = 75; // baseline
    if (q.includes('auto') && p.movement === 'Automatic') score += 15;
    if (q.includes('quartz') && p.movement === 'Quartz') score += 15;
    if (q.includes('smart') && p.movement.includes('Smart')) score += 20;
    if (q.includes('minimal') && p.style === 'Minimal') score += 12;
    if (q.includes('chrono') && p.style === 'Chronograph') score += 18;
    if (q.includes('dress') && p.style === 'Dress') score += 14;
    if (q.includes('green') && (p.dial.toLowerCase().includes('green') || p.model.toLowerCase().includes('green'))) score += 15;
    if (q.includes('blue') && (p.dial.toLowerCase().includes('blue') || p.model.toLowerCase().includes('blue'))) score += 15;
    if (q.includes('black') && (p.dial.toLowerCase().includes('black') || p.model.toLowerCase().includes('black'))) score += 12;
    if (q.includes('gold') && (p.material.toLowerCase().includes('gold') || p.model.toLowerCase().includes('gold'))) score += 15;
    if (q.includes('20') || q.includes('20k') || q.includes('20,000')) {
      if (p.price <= 20000) score += 8;
    }
    if (q.includes('office') && p.occasion.includes('Office')) score += 6;
    if (q.includes('weekend') && p.occasion.includes('Weekend')) score += 6;

    // Cap at 99%
    score = Math.min(score, 99);
    return { ...p, calculatedScore: score };
  });

  scored.sort((a, b) => b.calculatedScore - a.calculatedScore);
  const topMatches = scored.slice(0, 3);

  return `
    <div style="margin-top: var(--space-8);">
      <div style="font-size: 11px; letter-spacing: 0.12em; font-weight: 700; color: #888888; text-transform: uppercase; margin-bottom: 12px;">
        SYNTHESIZED PREFERENCE SIGNALS
      </div>
      <div class="ai-signals-panel">
        ${signals.map(s => `
          <div class="ai-signal-pill">
            <span style="color: var(--color-accent-champagne); font-weight: 700;">${s.label}:</span>
            <span>${s.val}</span>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
        <h3 style="font-family: var(--font-heading); font-size: 22px; font-weight: 600;">
          Top Recommendations (${topMatches.length} Matches Found)
        </h3>
        <span style="font-size: 12px; color: var(--color-accent-champagne);">Sorted by Horological Compatibility</span>
      </div>

      <div class="ai-results-grid">
        ${topMatches.map(p => `
          <div class="ai-watch-recommendation">
            <div class="match-score-badge">${p.calculatedScore}% STYLE MATCH</div>
            <div class="ai-rec-media">
              <img src="${p.image}" alt="${p.brand} ${p.model}" class="ai-rec-img">
            </div>
            <div style="font-size: 11px; font-weight: 700; color: var(--color-accent-champagne); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px;">
              ${p.brand}
            </div>
            <h4 style="font-family: var(--font-heading); font-size: 17px; font-weight: 600; margin-bottom: 6px; color: #FFFFFF;">
              ${p.model}
            </h4>
            <div style="font-size: 18px; font-weight: 700; color: var(--color-accent-champagne); margin-bottom: 12px;">
              ₹${p.price.toLocaleString('en-IN')}
            </div>

            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
              <span class="pill-badge" style="background: rgba(255,255,255,0.1); color: #E0E0E0; font-size: 10px;">${p.movement}</span>
              <span class="pill-badge" style="background: rgba(255,255,255,0.1); color: #E0E0E0; font-size: 10px;">${p.caseSize}</span>
              <span class="pill-badge" style="background: rgba(255,255,255,0.1); color: #E0E0E0; font-size: 10px;">${p.waterResistance}</span>
            </div>

            <div class="why-this-watch-box">
              <strong>WHY THIS MATCHES YOUR QUERY</strong>
              ${p.aiReason}
            </div>

            <div style="display: flex; gap: 8px; margin-top: 18px;">
              <button class="btn btn-champagne btn-sm" style="flex: 1;" onclick="addToCart('${p.id}')">
                Add to Cart
              </button>
              <button class="btn btn-outline-white btn-sm" onclick="navigateTo('pdp', '${p.id}')">
                View Specs
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// View: PRODUCT DETAIL (PDP)
// ==========================================================================
function renderPDP(container, productId) {
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const isWishlisted = AppState.wishlist.includes(product.id);
  const isInComparison = AppState.comparison.includes(product.id);
  const similarWatches = PRODUCTS.filter(p => p.brand === product.brand || p.movement === product.movement)
                                 .filter(p => p.id !== product.id)
                                 .slice(0, 4);

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <!-- Breadcrumb -->
      <nav class="pdp-breadcrumb">
        <a href="javascript:void(0)" onclick="navigateTo('home')">Home</a>
        <span>/</span>
        <a href="javascript:void(0)" onclick="navigateTo('discovery')">Watches</a>
        <span>/</span>
        <a href="javascript:void(0)" onclick="navigateTo('brands', '${product.brand}')">${product.brand}</a>
        <span>/</span>
        <span style="color: var(--color-text-primary); font-weight: 500;">${product.model}</span>
      </nav>

      <div class="pdp-layout">
        <!-- Left: Image Gallery & 3D Interactive Stage -->
        <div class="pdp-gallery-wrap">
          <div class="pdp-thumbnail-col">
            <button class="pdp-thumb-btn active">
              <img src="${product.image}" alt="${product.model}">
            </button>
            <button class="pdp-thumb-btn">
              <img src="./assets/brand/app-icon.png" alt="WRISTO Authentic Seal">
            </button>
          </div>

          <div class="pdp-main-image-stage tilt-element" data-tilt="true">
            <span class="pill-badge gold" style="position: absolute; top: 16px; left: 16px;">
              ${product.badge || 'VERIFIED AUTHENTIC'}
            </span>
            <img src="${product.image}" alt="${product.brand} ${product.model}" class="pdp-main-img" id="pdp-main-view-img">
          </div>
        </div>

        <!-- Right: Details, Specifications & Purchase CTAs -->
        <div class="pdp-content-col">
          <div class="pdp-brand-title">${product.brand}</div>
          <h1 class="pdp-model-title">${product.brand} ${product.model}</h1>

          <div class="card-rating-row" style="margin-bottom: 14px;">
            <span class="star-icon">★</span>
            <span style="font-weight: 700; color: var(--color-text-primary);">${product.rating}</span>
            <span>(${product.reviewsCount} verified owner reviews)</span>
            <span style="margin: 0 6px;">•</span>
            <span class="pill-badge" style="background: rgba(63, 138, 98, 0.1); color: var(--color-success);">IN STOCK</span>
          </div>

          <div class="pdp-price-row">
            <span class="pdp-price-current">₹${product.price.toLocaleString('en-IN')}</span>
            <span class="pdp-price-original">₹${product.originalPrice.toLocaleString('en-IN')}</span>
            <span class="card-discount-badge" style="font-size: 13px;">
              SAVE ₹${(product.originalPrice - product.price).toLocaleString('en-IN')} (${Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)
            </span>
          </div>

          <p class="pdp-desc-text">
            ${product.description}
          </p>

          <!-- Specifications Matrix -->
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-secondary); margin-bottom: 10px;">
            TECHNICAL HOROLOGY SPECIFICATIONS
          </div>
          <div class="pdp-specs-grid">
            <div class="spec-cell">
              <div class="spec-label">Caliber Movement</div>
              <div class="spec-val">${product.movement}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Case Diameter</div>
              <div class="spec-val">${product.caseSize}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Case Material</div>
              <div class="spec-val">${product.material}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Strap & Clasp</div>
              <div class="spec-val">${product.strap}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Dial Color & Finish</div>
              <div class="spec-val">${product.dial}</div>
            </div>
            <div class="spec-cell">
              <div class="spec-label">Water Resistance</div>
              <div class="spec-val">${product.waterResistance}</div>
            </div>
          </div>

          <!-- AI Why This Watch Box -->
          <div class="why-this-watch-box" style="margin-bottom: 24px; background: var(--color-brand-cream); border-left-color: var(--color-accent-gold); color: #333333;">
            <strong style="color: var(--color-text-accent);">AI STYLE CONCIERGE INSIGHT</strong>
            ${product.aiReason}
          </div>

          <!-- Purchase Action Buttons -->
          <div class="pdp-actions-row">
            <div class="quantity-stepper">
              <button class="stepper-btn" onclick="adjustPdpQty(-1)">−</button>
              <div class="stepper-val" id="pdp-qty">1</div>
              <button class="stepper-btn" onclick="adjustPdpQty(1)">+</button>
            </div>
            <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="addPdpToCart('${product.id}')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
            <button class="btn btn-champagne btn-lg" style="flex: 1;" onclick="buyNowPdp('${product.id}')">
              Buy Now &rarr;
            </button>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 24px;">
            <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="toggleWishlist('${product.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#B94A48' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ${isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
            <button class="btn btn-outline btn-sm" style="flex: 1;" onclick="toggleComparison('${product.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>
              ${isInComparison ? 'In Comparison' : 'Compare Specs'}
            </button>
          </div>
        </div>
      </div>

      <!-- Similar Watches Section -->
      <div style="margin-top: var(--space-16); padding-top: var(--space-12); border-top: 1px solid var(--color-border-light);">
        <div class="section-header">
          <div>
            <div class="section-label">Coordinated Horology</div>
            <h2 class="section-title">Similar & Alternative Watches</h2>
            <p class="section-subtitle">Timepieces sharing movement caliber or design aesthetics from the catalog.</p>
          </div>
        </div>
        <div class="product-grid">
          ${similarWatches.map(w => renderProductCardHTML(w)).join('')}
        </div>
      </div>
    </div>
  `;
}

window.adjustPdpQty = function(delta) {
  const el = document.getElementById('pdp-qty');
  if (!el) return;
  let q = parseInt(el.textContent, 10) + delta;
  if (q < 1) q = 1;
  el.textContent = q;
};

window.addPdpToCart = function(productId) {
  const qEl = document.getElementById('pdp-qty');
  const qty = qEl ? parseInt(qEl.textContent, 10) : 1;
  addToCart(productId, qty);
};

window.buyNowPdp = function(productId) {
  addPdpToCart(productId);
  navigateTo('checkout');
};

// ==========================================================================
// View: COLLECTIONS
// ==========================================================================
function renderCollections(container, selectedId = 'quiet-luxury') {
  const activeCol = COLLECTIONS.find(c => c.id === selectedId) || COLLECTIONS[0];
  const items = PRODUCTS.filter(p => activeCol.itemIds.includes(p.id));

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div class="section-header-center">
        <div class="pill-badge gold" style="margin-bottom: 12px;">CURATED HOROLOGY STORIES</div>
        <h1 class="section-title">Editorial Collections</h1>
        <p class="section-subtitle">
          Theme-driven groupings that unite watches by occasion, mechanical identity, and silhouette.
        </p>
      </div>

      <!-- Collection Nav Tabs -->
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-10);">
        ${COLLECTIONS.map(c => `
          <button class="btn btn-sm ${c.id === activeCol.id ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('collections', '${c.id}')">
            ${c.title}
          </button>
        `).join('')}
      </div>

      <!-- Collection Hero Narrative Card -->
      <div style="background: var(--color-brand-black); color: #FFFFFF; border-radius: var(--radius-xl); padding: var(--space-10); margin-bottom: var(--space-12); border: 1px solid rgba(255,255,255,0.1);">
        <div class="pill-badge gold" style="margin-bottom: 12px;">${activeCol.bannerTag}</div>
        <h2 style="font-family: var(--font-heading); font-size: 36px; font-weight: 600; margin-bottom: 12px;">
          ${activeCol.title}
        </h2>
        <p style="font-size: 16px; color: #CCCCCC; max-width: 640px; line-height: 1.6;">
          ${activeCol.description}
        </p>
      </div>

      <!-- Products Grid -->
      <div class="product-grid">
        ${items.map(product => renderProductCardHTML(product)).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// View: BRANDS
// ==========================================================================
function renderBrands(container, selectedBrand = 'AUREN') {
  const activeBrand = BRANDS.find(b => b.name === selectedBrand) || BRANDS[0];
  const brandWatches = PRODUCTS.filter(p => p.brand === activeBrand.name);

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div class="section-header-center">
        <div class="pill-badge gold" style="margin-bottom: 12px;">CERTIFIED HOUSES</div>
        <h1 class="section-title">Brand Discovery</h1>
        <p class="section-subtitle">Explore timepieces crafted by our curated independent and flagship partner brands.</p>
      </div>

      <!-- Brand Switcher Tabs -->
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: var(--space-10);">
        ${BRANDS.map(b => `
          <button class="btn btn-sm ${b.name === activeBrand.name ? 'btn-primary' : 'btn-outline'}" onclick="navigateTo('brands', '${b.name}')">
            ${b.name} (${b.watchCount})
          </button>
        `).join('')}
      </div>

      <!-- Brand Profile Card -->
      <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: var(--space-8); margin-bottom: var(--space-10);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 32px; font-weight: 700; letter-spacing: 0.1em;">
              ${activeBrand.name}
            </h2>
            <div style="font-size: 13px; color: var(--color-accent-gold); font-weight: 600;">
              ${activeBrand.country} • ${activeBrand.established}
            </div>
          </div>
          <div style="font-size: 14px; font-weight: 600; color: var(--color-text-secondary);">
            Price Range: <strong style="color: var(--color-text-primary);">${activeBrand.priceRange}</strong>
          </div>
        </div>
        <p style="font-size: 15px; color: var(--color-text-secondary); max-width: 680px; line-height: 1.6;">
          ${activeBrand.description}
        </p>
      </div>

      <!-- Brand Products Grid -->
      <div class="product-grid">
        ${brandWatches.map(product => renderProductCardHTML(product)).join('')}
      </div>
    </div>
  `;
}

// ==========================================================================
// View: WISHLIST
// ==========================================================================
function renderWishlist(container) {
  const items = PRODUCTS.filter(p => AppState.wishlist.includes(p.id));

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div class="section-header">
        <div>
          <div class="section-label">Saved Favorites</div>
          <h1 class="section-title">My Wishlist</h1>
          <p class="section-subtitle">${items.length} timepieces saved to your private curation.</p>
        </div>
        ${items.length > 0 ? `
          <button class="btn btn-outline btn-sm" onclick="clearWishlist()">Clear Wishlist</button>
        ` : ''}
      </div>

      ${items.length === 0 ? `
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-16); text-align: center; max-width: 560px; margin: 40px auto;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #F6F1E9; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: var(--color-accent-gold);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 20px; font-weight: 600; margin-bottom: 8px;">Your Wishlist is Empty</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 24px;">Explore our 40-watch catalog and tap the heart icon on any piece you love to save it here.</p>
          <button class="btn btn-primary" onclick="navigateTo('discovery')">Explore Timepieces</button>
        </div>
      ` : `
        <div class="product-grid">
          ${items.map(product => renderProductCardHTML(product)).join('')}
        </div>
      `}
    </div>
  `;
}

window.clearWishlist = function() {
  AppState.wishlist = [];
  saveWishlist();
  navigateTo('wishlist');
  showToast('Wishlist cleared');
};

// ==========================================================================
// View: COMPARISON
// ==========================================================================
function renderComparison(container) {
  const items = PRODUCTS.filter(p => AppState.comparison.includes(p.id));

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20);">
      <div class="section-header">
        <div>
          <div class="section-label">Spec Comparison</div>
          <h1 class="section-title">Side-by-Side Horology Matrix</h1>
          <p class="section-subtitle">Compare case diameters, mechanical calibers, and water resistance specifications.</p>
        </div>
        ${items.length > 0 ? `
          <button class="btn btn-outline btn-sm" onclick="clearComparison()">Clear All</button>
        ` : ''}
      </div>

      ${items.length === 0 ? `
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-16); text-align: center; max-width: 560px; margin: 40px auto;">
          <h3 style="font-family: var(--font-heading); font-size: 20px; margin-bottom: 8px;">No Watches Selected for Comparison</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 24px;">You can compare up to 4 watches side-by-side to evaluate specifications and pricing.</p>
          <button class="btn btn-primary" onclick="navigateTo('discovery')">Select Watches</button>
        </div>
      ` : `
        <div class="comparison-table-wrap">
          <table class="comparison-table">
            <thead>
              <tr>
                <th style="width: 180px;">Model</th>
                ${items.map(w => `
                  <td style="text-align: center; min-width: 200px;">
                    <img src="${w.image}" alt="${w.model}" style="width: 110px; height: 110px; object-fit: contain; margin: 0 auto 10px auto;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--color-accent-gold);">${w.brand}</div>
                    <div style="font-family: var(--font-heading); font-size: 16px; font-weight: 600; margin-bottom: 6px;">${w.model}</div>
                    <div style="font-size: 16px; font-weight: 700; margin-bottom: 12px;">₹${w.price.toLocaleString('en-IN')}</div>
                    <div style="display: flex; gap: 6px; justify-content: center;">
                      <button class="btn btn-primary btn-sm" onclick="addToCart('${w.id}')">Add to Cart</button>
                      <button class="btn btn-outline btn-sm" onclick="toggleComparison('${w.id}')">Remove</button>
                    </div>
                  </td>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Caliber Movement</th>
                ${items.map(w => `<td><strong>${w.movement}</strong></td>`).join('')}
              </tr>
              <tr>
                <th>Case Diameter</th>
                ${items.map(w => `<td>${w.caseSize}</td>`).join('')}
              </tr>
              <tr>
                <th>Case Material</th>
                ${items.map(w => `<td>${w.material}</td>`).join('')}
              </tr>
              <tr>
                <th>Strap Type</th>
                ${items.map(w => `<td>${w.strap}</td>`).join('')}
              </tr>
              <tr>
                <th>Dial Finish</th>
                ${items.map(w => `<td>${w.dial}</td>`).join('')}
              </tr>
              <tr>
                <th>Water Resistance</th>
                ${items.map(w => `<td>${w.waterResistance}</td>`).join('')}
              </tr>
              <tr>
                <th>Style Aesthetic</th>
                ${items.map(w => `<td>${w.style}</td>`).join('')}
              </tr>
              <tr>
                <th>Recommended For</th>
                ${items.map(w => `<td>${w.occasion.join(', ')}</td>`).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

window.clearComparison = function() {
  AppState.comparison = [];
  saveComparison();
  navigateTo('comparison');
};

// ==========================================================================
// View: CART (Page View)
// ==========================================================================
function renderCartView(container) {
  const subtotal = AppState.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20); max-width: 900px;">
      <div class="section-header">
        <div>
          <div class="section-label">Your Bag</div>
          <h1 class="section-title">Shopping Cart</h1>
          <p class="section-subtitle">${AppState.cart.length} unique items selected.</p>
        </div>
        <a href="javascript:void(0)" class="view-all-link" onclick="navigateTo('discovery')">&larr; Continue Shopping</a>
      </div>

      ${AppState.cart.length === 0 ? `
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-16); text-align: center;">
          <h3 style="font-family: var(--font-heading); font-size: 20px; margin-bottom: 8px;">Your Shopping Cart is Empty</h3>
          <p style="font-size: 14px; color: var(--color-text-secondary); margin-bottom: 24px;">Browse through our curated collection of 40 fine watches to add pieces to your bag.</p>
          <button class="btn btn-primary" onclick="navigateTo('discovery')">Explore All Watches</button>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: 1.8fr 1.2fr; gap: var(--space-8); align-items: start;">
          <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px;">
            ${AppState.cart.map(item => {
              const product = PRODUCTS.find(p => p.id === item.id);
              if (!product) return '';
              return `
                <div class="cart-item-row">
                  <img src="${product.image}" alt="${product.model}" class="cart-item-thumb">
                  <div class="cart-item-info">
                    <div class="cart-item-brand">${product.brand}</div>
                    <div class="cart-item-title">${product.model}</div>
                    <div class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
                    <button onclick="removeFromCart('${product.id}')" style="color: var(--color-text-muted); font-size: 13px;">✕</button>
                    <div class="quantity-stepper" style="height: 32px;">
                      <button class="stepper-btn" style="width: 28px;" onclick="updateCartQty('${product.id}', -1)">−</button>
                      <div class="stepper-val" style="width: 28px; font-size: 12px;">${item.quantity}</div>
                      <button class="stepper-btn" style="width: 28px;" onclick="updateCartQty('${product.id}', 1)">+</button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Order Summary Card -->
          <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 16px;">Order Summary</h3>
            <div class="cart-totals-row">
              <span style="color: var(--color-text-secondary);">Subtotal</span>
              <span style="font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="cart-totals-row">
              <span style="color: var(--color-text-secondary);">Insured Express Shipping</span>
              <span style="font-weight: 600; color: var(--color-success);">FREE</span>
            </div>
            <div class="cart-totals-row total-bold">
              <span>Total Amount</span>
              <span style="color: var(--color-accent-gold);">₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button class="btn btn-champagne" style="width: 100%; margin-top: 20px;" onclick="navigateTo('checkout')">
              Proceed to Checkout &rarr;
            </button>
          </div>
        </div>
      `}
    </div>
  `;
}

// ==========================================================================
// View: CHECKOUT
// ==========================================================================
function renderCheckout(container) {
  const subtotal = AppState.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20); max-width: 840px;">
      <!-- Stepper -->
      <div class="checkout-stepper">
        <div class="step-node active">
          <div class="step-circle">1</div>
          <span>Shipping</span>
        </div>
        <div class="step-node active">
          <div class="step-circle">2</div>
          <span>Delivery</span>
        </div>
        <div class="step-node active">
          <div class="step-circle">3</div>
          <span>Payment</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1.6fr 1fr; gap: var(--space-8); align-items: start;">
        <div>
          <!-- Shipping Address -->
          <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 600; margin-bottom: 16px;">1. Shipping Address</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px;">Full Name</label>
                <input type="text" id="chk-name" value="Gaurav Kadam" style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-medium); border-radius: var(--radius-sm); font-size: 13px;">
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px;">Phone Number</label>
                <input type="text" id="chk-phone" value="+91 98705 43210" style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-medium); border-radius: var(--radius-sm); font-size: 13px;">
              </div>
            </div>
            <div style="margin-bottom: 12px;">
              <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px;">Delivery Address</label>
              <input type="text" id="chk-address" value="A-102, Shree Residency, Baner Road" style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-medium); border-radius: var(--radius-sm); font-size: 13px;">
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px;">City / State</label>
                <input type="text" id="chk-city" value="Pune, Maharashtra" style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-medium); border-radius: var(--radius-sm); font-size: 13px;">
              </div>
              <div>
                <label style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--color-text-secondary); display: block; margin-bottom: 4px;">PIN Code</label>
                <input type="text" id="chk-pin" value="411014" style="width: 100%; padding: 10px 12px; border: 1px solid var(--color-border-medium); border-radius: var(--radius-sm); font-size: 13px;">
              </div>
            </div>
          </div>

          <!-- Delivery Speed Options -->
          <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;">
            <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 600; margin-bottom: 16px;">2. Delivery Speed</h3>
            <label style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--color-border-accent); border-radius: var(--radius-sm); margin-bottom: 8px; cursor: pointer; background: #FFFDF9;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="delivery" checked style="accent-color: var(--color-brand-black);">
                <div>
                  <div style="font-size: 13px; font-weight: 600;">Standard Insured Delivery (3 – 5 Days)</div>
                  <div style="font-size: 11px; color: var(--color-text-muted);">BlueDart Air Priority Express</div>
                </div>
              </div>
              <span style="font-size: 12px; font-weight: 700; color: var(--color-success);">FREE</span>
            </label>
          </div>

          <!-- Payment Options -->
          <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 16px; font-weight: 600; margin-bottom: 16px;">3. Payment Method</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); cursor: pointer;">
                <input type="radio" name="payment" checked style="accent-color: var(--color-brand-black);">
                <span style="font-size: 13px; font-weight: 600;">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
              </label>
              <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); cursor: pointer;">
                <input type="radio" name="payment" style="accent-color: var(--color-brand-black);">
                <span style="font-size: 13px; font-weight: 600;">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
              </label>
              <label style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--color-border-light); border-radius: var(--radius-sm); cursor: pointer;">
                <input type="radio" name="payment" style="accent-color: var(--color-brand-black);">
                <span style="font-size: 13px; font-weight: 600;">Cash on Delivery (Verified)</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Checkout Summary -->
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px; position: sticky; top: 96px;">
          <h3 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 16px;">Summary</h3>
          <div style="max-height: 220px; overflow-y: auto; margin-bottom: 16px;">
            ${AppState.cart.map(item => {
              const p = PRODUCTS.find(x => x.id === item.id);
              if (!p) return '';
              return `
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px;">
                  <span>${p.model} × ${item.quantity}</span>
                  <span style="font-weight: 600;">₹${(p.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              `;
            }).join('')}
          </div>
          <div class="cart-totals-row total-bold">
            <span>Total Payable</span>
            <span style="color: var(--color-accent-gold);">₹${subtotal.toLocaleString('en-IN')}</span>
          </div>
          <button class="btn btn-champagne" style="width: 100%; margin-top: 20px;" onclick="placeOrder()">
            Place Order with 1-Click &rarr;
          </button>
          <div style="text-align: center; font-size: 11px; color: var(--color-text-muted); margin-top: 12px;">
            🔒 256-Bit SSL Encrypted Horology Checkout
          </div>
        </div>
      </div>
    </div>
  `;
}

window.placeOrder = function() {
  const orderId = '#WR' + Math.floor(1000000 + Math.random() * 9000000);
  AppState.lastOrder = {
    id: orderId,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    items: [...AppState.cart],
    total: AppState.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(x => x.id === item.id);
      return sum + (p ? p.price * item.quantity : 0);
    }, 0)
  };

  AppState.cart = [];
  saveCart();
  navigateTo('order-success');
};

// ==========================================================================
// View: ORDER SUCCESS (with Confetti Celebration)
// ==========================================================================
function renderOrderSuccess(container) {
  const order = AppState.lastOrder || {
    id: '#WR1245789',
    date: '29 Sep 2026',
    total: 19999
  };

  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-12); padding-bottom: var(--space-20); text-align: center; max-width: 620px;">
      <div style="width: 76px; height: 76px; border-radius: 50%; background: #3F8A62; color: #FFFFFF; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; box-shadow: 0 10px 30px rgba(63, 138, 98, 0.4);">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>

      <div class="pill-badge gold" style="margin-bottom: 12px;">OFFICIAL ORDER CONFIRMED</div>
      <h1 style="font-family: var(--font-heading); font-size: 36px; font-weight: 600; margin-bottom: 8px;">Order Placed!</h1>
      <p style="font-size: 15px; color: var(--color-text-secondary); margin-bottom: 24px;">
        Your order <strong>${order.id}</strong> has been successfully placed and transmitted to our certified horology dispatch center.
      </p>

      <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-lg); padding: 24px; text-align: left; margin-bottom: 28px;">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
          <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: #F6F1E9; display: flex; align-items: center; justify-content: center; color: var(--color-accent-gold);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div>
            <div style="font-size: 14px; font-weight: 600;">Estimated Delivery: 3 – 5 Days</div>
            <div style="font-size: 12px; color: var(--color-text-muted);">BlueDart Air Insured Transit Tracking Active</div>
          </div>
        </div>
        <div style="padding-top: 14px; border-top: 1px solid var(--color-border-light); display: flex; justify-content: space-between; font-size: 13px;">
          <span>Deliver to:</span>
          <strong>Gaurav Kadam, Pune, MH 411014</strong>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button class="btn btn-champagne" onclick="navigateTo('discovery')">Continue Shopping</button>
        <button class="btn btn-outline" onclick="navigateTo('profile')">View in My Account</button>
      </div>
    </div>
  `;

  // Trigger celebration confetti
  triggerConfetti();
}

// ==========================================================================
// View: PROFILE
// ==========================================================================
function renderProfile(container) {
  container.innerHTML = `
    <div class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-20); max-width: 860px;">
      <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-xl); padding: var(--space-8); margin-bottom: var(--space-8); display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
        <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--color-brand-black); color: var(--color-accent-champagne); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 24px; font-weight: 700;">
          GK
        </div>
        <div>
          <h1 style="font-family: var(--font-heading); font-size: 24px; font-weight: 600;">Gaurav Kadam</h1>
          <p style="font-size: 13px; color: var(--color-text-secondary);">gauravkadam@gmail.com • Member since 2024</p>
          <span class="pill-badge gold" style="margin-top: 6px;">WRISTO PRIVILEGE MEMBER</span>
        </div>
      </div>

      <!-- Profile Tabs -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: var(--space-8);">
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: 18px;">
          <div style="font-size: 12px; color: var(--color-text-muted); text-transform: uppercase;">Saved Wishlist</div>
          <div style="font-size: 24px; font-weight: 700; margin: 4px 0;">${AppState.wishlist.length}</div>
          <a href="javascript:void(0)" onclick="navigateTo('wishlist')" style="font-size: 12px; color: var(--color-accent-gold); font-weight: 600;">View Saved &rarr;</a>
        </div>
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: 18px;">
          <div style="font-size: 12px; color: var(--color-text-muted); text-transform: uppercase;">Comparison List</div>
          <div style="font-size: 24px; font-weight: 700; margin: 4px 0;">${AppState.comparison.length}</div>
          <a href="javascript:void(0)" onclick="navigateTo('comparison')" style="font-size: 12px; color: var(--color-accent-gold); font-weight: 600;">Compare Specs &rarr;</a>
        </div>
        <div style="background: var(--color-brand-paper); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: 18px;">
          <div style="font-size: 12px; color: var(--color-text-muted); text-transform: uppercase;">Active Orders</div>
          <div style="font-size: 24px; font-weight: 700; margin: 4px 0;">${AppState.lastOrder ? 1 : 0}</div>
          <span style="font-size: 12px; color: var(--color-success); font-weight: 600;">Dispatch In Progress</span>
        </div>
      </div>

      <!-- AI Horology Style Profile -->
      <div style="background: var(--color-brand-black); color: #FFFFFF; border-radius: var(--radius-lg); padding: 24px; border: 1px solid rgba(255,255,255,0.1);">
        <h3 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 8px;">Your Personalized Horology DNA</h3>
        <p style="font-size: 13px; color: #A0A0A0; margin-bottom: 16px;">Based on your views and interactions, WRISTO AI models your preferred watch aesthetics:</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <span class="pill-badge gold">FAVORED MOVEMENT: AUTOMATIC</span>
          <span class="pill-badge black" style="background: #2A2A2A;">OPTIMAL CASE: 39MM – 41MM</span>
          <span class="pill-badge black" style="background: #2A2A2A;">PALETTE: SUNRAY BLUE / OBSIDIAN</span>
          <span class="pill-badge black" style="background: #2A2A2A;">STRAP: SOLID LINK / MILANESE</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Product Card HTML Generator
// ==========================================================================
function renderProductCardHTML(product) {
  const isWishlisted = AppState.wishlist.includes(product.id);
  const isInComparison = AppState.comparison.includes(product.id);

  return `
    <div class="product-card" onclick="navigateTo('pdp', '${product.id}')">
      <div class="card-media tilt-element" data-tilt="true">
        ${product.badge ? `<span class="pill-badge card-badge-tag gold">${product.badge}</span>` : ''}
        <button class="card-wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist('${product.id}')" title="Save to Wishlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? '#B94A48' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <img src="${product.image}" alt="${product.brand} ${product.model}" class="card-watch-img" loading="lazy">
        <div class="card-quick-actions">
          <button class="quick-action-btn" onclick="event.stopPropagation(); addToCart('${product.id}')">
            Quick Add
          </button>
          <button class="quick-action-btn" onclick="event.stopPropagation(); toggleComparison('${product.id}')">
            ${isInComparison ? 'Compared' : 'Compare'}
          </button>
        </div>
      </div>

      <div class="card-info">
        <div class="card-brand">${product.brand} • ${product.movement}</div>
        <h4 class="card-title">${product.model}</h4>
        <div class="card-rating-row">
          <span class="star-icon">★</span>
          <span style="font-weight: 600; color: var(--color-text-primary);">${product.rating}</span>
          <span>(${product.reviewsCount})</span>
        </div>
        <div class="card-price-row">
          <span class="card-price">₹${product.price.toLocaleString('en-IN')}</span>
          <span class="card-original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
          <span class="card-discount-badge">${Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
        </div>
      </div>
    </div>
  `;
}

// ==========================================================================
// Cart & Wishlist Interactions
// ==========================================================================
window.addToCart = function(productId, qty = 1) {
  const existing = AppState.cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    AppState.cart.push({ id: productId, quantity: qty });
  }
  saveCart();
  const product = PRODUCTS.find(p => p.id === productId);
  showToast(`✓ ${product ? product.brand + ' ' + product.model : 'Watch'} added to cart`);
  openCartDrawer();
};

window.removeFromCart = function(productId) {
  AppState.cart = AppState.cart.filter(item => item.id !== productId);
  saveCart();
  updateCartDrawerUI();
  if (AppState.currentView === 'cart') renderCartView(document.getElementById('main-content-view'));
};

window.updateCartQty = function(productId, delta) {
  const item = AppState.cart.find(x => x.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartDrawerUI();
    if (AppState.currentView === 'cart') renderCartView(document.getElementById('main-content-view'));
  }
};

window.toggleWishlist = function(productId) {
  const idx = AppState.wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);
  if (idx > -1) {
    AppState.wishlist.splice(idx, 1);
    showToast(`Removed from wishlist`);
  } else {
    AppState.wishlist.push(productId);
    showToast(`♥ Saved to wishlist`);
  }
  saveWishlist();
  if (AppState.currentView === 'wishlist') renderWishlist(document.getElementById('main-content-view'));
  else if (AppState.currentView === 'pdp') renderPDP(document.getElementById('main-content-view'), productId);
  else if (AppState.currentView === 'home' || AppState.currentView === 'discovery') {
    navigateTo(AppState.currentView);
  }
};

window.toggleComparison = function(productId) {
  const idx = AppState.comparison.indexOf(productId);
  if (idx > -1) {
    AppState.comparison.splice(idx, 1);
    showToast(`Removed from comparison`);
  } else {
    if (AppState.comparison.length >= 4) {
      showToast('Maximum 4 watches can be compared at once.');
      return;
    }
    AppState.comparison.push(productId);
    showToast(`Added to comparison matrix`);
  }
  saveComparison();
  if (AppState.currentView === 'comparison') renderComparison(document.getElementById('main-content-view'));
  else navigateTo(AppState.currentView);
};

// ==========================================================================
// Cart Drawer Management
// ==========================================================================
window.openCartDrawer = function() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) {
    overlay.classList.add('open');
    updateCartDrawerUI();
  }
};

window.closeCartDrawer = function() {
  const overlay = document.getElementById('cart-drawer-overlay');
  if (overlay) overlay.classList.remove('open');
};

function updateCartDrawerUI() {
  const body = document.getElementById('cart-drawer-items');
  const footer = document.getElementById('cart-drawer-footer');
  if (!body || !footer) return;

  if (AppState.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 40px 10px; color: var(--color-text-secondary);">
        <p style="font-size: 15px; margin-bottom: 12px;">Your shopping cart is currently empty.</p>
        <button class="btn btn-primary btn-sm" onclick="closeCartDrawer(); navigateTo('discovery');">Explore Watches</button>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  body.innerHTML = AppState.cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    return `
      <div class="cart-item-row">
        <img src="${product.image}" alt="${product.model}" class="cart-item-thumb">
        <div class="cart-item-info">
          <div class="cart-item-brand">${product.brand}</div>
          <div class="cart-item-title">${product.model}</div>
          <div class="cart-item-price">₹${product.price.toLocaleString('en-IN')}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between;">
          <button onclick="removeFromCart('${product.id}')" style="color: var(--color-text-muted); font-size: 13px;">✕</button>
          <div class="quantity-stepper" style="height: 30px;">
            <button class="stepper-btn" style="width: 26px;" onclick="updateCartQty('${product.id}', -1)">−</button>
            <div class="stepper-val" style="width: 26px; font-size: 11px;">${item.quantity}</div>
            <button class="stepper-btn" style="width: 26px;" onclick="updateCartQty('${product.id}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = AppState.cart.reduce((sum, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const subtotalEl = document.getElementById('drawer-subtotal-val');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
}

// ==========================================================================
// Search Overlay Modal
// ==========================================================================
window.openSearchModal = function() {
  const overlay = document.getElementById('search-modal-overlay');
  const input = document.getElementById('search-modal-input');
  if (overlay) {
    overlay.classList.add('open');
    if (input) {
      input.value = '';
      input.focus();
      renderSearchResults('');
    }
  }
};

window.closeSearchModal = function() {
  const overlay = document.getElementById('search-modal-overlay');
  if (overlay) overlay.classList.remove('open');
};

window.handleLiveSearch = function(query) {
  renderSearchResults(query.trim().toLowerCase());
};

function renderSearchResults(q) {
  const container = document.getElementById('search-modal-results');
  if (!container) return;

  if (!q) {
    container.innerHTML = `
      <div style="padding: 16px;">
        <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: var(--color-text-muted); text-transform: uppercase; margin-bottom: 12px;">
          POPULAR SEARCHES
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${['Titan', 'Automatic', 'Minimal', 'Green Dial', 'Chronograph', 'Vela Rose', 'Pulse Smart'].map(tag => `
            <span class="ai-suggestion-chip" onclick="handleSearchTag('${tag}')">${tag}</span>
          `).join('')}
        </div>
      </div>
    `;
    return;
  }

  const matches = PRODUCTS.filter(p => 
    p.brand.toLowerCase().includes(q) ||
    p.model.toLowerCase().includes(q) ||
    p.movement.toLowerCase().includes(q) ||
    p.style.toLowerCase().includes(q) ||
    p.dial.toLowerCase().includes(q)
  ).slice(0, 6);

  if (matches.length === 0) {
    container.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--color-text-muted); font-size: 14px;">No watches found matching "${q}"</div>`;
    return;
  }

  container.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="closeSearchModal(); navigateTo('pdp', '${p.id}')">
      <img src="${p.image}" alt="${p.model}" class="search-item-thumb">
      <div style="flex-grow: 1;">
        <div style="font-size: 11px; font-weight: 700; color: var(--color-accent-gold); text-transform: uppercase;">${p.brand}</div>
        <div style="font-size: 14px; font-weight: 600;">${p.model}</div>
      </div>
      <div style="font-size: 14px; font-weight: 700;">₹${p.price.toLocaleString('en-IN')}</div>
    </div>
  `).join('');
}

window.handleSearchTag = function(tag) {
  const input = document.getElementById('search-modal-input');
  if (input) {
    input.value = tag;
    handleLiveSearch(tag);
  }
};

// ==========================================================================
// 3D Tilt Micro-Interaction (Design Spec Section 11 & 12)
// ==========================================================================
function init3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 1024) return; // desktop only as specified

  const tiltCards = document.querySelectorAll('.tilt-element');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', handleCardMouseMove);
    card.addEventListener('mouseleave', handleCardMouseLeave);
  });
}

function handleCardMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  // Restrained rotation (±2deg X, ±3deg Y as mandated by Section 11)
  const rotateX = ((centerY - y) / centerY) * 2.5;
  const rotateY = ((x - centerX) / centerX) * 3.5;

  const img = card.querySelector('img');
  if (img) {
    img.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  }
}

function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  const img = card.querySelector('img');
  if (img) {
    img.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1.0)`;
  }
}

// ==========================================================================
// Toast System
// ==========================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="color: var(--color-accent-champagne);">✦</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-leave');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ==========================================================================
// Confetti Animation (for Order Success Celebration)
// ==========================================================================
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#E8C89A', '#C89B5B', '#111111', '#F6F1E9', '#3F8A62'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 14 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 4 - 2
    });
  }

  let animationFrame;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let stillFalling = false;

    pieces.forEach(p => {
      p.y += p.speed;
      p.rotation += p.rotSpeed;
      if (p.y < canvas.height) stillFalling = true;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (stillFalling) {
      animationFrame = requestAnimationFrame(updateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  updateConfetti();
}

// ==========================================================================
// Header Badges & Sticky Behavior
// ==========================================================================
function updateHeaderBadges() {
  const cartBadge = document.getElementById('header-cart-count');
  const wishBadge = document.getElementById('header-wishlist-count');
  const mobWishBadge = document.getElementById('mob-wishlist-count');

  const totalCartItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) {
    cartBadge.textContent = totalCartItems;
    cartBadge.style.display = totalCartItems > 0 ? 'flex' : 'none';
    cartBadge.classList.add('pulse');
    setTimeout(() => cartBadge.classList.remove('pulse'), 300);
  }

  if (wishBadge) {
    wishBadge.textContent = AppState.wishlist.length;
    wishBadge.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
  }

  if (mobWishBadge) {
    mobWishBadge.textContent = AppState.wishlist.length;
    mobWishBadge.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
  }
}

function updateComparisonBadge() {
  const compBtn = document.getElementById('header-compare-btn');
  if (compBtn) {
    const badge = compBtn.querySelector('.action-badge');
    if (badge) {
      badge.textContent = AppState.comparison.length;
      badge.style.display = AppState.comparison.length > 0 ? 'flex' : 'none';
    }
  }
}

// ==========================================================================
// Hero Actions & Gender Quick Filters
// ==========================================================================
function filterByGender(gender) {
  AppState.filters.gender = gender;
  navigateTo('discovery');
}

function openHeroVideoModal() {
  let modal = document.getElementById('hero-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'hero-video-modal';
    modal.className = 'hero-video-modal-overlay';
    modal.onclick = closeHeroVideoModal;
    modal.innerHTML = `
      <div class="hero-video-modal-box" onclick="event.stopPropagation()">
        <button class="hero-video-close-btn" onclick="closeHeroVideoModal()" aria-label="Close">&times;</button>
        <div class="hero-video-frame-wrap">
          <div class="hero-video-placeholder">
            <div class="hero-video-poster" style="background-image: url('./assets/banners/hero-luxury-watch-bg.jpg');"></div>
            <div class="hero-video-play-layer">
              <span class="hero-video-badge">WRISTO CINEMA &bull; 4K HOROLOGY</span>
              <h3 style="font-family: var(--font-serif, serif); font-size: 30px; font-weight: 500; margin: 12px 0 8px 0; color: #FFFFFF;">Precision in Motion</h3>
              <p style="font-size: 14px; color: #CCCCCC; max-width: 460px; line-height: 1.6; text-align: center; margin-bottom: 24px;">Discover the hand-finished mechanical escapements, surgical-grade metallurgy, and timeless aesthetic restraint defining the WRISTO collection.</p>
              <button class="btn btn-hero-primary" onclick="showToast('Playing full Horological Showcase film...')">
                <span class="hero-play-icon" style="border-color: #111111;">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="#111111"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </span>
                Play Craftsmanship Film
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add('open');
}

function closeHeroVideoModal() {
  const modal = document.getElementById('hero-video-modal');
  if (modal) modal.classList.remove('open');
}

// Sticky header listener
window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
});

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  updateHeaderBadges();
  updateComparisonBadge();
  navigateTo('home');
});
