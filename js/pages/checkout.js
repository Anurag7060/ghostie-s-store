// ============================================
// Checkout Page
// ============================================

import Store from '../store.js';
import { showToast } from '../components/toast.js';
import { renderFooter } from './home.js';

let currentStep = 1;

export default function renderCheckout() {
  const cart = Store.state.cart;
  if (cart.length === 0) {
    const div = document.createElement('div');
    div.className = 'main-content container';
    div.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🛒</div><h3>Cart is Empty</h3><p>Add products before checkout.</p><a href="#/shop" class="btn btn-primary">Shop Now</a></div>';
    return div;
  }

  const subtotal = Store.getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const div = document.createElement('div');
  div.className = 'main-content';
  div.innerHTML = `
    <div class="container">
      <h2 style="margin-bottom:var(--space-8);text-align:center">Checkout</h2>
      <div class="steps" id="checkout-steps">
        <div class="step active"><span class="step-number">1</span><span class="step-label">Shipping</span></div>
        <div class="step-connector"></div>
        <div class="step"><span class="step-number">2</span><span class="step-label">Payment</span></div>
        <div class="step-connector"></div>
        <div class="step"><span class="step-number">3</span><span class="step-label">Review</span></div>
      </div>

      <div class="checkout-layout">
        <div id="checkout-form-container">
          ${renderShippingStep()}
        </div>
        <div class="order-summary">
          <h3>Order Summary</h3>
          ${cart.map(item => `
            <div style="display:flex;gap:var(--space-3);padding:var(--space-2) 0;align-items:center">
              <img src="${item.image}" alt="" style="width:48px;height:48px;border-radius:var(--radius-sm);object-fit:cover">
              <div style="flex:1">
                <div style="font-size:var(--font-size-sm);font-weight:500">${item.name}</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary)">Qty: ${item.qty}</div>
              </div>
              <div style="font-weight:600;font-size:var(--font-size-sm)">$${(item.price * item.qty).toFixed(2)}</div>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="order-summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
          <div class="order-summary-row"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span></div>
          <div class="order-summary-total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `;

  setTimeout(() => bindCheckoutEvents(total), 50);
  return div;
}

function renderShippingStep() {
  return `
    <div class="checkout-form" id="step-shipping">
      <h3>Shipping Information</h3>
      <div class="form-grid">
        <div class="input-group">
          <label for="ship-first">First Name *</label>
          <input type="text" class="input" id="ship-first" required placeholder="John">
        </div>
        <div class="input-group">
          <label for="ship-last">Last Name *</label>
          <input type="text" class="input" id="ship-last" required placeholder="Doe">
        </div>
        <div class="input-group full-width">
          <label for="ship-email">Email *</label>
          <input type="email" class="input" id="ship-email" required placeholder="john@example.com">
        </div>
        <div class="input-group full-width">
          <label for="ship-address">Address *</label>
          <input type="text" class="input" id="ship-address" required placeholder="123 Main Street">
        </div>
        <div class="input-group">
          <label for="ship-city">City *</label>
          <input type="text" class="input" id="ship-city" required placeholder="New York">
        </div>
        <div class="input-group">
          <label for="ship-zip">ZIP Code *</label>
          <input type="text" class="input" id="ship-zip" required placeholder="10001">
        </div>
      </div>
      <button class="btn btn-primary btn-lg btn-block" id="to-payment" style="margin-top:var(--space-6)">Continue to Payment →</button>
    </div>
  `;
}

