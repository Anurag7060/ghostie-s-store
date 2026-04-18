// ============================================
// App — Main Entry Point
// ============================================

import { injectSpeedInsights } from '@vercel/speed-insights';
import Store from './store.js';
import Router from './router.js';
import { renderHeader } from './components/header.js';
import { initCartDrawer } from './components/cartDrawer.js';

// Initialize Vercel Speed Insights
injectSpeedInsights();

// Initialize store
Store.init();

// Register routes
Router.register('/', async () => {
  const { default: renderHome } = await import('./pages/home.js');
  return await renderHome();
});

Router.register('/shop', async () => {
  const { default: renderShop } = await import('./pages/shop.js');
  return await renderShop();
});

Router.register('/product/:id', async (params) => {
  const { default: renderProduct } = await import('./pages/product.js');
  return await renderProduct(params);
});

Router.register('/cart', async () => {
  const { default: renderCart } = await import('./pages/cart.js');
  return renderCart();
});

Router.register('/checkout', async () => {
  const { default: renderCheckout } = await import('./pages/checkout.js');
  return renderCheckout();
});

Router.register('/account', async () => {
  const { default: renderAccount } = await import('./pages/account.js');
  return renderAccount();
});

Router.register('/wishlist', async () => {
  const { default: renderWishlist } = await import('./pages/wishlist.js');
  return renderWishlist();
});

// Initialize router
Router.init();

// Render header
renderHeader();

// Initialize cart drawer
initCartDrawer();

// Re-render header on cart/auth changes
Store.on('cart-updated', () => renderHeader());
Store.on('auth-changed', () => renderHeader());
Store.on('wishlist-updated', () => renderHeader());
