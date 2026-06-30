create extension if not exists "pg_cron" with schema "pg_catalog";

drop extension if exists "pg_net";

create extension if not exists "pg_net" with schema "public";

create type "public"."app_role" as enum ('admin', 'user');


  create table "public"."integrations" (
    "provider" text default 'melhor_envio'::text,
    "access_token" text,
    "refresh_token" text,
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "singleton_id" boolean not null default true
      );


alter table "public"."integrations" enable row level security;


  create table "public"."notifications" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "message" text not null,
    "link" text,
    "read" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."notifications" enable row level security;


  create table "public"."order_items" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "product_id" uuid,
    "product_name" text not null,
    "product_image" text not null,
    "unit_price" numeric(10,2) not null,
    "quantity" integer not null,
    "item_weight" numeric(10,2) default 0,
    "item_width" numeric(10,2) default 0,
    "item_height" numeric(10,2) default 0,
    "item_length" numeric(10,2) default 0
      );


alter table "public"."order_items" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "total" numeric(10,2) not null,
    "status" text not null default 'paid'::text,
    "shipping_name" text not null,
    "shipping_address" text not null,
    "shipping_city" text not null,
    "shipping_zip" text not null,
    "created_at" timestamp with time zone not null default now(),
    "refund_status" text not null default 'none'::text,
    "shipping_phone" text,
    "shipping_email" text,
    "shipping_cost" numeric(10,2) default 0.00,
    "tracking_code" text,
    "estimated_delivery" timestamp with time zone,
    "last_tracking_event" text,
    "total_weight" numeric(10,2) default 0,
    "shipping_service_id" text,
    "shipping_company_name" text,
    "shipping_document" text,
    "shipping_state" text,
    "payment_status" text not null default 'pending'::text,
    "melhor_envio_protocol" text,
    "shipping_type" text default 'melhor_envio'::text,
    "is_archived" boolean default false,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."orders" enable row level security;


  create table "public"."product_images" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "url" text not null,
    "position" integer not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."product_images" enable row level security;


  create table "public"."products" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "descricao" text not null,
    "preco" numeric(10,2) not null,
    "imagem_url" text not null,
    "categoria" text not null,
    "estoque" integer not null default 0,
    "destaque" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "ativo" boolean not null default true,
    "weight" numeric default 0,
    "width" numeric default 0,
    "height" numeric default 0,
    "length" numeric default 0,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."products" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "display_name" text,
    "email" text,
    "created_at" timestamp with time zone not null default now(),
    "phone" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."reviews" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "user_id" uuid not null,
    "rating" integer not null,
    "comment" text not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."reviews" enable row level security;


  create table "public"."store_config" (
    "id" boolean not null default true,
    "name" text not null,
    "email" text not null,
    "phone" text not null,
    "city" text not null,
    "state" text not null,
    "zip_code" text not null,
    "address" text not null,
    "updated_at" timestamp with time zone default now(),
    "allow_local_pickup" boolean default false,
    "allow_local_delivery" boolean default false,
    "local_delivery_fee" numeric default 0.00
      );


alter table "public"."store_config" enable row level security;


  create table "public"."user_addresses" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "street" text,
    "city" text,
    "state" text,
    "updated_at" timestamp with time zone default now(),
    "zip_code" text,
    "role" text default 'customer'::text,
    "active" boolean default false
      );


alter table "public"."user_addresses" enable row level security;


  create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "role" public.app_role not null,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."user_roles" enable row level security;

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id, read);

CREATE INDEX idx_orders_is_archived ON public.orders USING btree (is_archived);

CREATE INDEX idx_product_images_product ON public.product_images USING btree (product_id, "position");

CREATE UNIQUE INDEX integrations_pkey ON public.integrations USING btree (singleton_id);

CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX product_images_pkey ON public.product_images USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_user_id_key ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX reviews_product_id_user_id_key ON public.reviews USING btree (product_id, user_id);

CREATE UNIQUE INDEX store_config_pkey ON public.store_config USING btree (id);

