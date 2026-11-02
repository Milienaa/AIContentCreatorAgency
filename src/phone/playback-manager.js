/**
 * Caps how many phone videos play at once. When a new one asks to play
 * past the cap, the oldest is evicted (its owner pauses it in onEvict).
 */
export function createPlaybackManager({ max, onEvict = () => {} }) {
  const order = [];

  return {
    request(id) {
      if (!order.includes(id)) order.push(id);
      while (order.length > max) onEvict(order.shift());
      return true;
    },
    release(id) {
      const i = order.indexOf(id);
      if (i !== -1) order.splice(i, 1);
    },
    active() {
      return [...order];
    },
  };
}
