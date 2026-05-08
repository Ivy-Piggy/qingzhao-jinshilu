/* ═══════════════════════════════════════
   李清照 · 金陵《金石录》 增强交互脚本
   Li Qingzhao · Enhanced Interactions
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // =============================
  // 1. ─── Loader ───
  // =============================
  const loader = document.getElementById('loader');
  const hideLoader = () => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  };
  window.addEventListener('load', () => setTimeout(hideLoader, 400));
  setTimeout(hideLoader, 3000);

  // =============================
  // 2. ─── Ink-Wash Canvas Animation ───
  // =============================
  const canvas = document.getElementById('ink-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let inkDrops = [];
    let animationId = null;

    function resizeCanvas() {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    class InkDrop {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20 - Math.random() * 60;
        this.radius = 2 + Math.random() * 6;
        this.speed = 0.15 + Math.random() * 0.35;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.005 + Math.random() * 0.01;
        this.wobbleAmp = 3 + Math.random() * 8;
        this.opacity = 0.08 + Math.random() * 0.2;
        this.hue = Math.random() > 0.6 ? 40 : 0; // 0=vermillion hue, 40=gold hue
        this.saturation = Math.random() > 0.5 ? 60 : 30;
      }
      update() {
        this.y += this.speed;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * this.wobbleAmp * 0.02;
        if (this.y > canvas.height + 40) {
          this.reset();
          this.y = -20;
        }
      }
      draw() {
        const alpha = this.opacity * Math.min(1, (this.y + 40) / 120);
        ctx.beginPath();
        // Ink splash effect — irregular circles
        const r = this.radius * (0.8 + 0.4 * Math.sin(this.wobble * 0.7));
        ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        if (this.hue === 0) {
          ctx.fillStyle = `hsla(8, ${this.saturation}%, 50%, ${alpha})`;
        } else {
          ctx.fillStyle = `hsla(42, ${this.saturation}%, 55%, ${alpha})`;
        }
        ctx.fill();

        // Subtle ink trail
        ctx.beginPath();
        ctx.arc(this.x - Math.sin(this.wobble * 0.5) * 3, this.y - 8, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(0, 0%, 40%, ${alpha * 0.3})`;
        ctx.fill();
      }
    }

    function initInkDrops() {
      const count = Math.min(60, Math.floor(canvas.width / 15));
      inkDrops = [];
      for (let i = 0; i < count; i++) {
        const drop = new InkDrop();
        drop.y = Math.random() * canvas.height;
        drop.reset = null; // Don't call the original reset which randomizes y again
        const d = new InkDrop();
        inkDrops.push(d);
      }
    }

    function animateInk() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      inkDrops.forEach((drop) => {
        drop.update();
        drop.draw();
      });
      animationId = requestAnimationFrame(animateInk);
    }

    resizeCanvas();
    initInkDrops();
    animateInk();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initInkDrops();
      }, 200);
    });
  }

  // =============================
  // 3. ─── Progress Bar ───
  // =============================
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressFill.style.width = progress + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // =============================
  // 4. ─── Scroll Reveal ───
  // =============================
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
    { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  // =============================
  // 5. ─── Navbar ───
  // =============================
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = {};
  document.querySelectorAll('section[id]').forEach((sec) => {
    sections[sec.id] = sec;
  });

  function updateNav() {
    // Scrolled state
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section
    let currentSection = '';
    let minDist = Infinity;
    const scrollY = window.scrollY + 200;
    Object.entries(sections).forEach(([id, sec]) => {
      const top = sec.offsetTop;
      const dist = Math.abs(scrollY - top);
      if (dist < minDist) {
        minDist = dist;
        currentSection = id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // =============================
  // 6. ─── Back to Top ───
  // =============================
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    function toggleBackToTop() {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =============================
  // 7. ─── Smooth Anchor Scroll ───
  // =============================
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

  // =============================
  // 8. ─── Mobile Nav Toggle ───
  // =============================
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
      });
    });
  }

  // =============================
  // 9. ─── Poem Cards → Modal ───
  // =============================
  const modal = document.getElementById('poem-modal');
  const modalPhase = modal?.querySelector('.modal-phase');
  const modalTitle = modal?.querySelector('.modal-title');
  const modalBody = modal?.querySelector('.modal-body');
  const modalFooter = modal?.querySelector('.modal-footer');
  const modalClose = modal?.querySelector('.modal-close');
  const modalBackdrop = modal?.querySelector('.modal-backdrop');

  const poemData = [];

  document.querySelectorAll('.poem-card').forEach((card, index) => {
    const phase = card.querySelector('.poem-phase')?.textContent || '';
    const title = card.querySelector('.poem-header h3')?.textContent || '';
    const note = card.querySelector('.poem-note')?.textContent || '';
    const lines = Array.from(card.querySelectorAll('.poem-body p')).map(p => p.textContent);
    const tags = Array.from(card.querySelectorAll('.poem-tag')).map(t => t.textContent);

    poemData.push({ phase, title, note, lines, tags });

    card.addEventListener('click', () => {
      openPoemModal(index);
    });
  });

  function openPoemModal(index) {
    if (!modal || !poemData[index]) return;

    const poem = poemData[index];
    modalPhase.textContent = poem.phase;
    modalTitle.textContent = poem.title;

    modalBody.innerHTML = poem.lines
      .map(line => line.trim() === '' ? '<p class="poem-blank"></p>' : `<p>${line}</p>`)
      .join('');

    modalFooter.innerHTML = poem.tags
      .map(tag => `<span class="poem-tag" style="color:var(--vermillion)">${tag}</span>`)
      .join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePoemModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closePoemModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closePoemModal);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closePoemModal();
    }
  });

  // =============================
  // 10. ─── Hero Mouse Parallax ───
  // =============================
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

  // =============================
  // 11. ─── Timeline/Era Card 3D Tilt ───
  // =============================
  document.querySelectorAll('.era-card, .jinshilu-step').forEach((card) => {
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
      card.style.transform = '';
    });
  });

  // =============================
  // 12. ─── Map Item Hover ───
  // =============================
  document.querySelectorAll('.map-item').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const dot = item.querySelector('.map-dot');
      if (dot) {
        dot.style.transform = 'scale(1.5)';
        dot.style.boxShadow = '0 0 16px var(--dot-color, var(--vermillion))';
      }
    });
    item.addEventListener('mouseleave', () => {
      const dot = item.querySelector('.map-dot');
      if (dot) {
        dot.style.transform = '';
        dot.style.boxShadow = '';
      }
    });
  });

  // =============================
  // 13. ─── Route SVG Hover: highlight path ───
  // =============================
  const routePath = document.querySelector('.route-path');
  const routeContainer = document.querySelector('.route-map-container');
  if (routePath && routeContainer) {
    routeContainer.addEventListener('mouseenter', () => {
      routePath.style.strokeWidth = '4';
    });
    routeContainer.addEventListener('mouseleave', () => {
      routePath.style.strokeWidth = '2.5';
    });
  }

  // =============================
  // 14. ─── Window Resize: Re-check Visibility ───
  // =============================
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

  // =============================
  // 15. ─── Initial Reveal ───
  // =============================
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

  // =============================
  // 16. ─── Console Easter Egg ───
  // =============================
  console.log(
    '%c📜 李清照 · 金陵《金石录》 %c Li Qingzhao · Jinshi Lu in Jinling ',
    'background:#c0392b;color:#e0d8c8;font-size:16px;font-weight:bold;padding:8px 12px;border-radius:4px 0 0 4px;font-family:serif;',
    'background:#1c1a24;color:#e0d8c8;font-size:16px;padding:8px 12px;border-radius:0 4px 4px 0;font-family:sans-serif;'
  );
  console.log('%c「九万里风鹏正举，风休住，蓬舟吹取三山去」', 'color:#c0392b;font-size:14px;font-family:serif;');

});
