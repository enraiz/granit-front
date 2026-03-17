# @granit/react-background-jobs

React hooks for background job monitoring -- useBackgroundJobs, usePauseJob, useResumeJob,
useTriggerJob.

## Installation

```bash
pnpm add @granit/react-background-jobs
```

## API

### Hooks

- `useBackgroundJobs(options?)` -- list and monitor background jobs
- `usePauseJob()` -- pause a running job
- `useResumeJob()` -- resume a paused job
- `useTriggerJob()` -- manually trigger a job

### Utilities

- `backgroundJobKeys` -- React Query key factory

### Types

- `BackgroundJobsOptions` -- configuration options for the jobs hook

## Usage

```tsx
import { useBackgroundJobs, useTriggerJob } from '@granit/react-background-jobs';

function JobDashboard() {
  const { data: jobs } = useBackgroundJobs();
  const { mutate: trigger } = useTriggerJob();

  return (
    <ul>
      {jobs?.map((job) => (
        <li key={job.id}>
          {job.name} - {job.state}
          <button onClick={() => trigger(job.id)}>Run now</button>
        </li>
      ))}
    </ul>
  );
}
```

## License

Apache-2.0
