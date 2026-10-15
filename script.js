// ================================================================
// MOUHANNED MEJRI – PORTFOLIO JAVASCRIPT
// ================================================================

/* ── PARTICLES BACKGROUND ─────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const COLORS = ['#4f8ef7', '#8b5cf6', '#06d6a0', '#f472b6'];
  const NUM = Math.min(70, Math.floor(W * H / 18000));

  let particles = Array.from({ length: NUM }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: Math.random() * 0.5 + 0.1,
  }));

  let mouse = { x: -9999, y: -9999 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,142,247,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      // Mouse repel
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.x += dx * 0.03;
        p.y += dy * 0.03;
      }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${p.alpha})`).replace('rgb', 'rgba').replace('#', '');
      // Use hex directly:
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  draw();

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
}

/* ── TYPING EFFECT ────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const phrases = [
    'Final-Year Computer Engineering Student',
    'LLM Agents & Multi-Agent Systems',
    'RAG & Multimodal AI Engineer',
    'Full-Stack AI Products Builder',
    'Applied AI & Few-Shot ML Researcher',
    'Codeforces Specialist (Rating 1490)',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }
  type();
}

/* ── NAVIGATION ───────────────────────────────── */
function initNav() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let active = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) active = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${active}`);
    });
  }
  updateActiveLink();
}

/* ── SCROLL REVEAL ────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ── PROJECT FILTER ───────────────────────────── */
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const match = cat === 'all' || categories.includes(cat);
        card.style.display = match ? 'flex' : 'none';
        if (match) card.style.animation = 'fadeUp 0.4s ease both';
      });
    });
  });
}

/* ── SMOOTH SCROLL ────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ── COUNTER ANIMATION ────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.target;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (isNaN(target)) return;
        const duration = 1400;
        const step = Math.max(1, target / (duration / 16));
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = prefix + Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => observer.observe(c));
}

/* ── CURSOR GLOW (desktop only) ───────────────── */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', width: '300px', height: '300px',
    borderRadius: '50%', pointerEvents: 'none', zIndex: '0',
    background: 'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    transition: 'left 0.1s ease, top 0.1s ease',
  });
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

/* ── INIT ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTyping();
  initNav();
  initReveal();
  initProjectFilter();
  initSmoothScroll();
  initCounters();
  initCursorGlow();

  // Hero scroll button
  document.querySelector('.hero-scroll')?.addEventListener('click', () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  });
});
