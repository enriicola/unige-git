'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import { forwardRef } from 'react';

import { cn } from '#js/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none text-secondary-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-60'
);

const Label = forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
