import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Separator,
  Spinner,
} from '@granit/ui';
import { AlertTriangle, CheckCircle, Loader2, Play, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useImportJob } from '../hooks/use-import-job.js';
import { useImportPreview } from '../hooks/use-import-preview.js';
import { useImportReport } from '../hooks/use-import-report.js';

import { ColumnMappingTable } from './column-mapping-table.js';
import { FileDropZone } from './file-drop-zone.js';
import { ImportReportSummary } from './import-report-summary.js';
import { ImportRowErrors } from './import-row-errors.js';

import type { ImportJobStatus } from '../types/import-job.js';

export interface ImportDialogProps {
  /** The import definition name. */
  readonly definitionName: string;
  /** Whether the dialog is open. */
  readonly open: boolean;
  /** Callback when the dialog open state changes. */
  readonly onOpenChange: (open: boolean) => void;
  /** Accepted file types. Defaults to `['.csv', '.xlsx', '.xls']`. */
  readonly accept?: readonly string[];
}

type ImportStep = 'upload' | 'map' | 'execute' | 'report';

const STEP_LABELS: Record<ImportStep, string> = {
  upload: 'Upload file',
  map: 'Map columns',
  execute: 'Execute',
  report: 'Report',
};

const STATUS_ICONS: Record<ImportJobStatus, 'loading' | 'success' | 'error' | 'warning'> = {
  Created: 'loading',
  Previewed: 'loading',
  Mapped: 'success',
  Executing: 'loading',
  Completed: 'success',
  PartiallyCompleted: 'warning',
  Failed: 'error',
  Cancelled: 'error',
};

/**
 * Import wizard dialog.
 *
 * Four-step workflow: Upload -> Map columns -> Execute -> Report.
 */
export function ImportDialog({
  definitionName,
  open,
  onOpenChange,
  accept = ['.csv', '.xlsx', '.xls'],
}: ImportDialogProps) {
  const importJob = useImportJob();
  const importPreview = useImportPreview();
  const importReport = useImportReport(
    importJob.isTerminal ? importJob.job?.id : undefined,
  );

  const [step, setStep] = useState<ImportStep>('upload');

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setStep('upload');
      importJob.reset();
      importPreview.reset();
    }

  }, [open]);

  // Handle file upload
  const handleFileSelect = useCallback(
    (file: File) => {
      importJob.upload(file, definitionName);
    },
    [definitionName, importJob],
  );

  // After upload succeeds, trigger preview
  useEffect(() => {
    if (importJob.job?.status === 'Created' && step === 'upload') {
      importPreview.preview(importJob.job.id);
    }

  }, [importJob.job?.status, importJob.job?.id, step]);

  // After preview succeeds, move to map step
  useEffect(() => {
    if (importPreview.headers.length > 0 && step === 'upload') {
      setStep('map');
    }
  }, [importPreview.headers.length, step]);

  // When job reaches terminal, go to report
  useEffect(() => {
    if (importJob.isTerminal && step === 'execute') {
      setStep('report');
    }
  }, [importJob.isTerminal, step]);

  const handleConfirmMappings = useCallback(() => {
    importJob.confirmMap({ mappings: importPreview.mappings });
    setStep('execute');
  }, [importJob, importPreview.mappings]);

  const handleExecute = useCallback(() => {
    importJob.execute();
  }, [importJob]);

  const handleDryRun = useCallback(() => {
    if (importJob.job) {
      importPreview.dryRun(importJob.job.id);
    }
  }, [importJob.job, importPreview]);

  const isUploading = importJob.isUploading || importPreview.isPreviewing;
  const jobStatus = importJob.job?.status;
  const statusIcon = jobStatus ? STATUS_ICONS[jobStatus] : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-slot="import-dialog"
        className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Import</DialogTitle>
          <DialogDescription>
            {STEP_LABELS[step]}
            {importJob.job && (
              <span className="ml-2 text-muted-foreground">
                — {importJob.job.originalFileName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-1">
          {(['upload', 'map', 'execute', 'report'] as const).map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s === step
                  ? 'bg-primary'
                  : (['upload', 'map', 'execute', 'report'] as const).indexOf(s) <
                      (['upload', 'map', 'execute', 'report'] as const).indexOf(step)
                    ? 'bg-primary/40'
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <div className="space-y-4">
          {/* Step: Upload */}
          {step === 'upload' && (
            <>
              <FileDropZone
                accept={accept}
                onFileSelect={handleFileSelect}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Spinner />
                  <span>Uploading and analyzing file…</span>
                </div>
              )}
            </>
          )}

          {/* Step: Map columns */}
          {step === 'map' && (
            <>
              <ColumnMappingTable
                mappings={importPreview.mappings}
                fieldMetadata={importPreview.fieldMetadata}
                previewRows={importPreview.previewRows}
                headers={importPreview.headers}
                onMappingChange={importPreview.updateMapping}
                disabled={importJob.isConfirming}
              />
              {importPreview.dryRunReport && (
                <>
                  <Separator />
                  <ImportReportSummary report={importPreview.dryRunReport} />
                  {importPreview.dryRunReport.rowErrors.length > 0 && (
                    <ImportRowErrors errors={importPreview.dryRunReport.rowErrors} />
                  )}
                </>
              )}
            </>
          )}

          {/* Step: Execute */}
          {step === 'execute' && (
            <div className="flex flex-col items-center gap-4 py-8">
              {importJob.isExecuting ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">Import in progress…</p>
                </>
              ) : importJob.job?.status === 'Mapped' ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />
                  <p className="text-sm">Mappings confirmed. Ready to execute.</p>
                </>
              ) : (
                <>
                  {statusIcon === 'loading' && <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />}
                  {statusIcon === 'success' && <CheckCircle className="h-8 w-8 text-green-600" aria-hidden="true" />}
                  {statusIcon === 'warning' && <AlertTriangle className="h-8 w-8 text-yellow-600" aria-hidden="true" />}
                  {statusIcon === 'error' && <X className="h-8 w-8 text-red-600" aria-hidden="true" />}
                  <p className="text-sm">{jobStatus}</p>
                </>
              )}
            </div>
          )}

          {/* Step: Report */}
          {step === 'report' && importReport.report.data && (
            <>
              <ImportReportSummary
                report={importReport.report.data}
                onDownloadCorrection={
                  importReport.report.data.failedRows > 0
                    ? importReport.downloadCorrection
                    : undefined
                }
              />
              {importReport.report.data.rowErrors.length > 0 && (
                <ImportRowErrors errors={importReport.report.data.rowErrors} />
              )}
            </>
          )}

          {step === 'report' && importReport.report.isLoading && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Spinner />
              <span className="text-sm text-muted-foreground">Loading report…</span>
            </div>
          )}

          {/* Error display */}
          {(importJob.error ?? importPreview.error) && (
            <p className="text-sm text-red-600">
              {(importJob.error ?? importPreview.error)?.message}
            </p>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>

            {step === 'map' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDryRun}
                  disabled={importPreview.isDryRunning}
                >
                  {importPreview.isDryRunning ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  Dry run
                </Button>
                <Button
                  onClick={handleConfirmMappings}
                  disabled={importJob.isConfirming}
                >
                  Confirm mappings
                </Button>
              </>
            )}

            {step === 'execute' && importJob.job?.status === 'Mapped' && (
              <Button onClick={handleExecute} disabled={importJob.isExecuting}>
                {importJob.isExecuting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Play className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Execute import
              </Button>
            )}

            {step === 'execute' && importJob.isPolling && (
              <Button
                variant="destructive"
                onClick={() => importJob.cancel()}
              >
                Cancel
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
