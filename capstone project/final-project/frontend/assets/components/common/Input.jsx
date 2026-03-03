'use client';

import { forwardRef } from 'react';
import { cn } from '#js/utils';

const Input = forwardRef(({ id, className, type = 'text', ...props }, ref) => (
  <input
    id={id}
    ref={ref}
    type={type}
    className={cn(
      `w-full h-10 rounded-md border border-secondary-300  px-3 py-2 text-secondary-900 placeholder:text-secondary-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`,
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export { Input };
