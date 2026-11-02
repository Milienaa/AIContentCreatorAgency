const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * Progress shown in the phone while a clip "generates".
 * Never ahead of the real buffer, never faster than minMs.
 */
export function generationProgress({ bufferedRatio, elapsedMs, minMs = 1200 }) {
  const buffered = Math.round(clamp(bufferedRatio, 0, 1) * 100);
  const paced = Math.floor(clamp(elapsedMs / minMs, 0, 1) * 100);
  return Math.min(buffered, paced);
}

export function isTimedOut(elapsedMs, limitMs = 8000) {
  return elapsedMs >= limitMs;
}
