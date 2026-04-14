/* =============================================
   SCHOOL WEBSITE - MAIN JAVASCRIPT
   ============================================= */

/* =============================================
   1. NAVBAR — Scroll Effect & Hamburger
   ============================================= */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  /* Scroll: add .scrolled class after 60px */
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.remove('transparent');
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.add('transparent');
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  /* Hamburger toggle */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    /* Close mobile menu when a link is tapped */
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Highlight active nav link based on current page */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && href === currentPage) {
      link.classList.add('active');
    }
  });
})();


/* =============================================
   2. SCROLL ANIMATIONS — IntersectionObserver
   ============================================= */
(function initScrollAnimations() {
  const targets = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();


/* =============================================
   3. COUNTER ANIMATION — Hero Stats
   ============================================= */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
})();


/* =============================================
   4. GALLERY LIGHTBOX
   ============================================= */
(function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const closeBtn    = document.getElementById('lightbox-close');
  const prevBtn     = document.getElementById('lightbox-prev');
  const nextBtn     = document.getElementById('lightbox-next');

  if (!lightbox) return;

  let allItems = [];
  let currentIndex = 0;

  /* Gather all gallery items on the page */
  function refreshItems() {
    allItems = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  }

  function openLightbox(index) {
    refreshItems();
    currentIndex = index;
    const item = allItems[currentIndex];
    if (!item) return;
    lightboxImg.src = item.dataset.src;
    lightboxImg.alt = item.dataset.caption || '';
    lightboxCap.textContent = item.dataset.caption || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function showNext() {
    refreshItems();
    currentIndex = (currentIndex + 1) % allItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    refreshItems();
    currentIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    openLightbox(currentIndex);
  }

  /* Open on gallery item click */
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item[data-src]');
    if (item) {
      refreshItems();
      openLightbox(allItems.indexOf(item));
    }
  });

  if (closeBtn)  closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn)   nextBtn.addEventListener('click', showNext);
  if (prevBtn)   prevBtn.addEventListener('click', showPrev);

  /* Close on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* Keyboard controls */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  showNext();
    if (e.key === 'ArrowLeft')   showPrev();
  });
})();


/* =============================================
   5. GALLERY FILTER
   ============================================= */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* Active button state */
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const category = btn.dataset.filter;
      const items = document.querySelectorAll('.gallery-item');

      items.forEach(function (item) {
        const match = category === 'all' || item.dataset.category === category;
        item.style.display = match ? '' : 'none';
      });
    });
  });
})();


/* =============================================
   6. SMOOTH SCROLL for anchor links
   ============================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90; // account for fixed navbar
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();


/* =============================================
   7. CONTACT FORM — basic validation feedback
   ============================================= */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    /* Simulate submission delay */
    setTimeout(function () {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#16a34a';
      form.reset();
      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1200);
  });
})();


/* =============================================
   8. MOBILE SUBMENU TOGGLE
   ============================================= */
(function initMobileSubmenus() {
  document.querySelectorAll('.mobile-section-title').forEach(function (title) {
    title.addEventListener('click', function () {
      const submenu = this.nextElementSibling;
      if (submenu) {
        const isOpen = submenu.style.display === 'block';
        submenu.style.display = isOpen ? 'none' : 'block';
        this.textContent = (isOpen ? '▸ ' : '▾ ') + this.textContent.replace(/^[▸▾]\s/, '');
      }
    });
  });
})();


/* =============================================
   9. DOCUMENT TABLE — search / filter
   ============================================= */
(function initDocsSearch() {
  const searchInput = document.getElementById('docs-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.docs-table tbody tr').forEach(function (row) {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  });
})();
