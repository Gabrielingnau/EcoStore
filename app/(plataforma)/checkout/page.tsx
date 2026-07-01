"use client";

import { AlertCircle, MapPin, Plus, Truck, User } from "lucide-react";
import Link from "next/link";
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
    activeAddress?.zip_code, // Passe sempre o CEP do cliente
    items,
  );

  console.log(items, "ITEMS");

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

  return (
    <div>
      <BackButton />
      <h1 className="text-3xl font-black mb-8">
        {step === "shipping" ? "Finalizar compra" : "Revisão do Pedido"}
      </h1>

      {step === "shipping" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {hasNoAddress ? (
            <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                <AlertCircle className="w-10 h-10 text-primary" />
                <h3 className="font-bold text-lg">
                  Nenhum endereço cadastrado
                </h3>
                <Button
                  nativeButton={false}
                  render={
                    <Link href="/endereco">
                      <Plus className="mr-2 w-4 h-4" /> Cadastrar
                    </Link>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <AddressCard
                address={activeAddress}
                addresses={addresses}
                onActivate={activateAddress}
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

              <div className="space-y-4">
                <h3 className="font-bold">Opções de Envio</h3>
                {isLocal ? (
                  localOptions.length > 0 ? (
                    <RadioGroup
                      value={selectedRate?.id ?? ""}
                      onValueChange={(id) =>
                        setSelectedRate(localOptions.find((o) => o.id === id))
                      }
                    >
                      {localOptions.map((opt) => (
                        <ShippingCard key={opt.id} {...opt} />
                      ))}
                    </RadioGroup>
                  ) : (
                    <Card className="border border-border bg-card">
                      <CardContent className="p-6 text-center space-y-4">
                        <div className="mx-auto w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">
                            Frete não disponível
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Estamos na mesma região, mas não encontramos opções
                            de entrega configuradas.
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Button
                            variant="outline"
                            className="w-full"
                            render={
                              <Link href="/endereco">Revisar endereço</Link>
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Precisa de ajuda?{" "}
                            <strong>
                              <Link href="/contato">Entre em contato</Link>
                            </strong>{" "}
                            com nossa equipe.
                          </p>
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
                    {selectedRate?.type === "pickup" ||
                    selectedRate?.type === "local_delivery"
                      ? "Entrega Local"
                      : `${selectedRate?.company?.name} - ${selectedRate?.name}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prazo: {selectedRate?.delivery_time}
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
            {isStripeLoading ? "Redirecionando..." : "Confirmar Compra"}
          </Button>
        </div>
      )}
    </div>
  );
}
