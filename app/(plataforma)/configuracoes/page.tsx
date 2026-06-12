"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  Loader2, Pencil, Save, Mail, Phone, MapPin, 
  Building2, Globe, Hash, Package, CheckCircle2 
} from "lucide-react";

import { useStoreConfig } from "./hooks/use-store-config";
import { StoreConfig, storeConfigSchema } from "./types/store-settings";
import { maskPhone, maskCEP, unmask } from "@/lib/utils";

// --- Mude para true para exibir os botões de integração ---
const SHOW_INTEGRATION_ACTIONS = true; 

export default function ConfiguracoesPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  
  const { config, isLoading, save, isConfigured } = useStoreConfig();
  const [isEditing, setIsEditing] = useState(false);
  
  const { control, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm<StoreConfig>({
    resolver: yupResolver(storeConfigSchema),
    mode: "onChange"
  });

  useEffect(() => {
    if (config) reset(config);
    if (!isLoading && !isConfigured) setIsEditing(true);
  }, [config, reset, isLoading, isConfigured]);

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-8">
      
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-200">
          <CheckCircle2 size={20} /> Integração realizada com sucesso!
        </div>
      )}

      {SHOW_INTEGRATION_ACTIONS && (
        <div className="border border-amber-200 bg-amber-50 p-6 rounded-3xl shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-amber-900">
            <Package size={20}/> Integrações (Modo Administrador)
          </h2>
          <div className="flex gap-4">
            <a href="/api/melhor-envio/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Reconectar Melhor Envio</a>
            <a href="/api/melhor-envio/testar" target="_blank" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold">Testar Conexão</a>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações da Loja</h1>
          <p className="text-muted-foreground mt-1">Gerencie as informações públicas da sua plataforma.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 font-medium bg-primary text-primary-foreground hover:opacity-90 rounded-xl transition"
          >
            {isConfigured ? <><Pencil size={18}/> Editar Informações</> : <><Building2 size={18}/> Configurar Loja</>}
          </button>
        )}
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
        {!isEditing ? (
          <div className="space-y-12">
            <div className="border-b border-border/50 pb-8">
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">Loja</p>
              <h2 className="text-5xl font-extrabold tracking-tight">{config?.name}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              <Section title="Informações de Contato" icon={<Phone size={18}/>}>
                <InfoItem label="Email" value={config?.email} icon={<Mail size={18}/>} />
                <InfoItem label="Telefone" value={maskPhone(config?.phone || "")} icon={<Phone size={18}/>} />
              </Section>
              <Section title="Localização" icon={<MapPin size={18}/>}>
                <InfoItem label="Endereço" value={config?.address} icon={<Building2 size={18}/>} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Cidade/UF" value={config?.city ? `${config.city} / ${config.state}` : undefined} icon={<Globe size={18}/>} />
                  <InfoItem label="CEP" value={maskCEP(config?.zip_code || "")} icon={<Hash size={18}/>} />
                </div>
              </Section>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit((d) => { 
            save({ ...d, phone: unmask(d.phone), zip_code: unmask(d.zip_code) }); 
            setIsEditing(false); 
          })} className="space-y-10">
            <div className="space-y-6">
              <h3 className="font-semibold flex items-center gap-2 text-primary"><Building2 size={18}/> Dados de Identidade</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <ControlledInput control={control} name="name" label="Nome da Loja" placeholder="Ex: Minha Loja" errors={errors} />
                <ControlledInput control={control} name="email" label="Email" placeholder="contato@loja.com" errors={errors} />
                <ControlledInput control={control} name="phone" label="Telefone" placeholder="(00) 00000-0000" errors={errors} mask={maskPhone} />
              </div>
            </div>
            <div className="space-y-6 border-t border-border/50 pt-8">
              <h3 className="font-semibold flex items-center gap-2 text-primary"><MapPin size={18}/> Dados de Localização</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <ControlledInput control={control} name="city" label="Cidade" placeholder="Nome da cidade" errors={errors} />
                <ControlledInput control={control} name="state" label="Estado (UF)" placeholder="SP" errors={errors} />
                <ControlledInput control={control} name="zip_code" label="CEP" placeholder="00000-000" errors={errors} mask={maskCEP} />
              </div>
              <ControlledInput control={control} name="address" label="Endereço Completo" placeholder="Rua, número, bairro..." errors={errors} />
            </div>
            <div className="flex gap-4 pt-4">
              {isConfigured && (
                <button type="button" onClick={() => { reset(); setIsEditing(false); }} className="px-6 py-3 rounded-xl font-semibold bg-secondary hover:bg-secondary/80">Cancelar</button>
              )}
              <button disabled={!isDirty || isSubmitting} className="flex-1 flex justify-center items-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 transition">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} Salvar Alterações
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ControlledInput({ control, name, label, placeholder, errors, mask }: any) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{label}</label>
          <input 
            value={mask ? mask(value || "") : value || ""} 
            onChange={(e) => onChange(mask ? unmask(e.target.value) : e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-background border px-4 py-3 rounded-xl text-sm outline-none transition ${errors[name] ? "border-red-500" : "border-input"}`}
          />
          {errors[name] && <p className="text-xs text-red-500">{errors[name]?.message as string}</p>}
        </div>
      )}
    />
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 font-semibold text-foreground/80">{icon} {title}</h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function InfoItem({ label, value, icon }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2.5 bg-secondary rounded-xl text-primary">{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className={`font-medium text-base ${!value ? "text-muted-foreground italic" : ""}`}>{value || `Sem ${label.toLowerCase()}`}</p>
      </div>
    </div>
  );
}