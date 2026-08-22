CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read enquiries"
ON public.enquiries FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role IN ('admin', 'staff')
));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_enquiries_updated_at
BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Server-side rate limiting ledger (service role only)
CREATE TABLE public.rate_limit_hits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL,
  subject text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX rate_limit_hits_lookup_idx ON public.rate_limit_hits (bucket, subject, created_at DESC);

GRANT ALL ON public.rate_limit_hits TO service_role;

ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

-- Bookings are now inserted by the server only, after spam + rate checks.
DROP POLICY IF EXISTS "Anyone can request a booking" ON public.bookings;