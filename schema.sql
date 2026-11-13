-- FoodLane Islamabad: database schema + Row Level Security.
-- UNTESTED draft. Run in Supabase -> SQL Editor on a NEW project first.
-- Design: customers (guests) can only place orders through place_order().
-- They can never read or change orders. Staff read/update orders via login.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default '',
  emoji text not null default '🍽️',
  delivery_time_text text not null default '',
  rating numeric(2,1),
  is_demo boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_pkr integer not null check (price_pkr >= 0),
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create index menu_items_restaurant_idx on public.menu_items(restaurant_id);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);
create index customers_phone_idx on public.customers(phone);

create table public.app_settings (
  id boolean primary key default true check (id),   -- single row
  delivery_fee_pkr integer not null default 150 check (delivery_fee_pkr >= 0),
  free_delivery_above_pkr integer not null default 0 check (free_delivery_above_pkr >= 0)
);
insert into public.app_settings default values;

create sequence public.order_number_seq start 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  restaurant_id uuid not null references public.restaurants(id),
  customer_id uuid not null references public.customers(id),
  delivery_address text not null,
  delivery_notes text not null default '',
  subtotal_pkr integer not null check (subtotal_pkr >= 0),
  delivery_fee_pkr integer not null check (delivery_fee_pkr >= 0),
  total_pkr integer not null check (total_pkr >= 0),
  payment_method text not null default 'cash_on_delivery' check (payment_method = 'cash_on_delivery'),
  status text not null default 'placed'
    check (status in ('placed','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_restaurant_idx on public.orders(restaurant_id, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,              -- snapshot, so later menu edits don't change old orders
  unit_price_pkr integer not null check (unit_price_pkr >= 0),
  quantity integer not null check (quantity between 1 and 20)
);
create index order_items_order_idx on public.order_items(order_id);

-- Staff: admin sees everything; restaurant staff see only their restaurant.
-- Create users in Supabase -> Authentication, then insert a row here.
create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','restaurant')),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  check ((role = 'admin' and restaurant_id is null) or (role = 'restaurant' and restaurant_id is not null))
);

-- ---------- helper ----------
create or replace function public.is_staff_for(rid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.staff_members s
    where s.user_id = auth.uid()
      and (s.role = 'admin' or s.restaurant_id = rid)
  );
$$;

-- ---------- Row Level Security ----------
alter table public.restaurants   enable row level security;
alter table public.menu_items    enable row level security;
alter table public.customers     enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.app_settings  enable row level security;
alter table public.staff_members enable row level security;

-- Public can browse active restaurants and available menu items.
create policy "public reads active restaurants" on public.restaurants
  for select to anon, authenticated using (is_active);
create policy "public reads available menu" on public.menu_items
  for select to anon, authenticated
  using (is_available and exists (select 1 from public.restaurants r where r.id = restaurant_id and r.is_active));
create policy "public reads settings" on public.app_settings
  for select to anon, authenticated using (true);

-- Staff read (no public policy exists on customers/orders/order_items = denied).
create policy "staff read own orders" on public.orders
  for select to authenticated using (public.is_staff_for(restaurant_id));
create policy "staff update own orders" on public.orders
  for update to authenticated
  using (public.is_staff_for(restaurant_id)) with check (public.is_staff_for(restaurant_id));
create policy "staff read order items" on public.order_items
  for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and public.is_staff_for(o.restaurant_id)));
create policy "staff read customers" on public.customers
  for select to authenticated
  using (exists (select 1 from public.orders o where o.customer_id = customers.id and public.is_staff_for(o.restaurant_id)));
create policy "staff read own record" on public.staff_members
  for select to authenticated using (user_id = auth.uid());

-- Staff may change ONLY status (prices, address, etc. stay frozen).
create or replace function public.orders_only_status_changes()
returns trigger language plpgsql as $$
begin
  if new.id <> old.id or new.order_number <> old.order_number or new.restaurant_id <> old.restaurant_id
     or new.customer_id <> old.customer_id or new.delivery_address <> old.delivery_address
     or new.delivery_notes <> old.delivery_notes or new.subtotal_pkr <> old.subtotal_pkr
     or new.delivery_fee_pkr <> old.delivery_fee_pkr or new.total_pkr <> old.total_pkr
     or new.payment_method <> old.payment_method or new.created_at <> old.created_at then
    raise exception 'Only the order status can be changed';
  end if;
  new.updated_at = now();
  return new;
