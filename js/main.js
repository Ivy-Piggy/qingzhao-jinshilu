/* ═══════════════════════════════════════
   李清照 · 金陵《金石录》 交互脚本
   Li Qingzhao · Jinshi Lu Interactions
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Loader ───
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback: hide loader after 3s even if load event is slow
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // ─── Navbar scroll effect ───
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ─── Mobile nav toggle ───
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close nav on link click (mobile)
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ─── Hero Particles ───
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    const particleCount = Math.min(25, Math.floor(window.innerWidth / 45));
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.width = particle.style.height = (2 + Math.random() * 3) + 'px';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (5 + Math.random() * 7) + 's';
      particle.style.background = Math.random() > 0.5 ? 'var(--vermillion)' : 'var(--gold)';
      particlesContainer.appendChild(particle);
    }
  }

  // ─── Smooth anchor scroll (fallback for older browsers) ───
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).scrollPaddingTop) || 72;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ─── Timeline era hover parallax ───
  document.querySelectorAll('.era-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -3;
      const rotateY = (x - centerX) / centerX * 3;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateX(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateX(4px)';
    });
  });

  // ─── Jinshilu step hover effect ───
  document.querySelectorAll('.jinshilu-step').forEach((step) => {
    step.addEventListener('mousemove', (e) => {
      const rect = step.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      step.style.transform = `perspective(800px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
    });

    step.addEventListener('mouseleave', () => {
      step.style.transform = '';
    });
  });

  // ─── Parallax hero mouse tracking ───
  const hero = document.getElementById('hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const bg = hero.querySelector('.hero-bg');
      if (bg) {
        bg.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
      }
    });
  }

  // ─── Window resize: re-check visibility ───
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('[data-reveal]:not(.revealed)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
        if (isVisible) {
          el.classList.add('revealed');
          revealObserver.unobserve(el);
        }
      });
    }, 200);
  });

  // ─── Initial reveal for visible elements on load ───
  setTimeout(() => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
      if (isVisible) {
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      }
    });
  }, 600);

  // ─── Console Easter Egg ───
  console.log(
    '%c📜 李清照 · 金陵《金石录》 %c Li Qingzhao · Jinshi Lu in Jinling ',
    'background:#c0392b;color:#e0d8c8;font-size:16px;font-weight:bold;padding:8px 12px;border-radius:4px 0 0 4px;font-family:serif;',
    'background:#1c1a24;color:#e0d8c8;font-size:16px;padding:8px 12px;border-radius:0 4px 4px 0;font-family:sans-serif;'
  );
  console.log('%c「九万里风鹏正举，风休住，蓬舟吹取三山去」', 'color:#c0392b;font-size:14px;font-family:serif;');

});
