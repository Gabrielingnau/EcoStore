"use client";
import { Toaster as Sonner } from "sonner";
export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "!bg-card !border !border-border !text-foreground !rounded-xl",
          description: "!text-muted-foreground",
        },
      }}
    />
  );
}
export { toast } from "sonner";
