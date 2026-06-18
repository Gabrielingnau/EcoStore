"use client";

import { MapPin, Trash2, Edit2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { maskCEP, unmask } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { ActivateAddressModal } from "./components/ActivateAddressModal";
import { DeleteAddressModal } from "./components/DeleteAddressModal";
import { InputGroup } from "./components/InputGroup";
import { useAddress } from "./hooks/use-address";
import { UserAddress, userAddressSchema } from "./types/user-settings-types";

export default function AddressPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFromCheckout = searchParams.get("redirect") === "checkout";

  // Incluindo a função 'update' que adicionamos no hook
  const { addresses, save, update, deleteAddress, activateAddress, isPending } =
    useAddress(user?.id || "");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<UserAddress>({
    resolver: yupResolver(userAddressSchema),
    defaultValues: {
      zip_code: "",
      street: "",
      city: "",
      state: "",
      active: false,
    },
  });

  const handleFetchCep = async (cep: string) => {
    const rawCep = unmask(cep);
    if (rawCep.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        form.setValue("street", data.logradouro);
        form.setValue("city", data.localidade);
        form.setValue("state", data.uf);
      } else {
        toast.error("CEP não encontrado");
      }
    } catch {
      toast.error("Erro ao buscar CEP");
    }
  };

  const onSubmit = (data: UserAddress) => {
    if (editingId) {
      update({ id: editingId, data }, {
        onSuccess: () => {
          setEditingId(null);
          form.reset();
        }
      });
    } else {
      save(data, {
        onSuccess: () => {
          form.reset();
          if (isFromCheckout) router.back();
        },
      });
    }
  };

  const handleEdit = (addr: any) => {
    setEditingId(addr.id);
    form.setValue("zip_code", addr.zip_code);
    form.setValue("street", addr.street);
    form.setValue("city", addr.city);
    form.setValue("state", addr.state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pb-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Meus Endereços</h1>
        <p className="text-muted-foreground">Gerencie seus endereços de entrega.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM */}
        <div className="lg:col-span-2">
          <div className="bg-card border p-6 rounded-2xl shadow-sm">
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isPending}>
                <InputGroup
                  label="CEP"
                  placeholder="00000-000"
                  {...form.register("zip_code")}
                  onMask={maskCEP}
                  onChange={(e) => {
                    form.setValue("zip_code", e.target.value);
                    if (e.target.value.length === 9) handleFetchCep(e.target.value);
                  }}
                />

                <InputGroup label="Rua" placeholder="Ex: Av. Brasil, 123" {...form.register("street")} />

                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Cidade" placeholder="Ex: São Paulo" {...form.register("city")} />
                  <InputGroup label="Estado" placeholder="SP" {...form.register("state")} />
                </div>

                <div className="flex gap-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); form.reset(); }}
                      className="w-full mt-6 bg-secondary py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
                  >
                    {isPending ? "Salvando..." : editingId ? "Atualizar Endereço" : "Adicionar Endereço"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>

        {/* LISTA */}
        <div className="lg:col-span-1">
          {addresses.length === 0 ? (
            <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <MapPin size={32} />
              </div>
              <h3 className="font-bold text-xl">Nenhum endereço cadastrado</h3>
              <p className="text-muted-foreground max-w-sm text-sm">Adicione um endereço para facilitar suas compras.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr: any) => (
                <div key={addr.id} className={`group relative border rounded-2xl p-5 transition-all ${addr.active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"}`}>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-full ${addr.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{addr.street}</h3>
                        {addr.active && <span className="text-[10px] uppercase font-bold tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">Principal</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.city}, {addr.state}</p>
                      <p className="text-sm text-muted-foreground">CEP: {addr.zip_code}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(addr)} className="text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(addr.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {!addr.active && (
                    <button type="button" onClick={() => setActiveId(addr.id)} className="w-full mt-4 text-xs font-semibold text-primary hover:bg-primary/10 py-2 rounded-lg transition-colors">
                      Definir como principal
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteAddressModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteAddress(deleteId!); setDeleteId(null); }} isPending={isPending} />
      <ActivateAddressModal isOpen={!!activeId} onClose={() => setActiveId(null)} onConfirm={() => { activateAddress(activeId!); setActiveId(null); }} isPending={isPending} />
    </div>
  );
}