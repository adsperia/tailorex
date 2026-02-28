/**
 * TailoRex — Shared UI Components
 * Injects navbar and footer into every page.
 */

(function () {
  // ——— Header ———
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  const currentPage = '/' + (window.location.pathname.split('/').pop().replace('.html', '') || '');

  function isActive(href) {
    return currentPage === href || (currentPage === '/index' && href === '/');
  }

  function navLinkClass(href, mobile) {
    const base = mobile
      ? 'px-4 py-3 rounded-lg text-sm font-medium transition-colors'
      : 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200';
    return isActive(href)
      ? `${base} text-primary bg-primary/10`
      : `${base} text-muted-foreground hover:text-foreground hover:bg-muted`;
  }

  function buildHeader() {
    const desktopLinks = navLinks
      .map((l) => `<a class="${navLinkClass(l.href, false)}" href="${l.href}">${l.label}</a>`)
      .join('');

    const mobileLinks = navLinks
      .map((l) => `<a class="${navLinkClass(l.href, true)}" href="${l.href}">${l.label}</a>`)
      .join('');

    return `
      <header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-sm py-5">
        <div class="container mx-auto px-4 flex items-center justify-between">
          <a class="relative z-10" href="/">
            <img src="assets/tailorex-logo.png" alt="TailorEx" class="h-10 transition-all duration-300">
          </a>
          <nav class="hidden md:flex items-center gap-1">
            ${desktopLinks}
            <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elevated h-9 rounded-md px-4 ml-4" href="/contact">Get Started</a>
          </nav>
          <button id="mobile-menu-btn" class="md:hidden p-2 rounded-lg transition-colors text-foreground hover:bg-muted" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div id="mobile-menu" class="md:hidden absolute top-full left-0 right-0 bg-white backdrop-blur-lg border-b border-border shadow-elevated transition-all duration-300 overflow-hidden max-h-0 opacity-0">
          <nav class="container mx-auto px-4 py-4 flex flex-col gap-2">
            ${mobileLinks}
            <a class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elevated h-11 px-6 py-2 mt-2" href="/contact">Get Started</a>
          </nav>
        </div>
      </header>`;
  }

  const navbarEl = document.getElementById('navbar');
  if (navbarEl) navbarEl.innerHTML = buildHeader();

  // Mobile toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('menu-open');
      if (isOpen) {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.style.opacity = '1';
      } else {
        mobileMenu.style.maxHeight = '0';
        mobileMenu.style.opacity = '0';
      }
    });
  }

  // ——— Footer ———
  function buildFooter() {
    const year = new Date().getFullYear();
    return `
      <footer class="py-12 bg-hero-gradient text-primary-foreground">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <img src="assets/tailorex-logo-white.png" alt="TailorEx" class="h-10">
              <div>
                <p class="text-sm text-primary-foreground/70">Enterprise Technology Solutions</p>
              </div>
            </div>
            <div class="flex flex-wrap justify-center gap-6 text-sm">
              <a href="/services" class="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Services</a>
              <a href="/about" class="text-primary-foreground/70 hover:text-primary-foreground transition-colors">About Us</a>
              <a href="/contact" class="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
              <a href="/privacy" class="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy Policy</a>
            </div>
            <p class="text-sm text-primary-foreground/50">&copy; ${year} TailorEx. All rights reserved.</p>
          </div>
        </div>
      </footer>`;
  }

  const footerEl = document.getElementById('footer');
  if (footerEl) footerEl.innerHTML = buildFooter();
})();
