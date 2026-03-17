# @granit/react-templating

React bindings for `@granit/templating` -- TemplatingProvider, hooks.

## Installation

```bash
pnpm add @granit/react-templating
```

## API

### Components

- `TemplatingProvider` -- provides templating configuration to the component tree

### Hooks

- `useTemplatingConfig()` -- access templating configuration from context
- `useTemplate(id)` -- fetch a single template
- `useTemplates(params?)` -- list templates
- `useTemplateCategories()` -- list template categories
- `useTemplateCategoryMutations()` -- create, update, delete template categories
- `useTemplateMutations()` -- create, update, delete templates
- `useTemplatePreview(id)` -- preview rendered template output
- `useTemplateBinaryPreview(id)` -- preview binary template output (PDF, etc.)
- `useTemplateHistory(id)` -- fetch template revision history
- `useTemplateRevision(id, revisionId)` -- fetch a specific revision
- `useTemplateVariables(id)` -- fetch available template variables

### Types

- `TemplatingProviderProps` -- props for `TemplatingProvider`

## Usage

```tsx
import { TemplatingProvider, useTemplates, useTemplatePreview } from '@granit/react-templating';

function App() {
  return (
    <TemplatingProvider config={{ basePath: '/api/templates' }}>
      <TemplateList />
    </TemplatingProvider>
  );
}

function TemplateList() {
  const { data: templates } = useTemplates();

  return (
    <ul>
      {templates?.map((t) => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  );
}
```

## License

Apache-2.0
