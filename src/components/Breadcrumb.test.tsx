import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumb from './Breadcrumb';

function renderBreadcrumb(initialEntries: string[]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Breadcrumb />
    </MemoryRouter>,
  );
}

describe('Breadcrumb', () => {
  it('renders "Home" for root path /', () => {
    renderBreadcrumb(['/']);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.queryByText('Browse')).toBeNull();
    expect(document.querySelector('.lucide-chevron-right')).toBeNull();
  });

  it('renders "Home > Browse" for path /browse', () => {
    renderBreadcrumb(['/browse']);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Browse')).toBeDefined();
    expect(document.querySelector('.lucide-chevron-right')).toBeDefined();
  });

  it('renders "Home > Browse" even when URL has query params', () => {
    renderBreadcrumb(['/browse?category=dogs']);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Browse')).toBeDefined();
    expect(screen.queryByText('dogs')).toBeNull();
    expect(screen.queryByText('category')).toBeNull();
  });

  it('last segment is not a link (span), previous segments are links', () => {
    renderBreadcrumb(['/browse']);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeDefined();
    expect(homeLink.getAttribute('href')).toBe('/');

    const browseLinks = screen.queryByRole('link', { name: 'Browse' });
    expect(browseLinks).toBeNull();

    const browseSpan = screen.getByText('Browse');
    expect(browseSpan.tagName).toBe('SPAN');
  });

  it('has aria-label="Breadcrumb" on nav element', () => {
    renderBreadcrumb(['/']);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeDefined();
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('renders correct number of list items for path /pets/123', () => {
    renderBreadcrumb(['/pets/123']);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Pets')).toBeDefined();
    expect(screen.getByText('123')).toBeDefined();
  });

  it('renders separators with aria-hidden="true"', () => {
    renderBreadcrumb(['/browse']);

    const separator = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(separator).toBeDefined();
    expect(separator.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders unknown segments as raw text (graceful fallback)', () => {
    renderBreadcrumb(['/browse/xyz']);

    expect(screen.getByText('Home')).toBeDefined();
    expect(screen.getByText('Browse')).toBeDefined();
    expect(screen.getByText('xyz')).toBeDefined();
  });
});
