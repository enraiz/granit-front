import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { ColumnMappingTable } from '../../import/components/column-mapping-table.js';
import { FileDropZone } from '../../import/components/file-drop-zone.js';
import { ImportButton } from '../../import/components/import-button.js';
import { ImportDialog } from '../../import/components/import-dialog.js';
import { ImportReportSummary } from '../../import/components/import-report-summary.js';
import { ImportRowErrors } from '../../import/components/import-row-errors.js';
import { MappingConfidenceBadge } from '../../import/components/mapping-confidence-badge.js';
import { ImportProvider } from '../../import/providers/import-provider.js';

import type { ImportConfig } from '../../import/providers/import-provider.js';
import type { ImportColumnMapping, ImportFieldMetadata } from '../../import/types/import-preview.js';
import type { ImportReportResponse } from '../../import/types/import-report.js';
import type { ReactNode } from 'react';

const mockClient = axios.create();

const mockConfig: ImportConfig = {
  client: mockClient,
  basePath: '/api/import',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ImportProvider config={mockConfig}>{children}</ImportProvider>
      </QueryClientProvider>
    );
  };
}

describe('ImportButton', () => {
  it('renders with default label', () => {
    render(<ImportButton onImport={() => {}} />);
    expect(screen.getByText('Import')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<ImportButton label="Upload CSV" onImport={() => {}} />);
    expect(screen.getByText('Upload CSV')).toBeInTheDocument();
  });

  it('calls onImport when clicked', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<ImportButton onImport={onImport} />);
    await user.click(screen.getByText('Import'));
    expect(onImport).toHaveBeenCalledOnce();
  });

  it('respects disabled prop', () => {
    render(<ImportButton onImport={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('FileDropZone', () => {
  it('renders with default text', () => {
    render(<FileDropZone onFileSelect={() => {}} />);
    expect(screen.getByText('Drag & drop a file here, or click to browse')).toBeInTheDocument();
  });

  it('shows accepted file types', () => {
    render(<FileDropZone accept={['.csv', '.xlsx']} onFileSelect={() => {}} />);
    expect(screen.getByText('Accepted: .csv, .xlsx')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<FileDropZone onFileSelect={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onFileSelect on drop', () => {
    const onFileSelect = vi.fn();
    render(<FileDropZone onFileSelect={onFileSelect} />);
    const dropZone = screen.getByRole('button');

    const file = new File(['data'], 'test.csv', { type: 'text/csv' });
    const dataTransfer = { files: [file], items: [file], types: ['Files'] };

    fireEvent.dragOver(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('does not call onFileSelect on drop when disabled', () => {
    const onFileSelect = vi.fn();
    render(<FileDropZone onFileSelect={onFileSelect} disabled />);
    const dropZone = screen.getByRole('button');

    const file = new File(['data'], 'test.csv', { type: 'text/csv' });
    const dataTransfer = { files: [file], items: [file], types: ['Files'] };

    fireEvent.drop(dropZone, { dataTransfer });
    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('handles drag over and drag leave', () => {
    const onFileSelect = vi.fn();
    const { container } = render(<FileDropZone onFileSelect={onFileSelect} />);
    const dropZone = screen.getByRole('button');

    fireEvent.dragOver(dropZone, { dataTransfer: { files: [], items: [], types: ['Files'] } });
    fireEvent.dragLeave(dropZone);

    expect(container.querySelector('[data-slot="file-drop-zone"]')).toBeInTheDocument();
  });

  it('opens file dialog on click', async () => {
    const user = userEvent.setup();
    const onFileSelect = vi.fn();
    render(<FileDropZone onFileSelect={onFileSelect} />);
    const dropZone = screen.getByRole('button');

    // Click triggers the hidden input — just verify no crash
    await user.click(dropZone);
    expect(dropZone).toBeInTheDocument();
  });

  it('calls onFileSelect when file is selected via input', () => {
    const onFileSelect = vi.fn();
    render(<FileDropZone onFileSelect={onFileSelect} accept={['.csv']} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['data'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});

describe('MappingConfidenceBadge', () => {
  it.each([
    ['Manual', 'Manual'],
    ['Exact', 'Exact match'],
    ['Fuzzy', 'Fuzzy match'],
    ['Saved', 'Saved'],
    ['Semantic', 'Semantic'],
  ] as const)('renders %s confidence', (confidence, label) => {
    render(<MappingConfidenceBadge confidence={confidence} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe('ImportReportSummary', () => {
  const baseReport: ImportReportResponse = {
    importJobId: 'job-1',
    finalStatus: 'Completed',
    totalRows: 100,
    succeededRows: 100,
    failedRows: 0,
    skippedRows: 0,
    insertedRows: 95,
    updatedRows: 5,
    duration: '00:00:03',
    rowErrors: [],
  };

  it('renders completed status', () => {
    render(<ImportReportSummary report={baseReport} />);
    expect(screen.getByText('Import completed')).toBeInTheDocument();
    expect(screen.getByText('Total rows')).toBeInTheDocument();
  });

  it('renders partially completed status', () => {
    render(<ImportReportSummary report={{ ...baseReport, finalStatus: 'PartiallyCompleted', failedRows: 5 }} />);
    expect(screen.getByText('Partially completed')).toBeInTheDocument();
  });

  it('shows download correction button when there are errors', () => {
    const onDownload = vi.fn();
    render(
      <ImportReportSummary
        report={{ ...baseReport, failedRows: 5 }}
        onDownloadCorrection={onDownload}
      />,
    );
    expect(screen.getByText('Download correction file')).toBeInTheDocument();
  });

  it('hides download button when no errors', () => {
    render(<ImportReportSummary report={baseReport} onDownloadCorrection={() => {}} />);
    expect(screen.queryByText('Download correction file')).not.toBeInTheDocument();
  });
});

describe('ImportRowErrors', () => {
  it('returns null for empty errors', () => {
    const { container } = render(<ImportRowErrors errors={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders error rows', () => {
    const errors = [
      { rowNumber: 5, kind: 'Validation' as const, errorCodes: ['NotEmpty'], message: 'Email is required' },
      { rowNumber: 12, kind: 'Conversion' as const, errorCodes: ['InvalidDate'], message: 'Invalid date format' },
    ];
    render(<ImportRowErrors errors={errors} />);
    expect(screen.getByText('Row errors (2)')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid date format')).toBeInTheDocument();
  });

  it('limits displayed errors', () => {
    const errors = Array.from({ length: 60 }, (_, i) => ({
      rowNumber: i + 1,
      kind: 'Validation' as const,
      errorCodes: ['Error'],
      message: `Error on row ${i + 1}`,
    }));
    render(<ImportRowErrors errors={errors} maxDisplay={10} />);
    expect(screen.getByText('50 more errors not shown. Download the correction file for full details.')).toBeInTheDocument();
  });
});

describe('ColumnMappingTable', () => {
  const mappings: ImportColumnMapping[] = [
    { sourceColumn: 'col_name', targetProperty: 'Name', confidence: 'Exact' },
    { sourceColumn: 'col_email', targetProperty: null, confidence: 'Manual' },
  ];
  const fieldMetadata: ImportFieldMetadata[] = [
    { propertyPath: 'Name', displayName: 'Full Name', clrTypeName: 'System.String', description: null, isRequired: true },
    { propertyPath: 'Email', displayName: 'Email Address', clrTypeName: 'System.String', description: null, isRequired: false },
  ];
  const previewRows = [['Alice', 'alice@example.com']];
  const headers = ['col_name', 'col_email'];

  it('renders source columns', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(screen.getByText('col_name')).toBeInTheDocument();
    expect(screen.getByText('col_email')).toBeInTheDocument();
  });

  it('renders preview data', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
  });

  it('renders confidence badges', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Exact match')).toBeInTheDocument();
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });

  it('renders required field indicator', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(container.querySelector('[data-slot="column-mapping-table"]')).toBeInTheDocument();
  });

  it('shows dash for empty preview value', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={[]}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    // Both rows should show "—" since previewRows is empty
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('renders table headers', () => {
    render(
      <ColumnMappingTable
        mappings={mappings}
        fieldMetadata={fieldMetadata}
        previewRows={previewRows}
        headers={headers}
        onMappingChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Source column')).toBeInTheDocument();
    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Target property')).toBeInTheDocument();
    expect(screen.getByText('Confidence')).toBeInTheDocument();
  });
});

describe('ImportReportSummary — additional', () => {
  it('renders failed status with lowercase label', () => {
    const report: ImportReportResponse = {
      importJobId: 'job-1',
      finalStatus: 'Failed',
      totalRows: 100,
      succeededRows: 0,
      failedRows: 100,
      skippedRows: 0,
      insertedRows: 0,
      updatedRows: 0,
      duration: '00:00:01',
      rowErrors: [],
    };
    render(<ImportReportSummary report={report} />);
    expect(screen.getByText('Import failed')).toBeInTheDocument();
  });

  it('calls onDownloadCorrection when download button is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    const report: ImportReportResponse = {
      importJobId: 'job-1',
      finalStatus: 'PartiallyCompleted',
      totalRows: 100,
      succeededRows: 90,
      failedRows: 10,
      skippedRows: 0,
      insertedRows: 90,
      updatedRows: 0,
      duration: '00:00:02',
      rowErrors: [],
    };
    render(<ImportReportSummary report={report} onDownloadCorrection={onDownload} />);
    await user.click(screen.getByText('Download correction file'));
    expect(onDownload).toHaveBeenCalledOnce();
  });
});

describe('ImportDialog', () => {
  it('renders when open with upload step', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ImportDialog
          definitionName="Test"
          open={true}
          onOpenChange={() => {}}
        />
      </Wrapper>,
    );

    expect(screen.getByRole('heading', { name: 'Import' })).toBeInTheDocument();
    expect(screen.getByText('Drag & drop a file here, or click to browse')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ImportDialog
          definitionName="Test"
          open={false}
          onOpenChange={() => {}}
        />
      </Wrapper>,
    );

    expect(screen.queryByText('Drag & drop a file here, or click to browse')).not.toBeInTheDocument();
  });
});
