import '@fontsource-variable/anybody/standard.css';
import '@fontsource-variable/newsreader/opsz.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/phone.css';
import './styles/sections.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { CASES, HERO_CLIPS } from './data/cases.js';
import { phoneMarkup } from './phone/render.js';
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

gsap.registerPlugin(ScrollTrigger, SplitText);

document.querySelector('[data-phones="hero"]').innerHTML = HERO_CLIPS.map(phoneMarkup).join('');
document.querySelector('[data-cases]').innerHTML = CASES.map(caseMarkup).join('');

const reducedMotion = prefersReducedMotion();
const { players, observe } = initPhones({ observeHero: false });
const heroPlayers = HERO_CLIPS.map((c) => players.get(c.id));

const lenis = initSmoothScroll();
initNav();
initMenu({ onOpen: () => lenis?.stop(), onClose: () => lenis?.start() });
initFaq();
initForm();
initBeforeAfter();

const start = () => {
  playHeroIntro({
    heroPlayers,
    reducedMotion,
    // After the intro, hero phones follow the same in/out-of-view rules as the rest
    onDone: () => heroPlayers.forEach((p) => observe(p.root)),
  });

  if (reducedMotion) return;
  initReveals();
  initParallax();
  initCursor();
  initMagnetic();
  ScrollTrigger.refresh();
};

// Split and measure only once the variable fonts are in
document.fonts.ready.then(start);
