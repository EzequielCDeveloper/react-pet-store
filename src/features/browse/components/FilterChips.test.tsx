import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FilterChips from './FilterChips';
import type { BrowseFilters } from '../useBrowseLogic';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

const defaultFilters: BrowseFilters = {
  status: '',
  category: '',
  q: '',
  sort: 'name-asc',
  hasPhoto: '',
};

describe('FilterChips', () => {
  it('returns null when all filters are at defaults', () => {
    const { container } = renderWithRouter(
      <FilterChips
        filters={defaultFilters}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(container.innerHTML).toBe('');
  });

  it('renders status chip when status is not empty', () => {
    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, status: 'available' }}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove Available filter/i })).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('renders category chip when category is set', () => {
    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, category: 'Dogs' }}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove Dogs filter/i })).toBeInTheDocument();
  });

  it('renders search chip when q is set', () => {
    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, q: 'rex' }}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText('"rex"')).toBeInTheDocument();
  });

  it('renders hasPhoto chip when hasPhoto is yes', () => {
    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, hasPhoto: 'yes' }}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText('With photos')).toBeInTheDocument();
  });

  it('clicking x on a chip calls onRemoveFilter with correct key', async () => {
    const user = userEvent.setup();
    const onRemoveFilter = vi.fn();

    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, status: 'available', category: 'Dogs' }}
        onRemoveFilter={onRemoveFilter}
        onClearAll={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: /Remove Available filter/i }));
    expect(onRemoveFilter).toHaveBeenCalledWith('status');
  });

  it('clicking Clear all calls onClearAll', async () => {
    const user = userEvent.setup();
    const onClearAll = vi.fn();

    renderWithRouter(
      <FilterChips
        filters={{ ...defaultFilters, status: 'available' }}
        onRemoveFilter={() => {}}
        onClearAll={onClearAll}
      />
    );

    await user.click(screen.getByText('Clear all'));
    expect(onClearAll).toHaveBeenCalledOnce();
  });

  it('renders multiple chips simultaneously', () => {
    renderWithRouter(
      <FilterChips
        filters={{
          ...defaultFilters,
          status: 'available',
          category: 'Dogs',
          q: 'rex',
          hasPhoto: 'yes',
        }}
        onRemoveFilter={() => {}}
        onClearAll={() => {}}
      />
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Dogs')).toBeInTheDocument();
    expect(screen.getByText('"rex"')).toBeInTheDocument();
    expect(screen.getByText('With photos')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });
});
