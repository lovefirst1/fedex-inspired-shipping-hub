-- Create shipments table
CREATE TABLE public.shipments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_code text UNIQUE NOT NULL,
  sender_name text NOT NULL,
  sender_address text NOT NULL,
  receiver_name text NOT NULL,
  receiver_address text NOT NULL,
  package_description text,
  package_weight numeric,
  origin_city text NOT NULL,
  origin_country text NOT NULL,
  destination_city text NOT NULL,
  destination_country text NOT NULL,
  current_location text,
  status text NOT NULL DEFAULT 'pending',
  estimated_delivery_date timestamp with time zone,
  actual_delivery_date timestamp with time zone,
  held_by_customs boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create shipment_timeline table for tracking history
CREATE TABLE public.shipment_timeline (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id uuid REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  location text,
  description text,
  timestamp timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Shipments policies - anyone can read (for public tracking)
CREATE POLICY "Anyone can view shipments"
  ON public.shipments FOR SELECT
  USING (true);

-- Only admins can create/update/delete shipments
CREATE POLICY "Admins can insert shipments"
  ON public.shipments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update shipments"
  ON public.shipments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete shipments"
  ON public.shipments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Timeline policies
CREATE POLICY "Anyone can view timeline"
  ON public.shipment_timeline FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert timeline"
  ON public.shipment_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update timeline"
  ON public.shipment_timeline FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, is_admin)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    false
  );
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for shipments updated_at
CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();