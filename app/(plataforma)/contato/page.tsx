"use client";

import { Mail, MessageCircle, MapPin, AlertCircle } from "lucide-react";
import { useStore } from "@/hooks/use-store";

export default function ContactPage() {
  const { config, isLoading } = useStore();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-96 bg-muted rounded-lg" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl border bg-muted" />)}
        </div>
        <div className="h-32 rounded-2xl border bg-muted" />
      </div>
    );
  }

  // Verifica se há pelo menos um dado para exibir
  const hasContact = config?.email || config?.phone || config?.address;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Fale conosco</h1>
        <p className="text-muted-foreground mt-2">Estamos aqui para ajudar. Escolha o canal de sua preferência:</p>
      </div>
      
      {!hasContact ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl text-center space-y-2">
          <AlertCircle className="text-muted-foreground" size={40} />
          <h3 className="font-semibold text-lg">Informações indisponíveis</h3>
          <p className="text-muted-foreground">Nossos canais de atendimento não foram configurados no momento.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email */}
          {config?.email ? (
            <a href={`mailto:${config.email}`} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-bold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground mt-1">{config.email}</p>
            </a>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-muted/20 p-6 opacity-60">
              <Mail className="h-6 w-6 text-muted-foreground mb-3" />
              <h3 className="font-bold text-foreground">Email</h3>
              <p className="text-sm text-muted-foreground mt-1 italic">Email não cadastrado</p>
            </div>
          )}

          {/* WhatsApp */}
          {config?.phone ? (
            <a href={`https://wa.me/${config.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all">
              <MessageCircle className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-bold text-foreground">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mt-1">{config.phone}</p>
            </a>
          ) : (
            <div className="rounded-2xl border border-border/50 bg-muted/20 p-6 opacity-60">
              <MessageCircle className="h-6 w-6 text-muted-foreground mb-3" />
              <h3 className="font-bold text-foreground">WhatsApp</h3>
              <p className="text-sm text-muted-foreground mt-1 italic">WhatsApp não cadastrado</p>
            </div>
          )}
        </div>
      )}

      {/* Endereço */}
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <MapPin className="h-6 w-6 text-primary mb-3" />
        <h3 className="font-bold text-foreground">Endereço</h3>
        {config?.address ? (
          <p className="text-sm text-muted-foreground mt-1">
            {config.address}, {config.city} - {config.state} <br/> 
            <span className="text-xs">CEP: {config.zip_code}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-1 italic">Endereço não cadastrado</p>
        )}
      </div>
    </div>
  );
}