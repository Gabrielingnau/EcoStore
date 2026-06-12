import { Package, Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  iconType: "product" | "order";
}

export const EmptyState = ({ title, description, iconType }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border rounded-2xl bg-muted/20">
    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
      {iconType === "product" ? (
        <Package className="h-8 w-8 text-muted-foreground" />
      ) : (
        <Inbox className="h-8 w-8 text-muted-foreground" />
      )}
    </div>
    <h3 className="text-lg font-bold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1 max-w-sm">{description}</p>
  </div>
);