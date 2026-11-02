import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/newsreader/opsz.css';
import '@fontsource-variable/newsreader/opsz-italic.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/phone.css';
import './styles/sections.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { CASES, REEL_ORDER } from './data/cases.js';
import { caseMarkup } from './sections/work.js';
import { initPhones } from './phone/phones.js';
import { initMenu } from './ui/menu.js';
import { initNav } from './ui/nav.js';
import { initFaq } from './ui/faq.js';
import { initForm } from './ui/form.js';
import { initBeforeAfter } from './ui/before-after.js';
import { initCursor } from './ui/cursor.js';
import { initMagnetic } from './ui/magnetic.js';
import { prefersReducedMotion } from './motion/prefs.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initReveals } from './motion/reveals.js';
import { initParallax } from './motion/parallax.js';
import { playHeroIntro } from './motion/hero-intro.js';
import { createHeroReel } from './motion/hero-reel.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

document.querySelector('[data-cases]').innerHTML = CASES.map(caseMarkup).join('');

const reducedMotion = prefersReducedMotion();
initPhones();
const reel = createHeroReel(
  document.querySelector('[data-reel]'),
  REEL_ORDER.map((id) => CASES.find((c) => c.id === id)),
  { reducedMotion },
);

const lenis = initSmoothScroll();
initNav();
initMenu({ onOpen: () => lenis?.stop(), onClose: () => lenis?.start() });
initFaq();
initForm();
initBeforeAfter();

const start = () => {
  playHeroIntro({ reel, reducedMotion });

  if (reducedMotion) return;
  initReveals();
  initParallax();
  initCursor();
  initMagnetic();
  ScrollTrigger.refresh();
};

// Split and measure only once the variable fonts are in
document.fonts.ready.then(start);
