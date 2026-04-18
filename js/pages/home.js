// ============================================
// Home Page
// ============================================

import API from '../api.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';

export default async function renderHome() {
  const featured = await API.getFeatured();
  const categories = await API.getCategories();
  const newArrivals = await API.getNewArrivals();

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">✨ New Season Collection</div>
          <h1>Discover <span class="text-gradient">Premium</span> Products</h1>
          <p>Curated collection of the finest products for the modern lifestyle. Quality meets design.</p>
          <div class="hero-actions">
            <a href="#/shop" class="btn btn-primary btn-lg">Shop Now →</a>
            <a href="#/shop" class="btn btn-outline btn-lg">Explore</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">2K+</div>
              <div class="hero-stat-label">Products</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">15K+</div>
              <div class="hero-stat-label">Customers</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">4.8</div>
              <div class="hero-stat-label">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="section-header">
        <h2>Shop by Category</h2>
      </div>
      <div class="category-grid">
        ${categories.map(c => `
          <a href="#/shop" class="category-card" onclick="setTimeout(()=>{document.querySelector('[data-filter-cat][value=&quot;${c.name}&quot;]')?.click()},300)">
            <span class="category-card-icon">${c.icon}</span>
            <div class="category-card-name">${c.name}</div>
            <div class="category-card-count">${c.count} products</div>
          </a>
        `).join('')}
      </div>
    </section>

    <section class="container">
      <div class="section-header">
        <h2>Featured Products</h2>
        <a href="#/shop" class="view-all">View All →</a>
      </div>
      <div class="product-grid" id="featured-grid">
        ${featured.map(p => renderProductCard(p)).join('')}
      </div>
    </section>

    <section class="container">
      <div class="promo-banner">
        <div>
          <h2>Summer Sale 🔥</h2>
          <p>Up to 50% off on selected items. Limited time offer.</p>
        </div>
        <a href="#/shop" class="btn btn-accent btn-lg">Shop the Sale</a>
      </div>
    </section>

    ${newArrivals.length > 0 ? `
    <section class="container">
      <div class="section-header">
        <h2>New Arrivals</h2>
        <a href="#/shop" class="view-all">View All →</a>
      </div>
      <div class="product-grid" id="new-grid">
        ${newArrivals.map(p => renderProductCard(p)).join('')}
      </div>
    </section>
    ` : ''}

    <section class="container">
      <div class="newsletter">
        <h2>Stay in the Loop</h2>
        <p>Subscribe for exclusive deals, new arrivals, and insider-only discounts.</p>
        <div class="newsletter-form">
          <input type="email" class="input" placeholder="Enter your email" id="newsletter-email">
          <button class="btn btn-primary" id="newsletter-btn">Subscribe</button>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;

  bindProductCardEvents(div.querySelector('#featured-grid'));
  bindProductCardEvents(div.querySelector('#new-grid'));

  // Newsletter
  setTimeout(() => {
    document.getElementById('newsletter-btn')?.addEventListener('click', () => {
      const email = document.getElementById('newsletter-email');
      if (email?.value) {
        const { showToast } = require_toast();
        email.value = '';
      }
    });
  }, 100);

  return div;
}

function require_toast() {
  return import('../components/toast.js');
}

export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#/" class="header-logo">
              <div class="logo-icon">G</div>
              <span>Ghostie's Store</span>
            </a>
            <p>Premium products for the modern lifestyle. Quality, design, and value in every product.</p>
            <div class="footer-socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="GitHub">⌨</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          <div class="footer-column">
            <h4>Shop</h4>
            <a href="#/shop">All Products</a>
            <a href="#/shop">New Arrivals</a>
            <a href="#/shop">Best Sellers</a>
            <a href="#/shop">Sale</a>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Contact Us</a>
          </div>
          <div class="footer-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Ghostie's Store. All rights reserved.</span>
          <span>Created by Anurag Sonwani</span>
        </div>
      </div>
    </footer>
  `;
}
