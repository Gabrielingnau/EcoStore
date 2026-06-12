import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AddressModal } from "./AddressModal";

export function AddressCard({ address, addresses, onSelect, onActivate, isPending }: any) {
  if (!address) return null;

  return (
    <Card className="border border-primary/20 shadow-sm bg-accent/5">
      <CardContent className="p-6 flex justify-between items-center">
        <div className="flex gap-4">
          <MapPin className="w-6 h-6 text-primary mt-1" />
          <div>
            <h3 className="font-bold text-lg">Entregar em:</h3>
            <p className="text-sm font-medium">{address.street}, {address.city}</p>
            <p className="text-xs text-muted-foreground">CEP: {address.zip_code}</p>
          </div>
        </div>
       <AddressModal 
          addresses={addresses} 
          currentId={address.id} 
          onSelect={onSelect} 
          onActivate={onActivate}
          isPending={isPending}
        />
      </CardContent>
    </Card>
  );
}