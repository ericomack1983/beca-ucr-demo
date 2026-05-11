"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#0B2A5B] text-white hover:bg-[#0a2350] shadow-[0_4px_14px_rgba(11,42,91,0.3)] hover:shadow-[0_6px_20px_rgba(11,42,91,0.4)] hover:scale-[1.02]",
        secondary:
          "bg-[#2563EB] text-white hover:bg-[#1d4ed8] shadow-[0_4px_14px_rgba(37,99,235,0.3)]",
        outline:
          "border border-[#0B2A5B]/20 bg-transparent text-[#0B2A5B] hover:bg-[#0B2A5B]/5",
        ghost:
          "bg-transparent text-[#0B2A5B] hover:bg-[#0B2A5B]/8",
        destructive:
          "bg-red-500 text-white hover:bg-red-600",
        emerald:
          "bg-[#10B981] text-white hover:bg-[#059669]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
