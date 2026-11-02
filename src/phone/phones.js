import { PhonePlayer } from './phone-player.js';
import { createPlaybackManager } from './playback-manager.js';
import { prefersReducedMotion, isTouch } from '../motion/prefs.js';

/**
 * Wires every [data-phone] on the page: one shared playback manager,
 * one IntersectionObserver that calls enter()/leave().
 * Returns the players map so the hero intro can trigger its phones directly.
 */
export function initPhones({ observeHero = true } = {}) {
  const players = new Map();
  const manager = createPlaybackManager({
    max: isTouch() ? 2 : 3,
    onEvict: (id) => players.get(id)?.evict(),
  });
  const reducedMotion = prefersReducedMotion();

  document.querySelectorAll('[data-phone]').forEach((root) => {
    players.set(root.dataset.id, new PhonePlayer(root, { manager, reducedMotion }));
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const player = players.get(target.dataset.id);
        if (!player) return;
        if (isIntersecting) player.enter();
        else player.leave();
      });
    },
    { threshold: 0.4 },
  );

  players.forEach((player, id) => {
    if (!observeHero && id.startsWith('hero-')) return;
    io.observe(player.root);
  });

  return { players, observe: (root) => io.observe(root) };
}
