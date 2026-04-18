// ============================================
// API — Mock Data Layer
// ============================================

let productsCache = null;

const API = {
  async getProducts() {
    if (productsCache) return productsCache;
    try {
      const res = await fetch('./data/products.json');
      productsCache = await res.json();
    } catch {
      productsCache = [];
    }
    return productsCache;
  },

  async getProduct(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === parseInt(id));
  },

  async getFiltered(filters = {}) {
    let products = [...(await this.getProducts())];
    if (filters.categories && filters.categories.length) {
      products = products.filter(p => filters.categories.includes(p.category));
    }
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= filters.maxPrice);
    }
    if (filters.minRating) {
      products = products.filter(p => p.rating >= filters.minRating);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    // Sort
    switch (filters.sort) {
      case 'price-low': products.sort((a, b) => a.price - b.price); break;
      case 'price-high': products.sort((a, b) => b.price - a.price); break;
      case 'rating': products.sort((a, b) => b.rating - a.rating); break;
      case 'newest': products.sort((a, b) => b.id - a.id); break;
      default: products.sort((a, b) => (b.tags?.includes('bestseller') ? 1 : 0) - (a.tags?.includes('bestseller') ? 1 : 0));
    }
    return products;
  },

  async search(query) {
    if (!query || query.length < 2) return [];
    const products = await this.getProducts();
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 6);
  },

  async getCategories() {
    const products = await this.getProducts();
    const cats = {};
    products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
    const icons = { Audio: '🎧', Wearables: '⌚', Footwear: '👟', Bags: '🎒', Accessories: '✨' };
    return Object.entries(cats).map(([name, count]) => ({ name, count, icon: icons[name] || '📦' }));
  },

  async getFeatured() {
    const products = await this.getProducts();
    return products.filter(p => p.tags?.includes('bestseller') || p.tags?.includes('trending')).slice(0, 8);
  },

  async getNewArrivals() {
    const products = await this.getProducts();
    return products.filter(p => p.tags?.includes('new')).slice(0, 4);
  },

  async getRelated(productId, category) {
    const products = await this.getProducts();
    return products.filter(p => p.category === category && p.id !== productId).slice(0, 4);
  }
};

export default API;
