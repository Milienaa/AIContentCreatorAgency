import gsap from 'gsap';

/** Buttons lean toward the pointer. Fine pointers only. */
export function initMagnetic(strength = 0.3) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - (r.left + r.width / 2)) * strength);
      y((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}
