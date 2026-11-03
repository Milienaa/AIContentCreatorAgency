/** Nav stays pinned to the top and turns solid after the first screen fold. */
export function initNav() {
  const nav = document.querySelector('[data-nav]');
  if (!nav) return;
  let ticking = false;

  const update = () => {
    nav.dataset.solid = String(window.scrollY > 60);
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
  update();
}
