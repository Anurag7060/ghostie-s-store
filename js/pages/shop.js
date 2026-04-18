// ============================================
// Shop Page
// ============================================

import API from '../api.js';
import Store from '../store.js';
import { renderProductCard, bindProductCardEvents } from '../components/productCard.js';
import { renderFilters, bindFilterEvents } from '../components/filters.js';
import { renderFooter } from './home.js';

export default async function renderShop() {
  const categories = await API.getCategories();
  const products = await API.getFiltered(Store.state.filters);

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>All Products</h2>
        <span style="color:var(--text-tertiary);font-size:var(--font-size-sm)">${products.length} products</span>
      </div>

      <div class="shop-layout">
        ${renderFilters(categories)}
        <div>
          <div id="active-filters" style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-4)"></div>
          <div class="product-grid" id="shop-grid">
            ${products.length > 0
              ? products.map(p => renderProductCard(p)).join('')
              : '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters</p></div>'
            }
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;

  bindProductCardEvents(div.querySelector('#shop-grid'));

  // After DOM is in place, bind filter events
  setTimeout(() => {
    bindFilterEvents(async () => {
      const filtered = await API.getFiltered(Store.state.filters);
      const grid = document.getElementById('shop-grid');
      if (grid) {
        grid.innerHTML = filtered.length > 0
          ? filtered.map(p => renderProductCard(p)).join('')
          : '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters</p></div>';
        bindProductCardEvents(grid);
      }
      // Update count
      const header = document.querySelector('.section-header span');
      if (header) header.textContent = `${filtered.length} products`;

      renderActiveTags();
    });

    renderActiveTags();
  }, 50);

  return div;
}

function renderActiveTags() {
  const container = document.getElementById('active-filters');
  if (!container) return;
  const f = Store.state.filters;
  let tags = '';
  f.categories.forEach(c => {
    tags += `<span class="tag tag-active">${c} <span class="tag-remove" data-remove-cat="${c}">✕</span></span>`;
  });
  if (f.maxPrice < 500) tags += `<span class="tag tag-active">Under $${f.maxPrice} <span class="tag-remove" data-remove-price>✕</span></span>`;
  if (f.minRating > 0) tags += `<span class="tag tag-active">${f.minRating}★+ <span class="tag-remove" data-remove-rating>✕</span></span>`;
  if (f.search) tags += `<span class="tag tag-active">"${f.search}" <span class="tag-remove" data-remove-search>✕</span></span>`;
  container.innerHTML = tags;

  container.addEventListener('click', async (e) => {
    const el = e.target;
    if (el.dataset.removeCat) {
      const cats = Store.state.filters.categories.filter(c => c !== el.dataset.removeCat);
      Store.setFilters({ categories: cats });
    } else if (el.dataset.removePrice !== undefined) {
      Store.setFilters({ maxPrice: 500 });
    } else if (el.dataset.removeRating !== undefined) {
      Store.setFilters({ minRating: 0 });
    } else if (el.dataset.removeSearch !== undefined) {
      Store.setFilters({ search: '' });
    } else return;

    // Re-render shop page
    const { default: renderShop } = await import('./shop.js');
    const app = document.getElementById('app');
    app.innerHTML = '';
    app.appendChild(await renderShop());
  });
}
