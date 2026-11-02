import { describe, it, expect, vi } from 'vitest';
import { createPlaybackManager } from '../src/phone/playback-manager.js';

describe('createPlaybackManager', () => {
  it('evicts the oldest active player when the limit is exceeded', () => {
    const onEvict = vi.fn();
    const m = createPlaybackManager({ max: 2, onEvict });
    m.request('a');
    m.request('b');
    m.request('c');
    expect(m.active()).toEqual(['b', 'c']);
    expect(onEvict).toHaveBeenCalledWith('a');
    expect(onEvict).toHaveBeenCalledTimes(1);
  });

  it('frees a slot on release', () => {
    const m = createPlaybackManager({ max: 2 });
    m.request('b');
    m.request('c');
    m.release('b');
    expect(m.active()).toEqual(['c']);
  });

  it('does not duplicate an id that is already active', () => {
    const onEvict = vi.fn();
    const m = createPlaybackManager({ max: 2, onEvict });
    m.request('c');
    m.request('c');
    expect(m.active()).toEqual(['c']);
    expect(onEvict).not.toHaveBeenCalled();
  });

  it('request returns true when the player may play', () => {
    const m = createPlaybackManager({ max: 1 });
    expect(m.request('a')).toBe(true);
  });
});
