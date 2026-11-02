import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion, isTouch } from './prefs.js';

/** Lenis on desktop pointers only; native scroll on touch and with reduced motion. */
export function initSmoothScroll() {
  if (prefersReducedMotion() || isTouch()) return null;

  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -70 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
