import { describe, it, expect } from 'vitest';
import { validateContact } from '../src/ui/form.js';

const valid = {
  name: 'Maya',
  email: 'maya@northline.com',
  brand: '',
  budget: '$1,000–3,000',
  message: '',
};

describe('validateContact', () => {
  it('accepts a complete brief', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('asks for a name when it is empty or whitespace', () => {
    expect(validateContact({ ...valid, name: '   ' })).toEqual({
      name: 'Add your name so we know who to reply to.',
    });
  });

  it('explains the expected email format', () => {
    expect(validateContact({ ...valid, email: 'abc' })).toEqual({
      email: 'Enter an email like name@brand.com.',
    });
  });

  it('treats an empty email as invalid', () => {
    expect(validateContact({ ...valid, email: '' }).email).toBe('Enter an email like name@brand.com.');
  });

  it('asks for a budget range', () => {
    expect(validateContact({ ...valid, budget: '' })).toEqual({ budget: 'Pick a budget range.' });
  });

  it('reports every problem at once', () => {
    expect(Object.keys(validateContact({ name: '', email: 'x@', brand: '', budget: '', message: '' }))).toEqual([
      'name',
      'email',
      'budget',
    ]);
  });
});
