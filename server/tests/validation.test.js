import { describe, it, expect } from 'vitest';
import { isValidUrl, validateSubmission } from '../src/validation.js';

describe('URL validation', () => {
  it.each([
    'https://github.com/user/repo',
    'http://example.com',
    'http://localhost:3000/page',
  ])('accepts %s', (url) => {
    expect(isValidUrl(url)).toBe(true);
  });

  it.each([
    '',
    'not-a-url',
    'ftp://example.com/file',
    'javascript:alert(1)',
    'http://',
  ])('rejects "%s"', (url) => {
    expect(isValidUrl(url)).toBe(false);
  });
});

describe('Submission validation', () => {
  it('reports every missing field', () => {
    const { valid, errors } = validateSubmission({});
    expect(valid).toBe(false);
    expect(Object.keys(errors)).toEqual([
      'name',
      'registrationNumber',
      'assignmentTitle',
      'submissionUrl',
    ]);
  });

  it('treats whitespace-only values as missing', () => {
    const { valid, errors } = validateSubmission({
      name: '   ',
      registrationNumber: '  ',
      assignmentTitle: 'x',
      submissionUrl: 'https://example.com',
    });
    expect(valid).toBe(false);
    expect(errors.name).toBeDefined();
    expect(errors.registrationNumber).toBeDefined();
  });
});