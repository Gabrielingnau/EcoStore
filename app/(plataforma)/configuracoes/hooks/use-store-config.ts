import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStoreConfig, upsertStoreConfig } from "../services/store-service";
import { toast } from "sonner";
import { StoreConfig } from "../types/store-settings";

export function useStoreConfig() {
  const queryClient = useQueryClient();

  const query = useQuery({ 
    queryKey: ["storeConfig"], 
    queryFn: getStoreConfig 
  });

  const mutation = useMutation({
    mutationFn: (data: StoreConfig) => upsertStoreConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storeConfig"] });
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (err) => {
      toast.error("Erro ao salvar configurações");
      console.error(err);
    }
  });

  return { 
    config: query.data, 
    isLoading: query.isLoading, 
    save: mutation.mutate,
    // Se existir config, a loja já foi configurada
    isConfigured: !!query.data 
  };
}