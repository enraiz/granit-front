import { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { http, HttpResponse } from 'msw';

import { ExportButton, ExportDialog, ExportProvider } from '@granit/data-export';

import { mockFields, mockPresets } from './_mocks';

import type { ExportConfig } from '@granit/data-export';
import type { Meta, StoryObj } from '@storybook/react-vite';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const mockConfig: ExportConfig = {
  client: axios.create({ baseURL: '' }),
  basePath: '/api/data-exchange/export',
  queryKeyPrefix: ['storybook', 'export'],
};

// ---------------------------------------------------------------------------
// Storybook Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'DataExport/ExportDialog',
  component: ExportDialog,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ExportProvider config={mockConfig}>
          <Story />
        </ExportProvider>
      </QueryClientProvider>
    ),
  ],
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data-exchange/export/definitions/Guava.PatientExport/fields', () =>
          HttpResponse.json(mockFields),
        ),
        http.get('/api/data-exchange/export/presets/Guava.PatientExport', () =>
          HttpResponse.json(mockPresets),
        ),
        http.post('/api/data-exchange/export/jobs', () =>
          HttpResponse.json(
            {
              id: 'job-1',
              definitionName: 'Guava.PatientExport',
              format: 'xlsx',
              status: 'Completed',
              rowCount: 42,
              fileName: 'patients_2026-03-04.xlsx',
              errorMessage: null,
              createdAt: '2026-03-04T10:00:00Z',
              completedAt: '2026-03-04T10:00:05Z',
            },
            { status: 201 },
          ),
        ),
        http.post('/api/data-exchange/export/presets', () =>
          new HttpResponse(null, { status: 201 }),
        ),
        http.delete('/api/data-exchange/export/presets/:def/:name', () =>
          new HttpResponse(null, { status: 204 }),
        ),
      ],
    },
  },
} satisfies Meta<typeof ExportDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

function InteractiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <ExportButton onExport={() => setOpen(true)} />
      <ExportDialog
        definitionName="Guava.PatientExport"
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <InteractiveDemo />,
};

export const WithFilters: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Export passes current filters, sort, and search to the job.
        </p>
        <ExportButton onExport={() => setOpen(true)} label="Export filtered data" />
        <ExportDialog
          definitionName="Guava.PatientExport"
          open={open}
          onOpenChange={setOpen}
          sort="-CreatedAt,LastName"
          filter={{ 'Status.Eq': 'Active' }}
          search="test"
        />
      </div>
    );
  },
};

export const OpenByDefault: Story = {
  args: {
    definitionName: 'Guava.PatientExport',
    open: true,
    onOpenChange: () => {},
  },
};
