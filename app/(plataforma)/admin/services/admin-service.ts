import { supabaseBrowser } from "@/lib/supabase/client";
import type { LocalProductImage } from "../types/admin-types";

const supabase = supabaseBrowser() as any;

// === BUSCAS (QUERIES) ===
export async function getAdminDashboardData() {
  const [productsRes, ordersRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false }),
  ]);
  if (productsRes.error) throw productsRes.error;
  if (ordersRes.error) throw ordersRes.error;

  return { products: productsRes.data ?? [], orders: ordersRes.data ?? [] };
}

export async function fetchExtraImages(productId: string) {
  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("position");
  if (error) throw error;
  return data ?? [];
}

// === UPLOADS & ARQUIVOS ===
export async function uploadStorageFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);
  if (error) throw error;

  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

// === MUTAÇÕES DE PRODUTO ===
export async function deleteProductService(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// Esta função ainda existe para casos de uso isolados, 
// mas o fluxo de edição agora usa a lógica dentro de saveProductWithGallery
export async function deleteExtraImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
}

export async function saveProductWithGallery({
  form,
  productId,
  localExtraImages,
  imagesToDelete = [], // Array de IDs de imagens para remover do banco
  mainImageFile,
}: {
  form: any;
  productId?: string;
  localExtraImages: LocalProductImage[];
  imagesToDelete?: string[]; 
  mainImageFile?: File;
}): Promise<string> {
  // 1. Processa imagem de capa
  let finalCapaUrl = form.imagem_url;
  if (mainImageFile) finalCapaUrl = await uploadStorageFile(mainImageFile);

  const productPayload = { ...form, imagem_url: finalCapaUrl };

  if (productId) {
    // === EDIÇÃO ===
    // Atualiza dados básicos
    const { error: updateErr } = await supabase
      .from("products")
      .update(productPayload)
      .eq("id", productId);
    if (updateErr) throw updateErr;

    // Remove as imagens marcadas para exclusão no banco
    if (imagesToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("product_images")
        .delete()
        .in("id", imagesToDelete);
      if (delErr) throw delErr;
    }
  } else {
    // === CRIAÇÃO ===
    const { data: newProduct, error: err } = await supabase
      .from("products")
      .insert(productPayload)
      .select()
      .single();
    if (err) throw err;
    productId = newProduct.id;
  }

  // 2. Insere novas imagens pendentes (tanto para novo produto quanto edição)
  const pendingExtraFiles = localExtraImages.filter((img) => img.isNewLocal && img.file);

  if (pendingExtraFiles.length > 0) {
    await Promise.all(
      pendingExtraFiles.map(async (item) => {
        if (item.file) {
          const publicUrl = await uploadStorageFile(item.file);
          await supabase.from("product_images").insert({
            product_id: productId,
            url: publicUrl,
          });
        }
      }),
    );
  }

  return productId!;
}

// === MUTAÇÕES DE PEDIDOS (ORDERS) ===
export async function updateOrderStatusService(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function updateRefundStatusService(id: string, refund_status: string) {
  const { error } = await supabase.from("orders").update({ refund_status }).eq("id", id);
  if (error) throw error;
}

export async function toggleProductActiveService(id: string, currentStatus: boolean) {
  const { error } = await supabase.from("products").update({ ativo: !currentStatus }).eq("id", id);
  if (error) throw new Error(error.message);
}