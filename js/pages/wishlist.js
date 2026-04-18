// ============================================
// Wishlist Page
// ============================================

import Store from '../store.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { renderFooter } from './home.js';

export default function renderWishlist() {
  const wishlist = Store.state.wishlist;

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>My Wishlist</h2>
        <span style="color:var(--text-tertiary);font-size:var(--font-size-sm)">${wishlist.length} items</span>
      </div>

      ${wishlist.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">💜</div>
          <h3>Wishlist is empty</h3>
          <p>Save your favorite products here for later.</p>
          <a href="#/shop" class="btn btn-primary btn-lg">Browse Products</a>
        </div>
      ` : `
        <div class="product-grid" id="wishlist-grid">
          ${wishlist.map(p => renderProductCard(p)).join('')}
        </div>
      `}
    </div>
    ${renderFooter()}
  `;

  bindProductCardEvents(div.querySelector('#wishlist-grid'));

  // Re-render on wishlist changes
  Store.on('wishlist-updated', () => {
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(renderWishlist());
  });

  return div;
}
