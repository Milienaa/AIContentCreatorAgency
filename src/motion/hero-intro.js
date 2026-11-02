import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { isDesktop } from './prefs.js';

/**
 * The page's one orchestrated moment: the frame starts as pure static and
 * the first clip denoises out of it, the wordmark "generates" from narrow to
 * wide, the claim rises word by word, then the caption and CTAs settle in.
 */
export function playHeroIntro({ reel, reducedMotion, onDone = () => {} }) {
  const root = document.documentElement;

  if (reducedMotion) {
    root.classList.remove('intro-pending');
    reel.start();
    onDone();
    return;
  }

  const wordmark = document.querySelector('[data-wordmark]');
  const claim = document.querySelector('.hero__claim');
  const split = SplitText.create(claim, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' });

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      split.revert();
      onDone();
    },
  });

  root.classList.remove('intro-pending');

  tl.call(() => reel.start(), null, 0.15);

  if (isDesktop()) {
    tl.fromTo(wordmark, { fontStretch: '50%', opacity: 0 }, { fontStretch: '150%', opacity: 1, duration: 1.3, ease: 'expo.out' }, 0.1);
  } else {
    tl.fromTo(wordmark, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.1);
  }

  tl.from(split.words, { yPercent: 110, duration: 0.8, stagger: 0.05 }, 0.45)
    .from('.hero__body > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.8)
    .from('.hero__caption', { opacity: 0, y: 12, duration: 0.7 }, 1.0);
}
