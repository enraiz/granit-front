# @granit/react-data-exchange

React bindings for `@granit/data-exchange` -- ExportProvider, ImportProvider, hooks.

## Installation

```bash
pnpm add @granit/react-data-exchange
```

## API

### Export

- `ExportProvider` -- provides export configuration to the component tree
- `useExportConfig()` -- access export configuration
- `useExportJob()` -- manage export job lifecycle
- `useExportPresets()` -- manage saved export presets
- `useExportDefinitions()` -- fetch available export definitions
- `useExportFields()` -- fetch available fields for an export
- `buildExportQueryKey(...)` -- React Query key factory for exports

### Import

- `ImportProvider` -- provides import configuration to the component tree
- `useImportConfig()` -- access import configuration
- `useImportJob()` -- manage import job lifecycle
- `useImportPreview()` -- preview import data before committing
- `useImportReport()` -- fetch import result report
- `buildImportQueryKey(...)` -- React Query key factory for imports

### Types

- `ExportConfig`, `ExportProviderProps` -- export provider configuration
- `ImportConfig`, `ImportProviderProps` -- import provider configuration
- `UseExportJobReturn`, `UseExportPresetsReturn` -- hook return types
- `UseImportJobReturn`, `UseImportPreviewReturn`, `UseImportReportReturn` -- hook return types

## Usage

```tsx
import { ExportProvider, useExportJob } from '@granit/react-data-exchange';

function App() {
  return (
    <ExportProvider config={{ basePath: '/api/exports' }}>
      <ExportButton />
    </ExportProvider>
  );
}

function ExportButton() {
  const { startExport, status } = useExportJob();

  return <button onClick={() => startExport({ format: 'csv' })}>Export CSV</button>;
}
```

## License

Apache-2.0
