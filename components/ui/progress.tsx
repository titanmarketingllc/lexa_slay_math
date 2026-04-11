import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
};

export function Progress({ value, className }: ProgressProps) {
  const width = `${Math.min(100, Math.max(0, value))}%`;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-slate-200",
        className,
      )}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={value}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#f59e0b_0%,#fb7185_45%,#22c55e_100%)] transition-all duration-500"
        style={{ width }}
      />
    </div>
  );
}
