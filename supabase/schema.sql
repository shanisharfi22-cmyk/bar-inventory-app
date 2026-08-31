-- Bar inventory app — run once in the Supabase SQL editor (or via `supabase db push`).
-- Order matters: suppliers before products (FK), then RLS, then realtime, then storage.

-- 1. Suppliers -----------------------------------------------------------
create table if not exists suppliers (
  name text primary key,
  phone text
);

-- 2. Products --------------------------------------------------------------
create table if not exists products (
  id integer primary key,
  name text not null,
  category text not null,
  supplier text not null references suppliers(name) on update cascade,
  bar_stock integer not null default 0,
  storage_boxes integer not null default 0,
  storage_singles integer not null default 0,
  units_per_box integer not null default 1,
  min_limit integer not null default 0,
  image_url text,
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category);
create index if not exists products_supplier_idx on products (supplier);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

-- 3. Row Level Security ------------------------------------------------
-- The app has no real user accounts (just an optional employee name), so we
-- allow the anon key full read/write. Tighten this later if real auth is added.
alter table suppliers enable row level security;
alter table products enable row level security;

drop policy if exists "public read suppliers" on suppliers;
drop policy if exists "public write suppliers" on suppliers;
create policy "public read suppliers" on suppliers for select using (true);
create policy "public write suppliers" on suppliers for all using (true) with check (true);

drop policy if exists "public read products" on products;
drop policy if exists "public write products" on products;
create policy "public read products" on products for select using (true);
create policy "public write products" on products for all using (true) with check (true);

-- 4. Realtime -------------------------------------------------------------
alter publication supabase_realtime add table products;

-- 5. Storage bucket for product photos ------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
drop policy if exists "public write product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "public write product images" on storage.objects
  for all using (bucket_id = 'product-images') with check (bucket_id = 'product-images');
