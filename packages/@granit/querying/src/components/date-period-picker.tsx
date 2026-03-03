// ---------------------------------------------------------------------------
// DatePeriodPicker — period selector for date filters (Story #54)
// ---------------------------------------------------------------------------

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@granit/ui';

import type { DateFilterMeta, DatePeriod } from '../types/query-metadata.js';

/** Human-readable labels for date periods. */
const PERIOD_LABELS: Readonly<Record<DatePeriod, string>> = {
  Today: 'Today',
  ThisWeek: 'This week',
  ThisMonth: 'This month',
  LastMonth: 'Last month',
  ThisQuarter: 'This quarter',
  ThisYear: 'This year',
  Custom: 'Custom',
};

export interface DatePeriodPickerProps {
  /** Date filter metadata. */
  readonly dateFilter: DateFilterMeta;
  /** Currently selected period. */
  readonly value?: DatePeriod;
  /** Callback when period changes. */
  readonly onValueChange: (period: DatePeriod) => void;
  /** CSS class for the root container. */
  readonly className?: string;
}

/**
 * Period selector dropdown for date-based filtering.
 *
 * @example
 * ```tsx
 * <DatePeriodPicker
 *   dateFilter={meta.dateFilters[0]}
 *   value={selectedPeriod}
 *   onValueChange={setSelectedPeriod}
 * />
 * ```
 */
export function DatePeriodPicker({
  dateFilter,
  value,
  onValueChange,
  className,
}: Readonly<DatePeriodPickerProps>) {
  return (
    <Select
      value={value ?? dateFilter.defaultPeriod}
      onValueChange={(v) => onValueChange(v as DatePeriod)}
    >
      <SelectTrigger data-slot="date-period-picker" className={className}>
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {dateFilter.availablePeriods.map((period) => (
          <SelectItem key={period} value={period}>
            {PERIOD_LABELS[period]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
