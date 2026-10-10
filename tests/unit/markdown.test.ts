import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '@/lib/markdown';

describe('renderMarkdown', () => {
  it('escapes raw HTML so scripts cannot be injected', () => {
    const html = renderMarkdown('<script>alert(1)</script> **hi**');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>hi</strong>');
  });

  it('only allows http(s) and relative links', () => {
    expect(renderMarkdown('[x](javascript:alert(1))')).not.toContain('<a ');
    expect(renderMarkdown('[shop](/)')).toContain('<a href="/">shop</a>');
  });

  it('never emits an H1 (the page title is the H1)', () => {
    expect(renderMarkdown('# Title')).toBe('<h2>Title</h2>');
  });
});
