import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PhonePlayer, PROMPT_MS } from '../src/phone/phone-player.js';
import { phoneMarkup } from '../src/phone/render.js';
import { createPlaybackManager } from '../src/phone/playback-manager.js';

const clip = {
  id: 'test-clip',
  prompt: 'espresso pouring in slow motion',
  src: '/media/test.mp4',
  poster: '/media/test.webp',
  label: 'Oro Coffee — espresso launch',
};

function mount({ reducedMotion = false } = {}) {
  document.body.innerHTML = phoneMarkup(clip);
  const root = document.querySelector('[data-phone]');
  const video = root.querySelector('video');
  video.load = vi.fn();
  video.play = vi.fn(() => Promise.resolve());
  video.pause = vi.fn();
  const manager = createPlaybackManager({ max: 3 });
  vi.spyOn(manager, 'release');
  const player = new PhonePlayer(root, { manager, reducedMotion });
  return { root, video, manager, player };
}

describe('PhonePlayer', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('types the prompt, then starts generating', () => {
    const { player } = mount();
    player.enter();
    expect(player.state).toBe('prompt');
    vi.advanceTimersByTime(PROMPT_MS);
    expect(player.state).toBe('generating');
  });

  it('renders and plays once buffered and the minimum time has passed', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(1300);
    expect(player.state).toBe('rendered');
    expect(video.play).toHaveBeenCalled();
  });

  it('does not render before 1.2s even when the clip is cached', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(600);
    expect(player.state).toBe('generating');
  });

  it('shows Tap to retry after 8s without data', () => {
    const { player, root } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS + 8000);
    expect(player.state).toBe('error');
    expect(root.textContent).toContain('Tap to retry');
  });

  it('retry after an error starts generating again', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS + 8000);
    player.toggle();
    expect(player.state).toBe('generating');
    expect(video.load).toHaveBeenCalledTimes(2);
  });

  it('toggle pauses a rendered video and plays it again', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(1300);
    player.toggle();
    expect(player.state).toBe('paused');
    expect(video.pause).toHaveBeenCalled();
    player.toggle();
    expect(player.state).toBe('rendered');
    expect(video.play).toHaveBeenCalledTimes(2);
  });

  it('with reduced motion, entering shows the poster without autoplay', () => {
    const { player, video } = mount({ reducedMotion: true });
    player.enter();
    expect(player.state).toBe('paused');
    expect(video.play).not.toHaveBeenCalled();
  });

  it('with reduced motion, a tap starts playback', () => {
    const { player, video } = mount({ reducedMotion: true });
    player.enter();
    player.toggle();
    expect(video.play).toHaveBeenCalled();
    expect(player.state).toBe('rendered');
  });

  it('leaving pauses the video and frees the playback slot', () => {
    const { player, video, manager } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(1300);
    player.leave();
    expect(video.pause).toHaveBeenCalled();
    expect(manager.release).toHaveBeenCalledWith('test-clip');
  });

  it('re-entering after render resumes without generating again', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(1300);
    player.leave();
    player.enter();
    expect(player.state).toBe('rendered');
    expect(video.load).toHaveBeenCalledTimes(1);
  });

  it('a user-paused video stays paused when scrolled back into view', () => {
    const { player, video } = mount();
    player.enter();
    vi.advanceTimersByTime(PROMPT_MS);
    video.dispatchEvent(new Event('canplaythrough'));
    vi.advanceTimersByTime(1300);
    player.toggle();
    player.leave();
    player.enter();
    expect(player.state).toBe('paused');
    expect(video.play).toHaveBeenCalledTimes(1);
  });
});
