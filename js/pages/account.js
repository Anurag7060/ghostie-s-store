// ============================================
// Account Page (Login/Register + Dashboard)
// ============================================

import Store from '../store.js';
import { showToast } from '../components/toast.js';
import { renderFooter } from './home.js';

export default function renderAccount() {
  const user = Store.state.user;
  const div = document.createElement('div');
  div.className = 'main-content';

  if (!user) {
    div.innerHTML = `
      <div class="container">
        <div class="auth-container">
          <div class="auth-card" id="auth-card">
            ${renderLoginForm()}
          </div>
        </div>
      </div>
      ${renderFooter()}
    `;
  } else {
    const orders = Store.state.orders;
    div.innerHTML = `
      <div class="container">
        <div class="section-header">
          <h2>My Account</h2>
          <button class="btn btn-ghost" id="logout-btn">Logout</button>
        </div>
        <div class="account-grid">
          <div class="account-sidebar">
            <div class="account-sidebar-item active" data-account-tab="orders">📦 Orders</div>
            <div class="account-sidebar-item" data-account-tab="settings">⚙️ Settings</div>
          </div>
          <div id="account-content">
            <div id="account-orders">
              <h3 style="margin-bottom:var(--space-6)">Order History</h3>
              ${orders.length === 0 ? `
                <div class="empty-state">
                  <div class="empty-state-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Your order history will appear here.</p>
                  <a href="#/shop" class="btn btn-primary">Start Shopping</a>
                </div>
              ` : orders.map(order => `
                <div class="order-card">
                  <div class="order-card-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                  <div style="font-size:var(--font-size-sm);color:var(--text-tertiary);margin-bottom:var(--space-3)">
                    ${new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-3)">
                    ${order.items.map(item => `
                      <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;border-radius:var(--radius-sm);object-fit:cover" title="${item.name}">
                    `).join('')}
                  </div>
                  <div style="font-weight:600">Total: $${order.total.toFixed(2)}</div>
                </div>
              `).join('')}
            </div>
            <div id="account-settings" style="display:none">
              <h3 style="margin-bottom:var(--space-6)">Account Settings</h3>
              <div class="checkout-form" style="max-width:500px">
                <div class="input-group" style="margin-bottom:var(--space-4)">
                  <label>Name</label>
                  <input type="text" class="input" value="${user.name}" id="setting-name">
                </div>
                <div class="input-group" style="margin-bottom:var(--space-4)">
                  <label>Email</label>
                  <input type="email" class="input" value="${user.email}" id="setting-email" disabled>
                </div>
                <div class="input-group" style="margin-bottom:var(--space-6)">
                  <label>Member since</label>
                  <input type="text" class="input" value="${new Date(user.joinDate).toLocaleDateString()}" disabled>
                </div>
                <button class="btn btn-primary" id="save-settings">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${renderFooter()}
    `;
  }

  setTimeout(() => {
    // Auth form toggling
    document.getElementById('toggle-register')?.addEventListener('click', () => {
      document.getElementById('auth-card').innerHTML = renderRegisterForm();
      bindAuthEvents();
    });

    bindAuthEvents();

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      Store.logout();
      showToast('Logged Out', 'See you again!', 'info');
      location.hash = '#/account';
    });

    // Account tabs
    document.querySelectorAll('[data-account-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.account-sidebar-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('account-orders').style.display = tab.dataset.accountTab === 'orders' ? 'block' : 'none';
        document.getElementById('account-settings').style.display = tab.dataset.accountTab === 'settings' ? 'block' : 'none';
      });
    });

    // Save settings
    document.getElementById('save-settings')?.addEventListener('click', () => {
      const name = document.getElementById('setting-name')?.value;
      if (name && Store.state.user) {
        Store.state.user.name = name;
        Store.save();
        showToast('Saved', 'Settings updated', 'success');
      }
    });
  }, 50);

  return div;
}

function renderLoginForm() {
  return `
    <h2>Welcome Back</h2>
    <p class="subtitle">Sign in to your account</p>
    <div class="input-group" style="margin-bottom:var(--space-4)">
      <label for="login-email">Email</label>
      <input type="email" class="input" id="login-email" placeholder="you@example.com">
    </div>
    <div class="input-group" style="margin-bottom:var(--space-6)">
      <label for="login-password">Password</label>
      <input type="password" class="input" id="login-password" placeholder="••••••••">
    </div>
    <button class="btn btn-primary btn-block btn-lg" id="login-btn">Sign In</button>
    <div class="auth-toggle">
      Don't have an account? <a id="toggle-register">Sign Up</a>
    </div>
  `;
}

function renderRegisterForm() {
  return `
    <h2>Create Account</h2>
    <p class="subtitle">Join Ghostie's Store today</p>
    <div class="input-group" style="margin-bottom:var(--space-4)">
      <label for="reg-name">Full Name</label>
      <input type="text" class="input" id="reg-name" placeholder="John Doe">
    </div>
    <div class="input-group" style="margin-bottom:var(--space-4)">
      <label for="reg-email">Email</label>
      <input type="email" class="input" id="reg-email" placeholder="you@example.com">
    </div>
    <div class="input-group" style="margin-bottom:var(--space-6)">
      <label for="reg-password">Password</label>
      <input type="password" class="input" id="reg-password" placeholder="••••••••">
    </div>
    <button class="btn btn-primary btn-block btn-lg" id="register-btn">Create Account</button>
    <div class="auth-toggle">
      Already have an account? <a id="toggle-login">Sign In</a>
    </div>
  `;
}

function bindAuthEvents() {
  document.getElementById('login-btn')?.addEventListener('click', () => {
    const email = document.getElementById('login-email')?.value;
    const pw = document.getElementById('login-password')?.value;
    if (!email || !pw) { showToast('Error', 'Please fill in all fields', 'error'); return; }
    Store.login(email);
    showToast('Welcome!', `Signed in as ${email}`, 'success');
    location.hash = '#/account';
  });

  document.getElementById('register-btn')?.addEventListener('click', () => {
    const name = document.getElementById('reg-name')?.value;
    const email = document.getElementById('reg-email')?.value;
    const pw = document.getElementById('reg-password')?.value;
    if (!name || !email || !pw) { showToast('Error', 'Please fill in all fields', 'error'); return; }
    Store.login(email, name);
    showToast('Welcome!', `Account created for ${name}`, 'success');
    location.hash = '#/account';
  });

  document.getElementById('toggle-login')?.addEventListener('click', () => {
    document.getElementById('auth-card').innerHTML = renderLoginForm();
    bindAuthEvents();
  });

  document.getElementById('toggle-register')?.addEventListener('click', () => {
    document.getElementById('auth-card').innerHTML = renderRegisterForm();
    bindAuthEvents();
  });
}
