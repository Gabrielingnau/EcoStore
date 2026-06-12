import { cn } from "@/lib/utils";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  onMask?: (value: string) => string;
}

export function InputGroup({ label, error, onMask, onChange, value, ...props }: InputGroupProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onMask) {
      e.target.value = onMask(e.target.value);
    }
    onChange?.(e);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{label}</label>
      <input
        {...props}
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full h-11 px-4 rounded-xl border bg-background transition-all outline-none focus:ring-2 focus:ring-primary/20",
          error ? "border-destructive ring-1 ring-destructive" : "border-border focus:border-primary"
        )}
      />
      {error && <span className="text-[10px] font-bold text-destructive block mt-1">{error}</span>}
    </div>
  );
}