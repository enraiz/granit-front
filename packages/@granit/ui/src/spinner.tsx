
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import * as React from 'react';

import { cn } from './cn.js';

const spinnerVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-8',
      lg: 'size-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface SpinnerProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Loader2Icon>, 'size'>,
    VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, ...props }: Readonly<SpinnerProps>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner };
