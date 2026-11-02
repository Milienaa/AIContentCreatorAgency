import { describe, it, expect } from 'vitest';
import { generationProgress, isTimedOut } from '../src/phone/generation.js';

describe('generationProgress', () => {
  it('starts at 0 even when the clip is fully cached', () => {
    expect(generationProgress({ bufferedRatio: 1, elapsedMs: 0 })).toBe(0);
  });

  it('is paced by the minimum duration when buffering is ahead', () => {
    expect(generationProgress({ bufferedRatio: 1, elapsedMs: 600 })).toBe(50);
  });

  it('reaches 100 once both buffering and minimum time are done', () => {
    expect(generationProgress({ bufferedRatio: 1, elapsedMs: 1200 })).toBe(100);
  });

  it('never runs ahead of the real buffer', () => {
    expect(generationProgress({ bufferedRatio: 0.3, elapsedMs: 5000 })).toBe(30);
  });

  it('clamps to the 0–100 range', () => {
    expect(generationProgress({ bufferedRatio: 2, elapsedMs: 99999 })).toBe(100);
    expect(generationProgress({ bufferedRatio: -1, elapsedMs: 500 })).toBe(0);
  });
});

describe('isTimedOut', () => {
  it('times out at 8 seconds', () => {
    expect(isTimedOut(8000)).toBe(true);
  });

  it('does not time out before 8 seconds', () => {
    expect(isTimedOut(7999)).toBe(false);
  });
});
