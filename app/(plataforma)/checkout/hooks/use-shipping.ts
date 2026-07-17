// hooks/use-shipping.ts
import { getShippingRates } from "@/lib/actions/shipping";
import { useQuery } from "@tanstack/react-query";

export function useShipping(
  originZip: string | undefined, 
  destinationZip: string | undefined, 
  items: any[]
) {
  const itemKeys = items.map(i => `${i.product.id}:${i.quantity}`);

  return useQuery({
    queryKey: ["shipping-rates", originZip, destinationZip, itemKeys],
    queryFn: async () => {
      // Adicione esta verificação de segurança
      if (!originZip || !destinationZip) return null;
      return getShippingRates(originZip, destinationZip, items);
    },
    // Remova o "!" e deixe o enabled cuidar da execução
    enabled: !!originZip && !!destinationZip && items.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}