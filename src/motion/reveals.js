import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { isDesktop } from './prefs.js';

const START = 'top 82%';

/** Section headings: words rise out of a line mask; on desktop they also widen 60% → 100%. */
function headings() {
  document.querySelectorAll('[data-split]:not(.hero__claim)').forEach((el) => {
    const split = SplitText.create(el, { type: 'words,lines', mask: 'lines', linesClass: 'split-line' });
    const from = { yPercent: 105 };
    if (isDesktop()) from.fontStretch = '60%';
    gsap.from(split.words, {
      ...from,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.04,
      scrollTrigger: { trigger: el, start: START, once: true },
      onComplete: () => split.revert(),
    });
  });
}

/** Text blocks: a short rise. */
function blocks() {
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: START, once: true },
    });
  });
}

/** Groups: children arrive one after another. */
function staggers() {
  gsap.utils.toArray('[data-stagger]').forEach((group) => {
    gsap.from(group.children, {
      y: 48,
      opacity: 0,
      duration: 0.85,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: group, start: START, once: true },
    });
  });
}

/** Media and colour blocks resolve out of noise: veil opacity 1 → 0 plus scale 1.04 → 1. */
function denoise() {
  gsap.utils.toArray('[data-denoise]').forEach((el) => {
    gsap.fromTo(
      el,
      { '--veil': 1, scale: 1.04 },
      {
        '--veil': 0,
        scale: 1,
        duration: 1.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: START, once: true },
      },
    );
  });
}

function counters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: START, once: true },
      onUpdate: () => (el.textContent = state.v.toFixed(decimals) + suffix),
    });
  });
}

function bars() {
  document.querySelectorAll('[data-bars]').forEach((group) => {
    gsap.from(group.querySelectorAll('.versus__bar'), {
      scaleX: 0,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.25,
      scrollTrigger: { trigger: group, start: START, once: true },
    });
  });
}

function processLine() {
  const line = document.querySelector('[data-process-line]');
  if (!line) return;
  gsap.fromTo(
    line,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.process__steps', start: 'top 75%', end: 'bottom 45%', scrub: true },
    },
  );
}

export function initReveals() {
  headings();
  blocks();
  staggers();
  denoise();
  counters();
  bars();
  processLine();
}

export { ScrollTrigger };
