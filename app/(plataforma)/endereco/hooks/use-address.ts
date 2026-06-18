import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getAddresses, 
  saveAddress, 
  updateAddress, // Importação da nova função
  deleteAddress,
  setActiveAddress
} from "../services/address-service"; 
import { toast } from "sonner";
import { UserAddress } from "../types/user-settings-types";

export function useAddress(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["addresses", userId];

  const query = useQuery({
    queryKey,
    queryFn: () => getAddresses(userId),
    enabled: !!userId,
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => saveAddress({ ...data, user_id: userId }),
    onSuccess: () => {
      toast.success("Endereço salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // NOVA MUTAÇÃO: Atualização
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: UserAddress }) => updateAddress(id, data),
    onSuccess: () => {
      toast.success("Endereço atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (addressId: string) => deleteAddress(addressId),
    onSuccess: () => {
      toast.success("Endereço excluído!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err.message),
  });

  const activateMutation = useMutation({
    mutationFn: (addressId: string) => setActiveAddress(addressId, userId),
    onSuccess: () => {
      toast.success("Endereço ativo atualizado!");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return { 
    addresses: query.data || [], 
    save: saveMutation.mutate,
    update: updateMutation.mutate, // Exportando a função de update
    deleteAddress: deleteMutation.mutate,
    activateAddress: activateMutation.mutate,
    isPending: 
      saveMutation.isPending || 
      updateMutation.isPending || 
      deleteMutation.isPending || 
      activateMutation.isPending,
    isLoading: query.isLoading 
  };
}