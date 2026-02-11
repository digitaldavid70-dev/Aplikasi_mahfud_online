-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table products (
  id text primary key,
  name text not null,
  category text,
  price numeric default 0,
  stock integer default 0,
  discount numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Partners Table
create table partners (
  id text primary key,
  name text not null,
  owner text,
  phone text,
  address text,
  type text,
  debt numeric default 0,
  total_paid numeric default 0,
  inventory jsonb default '{}'::jsonb,
  pricing_tier text default 'standard',
  credit_limit numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Sales Table
create table sales (
  id text primary key,
  date timestamp with time zone default timezone('utc'::text, now()),
  buyer_name text,
  buyer_phone text,
  product_id text references products(id),
  partner_id text references partners(id),
  qty integer default 1,
  price numeric default 0,
  total numeric default 0,
  payment_method text,
  is_direct boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Distributions Table
create table distributions (
  id text primary key,
  date timestamp with time zone default timezone('utc'::text, now()),
  partner_id text references partners(id),
  product_id text references products(id),
  qty integer default 0,
  status text default 'Dalam Perjalanan',
  req_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Returns Table
create table returns (
  id text primary key,
  date timestamp with time zone default timezone('utc'::text, now()),
  partner_id text references partners(id),
  product_id text references products(id),
  qty integer default 0,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Expenses Table
create table expenses (
  id text primary key,
  date timestamp with time zone default timezone('utc'::text, now()),
  description text,
  amount numeric default 0,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Key-Value Settings Table (Store as single row or key-value pairs)
create table app_settings (
  id integer primary key generated always as identity,
  company_name text,
  company_phone text,
  company_address text,
  company_email text,
  company_website text,
  low_stock_threshold integer default 20,
  debt_limit numeric default 10000000,
  wa_invoice_template text,
  wa_distribution_template text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default settings
insert into app_settings (company_name, low_stock_threshold) values ('ERP Distribusi', 20);
