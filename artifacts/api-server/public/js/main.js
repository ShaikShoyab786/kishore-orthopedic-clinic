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

    let waText = `Hello Kishore Orthopedic Clinic,\n\n`;
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
