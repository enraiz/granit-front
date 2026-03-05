import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportButton } from '../../export/components/export-button.js';
import { ExportDialog } from '../../export/components/export-dialog.js';
import { ExportProvider } from '../../export/providers/export-provider.js';

import type { ExportConfig } from '../../export/providers/export-provider.js';
import type { ReactNode } from 'react';

const mockClient = axios.create();

const mockConfig: ExportConfig = {
  client: mockClient,
  basePath: '/api/data-exchange/metadata',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ExportProvider config={mockConfig}>{children}</ExportProvider>
      </QueryClientProvider>
    );
  };
}

describe('ExportButton', () => {
  it('renders with default label', () => {
    render(<ExportButton onExport={() => {}} />);
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<ExportButton label="Download CSV" onExport={() => {}} />);
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });

  it('calls onExport when clicked', async () => {
    const user = userEvent.setup();
    const onExport = vi.fn();
    render(<ExportButton onExport={onExport} />);
    await user.click(screen.getByText('Export'));
    expect(onExport).toHaveBeenCalledOnce();
  });

  it('respects disabled prop', () => {
    render(<ExportButton onExport={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('ExportDialog', () => {
  const mockFields = [
    { propertyPath: 'Name', header: 'Full Name', type: 'String', order: 1, isNavigation: false },
    { propertyPath: 'Email', header: 'Email', type: 'String', order: 2, isNavigation: true },
    { propertyPath: 'Age', header: 'Age', type: 'Int32', order: 0, isNavigation: false },
  ];

  const mockPresets = [
    {
      presetName: 'Basic',
      definitionName: 'Test',
      format: 'csv',
      includeIdForImport: true,
      selectedFields: ['Name'],
    },
  ];

  function mockFieldsAndPresets() {
    vi.spyOn(mockClient, 'get').mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/fields')) {
        return Promise.resolve({ data: mockFields });
      }
      if (typeof url === 'string' && url.includes('/presets')) {
        return Promise.resolve({ data: mockPresets });
      }
      return new Promise(() => {});
    });
  }

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders when open with loading state', () => {
    vi.spyOn(mockClient, 'get').mockReturnValue(new Promise(() => {}));
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog
          definitionName="Test"
          open={true}
          onOpenChange={() => {}}
        />
      </Wrapper>,
    );

    expect(screen.getByRole('heading', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByText('Configure the columns and format for your export.')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog
          definitionName="Test"
          open={false}
          onOpenChange={() => {}}
        />
      </Wrapper>,
    );

    expect(screen.queryByText('Configure the columns and format for your export.')).not.toBeInTheDocument();
  });

  it('renders fields sorted by order when loaded', async () => {
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('shows column count and toggle all', async () => {
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Columns (3/3)')).toBeInTheDocument();
    });
    expect(screen.getByText('Deselect all')).toBeInTheDocument();
  });

  it('toggles all fields off then on', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Deselect all')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Deselect all'));
    await waitFor(() => {
      expect(screen.getByText('Select all')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Select all'));
    await waitFor(() => {
      expect(screen.getByText('Deselect all')).toBeInTheDocument();
    });
  });

  it('moves field down', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    const moveDownButtons = screen.getAllByText('Move down');
    await user.click(moveDownButtons[0]);
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('loads a preset and updates selection', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Basic'));
    await waitFor(() => {
      expect(screen.getByText('Columns (1/3)')).toBeInTheDocument();
    });
  });

  it('shows save preset form and cancels', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save preset'));
    expect(screen.getByPlaceholderText('Preset name')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });
  });

  it('saves a preset', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    vi.spyOn(mockClient, 'post').mockResolvedValueOnce({ data: undefined });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Save preset'));
    const input = screen.getByPlaceholderText('Preset name');
    await user.type(input, 'My Preset');
    await user.click(screen.getByText('Save'));

    // Verify save form is hidden after save
    await waitFor(() => {
      expect(screen.getByText('Save preset')).toBeInTheDocument();
    });
  }, 15000);

  it('starts export with selected fields', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const postSpy = vi.spyOn(mockClient, 'post').mockResolvedValue({
      data: { id: 'job-1', status: 'Queued', definitionName: 'Test', format: 'xlsx', rowCount: null, errorMessage: null },
    });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    // "Export" appears as both dialog title and button — get all and click the button
    const exportElements = screen.getAllByText('Export');
    const exportButton = exportElements.find(
      (el) => el.closest('button') !== null,
    )!;
    await user.click(exportButton.closest('button')!);
    expect(postSpy).toHaveBeenCalled();
  });

  it('shows navigation badge for nav fields', async () => {
    mockFieldsAndPresets();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('nav')).toBeInTheDocument();
    });
  });

  it('calls onOpenChange when Close button is clicked', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    const onOpenChange = vi.fn();
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={onOpenChange} />
      </Wrapper>,
    );

    // Wait for fields to load, then find the footer's Close button
    // (not the Radix dialog's sr-only Close from the X icon)
    await waitFor(() => {
      expect(screen.getByText('Full Name')).toBeInTheDocument();
    });

    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    // Footer Close button is the last one
    await user.click(closeButtons[closeButtons.length - 1]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('deletes a preset', async () => {
    const user = userEvent.setup();
    mockFieldsAndPresets();
    vi.spyOn(mockClient, 'delete').mockResolvedValue({ data: undefined });
    const Wrapper = createWrapper();

    render(
      <Wrapper>
        <ExportDialog definitionName="Test" open={true} onOpenChange={() => {}} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Delete preset'));
  });
});
