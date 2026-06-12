// hooks/use-shipping.ts
import { getShippingRates } from "@/lib/actions/shipping";
import { useQuery } from "@tanstack/react-query";

export function useShipping(
  originZip: string | undefined, 
  destinationZip: string | undefined, 
  items: any[]
) {
  // Criamos uma key baseada nos IDs e quantidades, evitando serializar objetos grandes
  const itemKeys = items.map(i => `${i.product.id}:${i.quantity}`);

  return useQuery({
    queryKey: ["shipping-rates", originZip, destinationZip, itemKeys],
    queryFn: () => getShippingRates(originZip!, destinationZip!, items),
    enabled: !!originZip && !!destinationZip && items.length > 0,
    // Cache de 5 minutos: evita consultas repetidas em integrações pagas (Melhor Envio)
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}