import { phoneMarkup } from '../phone/render.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const listTools = (tools) =>
  tools.length > 1 ? `${tools.slice(0, -1).join(', ')} and ${tools.at(-1)}` : tools[0];

export function caseMarkup(c, i) {
  const side = i % 2 === 0 ? 'left' : 'right';
  return `
<article class="case case--${side}" aria-labelledby="case-${esc(c.id)}">
  <div class="case__media" data-parallax="${side === 'left' ? -8 : 8}">
    ${phoneMarkup(c)}
  </div>
  <div class="case__info" data-reveal>
    <p class="case__category label">${esc(c.category)}</p>
    <h3 class="case__client display" id="case-${esc(c.id)}">${esc(c.client)}</h3>
    <p class="case__brief lede">${esc(c.brief)}</p>
    <dl class="case__metrics">
      ${c.metrics
        .map(
          (m) => `<div class="metric"><dt class="metric__label">${esc(m.label)}</dt><dd class="metric__value display">${esc(m.value)}</dd></div>`,
        )
        .join('')}
    </dl>
    <p class="case__tools">Made with ${esc(listTools(c.tools))}.</p>
  </div>
</article>`;
}
