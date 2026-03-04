import { useState } from 'react';

import { SavedViewSelector } from '@granit/querying';

import { mockSavedViews } from './_mocks';

import type { UseSavedViewsReturn } from '@granit/querying';
import type { SavedViewSummary } from '@granit/querying';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/SavedViewSelector',
  component: SavedViewSelector,
  tags: ['autodocs'],
} satisfies Meta<typeof SavedViewSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mock UseSavedViewsReturn
// ---------------------------------------------------------------------------

/**
 * Creates a mock UseSavedViewsReturn that satisfies the interface
 * without requiring TanStack Query providers.
 */
function createMockSavedViews(views: SavedViewSummary[]): UseSavedViewsReturn {
  const noopMutation = {
    mutate: () => {},
    mutateAsync: () => Promise.resolve(undefined as never),
    isPending: false,
    isIdle: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    variables: undefined,
    status: 'idle' as const,
    failureCount: 0,
    failureReason: null,
    reset: () => {},
    context: undefined,
    submittedAt: 0,
  };

  return {
    views: {
      data: views,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: 'success' as const,
      isFetching: false,
      isPending: false,
      isRefetching: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isStale: false,
      isLoadingError: false,
      fetchStatus: 'idle' as const,
      refetch: () => Promise.resolve(undefined as never),
      promise: Promise.resolve(undefined as never),
    } as unknown as UseSavedViewsReturn['views'],
    create: noopMutation as unknown as UseSavedViewsReturn['create'],
    update: noopMutation as unknown as UseSavedViewsReturn['update'],
    remove: noopMutation as unknown as UseSavedViewsReturn['remove'],
    setDefault: noopMutation as unknown as UseSavedViewsReturn['setDefault'],
  };
}

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function SavedViewSelectorInteractive() {
  const [selectedViewId, setSelectedViewId] = useState<string>('view-1');
  const savedViews = createMockSavedViews(mockSavedViews);

  return (
    <div className="flex flex-col gap-4">
      <SavedViewSelector
        savedViews={savedViews}
        selectedViewId={selectedViewId}
        onSelect={(view: SavedViewSummary) => {
          setSelectedViewId(view.id);
          // eslint-disable-next-line no-console
          console.log('Selected view:', view.name);
        }}
        onSave={() => ({
          filterJson: '{}',
          sortJson: '[]',
        })}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {mockSavedViews.find((v) => v.id === selectedViewId)?.name ?? '(none)'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => <SavedViewSelectorInteractive />,
};
