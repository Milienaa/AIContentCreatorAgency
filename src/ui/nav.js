/** Nav turns solid after the first screen fold and hides while scrolling down. */
export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    nav.dataset.solid = String(y > 60);
    const menuOpen = document.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded') === 'true';
    nav.dataset.hidden = String(!menuOpen && y > 400 && y > lastY + 2);
    if (Math.abs(y - lastY) > 2) lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  nav.addEventListener('focusin', () => (nav.dataset.hidden = 'false'));
  update();
}
