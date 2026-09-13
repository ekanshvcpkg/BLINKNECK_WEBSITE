


// IntersectionObserver
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function showToast(message, duration = 3500) {
  const container = $('#toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

/!* ── NAVBAR ──────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar'); 
  const navLinks = $$('.nav-link');
  const mobileLinks = $$('.mobile-link');
  const sections = $$('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    //! Active link tracking
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
    mobileLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });

  //! Smooth scroll
  $$('[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');
      if (target === '#') return;
      const el = $(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // close mobile menu if open
        $('#hamburger').classList.remove('open');
        $('#mobileMenu').classList.remove('open');
      }
    });
  });
}

/!* ── HAMBURGER ───────────────────────────────────────────────── */
function initHamburger() {
  const btn = $('#hamburger');
  const menu = $('#mobileMenu');
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    menu.classList.toggle('open', open);
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
}

/!* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.reveal').forEach(el => observer.observe(el));
}

/!* ── STAT COUNTERS ───────────────────────────────────────────── */
function animateCounter(el) {
  // Handle decimal/custom cases
  const decimal = el.dataset.decimal;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';

  if (decimal) {
    //! Animate to the decimal number
    const target = parseFloat(decimal);
    const numDecimals = decimal.includes('.') ? decimal.split('.')[1].length : 0;
    const duration = 2000;
    const start = performance.now();
    function tick(now) {
      const elapsed = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - elapsed, 3);
      const value = (target * ease).toFixed(numDecimals);
      el.textContent = prefix + value + suffix;
      if (elapsed < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(numDecimals) + suffix;
    }
    requestAnimationFrame(tick);
    return;
  }

  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  const duration = 2200;
  const start = performance.now();
  function tick(now) {
    const elapsed = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - elapsed, 3);
    el.textContent = prefix + Math.round(target * ease).toLocaleString() + suffix;
    if (elapsed < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + target.toLocaleString() + suffix;
  }
  requestAnimationFrame(tick);
}

function initStats() {
  const statEls = $$('.stat-value');
  if (!statEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));
}

/!* ── STEPS TRACKER (connector fill + active node) ───────────── */
function initSteps() {
  const steps = $$('.step-card');
  const fill = $('#connectorFill');

  if (!steps.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = steps.indexOf(entry.target);
        const pct = ((idx + 1) / steps.length) * 100;
        if (fill) fill.style.height = pct + '%';
        steps.forEach((s, i) => s.classList.toggle('active', i <= idx));
      }
    });
  }, { threshold: 0.4 });

  steps.forEach(s => observer.observe(s));
}

/!* ── MODAL ───────────────────────────────────────────────────── */
function initModal() {
  const overlay = $('#modalOverlay');
  const closeBtn = $('#modalClose');

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  //! Trigger buttons
  $$('#ctaPrimary, #ctaBottom').forEach(btn => btn && btn.addEventListener('click', open));
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/!* ── ESCROW FORM ─────────────────────────────────────────────── */
function initEscrowForm() {
  const form = $('#escrowForm');
  const resultArea = $('#formResult');
  const resultUrl = $('#resultUrl');
  const copyBtn = $('#copyBtn');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const amount = $('#escrowAmount').value;
    const recipient = $('#escrowRecipient').value;
    const timelock = $('#escrowTimelock').value;
    const condition = $('#escrowCondition').value;
    const note = $('#escrowNote').value;

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.textContent = 'Generating…';
    submitBtn.disabled = true;

    try { // handling errors
         // try to do something risky, like calling a server
      const res = await fetch('/api/escrow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recipient, timelock, condition, note })
      });
      const data = await res.json();

      resultUrl.textContent = data.blinkUrl;
      resultArea.style.display = 'block';
      showToast('✦ Blink Escrow generated successfully');
    } catch {
        // this runs only if it fails
      showToast('Error generating link. Please try again.');
    } finally {
        // this always runs, whether it failed or notx
      submitBtn.textContent = 'Generate Blink Link';
      submitBtn.disabled = false;
    }
  });

  copyBtn && copyBtn.addEventListener('click', () => {
    const url = resultUrl.textContent;
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      copyBtn.textContent = '✓ Copied!';
      showToast('Link copied to clipboard');
      setTimeout(() => { copyBtn.textContent = 'Copy Link'; }, 2000);
    });
  });
}

/!* ── MOCKUP BUTTON (visual only) ────────────────────────────── */
function initMockupBtn() {
  const btn = $('.mockup-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.textContent = '✓ Signed & Locked';
    btn.style.background = '#4caf82';
    setTimeout(() => {
      btn.textContent = 'Sign & Lock Escrow';
      btn.style.background = '';
    }, 2200);
    showToast('⬡ Wallet prompt would appear here in live build');
  });
}

/!* ── BOOT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initReveal();
  initStats();
  initSteps();
  initModal();
  initEscrowForm();
  initMockupBtn();
});
