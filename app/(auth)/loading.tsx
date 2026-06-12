import { Loader2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">
        Preparando ambiente seguro...
      </p>
    </div>
  );
}