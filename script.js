// ===== Omega Tutorial — site scripts =====

// ===== Keep mobile menu offset in sync with actual header height =====
const siteHeader = document.getElementById('siteHeader');

function syncHeaderHeight() {
  if (!siteHeader) return;
  document.documentElement.style.setProperty('--header-h', `${siteHeader.offsetHeight}px`);
}
syncHeaderHeight();
window.addEventListener('resize', syncHeaderHeight);
window.addEventListener('orientationchange', syncHeaderHeight);

// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

navToggle?.addEventListener('click', () => {
  syncHeaderHeight();
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('nav-open', isOpen);
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

// ===== FAQ accordion =====
const accItems = document.querySelectorAll('.acc-item');

function setPanel(item, open) {
  const trigger = item.querySelector('.acc-trigger');
  const panel = item.querySelector('.acc-panel');
  trigger.setAttribute('aria-expanded', String(open));
  panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
}

accItems.forEach(item => {
  const trigger = item.querySelector('.acc-trigger');
  const isOpenInitially = trigger.getAttribute('aria-expanded') === 'true';
  setPanel(item, isOpenInitially);

  trigger.addEventListener('click', () => {
    const currentlyOpen = trigger.getAttribute('aria-expanded') === 'true';
    accItems.forEach(other => setPanel(other, false));
    setPanel(item, !currentlyOpen);
  });
});

window.addEventListener('resize', () => {
  accItems.forEach(item => {
    const trigger = item.querySelector('.acc-trigger');
    if (trigger.getAttribute('aria-expanded') === 'true') setPanel(item, true);
  });
});

// ===== Animated stat counters (on scroll into view) =====
const statNums = document.querySelectorAll('.stat-num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ===== Demo booking form → opens WhatsApp with prefilled details =====
const demoForm = document.getElementById('demoForm');
const formNote = document.getElementById('formNote');

demoForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = demoForm.querySelector('[name="name"]').value.trim();
  const phone = demoForm.querySelector('[name="phone"]').value.trim();
  const track = demoForm.querySelector('[name="track"]').value;
  const mode = demoForm.querySelector('[name="mode"]').value;

  const message =
    `Hi Omega Tutorial, I'd like to book a free demo class.\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Course: ${track}\n` +
    `Preferred mode: ${mode}`;

  const waUrl = `https://wa.me/919678162351?text=${encodeURIComponent(message)}`;
  formNote.textContent = 'Opening WhatsApp with your details filled in — just hit send.';
  window.open(waUrl, '_blank', 'noopener');
  demoForm.reset();
});
