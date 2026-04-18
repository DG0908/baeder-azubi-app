import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;
export const DialogPortal = RadixDialog.Portal;

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const DialogOverlay = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className = '', ...props }, ref) => (
    <RadixDialog.Overlay
      ref={ref}
      className={[
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=open]:fade-in data-[state=closed]:fade-out',
        className,
      ].join(' ')}
      {...props}
    />
  )
);
DialogOverlay.displayName = 'DialogOverlay';

type DialogContentProps = React.ComponentPropsWithoutRef<typeof RadixDialog.Content> & {
  size?: 'sm' | 'md' | 'lg';
};

const SIZE: Record<NonNullable<DialogContentProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ size = 'md', className = '', children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        ref={ref}
        className={[
          'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
          'bg-white rounded-token-lg shadow-lg border border-gray-200 p-6',
          'focus:outline-none',
          SIZE[size],
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = 'DialogContent';

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Title>
>(({ className = '', ...props }, ref) => (
  <RadixDialog.Title
    ref={ref}
    className={`text-lg font-semibold text-gray-900 mb-2 ${className}`}
    {...props}
  />
));
DialogTitle.displayName = 'DialogTitle';

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof RadixDialog.Description>
>(({ className = '', ...props }, ref) => (
  <RadixDialog.Description
    ref={ref}
    className={`text-sm text-gray-600 ${className}`}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';
