"use client";

import { AlertCircle, CheckCircle2, Lock, MapPin, Plus, ShieldCheck, Truck, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { BackButton } from "@/components/site/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/hooks/use-store";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { isLocalZip, maskCPF } from "@/lib/utils";

import { useAddress } from "../endereco/hooks/use-address";
import { AddressCard } from "./components/AddressCard";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingCard } from "./components/ShippingCard";
import { ShippingOptions } from "./components/ShippingOptions";
import { useCheckout } from "./hooks/use-checkout";
import { useShipping } from "./hooks/use-shipping";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<"shipping" | "review">("shipping");
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);
  
  // Controla se o usuário já chegou a destravar a revisão pelo menos uma vez
  const [hasCompletedShipping, setHasCompletedShipping] = useState(false);

  const { user } = useAuth();
  const { addresses, activateAddress, isPending } = useAddress(user?.id || "");
  const { items, subtotal, form } = useCheckout();
  const { config } = useStore();

  // Se o carrinho estiver vazio, redireciona/volta para a rota anterior
  useEffect(() => {
    if (items && items.length === 0) {
      router.back();
    }
  }, [items, router]);

  const activeAddress = useMemo(
    () => addresses.find((a: any) => a.active),
    [addresses],
  );
  const hasNoAddress = !addresses || addresses.length === 0;

  const isLocal = useMemo(() => {
    if (!activeAddress?.zip_code || !config?.zip_code) return false;
    return isLocalZip(activeAddress.zip_code, config.zip_code);
  }, [activeAddress, config]);

  useEffect(() => {
    if (activeAddress) {
      form.setValue("zip", activeAddress.zip_code, { shouldValidate: true });
      form.setValue("address", activeAddress.street, { shouldValidate: true });
      form.setValue("city", activeAddress.city, { shouldValidate: true });
    }
  }, [activeAddress, form]);

  const { data: shippingRates, isLoading } = useShipping(
    config?.zip_code,
    activeAddress?.zip_code,
    items,
  );

  const localOptions = useMemo(() => {
    if (!isLocal) return [];
    const opts: {
      id: string;
      name: string;
      price: number;
      delivery_time: string;
      type: "pickup" | "local_delivery";
    }[] = [];
    if (config?.allow_local_pickup)
      opts.push({
        id: "pickup",
        name: "Retirada na Loja",
        price: 0,
        delivery_time: "Imediato",
        type: "pickup",
      });
    if (config?.allow_local_delivery)
      opts.push({
        id: "local",
        name: "Entrega Própria",
        price: config.local_delivery_fee || 18,
        delivery_time: "1 dia útil",
        type: "local_delivery",
      });
    return opts;
  }, [isLocal, config]);

  const total = useMemo(
    () => Number(subtotal) + (Number(selectedRate?.price) || 0),
    [subtotal, selectedRate],
  );

  // Validação se a etapa 1 está completa
  const isShippingComplete =
    !hasNoAddress && Boolean(selectedRate) && form.formState.isValid;

  // Atualiza o estado global de conclusão caso os dados já estejam válidos
  useEffect(() => {
    if (isShippingComplete) {
      setHasCompletedShipping(true);
    }
  }, [isShippingComplete]);

  // Função para lidar com o clique nas abas do topo com segurança
  const handleTabClick = (targetStep: "shipping" | "review") => {
    if (targetStep === "shipping") {
      setStep("shipping"); // Sempre pode voltar pra entrega
    } else if (targetStep === "review") {
      // Só deixa ir para revisão se os dados da entrega estiverem completos
      if (isShippingComplete || hasCompletedShipping) {
        setHasCompletedShipping(true);
        setStep("review");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full">
      <BackButton />
      
      {/* Header com Stepper Visual Moderno e Clicável */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {step === "shipping" ? "Checkout Seguro" : "Revisão e Pagamento"}
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            {step === "shipping" ? "Confirme seu endereço e escolha a forma de envio" : "Confira os dados antes de finalizar seu pedido"}
          </p>
        </div>

        {/* Stepper indicator interativo */}
        <div className="flex items-center gap-2 bg-secondary/60 p-1.5 rounded-2xl border border-border/60 self-start md:self-auto">
          {/* Aba 1: Entrega */}
          <button
            type="button"
            onClick={() => handleTabClick("shipping")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              step === "shipping"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-background/20 flex items-center justify-center text-[10px]">1</span>
            <span>Entrega</span>
          </button>

          {/* Aba 2: Revisão */}
          <button
            type="button"
            onClick={() => handleTabClick("review")}
            disabled={!isShippingComplete && !hasCompletedShipping}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              step === "review"
                ? "bg-primary text-primary-foreground shadow-xs"
                : isShippingComplete || hasCompletedShipping
                ? "text-muted-foreground hover:text-foreground cursor-pointer"
                : "text-muted-foreground/40 cursor-not-allowed opacity-60"
            }`}
            title={
              !isShippingComplete && !hasCompletedShipping
                ? "Preencha o CPF e selecione o frete para liberar"
                : "Ir para revisão"
            }
          >
            <span className="w-4 h-4 rounded-full bg-background/20 flex items-center justify-center text-[10px]">2</span>
            <span>Revisão</span>
          </button>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUNA ESQUERDA (70% no desktop) */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          {step === "shipping" ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {hasNoAddress ? (
                <Card className="border-dashed border-2 border-primary/30 bg-primary/5 rounded-2xl shadow-none">
                  <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-base text-foreground">Nenhum endereço cadastrado</h3>
                      <p className="text-xs text-muted-foreground">Você precisa cadastrar um endereço de entrega para prosseguir.</p>
                    </div>
                    <Button
                      nativeButton={false}
                      className="rounded-xl px-6 font-bold"
                      render={
                        <Link href="/endereco">
                          <Plus className="mr-2 w-4 h-4" /> Cadastrar Endereço
                        </Link>
                      }
                    />
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Seção Endereço */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Endereço de Destino
                    </h3>
                    <AddressCard
                      address={activeAddress}
                      addresses={addresses}
                      onSelect={(id: string) => activateAddress(id)}
                      onActivate={activateAddress}
                      isPending={isPending}
                    />
                  </div>

                  {/* Seção Dados NF (CPF) */}
                  <Card className="rounded-2xl border-border/60 shadow-sm bg-card">
                    <CardContent className="p-5 md:p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">Dados para Nota Fiscal</h3>
                          <p className="text-xs text-muted-foreground">Obrigatório para emissão da NF-e</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-semibold text-muted-foreground">
                          CPF do Destinatário
                        </label>
                        <Input
                          {...form.register("document", {
                            onChange: (e) => {
                              const masked = maskCPF(e.target.value);
                              form.setValue("document", masked, {
                                shouldValidate: true,
                              });
                            },
                          })}
                          placeholder="000.000.000-00"
                          className={`h-11 rounded-xl bg-secondary/40 border-border/60 ${
                            form.formState.errors.document ? "border-destructive" : ""
                          }`}
                        />
                        {form.formState.errors.document && (
                          <p className="text-xs text-destructive font-medium">
                            {form.formState.errors.document.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seção Opções de Envio */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Truck className="w-4 h-4 text-primary" /> Opções de Envio
                    </h3>
                    {isLocal ? (
                      localOptions.length > 0 ? (
                        <RadioGroup
                          value={selectedRate?.id ?? ""}
                          onValueChange={(id) =>
                            setSelectedRate(localOptions.find((o) => o.id === id))
                          }
                          className="space-y-3"
                        >
                          {localOptions.map((opt) => (
                            <ShippingCard key={opt.id} {...opt} />
                          ))}
                        </RadioGroup>
                      ) : (
                        <Card className="border border-border/60 rounded-2xl bg-card shadow-sm">
                          <CardContent className="p-6 text-center space-y-4">
                            <div className="mx-auto w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                              <AlertCircle className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="font-bold text-foreground">Frete não disponível</h3>
                              <p className="text-xs text-muted-foreground mt-1">
                                Estamos na mesma região, mas não encontramos opções de entrega configuradas.
                              </p>
                            </div>
                            <div className="flex flex-col gap-2.5 pt-2">
                              <Button
                                variant="outline"
                                className="w-full rounded-xl h-11"
                                render={
                                  <Link href="/endereco">Revisar endereço</Link>
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ) : (
                      <ShippingOptions
                        options={shippingRates}
                        isLoading={isLoading}
                        onSelect={setSelectedRate}
                        selectedId={selectedRate?.id ?? ""}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Botão Avançar Etapa */}
              <div className="pt-4">
                <Button
                  disabled={!isShippingComplete || isPending}
                  onClick={() => {
                    setHasCompletedShipping(true);
                    setStep("review");
                  }}
                  className="w-full h-13 rounded-2xl font-bold text-base shadow-lg transition-all"
                >
                  Continuar para Revisão
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="rounded-2xl border-border/60 shadow-sm bg-card">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <MapPin size={16} className="text-primary" /> Endereço de Entrega
                      </h3>
                      <button onClick={() => setStep("shipping")} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                        Alterar
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                      <p className="font-medium text-foreground">{activeAddress?.street}</p>
                      <p>{activeAddress?.city} - CEP: {activeAddress?.zip_code}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/60 shadow-sm bg-card">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                        <Truck size={16} className="text-primary" /> Envio e NF
                      </h3>
                      <button onClick={() => setStep("shipping")} className="text-xs font-semibold text-primary hover:underline cursor-pointer">
                        Alterar
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1 pt-1">
                      <p className="font-semibold text-foreground">
                        {selectedRate?.type === "pickup" || selectedRate?.type === "local_delivery"
                          ? "Entrega Local"
                          : `${selectedRate?.company?.name} - ${selectedRate?.name}`} ({selectedRate?.delivery_time})
                      </p>
                      <p>CPF NF: <span className="font-mono text-foreground">{form.getValues("document")}</span></p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Selo de Segurança */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Ambiente 100% seguro com criptografia de ponta a ponta</span>
              </div>

              <Button
                className="w-full h-14 rounded-2xl font-black text-base shadow-xl transition-all gap-2"
                disabled={isStripeLoading}
                onClick={async () => {
                  setIsStripeLoading(true);
                  const checkoutPayload = {
                    items: items.map((item: any) => ({
                      ...item,
                      product: {
                        ...item.product,
                        weight: item.product.weight || 0.3,
                        width: item.product.width || 10,
                        height: item.product.height || 10,
                        length: item.product.length || 10,
                      },
                    })),
                    shipping: selectedRate,
                    user: {
                      id: user?.id,
                      name: form.getValues("name"),
                      email: form.getValues("email"),
                      phone: form.getValues("phone"),
                      document: form.getValues("document"),
                      address: activeAddress?.street,
                      city: activeAddress?.city,
                      state: activeAddress?.state,
                      zip: activeAddress?.zip_code,
                    },
                  };
                  try {
                    const { url } = await createCheckoutSession(checkoutPayload);
                    if (url) window.location.href = url;
                  } catch (error) {
                    console.error("ERRO no Checkout:", error);
                    setIsStripeLoading(false);
                  }
                }}
              >
                <Lock className="w-4 h-4" />
                {isStripeLoading ? "Processando pagamento..." : "Ir para o Pagamento Seguro"}
              </Button>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA (Resumo da Compra) */}
        <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4 order-1 lg:order-2">
          <OrderSummary items={items} shipping={selectedRate} total={total} />
        </div>

      </div>
    </div>
  );
}