function renderPaymentStep() {
  return `
    <div class="checkout-form" id="step-payment">
      <h3>Payment Details</h3>
      <div class="form-grid">
        <div class="input-group full-width">
          <label for="card-number">Card Number *</label>
          <input type="text" class="input" id="card-number" placeholder="4242 4242 4242 4242" maxlength="19">
        </div>
        <div class="input-group">
          <label for="card-expiry">Expiry *</label>
          <input type="text" class="input" id="card-expiry" placeholder="MM/YY" maxlength="5">
        </div>
        <div class="input-group">
          <label for="card-cvv">CVV *</label>
          <input type="text" class="input" id="card-cvv" placeholder="123" maxlength="4">
        </div>
        <div class="input-group full-width">
          <label for="card-name">Name on Card *</label>
          <input type="text" class="input" id="card-name" placeholder="John Doe">
        </div>
      </div>
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-6)">
        <button class="btn btn-secondary" id="back-shipping">← Back</button>
        <button class="btn btn-primary btn-lg" id="to-review" style="flex:1">Review Order →</button>
      </div>
    </div>
  `;
}

function renderReviewStep(total) {
  return `
    <div class="checkout-form" id="step-review">
      <h3>Review & Place Order</h3>
      <p style="margin-bottom:var(--space-4);color:var(--text-secondary)">Please review your order details below.</p>
      <div class="product-meta">
        <div class="product-meta-item"><span class="icon">🔒</span> Secure 256-bit SSL encryption</div>
        <div class="product-meta-item"><span class="icon">📦</span> Estimated delivery: 3-5 business days</div>
        <div class="product-meta-item"><span class="icon">💰</span> Total: <strong>$${total.toFixed(2)}</strong></div>
      </div>
      <div style="display:flex;gap:var(--space-3);margin-top:var(--space-6)">
        <button class="btn btn-secondary" id="back-payment">← Back</button>
        <button class="btn btn-accent btn-lg" id="place-order" style="flex:1">🔒 Place Order — $${total.toFixed(2)}</button>
      </div>
    </div>
  `;
}

function updateSteps(step) {
  const steps = document.querySelectorAll('#checkout-steps .step');
  steps.forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 < step) s.classList.add('completed');
    else if (i + 1 === step) s.classList.add('active');
  });
}

function validateFields(ids) {
  let valid = true;
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      el?.classList.add('input-error');
      valid = false;
    } else {
      el?.classList.remove('input-error');
    }
  });
  if (!valid) showToast('Missing Fields', 'Please fill in all required fields', 'error');
  return valid;
}

function bindCheckoutEvents(total) {
  const container = document.getElementById('checkout-form-container');

  container?.addEventListener('click', (e) => {
    if (e.target.id === 'to-payment') {
      if (!validateFields(['ship-first', 'ship-last', 'ship-email', 'ship-address', 'ship-city', 'ship-zip'])) return;
      container.innerHTML = renderPaymentStep();
      updateSteps(2);
    }
    if (e.target.id === 'back-shipping') {
      container.innerHTML = renderShippingStep();
      updateSteps(1);
    }
    if (e.target.id === 'to-review') {
      if (!validateFields(['card-number', 'card-expiry', 'card-cvv', 'card-name'])) return;
      container.innerHTML = renderReviewStep(total);
      updateSteps(3);
    }
    if (e.target.id === 'back-payment') {
      container.innerHTML = renderPaymentStep();
      updateSteps(2);
    }
    if (e.target.id === 'place-order') {
      e.target.disabled = true;
      e.target.innerHTML = '<div class="spinner" style="margin:0 auto"></div>';
      setTimeout(() => {
        const order = Store.placeOrder({ name: 'Customer' });
        const app = document.getElementById('app');
        app.innerHTML = `
          <div class="main-content container">
            <div class="order-success">
              <div class="success-icon">✓</div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for your purchase. Your order has been placed successfully.</p>
              <div class="order-number">${order.id}</div>
              <p style="color:var(--text-tertiary);font-size:var(--font-size-sm)">A confirmation email will be sent shortly.</p>
              <div style="display:flex;gap:var(--space-4);justify-content:center;margin-top:var(--space-8)">
                <a href="#/" class="btn btn-primary btn-lg">Continue Shopping</a>
                <a href="#/account" class="btn btn-secondary btn-lg">View Orders</a>
              </div>
            </div>
          </div>
        `;
      }, 1500);
    }
  });
}
