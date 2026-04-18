// ============================================
// Filters Component
// ============================================

import Store from '../store.js';

export function renderFilters(categories) {
  const f = Store.state.filters;
  return `
    <aside class="filter-sidebar" id="filter-sidebar">
      <div class="filter-section">
        <h4>Categories</h4>
        ${categories.map(c => `
          <label class="filter-option">
            <input type="checkbox" value="${c.name}" ${f.categories.includes(c.name) ? 'checked' : ''} data-filter-cat>
            ${c.icon} ${c.name}
            <span class="count">${c.count}</span>
          </label>
        `).join('')}
      </div>
      <div class="filter-section">
        <h4>Max Price</h4>
        <div class="price-range">
          <input type="range" min="10" max="500" value="${f.maxPrice}" id="price-range" step="10">
          <div class="price-range-labels">
            <span>$10</span>
            <span id="price-value">$${f.maxPrice}</span>
          </div>
        </div>
      </div>
      <div class="filter-section">
        <h4>Min Rating</h4>
        ${[4, 3, 2, 1].map(r => `
          <label class="filter-option">
            <input type="checkbox" value="${r}" ${f.minRating === r ? 'checked' : ''} data-filter-rating>
            ${'★'.repeat(r)}${'☆'.repeat(5 - r)} & up
          </label>
        `).join('')}
      </div>
      <div class="filter-section">
        <h4>Sort By</h4>
        <select class="select" id="sort-select">
          <option value="featured" ${f.sort === 'featured' ? 'selected' : ''}>Featured</option>
          <option value="price-low" ${f.sort === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
          <option value="price-high" ${f.sort === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
          <option value="rating" ${f.sort === 'rating' ? 'selected' : ''}>Highest Rated</option>
          <option value="newest" ${f.sort === 'newest' ? 'selected' : ''}>Newest</option>
        </select>
      </div>
      <button class="btn btn-ghost btn-block btn-sm" id="clear-filters">Clear All Filters</button>
    </aside>
  `;
}

export function bindFilterEvents(callback) {
  // Category checkboxes
  document.querySelectorAll('[data-filter-cat]').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('[data-filter-cat]:checked')].map(c => c.value);
      Store.setFilters({ categories: checked });
      callback();
    });
  });

  // Price range
  document.getElementById('price-range')?.addEventListener('input', (e) => {
    document.getElementById('price-value').textContent = '$' + e.target.value;
    Store.setFilters({ maxPrice: parseInt(e.target.value) });
    callback();
  });

  // Rating
  document.querySelectorAll('[data-filter-rating]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      document.querySelectorAll('[data-filter-rating]').forEach(c => { if (c !== e.target) c.checked = false; });
      Store.setFilters({ minRating: e.target.checked ? parseInt(e.target.value) : 0 });
      callback();
    });
  });

  // Sort
  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    Store.setFilters({ sort: e.target.value });
    callback();
  });

  // Clear
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    Store.resetFilters();
    callback();
  });
}

export default { renderFilters, bindFilterEvents };
