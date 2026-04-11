import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal rounded-[1.5rem] text-left font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-200 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-slate-950 px-6 py-4 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800",
        secondary:
          "bg-white px-6 py-4 text-slate-900 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-50",
        outline:
          "bg-white px-6 py-4 text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50",
        choice:
          "min-h-[78px] w-full justify-start border-2 border-slate-200 bg-white px-5 py-4 text-xl text-slate-900 shadow-sm hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 md:min-h-[88px] md:text-2xl",
      },
      size: {
        default: "",
        lg: "min-h-16 px-8 text-lg",
        xl: "min-h-[72px] px-10 text-xl md:text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
