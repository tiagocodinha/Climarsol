/* =========================
   SMOOTH SCROLL (apenas âncoras)
========================= */
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');

  // Se não começar por "#", não mexemos — deixa o browser navegar normalmente (ex: /portfolio/)
  if (!href || !href.startsWith('#')) return;

  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetSection = document.querySelector(href);
    if (!targetSection) return;

    const navbarEl = document.querySelector('.navbar');
    const navHeight = navbarEl ? navbarEl.offsetHeight : 0;
    const targetPosition = targetSection.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Fecha menu mobile se estiver aberto
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (navMenu && hamburger && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
});

/* =========================
   CTA BUTTON -> #contact
========================= */
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
  ctaButton.addEventListener('click', function () {
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;

    const navbarEl = document.querySelector('.navbar');
    const navHeight = navbarEl ? navbarEl.offsetHeight : 0;
    const targetPosition = contactSection.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
}

/* =========================
   HAMBURGER MENU TOGGLE
========================= */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

/* =========================
   NAVBAR SHADOW ON SCROLL
========================= */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });
}

/* =========================
   CONTACT FORM VALIDATION (se existir)
========================= */
const contactForm = document.getElementById('contactForm');

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => (el.textContent = ''));

    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const messageEl = document.getElementById('message');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const message = messageEl ? messageEl.value.trim() : '';

    let isValid = true;

    if (name === '') {
      const nameError = document.getElementById('nameError');
      if (nameError) nameError.textContent = 'Por favor, introduza o seu nome.';
      isValid = false;
    }

    if (email === '') {
      const emailError = document.getElementById('emailError');
      if (emailError) emailError.textContent = 'Por favor, introduza o seu email.';
      isValid = false;
    } else if (!isValidEmail(email)) {
      const emailError = document.getElementById('emailError');
      if (emailError) emailError.textContent = 'Por favor, introduza um email válido.';
      isValid = false;
    }

    if (message === '') {
      const messageError = document.getElementById('messageError');
      if (messageError) messageError.textContent = 'Por favor, introduza uma mensagem.';
      isValid = false;
    }

    if (isValid) {
      const successMessage = document.getElementById('successMessage');
      if (successMessage) successMessage.classList.add('show');

      contactForm.reset();

      setTimeout(function () {
        if (successMessage) successMessage.classList.remove('show');
      }, 5000);
    }
  });
}

/* =========================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================= */
document.addEventListener('click', function (event) {
  if (!navMenu || !hamburger) return;

  const isClickInsideNav = navMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

/* =========================
   ACTIVE MENU LINK (PT + EN)
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const normalize = (p) => (p || '/').replace(/\/+$/, '') || '/';
  const currentPath = normalize(window.location.pathname);

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // ignora âncoras
    if (href.startsWith('#')) return;

    const linkPath = normalize(href);
    if (linkPath === currentPath) link.classList.add('active');
  });
});

/* =========================
   INTRO LOGO (remove after 7s)
========================= */
setTimeout(() => {
  const logo = document.getElementById('intro-logo');
  if (logo) logo.remove();
}, 7000);

/* =========================
   LOGO MARQUEE (se existir)
========================= */
document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  const SPEED_PX_PER_SEC = 70;
  const MIN_DURATION_S = 20;

  // duplica os logos para o loop não “cortar”
  if (![...track.children].some(n => n.classList?.contains('clone'))) {
    const originals = Array.from(track.children);
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
  }

  const setLoopWidth = () => {
    const loopPx = track.scrollWidth / 2;
    track.style.setProperty('--loop-px', `${loopPx}px`);

    const duration = Math.max(MIN_DURATION_S, loopPx / SPEED_PX_PER_SEC);
    track.style.setProperty('--marquee-duration', `${duration}s`);
  };

  const onReady = () => setLoopWidth();

  if (document.readyState === 'complete') onReady();
  else window.addEventListener('load', onReady);

  let rafId = null;
  window.addEventListener('resize', () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(setLoopWidth);
  });
});


/* =========================
   CURRENT YEAR IN FOOTER
========================= */
document.getElementById("year").textContent = new Date().getFullYear();

/* =========================
   LANGUAGE SWITCH (PT <-> EN) + ACTIVE
   PT: /  /empresa/  /portfolio/  /contactos/
   EN: /en/  /en/company/  /en/portfolio/  /en/contacts/
========================= */
(function () {
  const routes = {
    '/': '/en/',
    '/empresa/': '/en/company/',
    '/portfolio/': '/en/portfolio/',
    '/contactos/': '/en/contacts/'
  };

  const reverseRoutes = Object.fromEntries(
    Object.entries(routes).map(([pt, en]) => [en, pt])
  );

  const normalize = (p) => {
    if (!p) return '/';
    // garante barra final para bater certo no mapa
    p = p.startsWith('/') ? p : '/' + p;
    if (!p.endsWith('/')) p += '/';
    return p;
  };

  // Ativar visualmente PT/EN conforme URL
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const isEN = path.startsWith('/en');

    document.querySelectorAll('.lang-option').forEach(opt => {
      opt.classList.remove('active');
      if (opt.textContent.trim().toLowerCase() === (isEN ? 'en' : 'pt')) {
        opt.classList.add('active');
      }
    });
  });

  // Clique para trocar
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function () {
      const selectedLang = this.textContent.trim().toLowerCase();
      const currentPath = normalize(window.location.pathname);

      if (selectedLang === 'en') {
        if (currentPath.startsWith('/en/')) return;
        window.location.href = routes[currentPath] || '/en/';
      }

      if (selectedLang === 'pt') {
        if (!currentPath.startsWith('/en/')) return;
        window.location.href = reverseRoutes[currentPath] || '/';
      }
    });
  });
})();
