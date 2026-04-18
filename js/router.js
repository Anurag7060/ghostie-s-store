// ============================================
// Router — Hash-based SPA Router
// ============================================

const Router = {
  routes: {},
  currentRoute: null,

  register(path, handler) {
    this.routes[path] = handler;
  },

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  },

  navigate(path) {
    window.location.hash = path;
  },

  async resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const app = document.getElementById('app');

    // Match routes
    let matched = null;
    let params = {};

    for (const pattern in this.routes) {
      const regex = this.pathToRegex(pattern);
      const result = hash.match(regex);
      if (result) {
        matched = this.routes[pattern];
        const keys = (pattern.match(/:(\w+)/g) || []).map(k => k.slice(1));
        keys.forEach((key, i) => { params[key] = result[i + 1]; });
        break;
      }
    }

    if (!matched) {
      matched = this.routes['/'] || (() => '<h1>404 — Page Not Found</h1>');
    }

    // Page transition
    if (app) {
      app.classList.remove('page-enter');
      app.classList.add('page-exit');
      await new Promise(r => setTimeout(r, 150));
      app.innerHTML = '';
      const content = await matched(params);
      if (typeof content === 'string') {
        app.innerHTML = content;
      } else if (content instanceof HTMLElement) {
        app.appendChild(content);
      }
      app.classList.remove('page-exit');
      app.classList.add('page-enter');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.currentRoute = hash;
      this.updateActiveLinks(hash);
    }
  },

  pathToRegex(path) {
    const pattern = path.replace(/:(\w+)/g, '([^/]+)');
    return new RegExp('^' + pattern + '$');
  },

  updateActiveLinks(hash) {
    document.querySelectorAll('[data-nav]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + hash || (hash === '/' && href === '#/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

export default Router;
