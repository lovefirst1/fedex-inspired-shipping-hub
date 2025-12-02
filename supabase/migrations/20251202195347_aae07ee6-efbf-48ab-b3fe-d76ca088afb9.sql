-- Add new columns for currency, package value, shipping fee, and delivery days
ALTER TABLE public.shipments 
ADD COLUMN currency text DEFAULT 'USD',
ADD COLUMN package_value numeric,
ADD COLUMN shipping_fee numeric,
ADD COLUMN delivery_days integer;