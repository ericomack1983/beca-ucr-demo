import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#0B2A5B]/10 text-[#0B2A5B]",
        secondary: "bg-[#2563EB]/10 text-[#2563EB]",
        success: "bg-[#10B981]/10 text-[#059669]",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-700",
        outline: "border border-slate-200 text-slate-600",
        issuer: "bg-amber-50 border border-amber-200 text-amber-800",
        ucr: "bg-[#0B2A5B]/8 border border-[#0B2A5B]/15 text-[#0B2A5B]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
