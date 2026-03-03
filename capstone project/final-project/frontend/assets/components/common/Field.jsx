'use client';

import { useMemo } from 'react';
import { cva } from 'class-variance-authority';

import { Label } from '#components/common/Label';
import { Separator } from '#components/common/Separator';
import { cn } from '#js/utils';

function FieldSet({ className, ...props }) {
  return (
    <fieldset
      data-slot='field-set'
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  );
}

function FieldLegend({ className, variant = 'legend', ...props }) {
  return (
    <legend
      data-slot='field-legend'
      data-variant={variant}
      className={cn(
        'mb-3 font-medium text-secondary-800',
        'data-[variant=legend]:text-base',
        'data-[variant=label]:text-sm',
        className
      )}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }) {
  return (
    <div
      data-slot='field-group'
      className={cn('group/field-group flex w-full flex-col gap-4', className)}
      {...props}
    />
  );
}

const fieldVariants = cva(
  'group/field w-full gap-3 data-[invalid=true]:text-error',
  {
    variants: {
      orientation: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row items-center',
        responsive: 'flex flex-col md:flex-row md:items-center',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
);

function Field({ className, orientation = 'vertical', ...props }) {
  return (
    <div
      role='group'
      data-slot='field'
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }) {
  return (
    <div
      data-slot='field-content'
      className={cn(
        'group/field-content flex flex-1 flex-col gap-1.5 leading-snug',
        className
      )}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }) {
  return (
    <Label
      data-slot='field-label'
      className={cn(
        'group/field-label flex items-center gap-2 text-sm font-medium leading-snug text-secondary-800',
        'group-data-[disabled=true]/field:opacity-50',
        'min-w-[140px]',
        className
      )}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }) {
  return (
    <div
      data-slot='field-label'
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium leading-snug text-secondary-800 group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot='field-description'
      className={cn(
        'text-xs font-normal leading-normal text-secondary-500',
        '[&>a:hover]:text-primary-600 [&>a]:underline [&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  );
}

function FieldSeparator({ children, className, ...props }) {
  return (
    <div
      data-slot='field-separator'
      data-content={!!children}
      className={cn('relative -my-2 h-5 text-sm', className)}
      {...props}
    >
      <Separator className='absolute inset-0 top-1/2' />
      {children && (
        <span
          className='relative mx-auto block w-fit bg-secondary-0 px-2 text-xs text-secondary-500'
          data-slot='field-separator-content'
        >
          {children}
        </span>
      )}
    </div>
  );
}

function FieldError({ className, children, errors, ...props }) {
  const content = useMemo(() => {
    if (children) return children;
    if (!errors) return null;

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message;
    }

    return (
      <ul className='ml-4 flex list-disc flex-col gap-1'>
        {errors.map(
          (error) =>
            error?.message && <li key={error.message}>{error.message}</li>
        )}
      </ul>
    );
  }, [children, errors]);

  if (!content) return null;

  return (
    <div
      role='alert'
      data-slot='field-error'
      className={cn('text-error text-sm font-normal', className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
};
