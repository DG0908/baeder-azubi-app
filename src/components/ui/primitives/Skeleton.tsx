import React from 'react';

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'rect' | 'text' | 'circle';
};

const VARIANT: Record<NonNullable<SkeletonProps['variant']>, string> = {
  rect: 'rounded-token-md',
  text: 'rounded-token-sm h-4',
  circle: 'rounded-full',
};

export const Skeleton: React.FC<SkeletonProps> = ({ variant = 'rect', className = '', ...props }) => {
  const classes = [
    'animate-pulse bg-gray-200 dark:bg-gray-700',
    VARIANT[variant],
    className,
  ].join(' ');
  return <div role="status" aria-label="Wird geladen" className={classes} {...props} />;
};
