import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Command } from 'cmdk';
import { describe, expect, it, vi } from 'vitest';

import { ColumnVisibility } from '../components/column-visibility.js';
import { FilterPresets } from '../components/filter-presets.js';
import { FacetBadge } from '../components/smart-filter-bar/facet-badge.js';
import { SuggestionList } from '../components/smart-filter-bar/suggestion-list.js';

import type { ColumnDefinition, FilterGroupMeta } from '../types/query-metadata.js';
import type { FilterSuggestion, FilterToken } from '../types/smart-filter.js';

describe('FacetBadge', () => {
  const token: FilterToken = {
    id: 'test-1',
    type: 'filter',
    label: 'Status = Active',
    field: 'Status',
    operator: 'Eq',
    value: 'Active',
  };

  it('renders token label', () => {
    render(<FacetBadge token={token} onRemove={vi.fn()} />);
    expect(screen.getByText('Status = Active')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(<FacetBadge token={token} onRemove={vi.fn()} />);
    expect(container.querySelector('[data-slot="facet-badge"]')).toBeInTheDocument();
  });

  it('has data-token-type attribute', () => {
    const { container } = render(<FacetBadge token={token} onRemove={vi.fn()} />);
    expect(container.querySelector('[data-token-type="filter"]')).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<FacetBadge token={token} onRemove={onRemove} />);
    await user.click(screen.getByLabelText('Remove Status = Active'));
    expect(onRemove).toHaveBeenCalledWith('test-1');
  });
});

describe('SuggestionList', () => {
  const suggestions: FilterSuggestion[] = [
    { id: 'f-1', type: 'filter', label: 'Last Name', field: 'LastName', description: 'Filter by name' },
    { id: 'p-1', type: 'preset', label: 'Active', group: 'Status', name: 'Active' },
  ];

  it('renders suggestion items', () => {
    render(
      <Command>
        <SuggestionList suggestions={suggestions} onSelect={vi.fn()} />
      </Command>,
    );
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows empty message when no suggestions', () => {
    render(
      <Command>
        <SuggestionList suggestions={[]} onSelect={vi.fn()} />
      </Command>,
    );
    expect(screen.getByText('No suggestions found.')).toBeInTheDocument();
  });

  it('renders description for suggestions', () => {
    render(
      <Command>
        <SuggestionList suggestions={suggestions} onSelect={vi.fn()} />
      </Command>,
    );
    expect(screen.getByText('Filter by name')).toBeInTheDocument();
  });

  it('has data-slot attributes', () => {
    const { container } = render(
      <Command>
        <SuggestionList suggestions={suggestions} onSelect={vi.fn()} />
      </Command>,
    );
    expect(container.querySelector('[data-slot="suggestion-list"]')).toBeInTheDocument();
  });
});

describe('FilterPresets', () => {
  const groups: FilterGroupMeta[] = [
    {
      name: 'Status',
      label: 'Status',
      presets: [
        { name: 'Active', label: 'Active', isDefault: true },
        { name: 'Inactive', label: 'Inactive', isDefault: false },
      ],
    },
  ];

  it('renders preset group label', () => {
    render(
      <FilterPresets groups={groups} activePresets={{}} onToggle={vi.fn()} />,
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders preset buttons', () => {
    render(
      <FilterPresets groups={groups} activePresets={{}} onToggle={vi.fn()} />,
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <FilterPresets groups={groups} activePresets={{}} onToggle={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="filter-presets"]')).toBeInTheDocument();
  });

  it('returns null when no groups', () => {
    const { container } = render(
      <FilterPresets groups={[]} activePresets={{}} onToggle={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="filter-presets"]')).not.toBeInTheDocument();
  });

  it('calls onToggle when preset is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <FilterPresets groups={groups} activePresets={{}} onToggle={onToggle} />,
    );
    await user.click(screen.getByText('Active'));
    expect(onToggle).toHaveBeenCalledWith('Status', ['Active']);
  });

  it('calls onToggle with empty array when active preset is clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(
      <FilterPresets
        groups={groups}
        activePresets={{ Status: ['Active'] }}
        onToggle={onToggle}
      />,
    );
    await user.click(screen.getByText('Active'));
    expect(onToggle).toHaveBeenCalledWith('Status', []);
  });
});

describe('ColumnVisibility', () => {
  const columns: ColumnDefinition[] = [
    { name: 'LastName', label: 'Last Name', type: 'String', order: 0, isSortable: true, isFilterable: true, isVisible: true },
    { name: 'Age', label: 'Age', type: 'Int32', order: 1, isSortable: true, isFilterable: true, isVisible: true },
    { name: 'Email', label: 'Email', type: 'String', order: 2, isSortable: false, isFilterable: false, isVisible: false },
  ];

  it('renders trigger button', () => {
    render(
      <ColumnVisibility
        columns={columns}
        visibleColumns={['LastName', 'Age']}
        onVisibilityChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Columns')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <ColumnVisibility
        columns={columns}
        visibleColumns={['LastName', 'Age']}
        onVisibilityChange={vi.fn()}
      />,
    );
    expect(container.querySelector('[data-slot="column-visibility"]')).toBeInTheDocument();
  });

  it('shows column names in dropdown', async () => {
    const user = userEvent.setup();
    render(
      <ColumnVisibility
        columns={columns}
        visibleColumns={['LastName', 'Age']}
        onVisibilityChange={vi.fn()}
      />,
    );
    await user.click(screen.getByText('Columns'));
    expect(await screen.findByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });
});
