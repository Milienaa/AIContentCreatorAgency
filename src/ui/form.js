const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns { field: message } for every problem; empty object means valid. */
export function validateContact({ name = '', email = '', budget = '' }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Add your name so we know who to reply to.';
  if (!EMAIL.test(email.trim())) errors.email = 'Enter an email like name@brand.com.';
  if (!budget) errors.budget = 'Pick a budget range.';
  return errors;
}

export function initForm(form = document.querySelector('[data-form]')) {
  if (!form) return;
  const success = form.querySelector('.form__success');

  const show = (errors) => {
    ['name', 'email', 'budget'].forEach((key) => {
      const input = form.elements[key];
      const field = input.closest('.field');
      const msg = field.querySelector('.field__error');
      const error = errors[key] || '';
      msg.textContent = error;
      field.dataset.invalid = String(Boolean(error));
      input.setAttribute('aria-invalid', String(Boolean(error)));
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = validateContact(data);
    show(errors);
    const first = Object.keys(errors)[0];
    if (first) {
      form.elements[first].focus();
      return;
    }
    form.querySelectorAll('.field, .form__submit').forEach((el) => (el.hidden = true));
    success.hidden = false;
    success.focus?.();
  });

  // Clear a field's error as soon as it becomes valid
  form.addEventListener('input', (e) => {
    const key = e.target.name;
    if (!['name', 'email', 'budget'].includes(key)) return;
    const field = e.target.closest('.field');
    if (field.dataset.invalid !== 'true') return;
    const errors = validateContact(Object.fromEntries(new FormData(form)));
    if (!errors[key]) {
      field.dataset.invalid = 'false';
      field.querySelector('.field__error').textContent = '';
      e.target.setAttribute('aria-invalid', 'false');
    }
  });
}
