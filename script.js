(function() {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const filterChips = document.querySelectorAll('.filters .chip');
  const recipeCards = document.querySelectorAll('.recipe-grid .recipe');
  const factEl = document.getElementById('random-fact');
  const anotherFactBtn = document.getElementById('another-fact');
  const dropdown = document.querySelector('.dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');

  // Restore saved theme
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'dusk') {
      root.classList.add('dusk');
    }
  } catch (_) {}

  // Toggle between light and dusk
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDusk = root.classList.toggle('dusk');
      try { localStorage.setItem('theme', isDusk ? 'dusk' : ''); } catch (_) {}
      toggle.textContent = isDusk ? 'dawn' : 'dusk';
    });
  }

  // Gentle entrance animation
  document.addEventListener('DOMContentLoaded', () => {
    document.body.animate([
      { opacity: 0 },
      { opacity: 1 }
    ], { duration: 500, easing: 'ease-out' });
  });


  // Category filtering
  function applyFilter(category) {
    recipeCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = category === 'all' || category === cat;
      card.style.display = show ? '' : 'none';
      card.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: 250, easing: 'ease-out' });
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      filterChips.forEach(c => c.setAttribute('aria-selected', c === chip ? 'true' : 'false'));
      applyFilter(chip.getAttribute('data-filter'));
    });
  });

  // Fun facts
  const facts = [
    'Coffee was discovered by Ethiopian goat herders who noticed their goats dancing after eating coffee cherries.',
    'Espresso means "pressed out" in Italian, referring to the brewing method.',
    'Decaf coffee still contains small amounts of caffeine.',
    'Tea is the most consumed beverage in the world after water.',
    'Cold brew is brewed with cold water over many hours, making it smoother and less acidic.',
    'The world’s most expensive coffee can be made from beans eaten and excreted by civets (kopi luwak).',
    'A macchiato is simply an espresso “stained” with a dollop of milk foam.',
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
    factEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
  }

  if (factEl) {
    renderFact();
  }
  if (anotherFactBtn) {
    anotherFactBtn.addEventListener('click', renderFact);
  }

  let deferredPrompt = null;
  const installButton = document.getElementById('install-app');

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installButton) {
      installButton.style.display = 'inline-flex';
    }
  });

  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      installButton.disabled = true;
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      installButton.disabled = false;
      deferredPrompt = null;
      installButton.style.display = 'none';
      console.log('PWA install response:', choiceResult.outcome);
    });
  }

  window.addEventListener('appinstalled', () => {
    if (installButton) {
      installButton.style.display = 'none';
    }
    deferredPrompt = null;
    console.log('App installed.');
  });

  // Explore dropdown
  if (dropdown && dropdownToggle) {
    function closeDropdown() {
      dropdown.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
    function openDropdown() {
      dropdown.classList.add('open');
      dropdownToggle.setAttribute('aria-expanded', 'true');
    }
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.contains('open') ? closeDropdown() : openDropdown();
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDropdown();
    });
  }
})();


