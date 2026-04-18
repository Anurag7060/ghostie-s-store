// ============================================
// Cart Drawer Component
// ============================================

import Store from '../store.js';

let isOpen = false;

export function openCartDrawer() {
  if (isOpen) return;
  isOpen = true;
  renderCartDrawer();
}

export function closeCartDrawer() {
  if (!isOpen) return;
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  overlay?.classList.add('closing');
  drawer?.classList.add('closing');
  setTimeout(() => {
    overlay?.remove();
    drawer?.remove();
    isOpen = false;
  }, 300);
}

export function renderCartDrawer() {
  // Remove existing
  document.getElementById('cart-drawer-overlay')?.remove();
  document.getElementById('cart-drawer')?.remove();

  const cart = Store.state.cart;
  const total = Store.getCartTotal();

  const overlay = document.createElement('div');
  overlay.id = 'cart-drawer-overlay';
  overlay.className = 'drawer-overlay';
  overlay.onclick = closeCartDrawer;

  const drawer = document.createElement('div');
  drawer.id = 'cart-drawer';
  drawer.className = 'cart-drawer';
  drawer.innerHTML = `
    <div class="cart-drawer-header">
      <h3>🛒 Cart (${cart.length})</h3>
      <button class="action-btn" onclick="document.getElementById('cart-drawer-overlay').click()" aria-label="Close cart">✕</button>
    </div>
    <div class="cart-drawer-items">
      ${cart.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>Cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      ` : cart.map(item => `
        <div class="cart-drawer-item">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          <div class="cart-drawer-item-info">
            <div class="cart-drawer-item-name">${item.name}</div>
            <div class="qty-selector">
              <button data-qty-minus="${item.id}" data-color="${item.selectedColor}" data-size="${item.selectedSize}">−</button>
              <span>${item.qty}</span>
              <button data-qty-plus="${item.id}" data-color="${item.selectedColor}" data-size="${item.selectedSize}">+</button>
            </div>
            <div class="cart-drawer-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
          <span class="cart-drawer-item-remove" data-remove-id="${item.id}" data-color="${item.selectedColor}" data-size="${item.selectedSize}">✕</span>
        </div>
      `).join('')}
    </div>
    ${cart.length > 0 ? `
      <div class="cart-drawer-footer">
        <div class="cart-drawer-total">
          <span class="label">Subtotal</span>
          <span class="amount">$${total.toFixed(2)}</span>
        </div>
        <a href="#/cart" class="btn btn-secondary btn-block" onclick="document.getElementById('cart-drawer-overlay').click()">View Cart</a>
        <a href="#/checkout" class="btn btn-primary btn-block" onclick="document.getElementById('cart-drawer-overlay').click()">Checkout</a>
      </div>
    ` : ''}
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  // Bind events inside drawer
  drawer.addEventListener('click', (e) => {
    const minus = e.target.closest('[data-qty-minus]');
    const plus = e.target.closest('[data-qty-plus]');
    const remove = e.target.closest('[data-remove-id]');

    if (minus) {
      const id = parseInt(minus.dataset.qtyMinus);
      const item = cart.find(i => i.id === id);
      if (item && item.qty > 1) {
        Store.updateQty(id, item.qty - 1, minus.dataset.color, minus.dataset.size);
        renderCartDrawer();
      }
    }
    if (plus) {
      const id = parseInt(plus.dataset.qtyPlus);
      const item = cart.find(i => i.id === id);
      if (item) {
        Store.updateQty(id, item.qty + 1, plus.dataset.color, plus.dataset.size);
        renderCartDrawer();
      }
    }
    if (remove) {
      Store.removeFromCart(parseInt(remove.dataset.removeId), remove.dataset.color, remove.dataset.size);
      renderCartDrawer();
    }
  });
}

export function initCartDrawer() {
  Store.on('toggle-cart-drawer', () => {
    if (isOpen) closeCartDrawer();
    else openCartDrawer();
  });
}

export default { openCartDrawer, closeCartDrawer, initCartDrawer };
