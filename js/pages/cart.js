// ============================================
// Cart Page
// ============================================

import Store from '../store.js';
import { showToast } from '../components/toast.js';
import { renderFooter } from './home.js';

export default function renderCart() {
  const cart = Store.state.cart;
  const subtotal = Store.getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <div class="container">
      <div class="section-header">
        <h2>Shopping Cart</h2>
        <span style="color:var(--text-tertiary);font-size:var(--font-size-sm)">${cart.length} items</span>
      </div>

      ${cart.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <a href="#/shop" class="btn btn-primary btn-lg">Start Shopping</a>
        </div>
      ` : `
        <div class="cart-page">
          <div class="cart-items" id="cart-items">
            ${cart.map(item => `
              <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image" onclick="location.hash='#/product/${item.id}'">
                  <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                  <a href="#/product/${item.id}" class="cart-item-name" style="text-decoration:none;color:var(--text-primary)">${item.name}</a>
                  <div class="cart-item-variant">${item.selectedSize ? 'Size: ' + item.selectedSize : ''} ${item.selectedColor ? '• Color selected' : ''}</div>
                  <div class="cart-item-bottom">
                    <div class="qty-selector">
                      <button data-cart-minus="${item.id}">−</button>
                      <span>${item.qty}</span>
                      <button data-cart-plus="${item.id}">+</button>
                    </div>
                    <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
                    <button class="cart-item-remove" data-cart-remove="${item.id}">Remove</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-summary-row">
              <span>Subtotal</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="order-summary-row">
              <span>Shipping</span>
              <span>${shipping === 0 ? '<span style="color:var(--success-400)">FREE</span>' : '$' + shipping.toFixed(2)}</span>
            </div>

            <div class="coupon-input">
              <input type="text" class="input" placeholder="Coupon code" id="coupon-input">
              <button class="btn btn-secondary" id="apply-coupon">Apply</button>
            </div>
            <div id="coupon-msg" style="font-size:var(--font-size-xs);margin-bottom:var(--space-2)"></div>

            <div class="order-summary-total">
              <span>Total</span>
              <span id="cart-total">$${total.toFixed(2)}</span>
            </div>

            <a href="#/checkout" class="btn btn-primary btn-block btn-lg" style="margin-top:var(--space-6)">Proceed to Checkout</a>
            <a href="#/shop" class="btn btn-ghost btn-block" style="margin-top:var(--space-2)">Continue Shopping</a>
          </div>
        </div>
      `}
    </div>
    ${renderFooter()}
  `;

  // Bind events
  setTimeout(() => {
    const container = document.getElementById('cart-items');
    container?.addEventListener('click', (e) => {
      const minus = e.target.closest('[data-cart-minus]');
      const plus = e.target.closest('[data-cart-plus]');
      const remove = e.target.closest('[data-cart-remove]');
      let needsRerender = false;

      if (minus) {
        const id = parseInt(minus.dataset.cartMinus);
        const item = Store.state.cart.find(i => i.id === id);
        if (item && item.qty > 1) { Store.updateQty(id, item.qty - 1); needsRerender = true; }
      }
      if (plus) {
        const id = parseInt(plus.dataset.cartPlus);
        const item = Store.state.cart.find(i => i.id === id);
        if (item) { Store.updateQty(id, item.qty + 1); needsRerender = true; }
      }
      if (remove) {
        Store.removeFromCart(parseInt(remove.dataset.cartRemove));
        showToast('Removed', 'Item removed from cart', 'info');
        needsRerender = true;
      }

      if (needsRerender) {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(renderCart());
      }
    });

    // Coupon
    document.getElementById('apply-coupon')?.addEventListener('click', () => {
      const code = document.getElementById('coupon-input')?.value?.trim().toUpperCase();
      const msg = document.getElementById('coupon-msg');
      if (code === 'SAVE10') {
        const disc = subtotal * 0.1;
        const newTotal = subtotal - disc + shipping;
        document.getElementById('cart-total').textContent = '$' + newTotal.toFixed(2);
        msg.innerHTML = `<span style="color:var(--success-400)">✓ Code applied! You save $${disc.toFixed(2)}</span>`;
      } else {
        msg.innerHTML = `<span style="color:var(--error-400)">Invalid coupon code. Try "SAVE10"</span>`;
      }
    });
  }, 50);

  return div;
}