CREATE UNIQUE INDEX user_addresses_pkey ON public.user_addresses USING btree (id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

alter table "public"."integrations" add constraint "integrations_pkey" PRIMARY KEY using index "integrations_pkey";

alter table "public"."notifications" add constraint "notifications_pkey" PRIMARY KEY using index "notifications_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."product_images" add constraint "product_images_pkey" PRIMARY KEY using index "product_images_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."store_config" add constraint "store_config_pkey" PRIMARY KEY using index "store_config_pkey";

alter table "public"."user_addresses" add constraint "user_addresses_pkey" PRIMARY KEY using index "user_addresses_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."integrations" add constraint "only_one_row" CHECK ((singleton_id = true)) not valid;

alter table "public"."integrations" validate constraint "only_one_row";

alter table "public"."notifications" add constraint "notifications_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."notifications" validate constraint "notifications_user_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."orders" add constraint "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."orders" validate constraint "orders_user_id_fkey";

alter table "public"."product_images" add constraint "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_product_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_user_id_key" UNIQUE using index "profiles_user_id_key";

alter table "public"."reviews" add constraint "reviews_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_product_id_fkey";

alter table "public"."reviews" add constraint "reviews_product_id_user_id_key" UNIQUE using index "reviews_product_id_user_id_key";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."store_config" add constraint "force_one_row" CHECK ((id = true)) not valid;

alter table "public"."store_config" validate constraint "force_one_row";

alter table "public"."user_addresses" add constraint "user_addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_addresses" validate constraint "user_addresses_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.call_update_tracking_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  PERFORM net.http_post(
    'https://trmbmnjpylozykcyxcuc.supabase.co/functions/v1/update-tracking'
  );
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_low_stock()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Verifica se o estoque novo é menor que 2 e se foi alterado
  IF NEW.estoque < 2 AND (OLD.estoque IS NULL OR NEW.estoque <> OLD.estoque) THEN
    INSERT INTO public.notifications (user_id, title, message, link)
    SELECT 
      user_id, 
      'Estoque Baixo!', 
      'Atenção: O produto "' || NEW.nome || '" atingiu o limite crítico!' || 
      CHR(10) || 'Estoque atual: ' || NEW.estoque || ' unidade(s)' || 
      CHR(10) || 'Preço unitário: R$ ' || NEW.preco::text, 
      '/produto/' || NEW.id::text
    FROM public.user_roles
    WHERE role = 'admin';
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cleanup_orders_test()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
  -- 1. Arquivar pedidos: se status for 'Entregue' há mais de 1 minuto
  update public.orders
  set is_archived = true
  where status = 'Entregue'
    and is_archived = false
    and updated_at < now() - interval '1 minute';

  -- 2. Deletar pedidos arquivados há mais de 2 minutos
  delete from public.orders
  where is_archived = true
    and updated_at < now() - interval '2 minutes';
end;
$function$
;

CREATE OR REPLACE FUNCTION public.executar_limpeza_pedidos()
 RETURNS void
 LANGUAGE plpgsql
AS $function$BEGIN
  -- Arquiva pedidos 'Entregue' onde a última atualização foi há mais de 1 minuto
  UPDATE public.orders
  SET is_archived = true
  WHERE status = 'Entregue'
    AND is_archived = false
    AND updated_at < NOW() - INTERVAL '1 minute';

  -- Exclui itens vinculados antes de excluir o pedido
  DELETE FROM public.order_items
  WHERE order_id IN (
    SELECT id FROM public.orders 
    WHERE is_archived = true 
    AND updated_at < NOW() - INTERVAL '1 week'
  );

  -- Exclui o pedido arquivado há mais de 2 minutos
  DELETE FROM public.orders
  WHERE is_archived = true
    AND updated_at < NOW() - INTERVAL '1 month';
