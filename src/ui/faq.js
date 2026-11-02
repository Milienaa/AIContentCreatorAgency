import { prefersReducedMotion } from '../motion/prefs.js';

/** Smooth height for <details> accordions; native behaviour when motion is reduced. */
export function initFaq() {
  if (prefersReducedMotion()) return;

  document.querySelectorAll('[data-faq] details').forEach((details) => {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.faq__answer');
    let anim;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      anim?.cancel();
      if (!details.open) {
        details.open = true;
        const h = answer.scrollHeight;
        anim = answer.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 1 }], {
          duration: 420,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
      } else {
        const h = answer.scrollHeight;
        anim = answer.animate([{ height: `${h}px`, opacity: 1 }, { height: '0px', opacity: 0 }], {
          duration: 320,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
        anim.onfinish = () => (details.open = false);
      }
    });
  });
}
