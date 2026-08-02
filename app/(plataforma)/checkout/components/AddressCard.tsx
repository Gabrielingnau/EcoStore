import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AddressModal } from "./AddressModal";

export function AddressCard({ address, addresses, onSelect, onActivate, isPending }: any) {
  if (!address) return null;

  return (
    <Card className="border border-border/60 shadow-sm bg-card rounded-2xl">
      <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <MapPin size={20} />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm text-foreground">Endereço de Entrega</h3>
            <p className="text-xs font-medium text-foreground">{address.street}, {address.city}</p>
            <p className="text-xs text-muted-foreground font-mono">CEP: {address.zip_code}</p>
          </div>
        </div>
        
        <div className="w-full sm:w-auto flex justify-end">
          <AddressModal 
            addresses={addresses} 
            currentId={address.id} 
            onSelect={onSelect} 
            onActivate={onActivate}
            isPending={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}