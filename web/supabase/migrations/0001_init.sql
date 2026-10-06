-- Brydge: initial schema (24 Sep 2026).
-- Public visitors never touch tables directly. Checkout and contact messages
-- are written by server actions with the service role, after the server has
-- reloaded prices from `products` and recalculated the total. Only users
-- listed in `admins` can read or change orders and messages.

-- ---------------------------------------------------------------- admins

create table public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin' check (role in ('owner', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- -------------------------------------------------------------- products

create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  tagline      text not null default '',
  description  text not null default '',
  color        text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  ink          text not null default 'espresso' check (ink in ('espresso', 'cream')),
  price        numeric(10, 2) not null check (price >= 0),
  bars_per_box int  not null default 12 check (bars_per_box > 0),
  weight_grams int  not null default 60,
  -- { protein, calories, carbs, sugar, fat, fibre } per bar
  nutrition    jsonb not null default '{}'::jsonb,
  ingredients  text not null default '',
  in_stock     boolean not null default true,
  active       boolean not null default true,
  sort_order   int  not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- -------------------------------------------------------------- settings

-- One row: delivery fee and free-delivery threshold, editable in /admin/settings.
create table public.settings (
  id                 int primary key default 1 check (id = 1),
  currency           text not null default 'USD',
  delivery_fee       numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  free_delivery_over numeric(10, 2) check (free_delivery_over is null or free_delivery_over >= 0),
  updated_at         timestamptz not null default now(),
  updated_by         uuid references auth.users (id)
);

-- ---------------------------------------------------------------- orders

create type public.order_status as enum
  ('pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled');

create sequence public.order_number_seq start 1;

create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  reference        text not null unique
                     default 'BRY-' || lpad(nextval('public.order_number_seq')::text, 6, '0'),
  -- Secret in the confirmation link, so references can't be guessed to read orders.
  access_token     uuid not null default gen_random_uuid(),
  status           public.order_status not null default 'pending',
  payment_method   text not null default 'cod',  -- cash on delivery only in v1
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  city             text not null,
  address          text not null,
  notes            text,
  subtotal         numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee     numeric(10, 2) not null check (delivery_fee >= 0),
  total            numeric(10, 2) not null check (total >= 0),
  currency         text not null default 'USD',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index orders_status_idx  on public.orders (status);
create index orders_created_idx on public.orders (created_at desc);

-- Name and price are copied at order time, so an order keeps what the
-- customer was charged even if the product is renamed or repriced later.
create table public.order_items (
  id           bigint generated always as identity primary key,
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid references public.products (id) on delete set null,
  product_name text not null,
  unit_price   numeric(10, 2) not null check (unit_price >= 0),
  quantity     int not null check (quantity > 0),
  line_total   numeric(10, 2) not null check (line_total >= 0)
);

create index order_items_order_idx on public.order_items (order_id);

create table public.order_events (
  id          bigint generated always as identity primary key,
  order_id    uuid not null references public.orders (id) on delete cascade,
  from_status public.order_status,
  to_status   public.order_status,
  note        text,
  created_by  uuid references auth.users (id),
  created_at  timestamptz not null default now()
);

create index order_events_order_idx on public.order_events (order_id);

-- ------------------------------------------------------ contact messages

create table public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  subject    text not null,
  message    text not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------- updated_at trigger

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------ place_order

-- Saves an order, its items and its first event in one transaction, so a
-- half-written order can't exist. Called only by the checkout server action
-- (service role) after it has recalculated every price; nobody else may run it.
create or replace function public.place_order(p_order jsonb, p_items jsonb)
returns table (reference text, access_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders;
begin
  insert into public.orders
    (customer_name, customer_phone, customer_email, city, address, notes,
     subtotal, delivery_fee, total, currency)
  values
    (p_order->>'customer_name', p_order->>'customer_phone', nullif(p_order->>'customer_email', ''),
     p_order->>'city', p_order->>'address', nullif(p_order->>'notes', ''),
     (p_order->>'subtotal')::numeric, (p_order->>'delivery_fee')::numeric,
     (p_order->>'total')::numeric, coalesce(p_order->>'currency', 'USD'))
  returning * into v_order;

  insert into public.order_items (order_id, product_id, product_name, unit_price, quantity, line_total)
  select v_order.id, (i->>'product_id')::uuid, i->>'product_name', (i->>'unit_price')::numeric,
         (i->>'quantity')::int, (i->>'line_total')::numeric
  from jsonb_array_elements(p_items) as i;

  insert into public.order_events (order_id, to_status, note)
  values (v_order.id, 'pending', 'Order placed on the website (cash on delivery)');

  return query select v_order.reference, v_order.access_token;
end;
$$;

revoke all on function public.place_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb) to service_role;

-- ------------------------------------------------------------------- RLS

alter table public.admins           enable row level security;
alter table public.products         enable row level security;
alter table public.settings         enable row level security;
alter table public.orders           enable row level security;
alter table public.order_items      enable row level security;
alter table public.order_events     enable row level security;
alter table public.contact_messages enable row level security;

-- Anyone may read visible products and the delivery settings (the shop needs them).
create policy "public reads active products" on public.products
  for select using (active or public.is_admin());
create policy "public reads settings" on public.settings
  for select using (true);

-- Admins manage everything. No insert policy for anon: public writes go
-- through the service role in server actions.
create policy "admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.settings
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage orders" on public.orders
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order items" on public.order_items
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage order events" on public.order_events
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage contact messages" on public.contact_messages
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read admins" on public.admins
  for select using (public.is_admin());
