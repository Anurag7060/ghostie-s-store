// ============================================
// Product Detail Page
// ============================================

import API from '../api.js';
import Store from '../store.js';
import { renderStars, renderProductCard, bindProductCardEvents } from '../components/productCard.js';
import { showToast } from '../components/toast.js';
import { renderFooter } from './home.js';

export default async function renderProduct(params) {
  const product = await API.getProduct(params.id);
  if (!product) {
    const div = document.createElement('div');
    div.className = 'main-content container';
    div.innerHTML = '<div class="empty-state"><div class="empty-state-icon">😕</div><h3>Product Not Found</h3><p>This product doesn\'t exist.</p><a href="#/shop" class="btn btn-primary">Back to Shop</a></div>';
    return div;
  }

  const related = await API.getRelated(product.id, product.category);
  const inWishlist = Store.isInWishlist(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  let selectedColor = product.colors?.[0] || null;
  let selectedSize = product.sizes?.[0] || null;

  const reviews = [
    { name: 'Alex M.', rating: 5, date: '2 weeks ago', text: 'Absolutely love this product! Quality is outstanding and it exceeded my expectations.' },
    { name: 'Sarah K.', rating: 4, date: '1 month ago', text: 'Great product overall. Shipping was fast and packaging was excellent.' },
    { name: 'James L.', rating: 5, date: '2 months ago', text: 'Best purchase I\'ve made this year. Highly recommend to everyone!' }
  ];

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <div class="container">
      <div class="product-detail">
        <div class="product-gallery">
          <div class="product-gallery-main">
            <img src="${product.images[0]}" alt="${product.name}" id="main-image">
          </div>
          <div class="product-gallery-thumbs">
            ${product.images.map((img, i) => `
              <div class="product-gallery-thumb ${i === 0 ? 'active' : ''}" data-thumb-idx="${i}">
                <img src="${img}" alt="${product.name} view ${i + 1}">
              </div>
            `).join('')}
          </div>
        </div>

        <div class="product-info">
          <div class="product-info-category">${product.category}</div>
          <h1>${product.name}</h1>
          <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-4)">
            ${renderStars(product.rating)}
            <span class="rating-count">${product.rating} (${product.reviews} reviews)</span>
          </div>
          <div class="product-info-price">
            <span class="current price">$${product.price.toFixed(2)}</span>
            ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
            ${discount > 0 ? `<span class="price-discount">Save ${discount}%</span>` : ''}
          </div>
          <p class="product-info-description">${product.description}</p>

          ${product.colors?.length ? `
          <div class="product-info-options">
            <h4>Color</h4>
            <div class="color-options">
              ${product.colors.map((c, i) => `
                <button class="color-option ${i === 0 ? 'active' : ''}" style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${product.sizes?.length ? `
          <div class="product-info-options">
            <h4>Size</h4>
            <div class="size-options">
              ${product.sizes.map((s, i) => `
                <button class="size-option ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="product-add-section">
            <div class="qty-selector">
              <button id="qty-minus">−</button>
              <span id="qty-value">1</span>
              <button id="qty-plus">+</button>
            </div>
            <button class="btn btn-primary btn-lg" id="add-to-cart-btn" style="flex:1">Add to Cart</button>
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" id="wishlist-toggle-btn" aria-label="Toggle wishlist">
              ${inWishlist ? '❤️' : '🤍'}
            </button>
          </div>

          <div class="product-meta">
            <div class="product-meta-item"><span class="icon">📦</span> Free shipping on orders over $50</div>
            <div class="product-meta-item"><span class="icon">🔄</span> 30-day easy returns</div>
            <div class="product-meta-item"><span class="icon">🛡️</span> 2-year warranty included</div>
            <div class="product-meta-item"><span class="icon">📋</span> ${product.stock > 0 ? `<span style="color:var(--success-400)">${product.stock} in stock</span>` : '<span style="color:var(--error-400)">Out of stock</span>'}</div>
          </div>
        </div>
      </div>

      <div class="product-tabs">
        <div class="tabs">
          <button class="tab active" data-tab="description">Description</button>
          <button class="tab" data-tab="specs">Specifications</button>
          <button class="tab" data-tab="reviews">Reviews (${product.reviews})</button>
        </div>
        <div class="tab-content active" id="tab-description">
          <p style="line-height:1.8;color:var(--text-secondary)">${product.description}</p>
        </div>
        <div class="tab-content" id="tab-specs">
          <table style="width:100%;border-collapse:collapse">
            ${Object.entries(product.specs || {}).map(([k, v]) => `
              <tr style="border-bottom:1px solid var(--border-color)">
                <td style="padding:var(--space-3) var(--space-4);font-weight:600;width:40%">${k}</td>
                <td style="padding:var(--space-3) var(--space-4);color:var(--text-secondary)">${v}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        <div class="tab-content" id="tab-reviews">
          ${reviews.map(r => `
            <div class="review">
              <div class="review-header">
                <div class="review-author">
                  <div class="review-avatar">${r.name[0]}</div>
                  <div>
                    <div class="review-name">${r.name}</div>
                    <div class="review-date">${r.date}</div>
                  </div>
                </div>
                ${renderStars(r.rating)}
              </div>
              <p class="review-text">${r.text}</p>
            </div>
          `).join('')}
        </div>
      </div>

      ${related.length > 0 ? `
      <section style="margin-top:var(--space-16)">
        <div class="section-header">
          <h2>Related Products</h2>
          <a href="#/shop" class="view-all">View All →</a>
        </div>
        <div class="product-grid" id="related-grid">
          ${related.map(p => renderProductCard(p)).join('')}
        </div>
      </section>
      ` : ''}
    </div>
    ${renderFooter()}
  `;

  // Bind events after rendering
  setTimeout(() => {
    let qty = 1;

    // Thumbnails
    div.querySelectorAll('[data-thumb-idx]').forEach(thumb => {
      thumb.addEventListener('click', () => {
        div.querySelectorAll('.product-gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        document.getElementById('main-image').src = product.images[parseInt(thumb.dataset.thumbIdx)];
      });
    });

    // Quantity
    document.getElementById('qty-minus')?.addEventListener('click', () => {
      if (qty > 1) { qty--; document.getElementById('qty-value').textContent = qty; }
    });
    document.getElementById('qty-plus')?.addEventListener('click', () => {
      if (qty < product.stock) { qty++; document.getElementById('qty-value').textContent = qty; }
    });

    // Color options
    div.querySelectorAll('.color-option').forEach(opt => {
      opt.addEventListener('click', () => {
        div.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedColor = opt.dataset.color;
      });
    });

    // Size options
    div.querySelectorAll('.size-option').forEach(opt => {
      opt.addEventListener('click', () => {
        div.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedSize = opt.dataset.size;
      });
    });

    // Add to cart
    document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
      Store.addToCart(product, qty, selectedColor, selectedSize);
      showToast('Added to Cart', `${qty}x ${product.name}`, 'success');
    });

    // Wishlist
    document.getElementById('wishlist-toggle-btn')?.addEventListener('click', () => {
      const added = Store.toggleWishlist(product);
      const btn = document.getElementById('wishlist-toggle-btn');
      btn.classList.toggle('active', added);
      btn.innerHTML = added ? '❤️' : '🤍';
      showToast(added ? 'Added to Wishlist' : 'Removed', product.name, added ? 'success' : 'info');
    });

    // Tabs
    div.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        div.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        div.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab)?.classList.add('active');
      });
    });

    // Related products events
    const relGrid = document.getElementById('related-grid');
    if (relGrid) bindProductCardEvents(relGrid);
  }, 50);

  return div;
}