END;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_count INTEGER;
BEGIN
  INSERT INTO public.profiles (user_id, display_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$function$
;

CREATE OR REPLACE FUNCTION public.notify_admin_on_review()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_product_name text;
BEGIN
  -- 1. Busca o nome do produto na tabela products usando o product_id do novo review
  SELECT nome INTO v_product_name
  FROM public.products
  WHERE id = NEW.product_id;

  -- 2. Insere a notificação com as informações detalhadas
  INSERT INTO public.notifications (user_id, title, message, link)
  SELECT 
    user_id, 
    'Nova Avaliação!', 
    'Produto: ' || v_product_name || ' | Nota: ' || NEW.rating || ' estrelas | Comentário: ' || NEW.comment, 
    '/produto/' || NEW.product_id::text
  FROM public.user_roles
  WHERE role = 'admin';

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_user_on_order_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Só notifica se o status mudou
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES (
      NEW.user_id, 
      'Atualização no seu pedido', 
      'Seu pedido ' || SUBSTRING(NEW.id::text FROM 1 FOR 8) || ' mudou para: ' || NEW.status, 
      '/perfil'
    );
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.notify_users_new_product()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Insere uma notificação para cada perfil de usuário encontrado
  INSERT INTO public.notifications (user_id, title, message, link)
  SELECT 
    user_id, 
    'Novo Lançamento!', 
    'Confira a novidade: ' || NEW.nome || 
    CHR(10) || 'Preço: R$ ' || NEW.preco::text || 
    CHR(10) || 'Venha conferir em nossa loja!', 
    '/produto/' || NEW.id::text
  FROM public.profiles; 
  
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.place_order(_items jsonb, _shipping_name text, _shipping_address text, _shipping_city text, _shipping_zip text, _shipping_phone text DEFAULT NULL::text, _shipping_email text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  new_order_id uuid;
  item record;
BEGIN
  -- 1. Insere o pedido principal
  INSERT INTO public.orders (
    user_id,
    total,
    shipping_name,
    shipping_address,
    shipping_city,
    shipping_zip,
    shipping_phone,
    shipping_email,
    status
  )
  VALUES (
    auth.uid(),
    (SELECT SUM((product->>'quantity')::numeric * (p.preco)::numeric) 
     FROM jsonb_array_elements(_items) AS product
     JOIN public.products p ON p.id = (product->>'product_id')::uuid),
    _shipping_name,
    _shipping_address,
    _shipping_city,
    _shipping_zip,
    _shipping_phone,
    _shipping_email,
    'paid'
  )
  RETURNING id INTO new_order_id;

  -- 2. Insere os itens do pedido
  FOR item IN SELECT * FROM jsonb_array_elements(_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      product_image,
      unit_price,
      quantity
    )
    SELECT
      new_order_id,
      p.id,
      p.nome,
      p.imagem_url,
      p.preco,
      (item.value->>'quantity')::integer
    FROM public.products p
    WHERE p.id = (item.value->>'product_id')::uuid;

    -- 3. Opcional: Baixa estoque (se você precisar)
    UPDATE public.products 
    SET estoque = estoque - (item.value->>'quantity')::integer
    WHERE id = (item.value->>'product_id')::uuid;
  END LOOP;

  RETURN new_order_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."integrations" to "anon";

grant insert on table "public"."integrations" to "anon";

grant references on table "public"."integrations" to "anon";

grant select on table "public"."integrations" to "anon";

grant trigger on table "public"."integrations" to "anon";

grant truncate on table "public"."integrations" to "anon";

grant update on table "public"."integrations" to "anon";

grant delete on table "public"."integrations" to "authenticated";

grant insert on table "public"."integrations" to "authenticated";

grant references on table "public"."integrations" to "authenticated";

grant select on table "public"."integrations" to "authenticated";

grant trigger on table "public"."integrations" to "authenticated";

grant truncate on table "public"."integrations" to "authenticated";

grant update on table "public"."integrations" to "authenticated";

grant delete on table "public"."integrations" to "service_role";

grant insert on table "public"."integrations" to "service_role";

grant references on table "public"."integrations" to "service_role";

grant select on table "public"."integrations" to "service_role";

grant trigger on table "public"."integrations" to "service_role";

grant truncate on table "public"."integrations" to "service_role";

grant update on table "public"."integrations" to "service_role";

grant delete on table "public"."notifications" to "anon";

grant insert on table "public"."notifications" to "anon";

grant references on table "public"."notifications" to "anon";

grant select on table "public"."notifications" to "anon";

grant trigger on table "public"."notifications" to "anon";

grant truncate on table "public"."notifications" to "anon";

grant update on table "public"."notifications" to "anon";

grant delete on table "public"."notifications" to "authenticated";

grant insert on table "public"."notifications" to "authenticated";

grant references on table "public"."notifications" to "authenticated";

grant select on table "public"."notifications" to "authenticated";

grant trigger on table "public"."notifications" to "authenticated";

grant truncate on table "public"."notifications" to "authenticated";

grant update on table "public"."notifications" to "authenticated";

grant delete on table "public"."notifications" to "service_role";

grant insert on table "public"."notifications" to "service_role";

grant references on table "public"."notifications" to "service_role";

grant select on table "public"."notifications" to "service_role";

grant trigger on table "public"."notifications" to "service_role";

grant truncate on table "public"."notifications" to "service_role";

grant update on table "public"."notifications" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant delete on table "public"."order_items" to "authenticated";

grant insert on table "public"."order_items" to "authenticated";

grant references on table "public"."order_items" to "authenticated";

grant select on table "public"."order_items" to "authenticated";

grant trigger on table "public"."order_items" to "authenticated";

grant truncate on table "public"."order_items" to "authenticated";

grant update on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant references on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant trigger on table "public"."order_items" to "service_role";

grant truncate on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."product_images" to "anon";

grant insert on table "public"."product_images" to "anon";

grant references on table "public"."product_images" to "anon";

grant select on table "public"."product_images" to "anon";

grant trigger on table "public"."product_images" to "anon";

grant truncate on table "public"."product_images" to "anon";

grant update on table "public"."product_images" to "anon";

grant delete on table "public"."product_images" to "authenticated";

grant insert on table "public"."product_images" to "authenticated";

grant references on table "public"."product_images" to "authenticated";

grant select on table "public"."product_images" to "authenticated";

grant trigger on table "public"."product_images" to "authenticated";

grant truncate on table "public"."product_images" to "authenticated";

grant update on table "public"."product_images" to "authenticated";

grant delete on table "public"."product_images" to "service_role";

grant insert on table "public"."product_images" to "service_role";

grant references on table "public"."product_images" to "service_role";

grant select on table "public"."product_images" to "service_role";

grant trigger on table "public"."product_images" to "service_role";

grant truncate on table "public"."product_images" to "service_role";

grant update on table "public"."product_images" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."store_config" to "anon";

grant insert on table "public"."store_config" to "anon";

grant references on table "public"."store_config" to "anon";

grant select on table "public"."store_config" to "anon";

grant trigger on table "public"."store_config" to "anon";

grant truncate on table "public"."store_config" to "anon";

grant update on table "public"."store_config" to "anon";

grant delete on table "public"."store_config" to "authenticated";

grant insert on table "public"."store_config" to "authenticated";

grant references on table "public"."store_config" to "authenticated";

grant select on table "public"."store_config" to "authenticated";

grant trigger on table "public"."store_config" to "authenticated";

grant truncate on table "public"."store_config" to "authenticated";

grant update on table "public"."store_config" to "authenticated";

grant delete on table "public"."store_config" to "service_role";

grant insert on table "public"."store_config" to "service_role";

grant references on table "public"."store_config" to "service_role";

grant select on table "public"."store_config" to "service_role";

grant trigger on table "public"."store_config" to "service_role";

grant truncate on table "public"."store_config" to "service_role";

grant update on table "public"."store_config" to "service_role";

grant delete on table "public"."user_addresses" to "anon";

grant insert on table "public"."user_addresses" to "anon";

grant references on table "public"."user_addresses" to "anon";

grant select on table "public"."user_addresses" to "anon";

grant trigger on table "public"."user_addresses" to "anon";

grant truncate on table "public"."user_addresses" to "anon";

grant update on table "public"."user_addresses" to "anon";

grant delete on table "public"."user_addresses" to "authenticated";

grant insert on table "public"."user_addresses" to "authenticated";

grant references on table "public"."user_addresses" to "authenticated";

grant select on table "public"."user_addresses" to "authenticated";

grant trigger on table "public"."user_addresses" to "authenticated";

grant truncate on table "public"."user_addresses" to "authenticated";

grant update on table "public"."user_addresses" to "authenticated";

grant delete on table "public"."user_addresses" to "service_role";

grant insert on table "public"."user_addresses" to "service_role";

grant references on table "public"."user_addresses" to "service_role";

grant select on table "public"."user_addresses" to "service_role";

grant trigger on table "public"."user_addresses" to "service_role";

grant truncate on table "public"."user_addresses" to "service_role";

grant update on table "public"."user_addresses" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";


  create policy "Apenas admin pode atualizar os dados"
  on "public"."integrations"
  as permissive
  for update
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Apenas admin pode deletar os dados"
  on "public"."integrations"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Apenas admin pode inserir dados"
  on "public"."integrations"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Qualquer um pode pegar os dados"
  on "public"."integrations"
  as permissive
  for select
  to public
using (true);



  create policy "todos podem deletar"
  on "public"."notifications"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "todos podem inserir dados"
  on "public"."notifications"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "todos podem ter acesso as notificações"
  on "public"."notifications"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Usuarios criam seus próprios itens"
  on "public"."order_items"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.orders o
  WHERE ((o.id = order_items.order_id) AND (o.user_id = auth.uid())))));



  create policy "todos podem ver todos os itens"
  on "public"."order_items"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Todos podem atualizar os pedidos"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Todos podem criar pedidos"
  on "public"."orders"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Todos podem ver os pedidos"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using (true);



  create policy "apenas Admins podem deletar"
  on "public"."orders"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins delete product images"
  on "public"."product_images"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins insert product images"
  on "public"."product_images"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins update product images"
  on "public"."product_images"
  as permissive
  for update
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Product images are viewable by everyone"
  on "public"."product_images"
  as permissive
  for select
  to public
