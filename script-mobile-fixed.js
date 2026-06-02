// Mobile-optimized CoffeeFriend app with better error handling

(function() {
  'use strict';

  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const filterChips = document.querySelectorAll('.filters .chip');
  const recipeCards = document.querySelectorAll('.recipe-grid .recipe');
  const factEl = document.getElementById('random-fact');
  const anotherFactBtn = document.getElementById('another-fact');
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Detect mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Restore saved theme
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dusk') {
      root.classList.add('dusk');
    }
  } catch (err) {
    console.log('LocalStorage unavailable:', err);
  }

  // Toggle between light and dusk
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDusk = root.classList.toggle('dusk');
      try {
        localStorage.setItem('theme', isDusk ? 'dusk' : '');
      } catch (err) {
        console.log('LocalStorage save failed:', err);
      }
      toggle.textContent = isDusk ? 'dawn' : 'dusk';
    });
  }

  // Safe animation wrapper
  function safeAnimate(element, keyframes, options) {
    try {
      if (element && element.animate && typeof element.animate === 'function') {
        return element.animate(keyframes, options);
      }
    } catch (err) {
      console.log('Animation failed, using CSS fallback');
    }
    // Fallback: just set opacity
    if (element) {
      element.style.opacity = '1';
    }
  }

  // Gentle entrance animation (mobile-safe)
  document.addEventListener('DOMContentLoaded', () => {
    safeAnimate(document.body, [
      { opacity: 0 },
      { opacity: 1 }
    ], { duration: 500, easing: 'ease-out' });
  });

  // Category filtering (mobile-safe)
  function applyFilter(category) {
    recipeCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = category === 'all' || category === cat;
      card.style.display = show ? '' : 'none';

      safeAnimate(card, [
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: 250, easing: 'ease-out' });
    });
  }

  filterChips.forEach(chip => {
    const handleActivate = () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      filterChips.forEach(c => c.setAttribute('aria-selected', c === chip ? 'true' : 'false'));
      applyFilter(chip.getAttribute('data-filter'));
    };

    chip.addEventListener('click', handleActivate);

    // Add touch support for mobile
    chip.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleActivate();
    });
  });

  // Fun facts
  const facts = [
    'Coffee was discovered by Ethiopian goat herders who noticed their goats dancing after eating coffee cherries.',
    'Espresso means "pressed out" in Italian, referring to the brewing method.',
    'Decaf coffee still contains small amounts of caffeine.',
    'Tea is the most consumed beverage in the world after water.',
    'Cold brew is brewed with cold water over many hours, making it smoother and less acidic.',
    'The world\'s most expensive coffee can be made from beans eaten and excreted by civets (kopi luwak).',
    'A macchiato is simply an espresso "stained" with a dollop of milk foam.',
    'Green tea contains L-theanine which, with caffeine, can promote calm focus.',
    'The crema on espresso is an emulsion of oils and CO₂ formed under pressure.',
    'Arabica and Robusta are the two main coffee species used commercially.'
  ];

  function randomFact() {
    return facts[Math.floor(Math.random() * facts.length)];
  }

  function renderFact() {
    if (!factEl) return;
    factEl.textContent = randomFact();

    safeAnimate(factEl, [
      { opacity: 0 },
      { opacity: 1 }
    ], { duration: 300, easing: 'ease-out' });
  }

  if (factEl) {
    renderFact();
  }

  if (anotherFactBtn) {
    anotherFactBtn.addEventListener('click', renderFact);

    // Add touch support
    anotherFactBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      renderFact();
    });
  }

  // Explore dropdown with mobile support
  if (dropdown && dropdownToggle) {
    function closeDropdown() {
      dropdown.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }

    function openDropdown() {
      dropdown.classList.add('open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    }

    function toggleDropdown(e) {
      e.stopPropagation();
      if (dropdown.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    dropdownToggle.addEventListener('click', toggleDropdown);

    // Better touch support for dropdown (mobile)
    dropdownToggle.addEventListener('touchend', (e) => {
      e.preventDefault();
      toggleDropdown(e);
    });

    document.addEventListener('click', (e) => {
      if (dropdown && !dropdown.contains(e.target) && !dropdownToggle.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('touchend', (e) => {
      if (dropdown && !dropdown.contains(e.target) && !dropdownToggle.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  // Global error handler (logs for debugging)
  window.addEventListener('error', (event) => {
    console.error('App error:', {
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      error: event.error
    });
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });

  // Log app startup
  console.log('CoffeeFriend app loaded', {
    isMobile: isMobile,
    userAgent: navigator.userAgent
  });
})();
