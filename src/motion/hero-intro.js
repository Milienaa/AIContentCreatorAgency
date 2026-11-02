import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { isDesktop } from './prefs.js';

/**
 * The page's one orchestrated moment: the prompt types, the wordmark
 * "generates" from narrow to wide, the claim rises word by word,
 * and the three hero phones start generating in a stagger.
 */
export function playHeroIntro({ heroPlayers, reducedMotion, onDone = () => {} }) {
  const root = document.documentElement;
  const promptEl = document.querySelector('[data-hero-prompt]');
  const text = promptEl.dataset.heroPrompt;

  if (reducedMotion) {
    promptEl.textContent = text;
    root.classList.remove('intro-pending');
    heroPlayers.forEach((p) => p.enter());
    onDone();
    return;
  }

  const wordmark = document.querySelector('[data-wordmark]');
  const claim = document.querySelector('.hero__claim');
  const split = SplitText.create(claim, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' });
  const typed = { n: 0 };

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      split.revert();
      onDone();
    },
  });

  root.classList.remove('intro-pending');

  tl.to(typed, {
    n: text.length,
    duration: Math.min(text.length * 0.028, 1.5),
    ease: 'none',
    onUpdate: () => (promptEl.textContent = text.slice(0, Math.round(typed.n))),
  });

  if (isDesktop()) {
    tl.fromTo(wordmark, { fontStretch: '50%', opacity: 0 }, { fontStretch: '150%', opacity: 1, duration: 1.3, ease: 'expo.out' }, 0.1);
  } else {
    tl.fromTo(wordmark, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9 }, 0.1);
  }

  tl.from(split.words, { yPercent: 110, duration: 0.8, stagger: 0.045 }, 0.45)
    .from('.hero__body > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, 0.8)
    .from('.hero__phones .phone', { y: 60, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.55);

  heroPlayers.forEach((player, i) => tl.call(() => player.enter(), null, 0.7 + i * 0.15));
}
