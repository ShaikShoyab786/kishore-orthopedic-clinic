/* =============================================
   KISHORE ORTHOPEDIC CENTRE — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTreatmentTabs();
  initContactForm();
  initScrollAnimations();
  initTestimonialCarousel();
});

/* ---- Sticky Navbar + Hamburger ---- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu?.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when nav link is clicked
  navMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar?.contains(e.target)) {
      hamburger?.classList.remove('open');
      navMenu?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---- Treatment Category Tabs ---- */
function initTreatmentTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.treatment-card');
  const dividers = document.querySelectorAll('.category-divider');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide individual cards
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });

      // Show/hide category dividers based on data-show-for attribute
      dividers.forEach(divider => {
        const showFor = (divider.dataset.showFor || '').split(' ');
        if (showFor.includes(category)) {
          divider.classList.remove('hidden');
        } else {
          divider.classList.add('hidden');
        }
      });

      // Show/hide entire grid sections
      const gridMap = {
        treatmentsGrid:  ['all', 'surgical'],
        nonSurgicalGrid: ['all', 'non-surgical'],
        rehabGrid:       ['all', 'rehab'],
      };
      Object.entries(gridMap).forEach(([id, allowedTabs]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (allowedTabs.includes(category)) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
    });
  });
}

/* ---- Contact Form → WhatsApp Redirect ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('input-error');
        const errMsg = document.createElement('span');
        errMsg.className = 'field-error';
        errMsg.textContent = 'This field is required.';
        field.parentNode.appendChild(errMsg);
      }
    });

    if (!isValid) return;

    // Build patient details from form fields
    const firstName  = (form.querySelector('#firstName')?.value  || '').trim();
    const lastName   = (form.querySelector('#lastName')?.value   || '').trim();
    const phone      = (form.querySelector('#phone')?.value      || '').trim();
    const department = (form.querySelector('#department')?.value || '').trim();
    const message    = (form.querySelector('#message')?.value    || '').trim();

    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    let waText = `Hello Kishore Orthopedic Centre,\n\n`;
    waText += `Name: ${fullName}\n`;
    waText += `Phone: ${phone}\n`;
    if (department) waText += `Department: ${department}\n`;
    waText += `\nMessage:\n${message}\n\n`;
    waText += `I would like to contact the clinic.`;

    const waUrl = `https://wa.me/917093571238?text=${encodeURIComponent(waText)}`;

    // Show brief sending state then open WhatsApp
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Opening WhatsApp...';
    submitBtn.disabled = true;

    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    }, 600);
  });
}

/* ---- Scroll Reveal Animations ---- */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.card, .doctor-card, .treatment-card, .testimonial-card, .value-card, .stat-box, .timeline-item, .accreditation-card, .step'
  );

  if (!elements.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ---- Testimonial Carousel ---- */
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const wrapper = carousel.querySelector('.carousel-track-wrapper');
  const track   = carousel.querySelector('.carousel-track');
  const cards   = Array.from(track.querySelectorAll('.testimonial-card'));
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dotsEl  = carousel.querySelector('.carousel-dots');

  const total = cards.length;
  if (total === 0) return;

  let current   = 0;
  let autoTimer = null;

  function getPerView() {
    if (window.innerWidth >= 900) return Math.min(3, total);
    if (window.innerWidth >= 580) return Math.min(2, total);
    return 1;
  }

  function getMaxIndex() {
    return Math.max(0, total - getPerView());
  }

  function layout() {
    const pv       = getPerView();
    const gap      = 24; // px (matches 1.5rem at 16px base)
    const width    = wrapper.offsetWidth;
    const cardW    = (width - gap * (pv - 1)) / pv;

    cards.forEach(card => {
      card.style.width    = cardW + 'px';
      card.style.minWidth = cardW + 'px';
    });

    track.style.gap = gap + 'px';
    applyTransform(cardW, gap);
    buildDots();
    updateButtons();
  }

  function applyTransform(cardW, gap) {
    const offset = current * (cardW + gap);
    track.style.transform = 'translateX(-' + offset + 'px)';
  }

  function goTo(index) {
    const max = getMaxIndex();
    current = Math.max(0, Math.min(index, max));
    const pv   = getPerView();
    const gap  = 24;
    const w    = wrapper.offsetWidth;
    const cardW = (w - gap * (pv - 1)) / pv;
    applyTransform(cardW, gap);
    updateDots();
    updateButtons();
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    const max = getMaxIndex();
    for (let i = 0; i <= max; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
      dotsEl.appendChild(btn);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= getMaxIndex();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      const max = getMaxIndex();
      goTo(current >= max ? 0 : current + 1);
    }, 5000);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  prevBtn?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch / swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { current = Math.min(current, getMaxIndex()); layout(); }, 200);
  });

  layout();
  startAuto();
}
