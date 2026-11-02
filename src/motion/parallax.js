import gsap from 'gsap';
import { isDesktop } from './prefs.js';

/** Scroll-linked depth. data-parallax holds a signed weight; desktop moves ±12%, phones ±5%. */
export function initParallax() {
  const amp = isDesktop() ? 12 : 5;

  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const dir = Math.sign(Number(el.dataset.parallax) || 1);
    gsap.fromTo(
      el,
      { yPercent: -dir * amp },
      {
        yPercent: dir * amp,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Ghost words drift sideways against the scroll
  gsap.utils.toArray('[data-ghost]').forEach((el) => {
    gsap.fromTo(
      el,
      { xPercent: 6 },
      {
        xPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Hero phones lift away as the hero scrolls out
  const phones = document.querySelector('.hero__phones');
  if (phones) {
    gsap.to(phones, {
      yPercent: isDesktop() ? -14 : -6,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}
