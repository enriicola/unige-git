'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import logo from '#img/logo.jpg';

export default function FinalizationWaitCard({
  title,
  description,
  progressText,
  pendingText,
  errorText,
}) {
  const resolvedTitle = title || 'Finalizing submissions';
  const resolvedDescription =
    description || 'Please wait while we prepare the peer review phase.';

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>{resolvedTitle}</CardTitle>
          <CardDescription>{resolvedDescription}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3 text-sm text-muted-foreground'>
          <div className='flex items-center gap-3'>
            <img
              src={logo.src}
              alt='CodyMatch logo'
              className='h-6 w-6 rounded-full object-cover animate-[spin_2s_linear_infinite]'
            />
            <span>Finalizing submissions. Please wait.</span>
          </div>
          {progressText ? (
            <p>
              Finalized submissions:{' '}
              <span className='font-semibold'>{progressText}</span>
            </p>
          ) : null}
          {pendingText ? (
            <p>
              Pending calculations:{' '}
              <span className='font-semibold'>{pendingText}</span>
            </p>
          ) : null}
          {errorText ? <p className='text-amber-700'>{errorText}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
