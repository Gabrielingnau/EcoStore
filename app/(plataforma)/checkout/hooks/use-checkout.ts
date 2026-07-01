"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { revalidateProductById } from "@/lib/actions/revalidate";
import { useCart } from "@/lib/store/cart";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { checkoutService } from "../services/checkout";
import {
  CheckoutFormData,
  checkoutSchema,
  PlaceOrderPayload,
} from "../types/checkout-type";

export function useCheckout() {
  const { profile } = useAuth();
  const router = useRouter();
  const { items, clear } = useCart();

  console.log("Itens no carrinho:", items);

  const form = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zip: "",
      address: "",
      city: "",
      document: "",
    },
  });

  const { mutate: handlePlaceOrder, isPending } = useMutation({
    mutationFn: (payload: PlaceOrderPayload) =>
      checkoutService.placeOrder(payload),
    onSuccess: async (orderId, variables) => {
      const productIds = variables._items.map((item) => item.product_id);
      await Promise.all(productIds.map((id) => revalidateProductById(id)));

      clear();
      toast.success("Pedido finalizado com sucesso!");
      router.push(`/sucesso/${orderId}`);
    },
    onError: (error: any) => {
      toast.error("Erro no checkout", {
        description: error.message || "Não foi possível processar seu pedido.",
      });
    },
  });

  // Sincroniza dados do perfil sem resetar o formulário inteiro
  useEffect(() => {
    if (profile) {
      form.setValue("name", profile.display_name || "", {
        shouldValidate: true,
      });
      form.setValue("email", profile.email || "", { shouldValidate: true });
      form.setValue("phone", profile.phone || "", { shouldValidate: true });
    }
  }, [profile, form]);

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) return;

    handlePlaceOrder({
      _items: items.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.nome,
        product_image: i.product.imagem_url,
        quantity: i.quantity,
        weight: Number(i.product.weight) || 0,
        width: Number(i.product.width) || 0,
        height: Number(i.product.height) || 0,
        length: Number(i.product.length) || 0,
      })),
      _shipping_name: data.name,
      _shipping_address: data.address,
      _shipping_city: data.city,
      _shipping_zip: data.zip,
      _shipping_phone: data.phone || null,
      _shipping_email: data.email || null,
      _shipping_document: data.document,
    });
  };

  return {
    form,
    items,
    isPending,
    onSubmit,
    subtotal: items.reduce((acc, i) => acc + i.product.preco * i.quantity, 0),
  };
}
