import { cn } from '#js/utils';
import { forwardRef } from 'react';

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className='relative w-full overflow-auto'>
    <table
      ref={ref}
      className={cn(
        'w-full caption-bottom text-sm text-secondary-800',
        className
      )}
      {...props}
    />
  </div>
));
// Table.displayName = 'Table';

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn('border-b border-secondary-200 bg-secondary-0', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&>tr:last-child]:border-b-0', className)}
    {...props}
  />
));
// TableBody.displayName = 'TableBody';

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t border-secondary-200 bg-secondary-0/80 font-medium',
      '[&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
// TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-secondary-100 transition-colors',

      'hover:bg-primary-0/35',

      'data-[state=selected]:bg-primary-0/70 data-[state=selected]:border-primary-300 data-[state=selected]:shadow-[inset_3px_0_0_rgb(var(--color-primary-600))]',
      className
    )}
    {...props}
  />
));
// TableRow.displayName = 'TableRow';

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle text-xs font-semibold tracking-wide uppercase',
      'text-secondary-500',
      '[&:first-child]:pl-1',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
// TableHead.displayName = 'TableHead';

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      'px-4 py-3 align-middle text-sm text-secondary-800',
      '[&:first-child]:pl-1',
      '[&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
));
// TableCell.displayName = 'TableCell';

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('mt-3 text-xs text-secondary-500 text-left', className)}
    {...props}
  />
));
// TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
