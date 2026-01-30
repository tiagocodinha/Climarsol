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
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

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

/* =========================
   CONTACT FORM (VALIDATION + AJAX SUBMIT + TOAST) PT/EN
   Requisitos no HTML:
   - form id="contactForm" + novalidate
   - inputs: id="name" id="email" id="phone" id="message"
   - erros: id="nameError" "emailError" "phoneError" "messageError"
   - botão: id="submitBtn"
   - toast: id="toast" (div)
========================= */
(function () {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = document.getElementById('submitBtn');
  const toast = document.getElementById('toast');

  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const messageEl = document.getElementById('message');

  // idioma automático pelo URL
  const lang = window.location.pathname.startsWith('/en') ? 'en' : 'pt';

  const TEXT = {
    pt: {
      nameRequired: "Por favor, introduza o seu nome.",
      emailRequired: "Por favor, introduza o seu email.",
      emailInvalid: "Por favor, introduza um email válido.",
      phoneInvalid: "Por favor, introduza um telefone válido (apenas números e + ( ) -).",
      messageRequired: "Por favor, introduza uma mensagem.",
      checkFields: "Verifique os campos assinalados.",
      sending: "A enviar...",
      sent: "Obrigado! A sua mensagem foi enviada.",
      sendFail: "Não foi possível enviar. Tente novamente.",
      networkFail: "Erro de ligação. Tente novamente."
    },
    en: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email.",
      emailInvalid: "Please enter a valid email address.",
      phoneInvalid: "Please enter a valid phone number (numbers and + ( ) - only).",
      messageRequired: "Please enter a message.",
      checkFields: "Please check the highlighted fields.",
      sending: "Sending...",
      sent: "Thank you! Your message has been sent.",
      sendFail: "Unable to send. Please try again.",
      networkFail: "Connection error. Please try again."
    }
  };

  const t = TEXT[lang];

  function setError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg || "";
  }

  function showToast(message, type = "success") {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("success", "error", "show");
    toast.classList.add(type);

    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[0-9\s()+-]{6,20}$/.test(phone);
  }

  // Limpador ao digitar (melhora UX)
  if (emailEl) emailEl.addEventListener('input', () => setError("emailError", ""));
  if (phoneEl) phoneEl.addEventListener('input', () => setError("phoneError", ""));
  if (nameEl) nameEl.addEventListener('input', () => setError("nameError", ""));
  if (messageEl) messageEl.addEventListener('input', () => setError("messageError", ""));

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    setError("nameError", "");
    setError("emailError", "");
    setError("phoneError", "");
    setError("messageError", "");

    const name = nameEl?.value.trim() || "";
    const email = emailEl?.value.trim() || "";
    const phone = phoneEl?.value.trim() || "";
    const message = messageEl?.value.trim() || "";

    let ok = true;

    if (!name) {
      setError("nameError", t.nameRequired);
      ok = false;
    }

    if (!email) {
      setError("emailError", t.emailRequired);
      ok = false;
    } else if (!isValidEmail(email)) {
      setError("emailError", t.emailInvalid);
      ok = false;
    }

    if (phone && !isValidPhone(phone)) {
      setError("phoneError", t.phoneInvalid);
      ok = false;
    }

    if (!message) {
      setError("messageError", t.messageRequired);
      ok = false;
    }

    if (!ok) {
      showToast(t.checkFields, "error");
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : "";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t.sending;
    }

    try {
      const formData = new FormData(contactForm);

      const res = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (res.ok) {
        contactForm.reset();
        showToast(t.sent, "success");
      } else {
        showToast(t.sendFail, "error");
      }
    } catch (err) {
      showToast(t.networkFail, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText || (lang === 'en' ? "Send message" : "Enviar");
      }
    }
  });
})();
