/** Full-screen menu: aria-expanded, Esc to close, focus kept inside while open. */
export function initMenu({ onOpen = () => {}, onClose = () => {} } = {}) {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (!toggle || !menu) return;
  const label = toggle.querySelector('.nav__toggle-label');
  let closeTimer;

  const focusables = () => [toggle, ...menu.querySelectorAll('a')];

  const open = () => {
    clearTimeout(closeTimer);
    menu.hidden = false;
    requestAnimationFrame(() => (menu.dataset.open = 'true'));
    toggle.setAttribute('aria-expanded', 'true');
    label.textContent = 'Close';
    document.documentElement.style.overflow = 'hidden';
    onOpen();
    menu.querySelector('a')?.focus();
  };

  const close = ({ returnFocus = true } = {}) => {
    menu.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    label.textContent = 'Menu';
    document.documentElement.style.overflow = '';
    onClose();
    closeTimer = setTimeout(() => (menu.hidden = true), 600);
    if (returnFocus) toggle.focus();
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close({ returnFocus: false });
  });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
