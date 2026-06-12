"use client";

import { AlertCircle, MapPin, Plus, Truck, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useStore } from "@/hooks/use-store";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { maskCPF } from "@/lib/utils";

import { useAddress } from "../endereco/hooks/use-address";
import { AddressCard } from "./components/AddressCard";
import { OrderSummary } from "./components/OrderSummary";
import { ShippingOptions } from "./components/ShippingOptions";
import { ValidationAlert } from "./components/ValidationAlert";
import { useCheckout } from "./hooks/use-checkout";
import { useShipping } from "./hooks/use-shipping";
import { BackButton } from "@/components/site/back-button";

export default function CheckoutPage() {
  const [step, setStep] = useState<"shipping" | "review">("shipping");
  const [selectedRate, setSelectedRate] = useState<any>(null);
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const { user } = useAuth();
  const { addresses, activateAddress, isPending } = useAddress(user?.id || "");
  const { items, subtotal, form } = useCheckout();
  const { config } = useStore();

  const activeAddress = useMemo(
    () => addresses.find((a: any) => a.active),
    [addresses],
  );
  const hasNoAddress = !addresses || addresses.length === 0;

  // EFEITO: Sincroniza endereço ativo com o formulário para validar campos ocultos
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

  const total = useMemo(() => {
    return Number(subtotal) + (Number(selectedRate?.price) || 0);
  }, [subtotal, selectedRate]);

  return (
    <div>
      <BackButton/>
      <h1 className="text-3xl font-black mb-8">
        {step === "shipping" ? "Finalizar compra" : "Revisão do Pedido"}
      </h1>

      {step === "shipping" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {hasNoAddress ? (
            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-10 h-10 text-primary" />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg">
                    Nenhum endereço cadastrado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cadastre um endereço para calcular o frete e continuar.
                  </p>
                </div>
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/endereco">
                      <Plus className="mr-2 w-4 h-4" /> Cadastrar novo endereço
                    </Link>
                  }
                ></Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <AddressCard
                address={activeAddress}
                addresses={addresses}
                onActivate={(id: string) => activateAddress(id)}
                isPending={isPending}
              />

              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <User size={18} /> Dados para NF
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
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
                      className={
                        form.formState.errors.document
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {form.formState.errors.document && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.document.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <ShippingOptions
                options={shippingRates}
                isLoading={isLoading}
                onSelect={setSelectedRate}
                selectedId={selectedRate?.id ?? ""}
              />

              <ValidationAlert
                errors={form.formState.errors}
                hasNoAddress={hasNoAddress}
                selectedRate={selectedRate}
                isValid={form.formState.isValid}
              />
            </>
          )}

          <Button
            disabled={
              !selectedRate ||
              isPending ||
              hasNoAddress ||
              !form.formState.isValid
            }
            onClick={() => setStep("review")}
            className="w-full h-12 font-bold"
          >
            Continuar para Revisão
          </Button>
        </div>
      ) : (
        // ... parte da revisão (deixei igual, pois está correta)
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <MapPin size={18} /> Endereço de Entrega
                </h3>
                <p className="text-sm text-muted-foreground">
                  {activeAddress?.street}
                </p>
                <p className="text-sm text-muted-foreground">
                  {activeAddress?.city} - CEP: {activeAddress?.zip_code}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-bold flex items-center gap-2">
                  <Truck size={18} /> Despacho e Envio
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {selectedRate?.company?.name} - {selectedRate?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prazo estimado: {selectedRate?.delivery_time} dias úteis
                  </p>
                </div>

                <div className="pt-3 border-t border-border">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Informações para NF
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    CPF: {form.getValues("document")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          <OrderSummary items={items} shipping={selectedRate} total={total} />
          <Button
            className="w-full h-12 font-bold text-lg"
            disabled={isStripeLoading}
            onClick={async () => {
              setIsStripeLoading(true);

              // Montando o payload com log para debug
              const checkoutPayload = {
                items,
                shipping: selectedRate,
                user: {
                  id: user?.id,
                  name: form.getValues("name"),
                  email: form.getValues("email"),
                  phone: form.getValues("phone"),
                  document: form.getValues("document"),
                  address: activeAddress?.street,
                  city: activeAddress?.city,
                  state: activeAddress?.state, // <--- ADICIONADO: Garanta que esta propriedade exista no activeAddress
                  zip: activeAddress?.zip_code,
                },
              };

              console.log(
                "DEBUG: Payload enviado para createCheckoutSession:",
                checkoutPayload,
              );

              try {
                const { url } = await createCheckoutSession(checkoutPayload);
                if (url) window.location.href = url;
              } catch (error) {
                console.error("ERRO no Checkout:", error);
                setIsStripeLoading(false);
              }
            }}
          >
            {isStripeLoading ? "Redirecionando..." : "Confirmar Compra"}
          </Button>
        </div>
      )}
    </div>
  );
}
