'use client';

import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva } from 'class-variance-authority';

import { cn } from '#js/utils';
import { forwardRef } from 'react';

const toggleVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-xs font-medium transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-secondary-300 text-secondary-800 bg-transparent hover:bg-secondary-100 hover:border-secondary-400 data-[state=on]:bg-primary-600 data-[state=on]:border-primary-600 data-[state=on]:text-white',

        outline:
          'border border-secondary-200 text-secondary-700 bg-transparent hover:bg-secondary-100 data-[state=on]:bg-primary-0 data-[state=on]:border-primary-300 data-[state=on]:text-primary-900',
      },
      size: {
        default: 'h-9 px-4 min-w-9',
        sm: 'h-8 px-3 min-w-8 text-[11px]',
        lg: 'h-10 px-5 min-w-10 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
