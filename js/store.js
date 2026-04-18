// ============================================
// Store — State Management with Events
// ============================================

const Store = {
  state: {
    cart: [],
    wishlist: [],
    user: null,
    orders: [],
    theme: 'dark',
    filters: { categories: [], maxPrice: 500, minRating: 0, sort: 'featured', search: '' }
  },

  listeners: {},

  init() {
    const saved = localStorage.getItem('ghosties_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state.cart = parsed.cart || [];
        this.state.wishlist = parsed.wishlist || [];
        this.state.user = parsed.user || null;
        this.state.orders = parsed.orders || [];
        this.state.theme = parsed.theme || 'dark';
      } catch (e) { /* ignore */ }
    }
    document.documentElement.setAttribute('data-theme', this.state.theme);
  },

  save() {
    localStorage.setItem('ghosties_state', JSON.stringify({
      cart: this.state.cart,
      wishlist: this.state.wishlist,
      user: this.state.user,
      orders: this.state.orders,
      theme: this.state.theme
    }));
  },

  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  },

  emit(event, data) {
    (this.listeners[event] || []).forEach(fn => fn(data));
  },

  // Cart
  addToCart(product, qty = 1, selectedColor = null, selectedSize = null) {
    const existing = this.state.cart.find(i =>
      i.id === product.id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
    );
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock || 99);
    } else {
      this.state.cart.push({ ...product, qty, selectedColor, selectedSize });
    }
    this.save();
    this.emit('cart-updated', this.state.cart);
  },

  removeFromCart(id, selectedColor, selectedSize) {
    this.state.cart = this.state.cart.filter(i =>
      !(i.id === id && i.selectedColor === selectedColor && i.selectedSize === selectedSize)
    );
    this.save();
    this.emit('cart-updated', this.state.cart);
  },

  updateQty(id, qty, selectedColor, selectedSize) {
    const item = this.state.cart.find(i =>
      i.id === id && i.selectedColor === selectedColor && i.selectedSize === selectedSize
    );
    if (item) {
      item.qty = Math.max(1, Math.min(qty, item.stock || 99));
      this.save();
      this.emit('cart-updated', this.state.cart);
    }
  },

  clearCart() {
    this.state.cart = [];
    this.save();
    this.emit('cart-updated', this.state.cart);
  },

  getCartTotal() {
    return this.state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  getCartCount() {
    return this.state.cart.reduce((sum, i) => sum + i.qty, 0);
  },

  // Wishlist
  toggleWishlist(product) {
    const idx = this.state.wishlist.findIndex(i => i.id === product.id);
    if (idx > -1) {
      this.state.wishlist.splice(idx, 1);
    } else {
      this.state.wishlist.push(product);
    }
    this.save();
    this.emit('wishlist-updated', this.state.wishlist);
    return idx === -1; // true if added
  },

  isInWishlist(id) {
    return this.state.wishlist.some(i => i.id === id);
  },

  // Auth
  login(email, name) {
    this.state.user = { email, name: name || email.split('@')[0], joinDate: new Date().toISOString() };
    this.save();
    this.emit('auth-changed', this.state.user);
  },

  logout() {
    this.state.user = null;
    this.save();
    this.emit('auth-changed', null);
  },

  // Orders
  placeOrder(shippingInfo) {
    const order = {
      id: 'NM-' + Date.now().toString(36).toUpperCase(),
      items: [...this.state.cart],
      total: this.getCartTotal(),
      shipping: shippingInfo,
      status: 'processing',
      date: new Date().toISOString()
    };
    this.state.orders.unshift(order);
    this.clearCart();
    this.save();
    this.emit('order-placed', order);
    return order;
  },

  // Theme
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.state.theme);
    this.save();
    this.emit('theme-changed', this.state.theme);
  },

  // Filters
  setFilters(filters) {
    Object.assign(this.state.filters, filters);
    this.emit('filters-changed', this.state.filters);
  },

  resetFilters() {
    this.state.filters = { categories: [], maxPrice: 500, minRating: 0, sort: 'featured', search: '' };
    this.emit('filters-changed', this.state.filters);
  }
};

export default Store;
