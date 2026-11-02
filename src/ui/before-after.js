/** Sketch/final comparison. The transparent range input handles drag, tap and keyboard. */
export function initBeforeAfter() {
  document.querySelectorAll('[data-before-after]').forEach((root) => {
    const range = root.querySelector('input[type="range"]');
    const update = () => root.style.setProperty('--pos', `${range.value}%`);
    range.addEventListener('input', update);
    update();
  });
}
