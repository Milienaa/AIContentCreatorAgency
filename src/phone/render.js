const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const RING_R = 15;
export const RING_LEN = +(2 * Math.PI * RING_R).toFixed(2);

/** Static markup for one phone. PhonePlayer brings it to life. */
export function phoneMarkup(clip) {
  return `
<figure class="phone" data-phone data-id="${esc(clip.id)}" data-state="idle">
  <div class="phone__body">
    <div class="phone__screen">
      <video class="phone__video" muted loop playsinline preload="none"
        poster="${esc(clip.poster)}" data-src="${esc(clip.src)}"
        aria-label="${esc(clip.label)}"></video>
      <div class="phone__noise" aria-hidden="true"></div>
      <div class="phone__ui" aria-live="polite">
        <p class="phone__prompt"><span class="phone__prompt-text" data-prompt="${esc(clip.prompt)}"></span></p>
        <div class="phone__status">
          <svg class="phone__ring" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="${RING_R}" class="phone__ring-track"/>
            <circle cx="18" cy="18" r="${RING_R}" class="phone__ring-fill"
              stroke-dasharray="${RING_LEN}" stroke-dashoffset="${RING_LEN}"/>
          </svg>
          <span class="phone__pct">Generating… 0%</span>
        </div>
        <span class="phone__badge">Rendered</span>
        <span class="phone__error">Couldn't load this clip. Tap to retry</span>
      </div>
      <button class="phone__toggle" type="button" aria-label="Play video"></button>
    </div>
    <span class="phone__island" aria-hidden="true"></span>
  </div>
</figure>`;
}