using (true);



  create policy "Admins delete products"
  on "public"."products"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins insert products"
  on "public"."products"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Admins update products"
  on "public"."products"
  as permissive
  for update
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Products are viewable by everyone"
  on "public"."products"
  as permissive
  for select
  to public
using (true);



  create policy "Users insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users update own profile"
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users view own profile"
  on "public"."profiles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Reviews are viewable by everyone"
  on "public"."reviews"
  as permissive
  for select
  to public
using (true);



  create policy "Users create own reviews"
  on "public"."reviews"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Users delete own reviews"
  on "public"."reviews"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "Users update own reviews"
  on "public"."reviews"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id));



  create policy "Apenas admin pode atualizar configurações"
  on "public"."store_config"
  as permissive
  for update
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Apenas admin pode deletar"
  on "public"."store_config"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Apenas admin pode inserir dados"
  on "public"."store_config"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Qualquer um pode ler as configurações da loja"
  on "public"."store_config"
  as permissive
  for select
  to public
using (true);



  create policy "Admin pode fazer tudo"
  on "public"."user_addresses"
  as permissive
  for all
  to authenticated
using (public.has_role(auth.uid(), 'admin'::public.app_role))
with check (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Clientes deletam próprios endereços"
  on "public"."user_addresses"
  as permissive
  for delete
  to authenticated
using (public.has_role(auth.uid(), 'user'::public.app_role));



  create policy "Clientes inserem próprios endereços"
  on "public"."user_addresses"
  as permissive
  for insert
  to authenticated
with check (public.has_role(auth.uid(), 'user'::public.app_role));



  create policy "Clientes leem próprios endereços"
  on "public"."user_addresses"
  as permissive
  for select
  to authenticated
using (public.has_role(auth.uid(), 'user'::public.app_role));



  create policy "Todos os usuarios atualizam seus endereços"
  on "public"."user_addresses"
  as permissive
  for update
  to authenticated
using (public.has_role(auth.uid(), 'user'::public.app_role))
with check (public.has_role(auth.uid(), 'user'::public.app_role));



  create policy "Admins view all roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using (public.has_role(auth.uid(), 'admin'::public.app_role));



  create policy "Users can view own roles"
  on "public"."user_roles"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_notify_order_status AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.notify_user_on_order_update();

CREATE TRIGGER trigger_update_tracking AFTER UPDATE OF tracking_code ON public.orders FOR EACH ROW WHEN (((old.tracking_code IS DISTINCT FROM new.tracking_code) AND (new.tracking_code IS NOT NULL))) EXECUTE FUNCTION public.call_update_tracking_function();

CREATE TRIGGER trg_check_low_stock AFTER UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.check_low_stock();

CREATE TRIGGER trg_notify_users_new_product AFTER INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.notify_users_new_product();

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_notify_review AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.notify_admin_on_review();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.store_config FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Admins delete product images"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (((bucket_id = 'product-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Admins update product images"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'product-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Admins upload product images"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'product-images'::text) AND public.has_role(auth.uid(), 'admin'::public.app_role)));



  create policy "Product images public read"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'product-images'::text));



