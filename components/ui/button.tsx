'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-dark text-white hover:bg-primary hover:shadow-lift',
        primary: 'bg-primary text-white hover:bg-primary/90 hover:shadow-lift',
        outline: 'border border-border bg-transparent hover:border-primary hover:text-primary',
        ghost: 'hover:bg-muted',
        accent: 'bg-accent text-white hover:bg-accent/90 hover:shadow-lift',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  magnetic?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, magnetic = false, asChild = false, onMouseMove, onMouseLeave, style, ...props }, ref) => {
    const [pos, setPos] = React.useState({ x: 0, y: 0 });
    const Comp: React.ElementType = asChild ? Slot : 'button';

    function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
      if (!magnetic) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      setPos({ x, y });
    }
    function handleLeave(e: React.MouseEvent<HTMLButtonElement>) {
      if (magnetic) setPos({ x: 0, y: 0 });
    }

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onMouseMove={(e: React.MouseEvent<HTMLButtonElement>) => { handleMove(e); onMouseMove?.(e); }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { handleLeave(e); onMouseLeave?.(e); }}
        style={magnetic ? { transform: `translate(${pos.x}px, ${pos.y}px)`, ...style } : style}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
