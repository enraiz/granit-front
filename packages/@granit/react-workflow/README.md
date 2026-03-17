# @granit/react-workflow

React bindings for `@granit/workflow` -- WorkflowProvider, useWorkflowStatus,
useWorkflowTransition, useWorkflowHistory.

## Installation

```bash
pnpm add @granit/react-workflow
```

## API

### Components

- `WorkflowProvider` -- provides workflow configuration to the component tree

### Hooks

- `useWorkflowConfig()` -- access workflow configuration from context
- `useWorkflowStatus(options)` -- fetch the current workflow status of an entity
- `useWorkflowTransition(options)` -- execute a workflow transition
- `useWorkflowHistory(options)` -- fetch the transition history of an entity

### Types

- `WorkflowProviderProps` -- props for `WorkflowProvider`
- `UseWorkflowStatusOptions`, `UseWorkflowStatusReturn` -- status hook types
- `UseWorkflowTransitionOptions`, `UseWorkflowTransitionReturn` -- transition hook types
- `UseWorkflowHistoryOptions`, `UseWorkflowHistoryReturn` -- history hook types

## Usage

```tsx
import { WorkflowProvider, useWorkflowStatus, useWorkflowTransition } from '@granit/react-workflow';

function App() {
  return (
    <WorkflowProvider config={{ basePath: '/api/workflow' }}>
      <DocumentStatus documentId="123" />
    </WorkflowProvider>
  );
}

function DocumentStatus({ documentId }: { documentId: string }) {
  const { data: status } = useWorkflowStatus({ entityId: documentId });
  const { mutate: transition } = useWorkflowTransition({ entityId: documentId });

  return (
    <div>
      <span>Status: {status?.currentState}</span>
      {status?.availableTransitions.map((t) => (
        <button key={t.name} onClick={() => transition({ transition: t.name })}>
          {t.name}
        </button>
      ))}
    </div>
  );
}
```

## License

Apache-2.0
