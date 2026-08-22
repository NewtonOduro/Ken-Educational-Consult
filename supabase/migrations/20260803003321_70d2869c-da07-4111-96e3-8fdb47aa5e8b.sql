CREATE TABLE public.bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  consultation_type text NOT NULL,
  destination text,
  meeting_mode text NOT NULL DEFAULT 'in_person',
  slot_date date NOT NULL,
  slot_time text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  reference text NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX bookings_slot_unique ON public.bookings (slot_date, slot_time);
CREATE INDEX bookings_created_at_idx ON public.bookings (created_at DESC);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can request a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  label text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX analytics_events_name_idx ON public.analytics_events (event_name, created_at DESC);

GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT ALL ON public.analytics_events TO service_role;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log an analytics event" ON public.analytics_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Booked slots (no personal data) so the picker can hide taken times
CREATE OR REPLACE FUNCTION public.get_booked_slots(from_date date, to_date date)
RETURNS TABLE (slot_date date, slot_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.slot_date, b.slot_time
  FROM public.bookings b
  WHERE b.slot_date BETWEEN from_date AND to_date
    AND b.status <> 'cancelled';
$$;

GRANT EXECUTE ON FUNCTION public.get_booked_slots(date, date) TO anon, authenticated, service_role;

-- Aggregate-only dashboard summary (no personal data returned)
CREATE OR REPLACE FUNCTION public.get_dashboard_summary()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'bookings_total', (SELECT count(*) FROM public.bookings),
    'bookings_last_7_days', (SELECT count(*) FROM public.bookings WHERE created_at > now() - interval '7 days'),
    'bookings_upcoming', (SELECT count(*) FROM public.bookings WHERE slot_date >= current_date AND status <> 'cancelled'),
    'events_total', (SELECT count(*) FROM public.analytics_events),
    'events_last_7_days', (SELECT count(*) FROM public.analytics_events WHERE created_at > now() - interval '7 days'),
    'events_by_name', COALESCE((
      SELECT jsonb_agg(x) FROM (
        SELECT event_name,
               count(*) AS total,
               count(*) FILTER (WHERE created_at > now() - interval '7 days') AS last_7_days
        FROM public.analytics_events
        GROUP BY event_name
        ORDER BY count(*) DESC
      ) x
    ), '[]'::jsonb),
    'bookings_by_type', COALESCE((
      SELECT jsonb_agg(x) FROM (
        SELECT consultation_type, count(*) AS total
        FROM public.bookings
        GROUP BY consultation_type
        ORDER BY count(*) DESC
      ) x
    ), '[]'::jsonb),
    'daily', COALESCE((
      SELECT jsonb_agg(x ORDER BY x.day) FROM (
        SELECT d::date AS day,
               (SELECT count(*) FROM public.bookings b WHERE b.created_at::date = d::date) AS bookings,
               (SELECT count(*) FROM public.analytics_events e WHERE e.created_at::date = d::date) AS events
        FROM generate_series(current_date - interval '13 days', current_date, interval '1 day') d
      ) x
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_summary() TO anon, authenticated, service_role;