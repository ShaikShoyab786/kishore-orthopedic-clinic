/* =============================================
   KISHORE ORTHOPEDIC CENTRE — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTreatmentTabs();
  initContactForm();
  initScrollAnimations();
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

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ---- Contact Form Submission ---- */
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

    // Simulate successful submission
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      if (successMsg) successMsg.style.display = 'block';
    }, 1200);
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
