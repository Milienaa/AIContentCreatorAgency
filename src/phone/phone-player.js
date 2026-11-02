import { generationProgress, isTimedOut } from './generation.js';
import { RING_LEN } from './render.js';

export const PROMPT_MS = 900;
const TICK_MS = 50;

/**
 * State machine for one phone:
 * idle → prompt → generating → rendered ⇄ paused, generating → error → generating.
 */
export class PhonePlayer {
  constructor(root, { manager, reducedMotion = false }) {
    this.root = root;
    this.id = root.dataset.id;
    this.manager = manager;
    this.reducedMotion = reducedMotion;
    this.video = root.querySelector('video');
    this.promptEl = root.querySelector('.phone__prompt-text');
    this.pctEl = root.querySelector('.phone__pct');
    this.ringEl = root.querySelector('.phone__ring-fill');
    this.toggleEl = root.querySelector('.phone__toggle');
    this.state = 'idle';
    this.generated = false;
    this.userPaused = false;
    this.ready = false;
    this.timers = [];

    this.video.addEventListener('canplaythrough', () => (this.ready = true));
    this.video.addEventListener('error', () => this.state === 'generating' && this.fail());
    this.toggleEl.addEventListener('click', () => this.toggle());
  }

  setState(state) {
    this.state = state;
    this.root.dataset.state = state;
    const playing = state === 'rendered';
    this.toggleEl.setAttribute(
      'aria-label',
      state === 'error' ? 'Retry loading video' : playing ? 'Pause video' : 'Play video',
    );
  }

  enter() {
    if (this.reducedMotion) {
      if (this.state === 'idle') this.setState('paused');
      return;
    }
    if (this.generated) {
      if (!this.userPaused) this.play();
      return;
    }
    if (this.state !== 'idle') return;
    this.setState('prompt');
    this.typePrompt();
    this.later(() => this.generate(), PROMPT_MS);
  }

  leave() {
    if (!this.generated) {
      this.clearTimers();
      if (this.state === 'prompt' || this.state === 'generating') this.setState('idle');
      return;
    }
    this.video.pause();
    this.manager.release(this.id);
  }

  /** Called by the playback manager when another phone takes the slot. */
  evict() {
    this.video.pause();
  }

  toggle() {
    if (this.state === 'error') return this.generate();
    if (this.state === 'rendered') {
      this.userPaused = true;
      this.video.pause();
      this.manager.release(this.id);
      this.setState('paused');
      return;
    }
    if (this.state === 'paused' || this.state === 'idle') {
      this.userPaused = false;
      if (!this.video.getAttribute('src')) this.attachSource();
      this.generated = true;
      this.play();
    }
  }

  // internals

  typePrompt() {
    const text = this.promptEl.dataset.prompt;
    const step = PROMPT_MS / Math.max(text.length, 1);
    this.promptEl.textContent = '';
    for (let i = 1; i <= text.length; i++) {
      this.later(() => (this.promptEl.textContent = text.slice(0, i)), step * i);
    }
  }

  attachSource() {
    this.video.src = this.video.dataset.src;
    this.video.load();
  }

  generate() {
    this.clearTimers();
    this.ready = false;
    this.setState('generating');
    this.attachSource();
    const start = Date.now();
    const id = setInterval(() => {
      const elapsedMs = Date.now() - start;
      const progress = generationProgress({ bufferedRatio: this.bufferedRatio(), elapsedMs });
      this.paint(progress);
      if (progress >= 100) {
        this.clearTimers();
        this.generated = true;
        this.play();
      } else if (isTimedOut(elapsedMs)) {
        this.fail();
      }
    }, TICK_MS);
    this.timers.push({ clear: () => clearInterval(id) });
  }

  bufferedRatio() {
    if (this.ready || this.video.readyState >= 4) return 1;
    const { buffered, duration } = this.video;
    if (!buffered || !buffered.length || !duration) return 0;
    return buffered.end(buffered.length - 1) / duration;
  }

  paint(progress) {
    this.pctEl.textContent = progress >= 100 ? 'Rendered' : `Generating… ${progress}%`;
    this.ringEl.setAttribute('stroke-dashoffset', String(RING_LEN * (1 - progress / 100)));
    this.root.style.setProperty('--gen', String(progress / 100));
  }

  play() {
    this.manager.request(this.id);
    const p = this.video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    this.setState('rendered');
  }

  fail() {
    this.clearTimers();
    this.setState('error');
  }

  later(fn, ms) {
    const id = setTimeout(fn, ms);
    this.timers.push({ clear: () => clearTimeout(id) });
  }

  clearTimers() {
    this.timers.forEach((t) => t.clear());
    this.timers = [];
  }
}
