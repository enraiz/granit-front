// ---------------------------------------------------------------------------
// SavedViewSelector — dropdown + dialog for saved views (Story #54)
// ---------------------------------------------------------------------------

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Label,
} from '@granit/ui';
import { BookmarkIcon, PlusIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';


import type { UseSavedViewsReturn } from '../hooks/use-saved-views.js';
import type { SavedViewSummary } from '../types/saved-views.js';
import type { FormEvent } from 'react';

export interface SavedViewSelectorProps {
  /** The useSavedViews return value. */
  readonly savedViews: UseSavedViewsReturn;
  /** Currently selected view ID. */
  readonly selectedViewId?: string;
  /** Callback when a view is selected. */
  readonly onSelect: (view: SavedViewSummary) => void;
  /** Callback to get current filter state for saving. */
  readonly onSave?: () => {
    filterJson?: string;
    sortJson?: string;
    groupByJson?: string;
    visibleColumnsJson?: string;
  };
  /** CSS class for the root container. */
  readonly className?: string;
}

/**
 * Dropdown with list of saved views + dialog for creating new views.
 *
 * @example
 * ```tsx
 * <SavedViewSelector
 *   savedViews={savedViews}
 *   selectedViewId={currentViewId}
 *   onSelect={(view) => applyView(view)}
 *   onSave={() => getCurrentFilters()}
 * />
 * ```
 */
export function SavedViewSelector({
  savedViews,
  selectedViewId,
  onSelect,
  onSave,
  className,
}: Readonly<SavedViewSelectorProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const { views, create, remove, setDefault } = savedViews;

  const handleCreate = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!newViewName.trim()) return;

      const state = onSave?.() ?? {};
      create.mutate(
        {
          name: newViewName.trim(),
          isShared: false,
          isDefault: false,
          ...state,
        },
        {
          onSuccess: () => {
            setNewViewName('');
            setDialogOpen(false);
          },
        },
      );
    },
    [newViewName, onSave, create],
  );

  const viewList = views.data ?? [];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            data-slot="saved-view-selector"
            className={className}
          >
            <BookmarkIcon className="mr-1.5 size-4" />
            Views
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Saved views</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {viewList.length === 0 && (
            <DropdownMenuItem disabled>No saved views</DropdownMenuItem>
          )}
          {viewList.map((view) => (
            <DropdownMenuItem
              key={view.id}
              data-active={view.id === selectedViewId}
              className="group flex items-center justify-between"
              onClick={() => onSelect(view)}
            >
              <span className="flex items-center gap-1.5">
                {view.isDefault && <StarIcon className="size-3 text-yellow-500" />}
                {view.name}
              </span>
              <span className="flex gap-1 opacity-0 group-hover:opacity-100">
                {!view.isDefault && (
                  <button
                    type="button"
                    aria-label={`Set ${view.name} as default`}
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDefault.mutate(view.id);
                    }}
                  >
                    <StarIcon className="size-3" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={`Delete ${view.name}`}
                  className="text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove.mutate(view.id);
                  }}
                >
                  <Trash2Icon className="size-3" />
                </button>
              </span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialogOpen(true)}>
            <PlusIcon className="mr-1.5 size-4" />
            Save current view
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Save view</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="view-name">View name</Label>
              <Input
                id="view-name"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="Enter a name for this view"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newViewName.trim() || create.isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
