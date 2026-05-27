import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Skeleton from './Skeleton';

describe('Skeleton', () => {
  it('renders text variant with animate-pulse', () => {
    const { container } = render(<Skeleton variant="text" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('animate-pulse');
    expect(el.className).toContain('rounded');
  });

  it('renders card variant with h-80', () => {
    const { container } = render(<Skeleton variant="card" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('h-80');
    expect(el.className).toContain('animate-pulse');
  });

  it('renders circle variant with rounded-full', () => {
    const { container } = render(<Skeleton variant="circle" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('rounded-full');
    expect(el.className).toContain('animate-pulse');
  });

  it('renders detail variant with max-w-4xl', () => {
    const { container } = render(<Skeleton variant="detail" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('max-w-4xl');
    expect(el.className).toContain('animate-pulse');
  });

  it('renders image variant with rounded-lg', () => {
    const { container } = render(<Skeleton variant="image" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('rounded-lg');
    expect(el.className).toContain('animate-pulse');
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton variant="text" className="my-custom-class" />);

    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('my-custom-class');
  });
});
