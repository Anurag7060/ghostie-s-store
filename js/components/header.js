// ============================================
// Header Component
// ============================================

import Store from '../store.js';
import Router from '../router.js';
import API from '../api.js';

let searchTimeout = null;

export function renderHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const cartCount = Store.getCartCount();
  const user = Store.state.user;
  const theme = Store.state.theme;

  header.innerHTML = `
    <div class="header-inner">
      <a href="#/" class="header-logo" data-nav>
        <div class="logo-icon">G</div>
        <span>Ghostie's Store</span>
      </a>

      <nav class="header-nav" aria-label="Main navigation">
        <a href="#/" data-nav>Home</a>
        <a href="#/shop" data-nav>Shop</a>
        <a href="#/wishlist" data-nav>Wishlist</a>
      </nav>

      <div class="header-search">
        <span class="search-icon">🔍</span>
        <input type="text" id="header-search-input" placeholder="Search products..." aria-label="Search products" autocomplete="off">
        <div class="search-results" id="search-results"></div>
      </div>

      <div class="header-actions">
        <button class="action-btn" id="theme-toggle" aria-label="Toggle theme" title="Toggle theme">
          ${theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button class="action-btn" id="cart-toggle" aria-label="Open cart" title="Cart">
          🛒
          ${cartCount > 0 ? `<span class="badge badge-accent cart-badge">${cartCount}</span>` : ''}
        </button>
        <button class="action-btn" id="account-btn" aria-label="Account" title="Account" onclick="location.hash='#/account'">
          ${user ? '👤' : '👤'}
        </button>
      </div>

      <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">☰</button>
    </div>

    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
      <a href="#/" data-nav>Home</a>
      <a href="#/shop" data-nav>Shop</a>
      <a href="#/wishlist" data-nav>Wishlist</a>
      <a href="#/account" data-nav>Account</a>
      <div class="mobile-search">
        <input type="text" placeholder="Search products..." class="input" id="mobile-search-input">
      </div>
    </nav>
  `;

  // Events
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    Store.toggleTheme();
    renderHeader();
  });

  document.getElementById('cart-toggle')?.addEventListener('click', () => {
    Store.emit('toggle-cart-drawer');
  });

  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('mobile-nav')?.classList.toggle('open');
  });

  // Search
  const searchInput = document.getElementById('header-search-input');
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const results = await API.search(e.target.value);
      renderSearchResults(results);
    }, 250);
  });

  searchInput?.addEventListener('blur', () => {
    setTimeout(() => {
      document.getElementById('search-results')?.classList.remove('show');
    }, 200);
  });

  // Mobile search
  document.getElementById('mobile-search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      Store.setFilters({ search: e.target.value.trim() });
      Router.navigate('/shop');
      document.getElementById('mobile-nav')?.classList.remove('open');
    }
  });

  // Scroll effect
  if (!header.dataset.scrollBound) {
    header.dataset.scrollBound = 'true';
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  Router.updateActiveLinks(window.location.hash.slice(1) || '/');
}

function renderSearchResults(results) {
  const container = document.getElementById('search-results');
  if (!container) return;

  if (!results.length) {
    container.classList.remove('show');
    return;
  }

  container.innerHTML = results.map(p => `
    <a class="search-result-item" href="#/product/${p.id}">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="result-info">
        <div class="result-name">${p.name}</div>
        <div class="result-price">$${p.price.toFixed(2)}</div>
      </div>
    </a>
  `).join('');
  container.classList.add('show');
}

export default { renderHeader };
