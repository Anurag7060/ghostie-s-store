// ============================================
// Product Card Component
// ============================================

import Store from '../store.js';
import { showToast } from './toast.js';

export function renderStars(rating) {
  let html = '<div class="rating">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star filled">★</span>';
    else if (i - 0.5 <= rating) html += '<span class="star half">★</span>';
    else html += '<span class="star">★</span>';
  }
  html += '</div>';
  return html;
}

export function renderProductCard(product) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const inWishlist = Store.isInWishlist(product.id);

  return `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-card-image" onclick="location.hash='#/product/${product.id}'">
        <img src="${product.image}" alt="${product.name}" loading="lazy" width="500" height="500">
        <div class="product-card-badges">
          ${discount > 0 ? `<span class="badge badge-sale">${discount}% OFF</span>` : ''}
          ${product.tags?.includes('new') ? '<span class="badge badge-primary">NEW</span>' : ''}
          ${product.tags?.includes('trending') ? '<span class="badge badge-warning">🔥 HOT</span>' : ''}
        </div>
        <div class="product-card-actions">
          <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-wishlist-id="${product.id}" aria-label="Toggle wishlist">
            ${inWishlist ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="product-card-quick-add">
          <button class="btn btn-primary btn-block btn-sm" data-add-cart="${product.id}">Add to Cart</button>
        </div>
      </div>
      <div class="product-card-body" onclick="location.hash='#/product/${product.id}'">
        <div class="product-card-category">${product.category}</div>
        <div class="product-card-name">${product.name}</div>
        <div class="product-card-price">
          <span class="price">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-card-rating">
          ${renderStars(product.rating)}
          <span class="rating-count">(${product.reviews})</span>
        </div>
      </div>
    </div>
  `;
}

// Delegated events for product cards
export function bindProductCardEvents(container) {
  container?.addEventListener('click', async (e) => {
    // Add to cart
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      e.stopPropagation();
      const id = parseInt(addBtn.dataset.addCart);
      const { default: API } = await import('../api.js');
      const product = await API.getProduct(id);
      if (product) {
        Store.addToCart(product);
        showToast('Added to Cart', `${product.name} added successfully`, 'success');
      }
      return;
    }

    // Wishlist toggle
    const wishBtn = e.target.closest('[data-wishlist-id]');
    if (wishBtn) {
      e.stopPropagation();
      const id = parseInt(wishBtn.dataset.wishlistId);
      const { default: API } = await import('../api.js');
      const product = await API.getProduct(id);
      if (product) {
        const added = Store.toggleWishlist(product);
        wishBtn.classList.toggle('active', added);
        wishBtn.innerHTML = added ? '❤️' : '🤍';
        showToast(
          added ? 'Added to Wishlist' : 'Removed from Wishlist',
          product.name,
          added ? 'success' : 'info'
        );
      }
    }
  });
}

export default { renderProductCard, renderStars, bindProductCardEvents };
