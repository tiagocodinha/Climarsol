// Smooth scrolling APENAS para links de âncora (#about, #contact, etc)
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');

  // Se não começar por "#", não mexemos — deixa o browser navegar normalmente (ex: /portfolio/)
  if (!href || !href.startsWith('#')) return;

  link.addEventListener('click', function(e) {
    e.preventDefault();

    const targetSection = document.querySelector(href);

    if (targetSection) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Close mobile menu if open
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });
});

// CTA button smooth scroll to contact form
const ctaButton = document.getElementById('ctaButton');
if (ctaButton) {
  ctaButton.addEventListener('click', function() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = contactSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Add shadow to navbar on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Contact form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Validate name
    if (name === '') {
      document.getElementById('nameError').textContent = 'Por favor, introduza o seu nome.';
      isValid = false;
    }

    // Validate email
    if (email === '') {
      document.getElementById('emailError').textContent = 'Por favor, introduza o seu email.';
      isValid = false;
    } else if (!isValidEmail(email)) {
      document.getElementById('emailError').textContent = 'Por favor, introduza um email válido.';
      isValid = false;
    }

    // Validate message
    if (message === '') {
      document.getElementById('messageError').textContent = 'Por favor, introduza uma mensagem.';
      isValid = false;
    }

    // If form is valid, show success message
    if (isValid) {
      const successMessage = document.getElementById('successMessage');
      successMessage.classList.add('show');

      // Reset form
      contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(function() {
        successMessage.classList.remove('show');
      }, 5000);
    }
  });
}

// Email validation helper function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Language toggle (visual only)
const langOptions = document.querySelectorAll('.lang-option');
langOptions.forEach(option => {
  option.addEventListener('click', function() {
    langOptions.forEach(opt => opt.classList.remove('active'));
    this.classList.add('active');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const isClickInsideNav = navMenu.contains(event.target);
  const isClickOnHamburger = hamburger.contains(event.target);

  if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.replace(/\/$/, ""); // remove último /
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href").replace(/\/$/, "");

    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});






    setTimeout(() => {
        const logo = document.getElementById("intro-logo");
        if (logo) logo.remove();
    }, 7000);



    document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".logo-track");
  if (!track) return;

  const SPEED_PX_PER_SEC = 70;   // velocidade
  const MIN_DURATION_S   = 20;   // duração mínima da volta

  // duplica os logos para o loop não “cortar”
  if (![...track.children].some(n => n.classList?.contains("clone"))) {
    const originals = Array.from(track.children);
    originals.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.classList.add("clone");
      track.appendChild(clone);
    });
  }

  const setLoopWidth = () => {
    // metade da largura total = 1 ciclo completo
    const loopPx = track.scrollWidth / 2;
    track.style.setProperty("--loop-px", `${loopPx}px`);

    const duration = Math.max(MIN_DURATION_S, loopPx / SPEED_PX_PER_SEC);
    track.style.setProperty("--marquee-duration", `${duration}s`);
  };

  const onReady = () => setLoopWidth();

  if (document.readyState === "complete") {
    onReady();
  } else {
    window.addEventListener("load", onReady);
  }

  let rafId = null;
  window.addEventListener("resize", () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(setLoopWidth);
  });
});
