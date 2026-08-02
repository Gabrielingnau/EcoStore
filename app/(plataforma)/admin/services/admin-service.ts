import { supabaseBrowser } from "@/lib/supabase/client";
import { parseDigitsToFloat } from "@/lib/utils";
import type { FormDataState, LocalProductImage } from "../types/admin-types";

const supabase = supabaseBrowser() as any;

// === BUSCAS (QUERIES) ===
export async function getAdminDashboardData() {
  const [productsRes, ordersRes] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
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

export async function fetchProductVariantsAndGuides(productId: string) {
  const [variantsRes, guidesRes] = await Promise.all([
    supabase
      .from("product_variants")
      .select(`*, variant_sizes (*)`)
      .eq("product_id", productId),
    supabase
      .from("product_size_guides")
      .select("*")
      .eq("product_id", productId)
      .maybeSingle(),
  ]);

  if (variantsRes.error) throw variantsRes.error;

  return {
    variants: variantsRes.data ?? [],
    sizeGuide: guidesRes.data ?? null,
  };
}

// === UPLOADS & ARQUIVOS ===
export async function uploadStorageFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;

  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
}

// === MUTAÇÕES DE PRODUTO ===
export async function deleteProductService(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteExtraImage(id: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Função unificada de persistência de produto, imagens, variantes, tamanhos e guia de tamanhos.
 */
export async function saveProductWithGallery({
  form,
  productId,
  localExtraImages,
  imagesToDelete = [],
  sizeGuideData, 
}: {
  form: FormDataState;
  productId?: string;
  localExtraImages: LocalProductImage[];
  imagesToDelete?: string[];
  sizeGuideData?: any; 
}): Promise<string> {
  let savedProductId = productId;

  // 1. Processamento e Upload das Imagens das Variantes (Etapa 2)
  const processedVariants = await Promise.all(
    (form.variants as any[] || []).map(async (variant: any) => {
      const uploadedImageUrls: string[] = [];

      for (const imgItem of variant.imagens) {
        if (typeof imgItem === "object" && imgItem !== null) {
          if (imgItem.file) {
            // Se tiver um arquivo novo, faz o upload para o storage
            const publicUrl = await uploadStorageFile(imgItem.file);
            uploadedImageUrls.push(publicUrl);
          } else if (imgItem.url && !imgItem.url.startsWith("blob:")) {
            uploadedImageUrls.push(imgItem.url);
          }
        } else if (typeof imgItem === "string" && !imgItem.startsWith("blob:")) {
          // Se já for uma URL válida do storage
          uploadedImageUrls.push(imgItem);
        }
      }

      return {
        ...variant,
        imagens: uploadedImageUrls,
      };
    })
  );

  // 2. Determinar qual é a variante principal e extrair a capa (primeira imagem dela)
  const principalVariant = 
    processedVariants.find((v) => v.is_principal) || processedVariants[0];
  
  const finalCapaUrl = 
    principalVariant && principalVariant.imagens.length > 0 
      ? principalVariant.imagens[0] 
      : form.imagem_url || "";

  // 3. SOMA AUTOMÁTICA DO ESTOQUE: Percorre todas as variantes e todos os tamanhos somando o estoque total
  const totalCalculatedStock = processedVariants.reduce((total: number, variant: any) => {
    const variantSizesStock = (variant.sizes || []).reduce((acc: number, size: any) => {
      return acc + (Number(size.estoque) || 0);
    }, 0);
    return total + variantSizesStock;
  }, 0);

  // 4. Payload da tabela products integrando dados do formulário e o estoque agregado
  const productPayload = {
    nome: form.nome,
    marca: form.marca,
    modelo: form.modelo,
    categoria: form.categoria,
    condicao: form.condicao,
    descricao: form.descricao,
    preco: typeof form.preco === "number" ? form.preco : parseDigitsToFloat(form.preco as any),
    preco_promocional: form.preco_promocional !== null && form.preco_promocional !== undefined
      ? typeof form.preco_promocional === "number"
        ? form.preco_promocional
        : parseDigitsToFloat(String(form.preco_promocional))
      : null,
    estoque: totalCalculatedStock, // <-- Estoque total calculado dinamicamente das variantes/tamanhos
    destaque: form.destaque ?? false,
    ativo: form.ativo ?? true,
    imagem_url: finalCapaUrl, // <-- Capa sincronizada com a variante principal
    weight: Number(form.weight),
    width: Number(form.width),
    height: Number(form.height),
    length: Number(form.length),
    permite_retirada: form.permite_retirada ?? false,
    garantia_tipo: form.garantia_tipo,
    garantia_dias: form.garantia_dias ? Number(form.garantia_dias) : 0,
  };

  if (savedProductId) {
    const { error: updateErr } = await supabase
      .from("products")
      .update(productPayload)
      .eq("id", savedProductId);
    if (updateErr) throw updateErr;

    if (imagesToDelete.length > 0) {
      const { error: delErr } = await supabase
        .from("product_images")
        .delete()
        .in("id", imagesToDelete);
      if (delErr) throw delErr;
    }
  } else {
    const { data: newProd, error: err } = await supabase
      .from("products")
      .insert(productPayload)
      .select()
      .single();
    if (err) throw err;
    savedProductId = newProd.id;
  }

  if (!savedProductId) throw new Error("ID do produto não retornado.");

  // 5. Imagens Extras do Produto
  const pendingExtraFiles = localExtraImages.filter((img) => img.isNewLocal && img.file);
  if (pendingExtraFiles.length > 0) {
    await Promise.all(
      pendingExtraFiles.map(async (item) => {
        if (item.file) {
          const publicUrl = await uploadStorageFile(item.file);
          await supabase.from("product_images").insert({
            product_id: savedProductId,
            url: publicUrl,
          });
        }
      })
    );
  }

  // 6. Sincroniza Variantes (Etapa 2) e Tamanhos/SKUs (Etapa 3)
  if (processedVariants.length > 0) {
    if (productId) {
      // Se for edição, removemos as antigas para recriar limpo
      await supabase.from("product_variants").delete().eq("product_id", savedProductId);
    }

    for (const variant of processedVariants) {
      const { data: insertedVariant, error: varErr } = await supabase
        .from("product_variants")
        .insert({
          product_id: savedProductId,
          cor: variant.cor,
          padrao_tecido: variant.padrao_tecido || null,
          is_principal: variant.is_principal,
          imagens: variant.imagens, // Array de strings limpas com as URLs do storage
        })
        .select()
        .single();

      if (varErr) throw varErr;

      if (insertedVariant && variant.sizes && variant.sizes.length > 0) {
        const sizePayloads = variant.sizes.map((s: any) => ({
          variant_id: insertedVariant.id,
          tamanho: s.tamanho,
          estoque: Number(s.estoque),
          sku: s.sku || `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
          codigo_universal: s.codigo_universal || null,
        }));

        const { error: sizeErr } = await supabase.from("variant_sizes").insert(sizePayloads);
        if (sizeErr) throw sizeErr;
      }
    }
  }

  // 7. Guia de Tamanhos
  if (sizeGuideData) {
    await supabase.from("product_size_guides").delete().eq("product_id", savedProductId);
    const { error: guideErr } = await supabase.from("product_size_guides").insert({
      product_id: savedProductId,
      ...sizeGuideData,
    });
    if (guideErr) throw guideErr;
  }

  return savedProductId;
}

// === OUTROS SERVIÇOS ===
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