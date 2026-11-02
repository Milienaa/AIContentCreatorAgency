import gsap from 'gsap';

/** "Play / Pause" disc that follows the pointer over phones. Fine pointers only. */
export function initCursor() {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const label = cursor.querySelector('.cursor__label');
  cursor.dataset.active = 'true';

  const x = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });

  const labelFor = (phone) => {
    const s = phone.dataset.state;
    if (s === 'rendered') return 'Pause';
    if (s === 'error') return 'Retry';
    if (s === 'prompt' || s === 'generating') return 'Generating';
    return 'Play';
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      x(e.clientX);
      y(e.clientY);
      const phone = e.target.closest?.('[data-phone]');
      cursor.dataset.visible = String(Boolean(phone));
      if (phone) label.textContent = labelFor(phone);
    },
    { passive: true },
  );

  // Refresh the label right after a click toggles the phone
  document.addEventListener('click', (e) => {
    const phone = e.target.closest?.('[data-phone]');
    if (phone) requestAnimationFrame(() => (label.textContent = labelFor(phone)));
  });

  document.addEventListener('pointerleave', () => (cursor.dataset.visible = 'false'));
}
