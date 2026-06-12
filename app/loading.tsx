import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <div className="relative">
        <Loader2 className="text-primary/50 animate-spin" />

        <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-2 border-primary animate-[spin_2s_linear_infinite]"></div>
      </div>
    </div>
  );
}