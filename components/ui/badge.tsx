import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-brand-50 text-brand-600",
      success: "bg-success-50 text-success-500",
      warning: "bg-warning-50 text-warning-500",
      danger: "bg-danger-50 text-danger-500",
      outline: "border border-surface-200 text-surface-800"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
