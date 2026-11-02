const mq = (q) => typeof window !== 'undefined' && window.matchMedia?.(q).matches === true;

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const isTouch = () => mq('(pointer: coarse)');
export const isDesktop = () => mq('(min-width: 1024px)');
