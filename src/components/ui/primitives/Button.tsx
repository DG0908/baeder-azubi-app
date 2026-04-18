import React from 'react';
import { Slot } from '@radix-ui/react-slot';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-brand-500 hover:bg-brand-600 text-white focus-visible:ring-brand-400',
  secondary: 'bg-accent-500 hover:bg-accent-600 text-white focus-visible:ring-accent-400',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 focus-visible:ring-gray-300',
  danger: 'bg-danger-500 hover:bg-danger-600 text-white focus-visible:ring-danger-500',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', asChild = false, className = '', ...props }, ref) => {
    const Component: React.ElementType = asChild ? Slot : 'button';
    const classes = [
      'inline-flex items-center justify-center gap-2 font-semibold rounded-token-md',
      'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    ].join(' ');
    return <Component ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = 'Button';