end $$;
create trigger orders_only_status_changes before update on public.orders
  for each row execute function public.orders_only_status_changes();

-- ---------- guest checkout ----------
-- Prices are recomputed here from menu_items. Browser-sent prices are ignored.
-- Expected payload:
-- { "restaurant_id": "<uuid>", "customer": {"name": "...", "phone": "03001234567"},
--   "address": "...", "notes": "", "items": [{"menu_item_id": "<uuid>", "quantity": 2}] }
create or replace function public.place_order(p_payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  v_restaurant public.restaurants;
  v_settings public.app_settings;
  v_name text := btrim(coalesce(p_payload #>> '{customer,name}', ''));
  v_phone text := regexp_replace(coalesce(p_payload #>> '{customer,phone}', ''), '[\s-]', '', 'g');
  v_address text := btrim(coalesce(p_payload ->> 'address', ''));
  v_notes text := btrim(coalesce(p_payload ->> 'notes', ''));
  v_item jsonb;
  v_menu public.menu_items;
  v_qty integer;
  v_subtotal integer := 0;
  v_fee integer;
  v_customer uuid;
  v_order uuid;
  v_number text;
  v_count integer := 0;
begin
  select * into v_restaurant from public.restaurants
    where id = (p_payload ->> 'restaurant_id')::uuid and is_active and not is_demo;
  if not found then raise exception 'Restaurant is not available'; end if;

  if length(v_name) < 2 or length(v_name) > 80 then raise exception 'Invalid name'; end if;
  if v_phone !~ '^(\+92|92|0)?3[0-9]{9}$' then raise exception 'Invalid phone number'; end if;
  if length(v_address) < 10 or length(v_address) > 300 then raise exception 'Invalid address'; end if;
  if length(v_notes) > 300 then raise exception 'Notes too long'; end if;
  if jsonb_typeof(p_payload -> 'items') <> 'array' or jsonb_array_length(p_payload -> 'items') not between 1 and 30 then
    raise exception 'Invalid items';
  end if;

  -- First pass: validate items and total.
  for v_item in select * from jsonb_array_elements(p_payload -> 'items') loop
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty is null or v_qty not between 1 and 20 then raise exception 'Invalid quantity'; end if;
    select * into v_menu from public.menu_items
      where id = (v_item ->> 'menu_item_id')::uuid and restaurant_id = v_restaurant.id and is_available;
    if not found then raise exception 'Menu item not available'; end if;
    v_subtotal := v_subtotal + v_menu.price_pkr * v_qty;
    v_count := v_count + 1;
  end loop;

  select * into v_settings from public.app_settings;
  v_fee := case
    when v_settings.free_delivery_above_pkr > 0 and v_subtotal >= v_settings.free_delivery_above_pkr then 0
    else v_settings.delivery_fee_pkr end;

  insert into public.customers (name, phone) values (v_name, v_phone) returning id into v_customer;
  v_number := 'FL-' || nextval('public.order_number_seq')::text;
  insert into public.orders (order_number, restaurant_id, customer_id, delivery_address, delivery_notes,
                             subtotal_pkr, delivery_fee_pkr, total_pkr)
    values (v_number, v_restaurant.id, v_customer, v_address, v_notes, v_subtotal, v_fee, v_subtotal + v_fee)
    returning id into v_order;

  -- Second pass: save the items with the server-side prices.
  for v_item in select * from jsonb_array_elements(p_payload -> 'items') loop
    select * into v_menu from public.menu_items where id = (v_item ->> 'menu_item_id')::uuid;
    insert into public.order_items (order_id, menu_item_id, item_name, unit_price_pkr, quantity)
      values (v_order, v_menu.id, v_menu.name, v_menu.price_pkr, (v_item ->> 'quantity')::integer);
  end loop;

  return jsonb_build_object('order_number', v_number, 'total_pkr', v_subtotal + v_fee);
end $$;

revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
