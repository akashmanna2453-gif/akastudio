const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const siteHeader = document.getElementById('siteHeader');
const pageLoader = document.getElementById('pageLoader');
const cursorDot = document.getElementById('cursorDot');
const whatsappButtons = document.querySelectorAll('[data-whatsapp]');
const fadeInElements = document.querySelectorAll('.fade-in');
const scaleInElements = document.querySelectorAll('.scale-in');
const accordionItems = document.querySelectorAll('.accordion-item');
const bgVideo = document.getElementById('bgVideo');

function toggleNav() {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  siteNav.classList.toggle('open');
}

function closeNav() {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', toggleNav);
window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeNav();
});

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 24;
  siteHeader.classList.toggle('scrolled', scrolled);
});

function revealOnScroll() {
  const revealOffset = window.innerHeight * 0.6;
  document.querySelectorAll('.fade-in, .scale-in').forEach((section, index) => {
    const top = section.getBoundingClientRect().top;
    if (top < revealOffset) {
      section.classList.add('visible');
      section.style.transitionDelay = `${index * 80}ms`;
    }
  });
}

function initAccordion() {
  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      accordionItems.forEach((other) => {
        other.setAttribute('aria-expanded', 'false');
      });
      item.setAttribute('aria-expanded', String(!isExpanded));
    });
  });
}

function initWhatsAppButtons() {
  whatsappButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const message = button.dataset.whatsapp;
      if (message) {
        event.preventDefault();
        const encoded = encodeURIComponent(message);
        window.location.href = `https://wa.me/919967590265?text=${encoded}`;
      }
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        event.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          closeNav();
        }
      }
    });
  });
}

function initCursor() {
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) {
    cursorDot.style.display = 'none';
    return;
  }

  document.addEventListener('mousemove', (event) => {
    cursorDot.style.opacity = '1';
    cursorDot.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });
}

function initLoadSequence() {
  setTimeout(() => {
    pageLoader.classList.add('hide');
  }, 700);
}

function prepareAnimations() {
  const heroElements = [
    document.querySelector('.site-header'),
    document.querySelector('.hero-badge'),
    document.querySelector('.hero h1'),
    document.querySelector('.hero p'),
    document.querySelector('.hero-actions'),
    document.querySelector('.hero-visual')
  ];

  heroElements.forEach((element, index) => {
    if (!element) return;
    const useScale = index === 5;
    element.classList.add(useScale ? 'scale-in' : 'fade-in');
    // Make hero actions (buttons) appear immediately so they are visible on load
    if (index === 4) {
      element.style.transitionDelay = `0ms`;
      element.classList.add('visible');
    } else {
      element.style.transitionDelay = `${index * 120 + 150}ms`;
    }
  });

  const sections = document.querySelectorAll('.section, .footer-grid');
  sections.forEach((section, i) => {
    section.classList.add('fade-in');
    section.dataset.revealIndex = i + 1;
  });
}

function initRevealObserver() {
  const revealEls = document.querySelectorAll('.fade-in, .scale-in');
  if (!revealEls.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const idx = parseInt(el.dataset.revealIndex || '0', 10);
      el.classList.add('visible');
      // stagger slightly based on assigned index
      el.style.transitionDelay = `${Math.max(0, idx * 60)}ms`;
      obs.unobserve(el);
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => observer.observe(el));
}

function init() {
  prepareAnimations();
  initAccordion();
  initWhatsAppButtons();
  initSmoothScroll();
  initCursor();
  revealOnScroll();
  initLoadSequence();
  initBgParallax();
  initRevealObserver();
}

function initBgParallax() {
  if (!bgVideo) return;

  let lastScroll = window.scrollY || 0;
  let ticking = false;

  function onScroll() {
    lastScroll = window.scrollY || 0;
    requestTick();
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateBg);
      ticking = true;
    }
  }

  function updateBg() {
    const depth = 0.12; // smaller = subtler movement
    const y = Math.round(lastScroll * depth);
    bgVideo.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
    ticking = false;
  }

  // initial position
  bgVideo.style.transform = 'translate3d(0,0,0) scale(1.02)';
  window.addEventListener('scroll', onScroll, { passive: true });
}

window.addEventListener('DOMContentLoaded', init);
