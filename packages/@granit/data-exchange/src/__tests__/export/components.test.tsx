import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { ExportButton } from '../../export/components/export-button.js';
import { ExportDialog } from '../../export/components/export-dialog.js';
import { ExportProvider } from '../../export/providers/export-provider.js';

import type { ExportConfig } from '../../export/providers/export-provider.js';
import type { ReactNode } from 'react';

const mockClient = axios.create();

const mockConfig: ExportConfig = {
  client: mockClient,
  basePath: '/api/export',
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
});
