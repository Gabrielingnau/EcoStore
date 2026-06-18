"use client";

import {
  AlertCircle,
  Building2,
  Globe,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Save,
  Truck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { maskCEP, maskPhone, unmask } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { useStoreConfig } from "./hooks/use-store-config";
import { StoreConfig, storeConfigSchema } from "./types/store-settings";

export default function ConfiguracoesPage() {
  const { config, isLoading, save, isConfigured } = useStoreConfig();
  const [isEditing, setIsEditing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoreConfig>({
    resolver: yupResolver(storeConfigSchema),
    mode: "onChange",
  });

  useEffect(() => {
    fetch("/api/melhor-envio/status", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setIsConnected(data.connected))
      .catch(() => setIsConnected(false));
  }, []);

  useEffect(() => {
    if (config) reset(config);
    if (!isLoading && !isConfigured) setIsEditing(true);
  }, [config, reset, isLoading, isConfigured]);

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="mx-auto space-y-6">
      {/* Status Melhor Envio */}
      <div
        className={`border p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm ${isConnected ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base md:text-lg font-bold flex items-center gap-2 text-slate-900">
              <Package size={20} /> Melhor Envio
            </h2>
            <p className="text-xs md:text-sm mt-1 text-slate-600">
              {isConnected === null ? "Verificando..." : isConnected ? "Loja conectada com sucesso." : "Loja desconectada da API."}
            </p>
          </div>
          <a
            href="/api/melhor-envio/login"
            className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl text-sm font-bold text-white transition bg-blue-600 hover:bg-blue-700"
          >
            {isConnected ? "Reconectar" : "Conectar Agora"}
          </a>
        </div>
      </div>

      {/* Título e Botão Editar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações da Loja</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie as informações públicas e logística.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 font-medium bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition"
          >
            <Pencil size={18} /> Editar Informações
          </button>
        )}
      </div>

      {/* Card Principal */}
      <div className="bg-card border border-border/50 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm">
        {!isEditing ? (
          <div className="space-y-8 md:space-y-12">
            <div className="border-b border-border/50 pb-6">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight break-words">{config?.name}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8 md:gap-12">
              <Section title="Informações de Contato" icon={<Phone size={18} />}>
                <InfoItem label="Email" value={config?.email} icon={<Mail size={18} />} />
                <InfoItem label="Telefone" value={maskPhone(config?.phone || "")} icon={<Phone size={18} />} />
              </Section>
              <Section title="Localização" icon={<MapPin size={18} />}>
                <InfoItem label="Endereço" value={config?.address} icon={<Building2 size={18} />} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Cidade/UF" value={config?.city ? `${config.city} / ${config.state}` : undefined} icon={<Globe size={18} />} />
                  <InfoItem label="CEP" value={maskCEP(config?.zip_code || "")} icon={<Hash size={18} />} />
                </div>
              </Section>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit((d) => {
              save({ ...d, phone: unmask(d.phone), zip_code: unmask(d.zip_code) });
              setIsEditing(false);
            })}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-primary text-sm uppercase tracking-wider">
                <Truck size={16} /> Métodos de Entrega
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/30 rounded-xl">
                <Controller
                  name="allow_local_pickup"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
                      Retirada na Loja
                    </label>
                  )}
                />
                <Controller
                  name="allow_local_delivery"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                      <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
                      Entrega Própria
                    </label>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 space-y-6">
              <h3 className="font-semibold flex items-center gap-2 text-primary text-sm uppercase tracking-wider">
                <Building2 size={16} /> Dados de Identidade
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <ControlledInput control={control} name="name" label="Nome da Loja" errors={errors} />
                <ControlledInput control={control} name="email" label="Email" errors={errors} />
                <ControlledInput control={control} name="phone" label="Telefone" errors={errors} mask={maskPhone} />
              </div>
            </div>

            <div className="pt-6 border-t border-border/50 space-y-6">
              <h3 className="font-semibold flex items-center gap-2 text-primary text-sm uppercase tracking-wider">
                <MapPin size={16} /> Dados de Localização
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <ControlledInput control={control} name="city" label="Cidade" errors={errors} />
                <ControlledInput control={control} name="state" label="UF" errors={errors} />
                <ControlledInput control={control} name="zip_code" label="CEP" errors={errors} mask={maskCEP} />
              </div>
              <ControlledInput control={control} name="address" label="Endereço Completo" errors={errors} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold bg-secondary hover:bg-secondary/80">Cancelar</button>
              <button disabled={isSubmitting} className="flex-1 flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold transition">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ControlledInput({ control, name, label, errors, mask }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>
          <input
            value={mask ? mask(value || "") : value || ""}
            onChange={(e) => onChange(mask ? unmask(e.target.value) : e.target.value)}
            className="w-full bg-background border border-input px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors[name] && <p className="text-xs text-red-500">{errors[name]?.message as string}</p>}
        </div>
      )}
    />
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-muted-foreground">{icon} {title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="flex gap-3 items-center">
      <div className="p-2 bg-secondary rounded-lg text-primary">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="font-semibold text-sm">{value || "Não informado"}</p>
      </div>
    </div>
  );
}